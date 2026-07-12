#!/usr/bin/env node

import { createHash } from "node:crypto";
import { createReadStream, createWriteStream } from "node:fs";
import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  statSync,
} from "node:fs";
import { homedir, platform, arch, tmpdir } from "node:os";
import { basename, join } from "node:path";
import { pipeline } from "node:stream/promises";
import { spawn, spawnSync } from "node:child_process";

const SERVER_NAME = "search-before-build-github";
const RELEASES = "https://github.com/github/github-mcp-server/releases";
const USER_AGENT = "search-before-build-github-mcp-setup";
const args = new Set(process.argv.slice(2));

function valueAfter(flag) {
  const values = process.argv.slice(2);
  const index = values.indexOf(flag);
  return index >= 0 ? values[index + 1] : undefined;
}

function fail(message) {
  throw new Error(message);
}

function target() {
  const key = `${platform()}:${arch()}`;
  const targets = {
    "win32:x64": ["Windows", "x86_64", "zip", "github-mcp-server.exe"],
    "win32:arm64": ["Windows", "arm64", "zip", "github-mcp-server.exe"],
    "win32:ia32": ["Windows", "i386", "zip", "github-mcp-server.exe"],
    "darwin:x64": ["Darwin", "x86_64", "tar.gz", "github-mcp-server"],
    "darwin:arm64": ["Darwin", "arm64", "tar.gz", "github-mcp-server"],
    "linux:x64": ["Linux", "x86_64", "tar.gz", "github-mcp-server"],
    "linux:arm64": ["Linux", "arm64", "tar.gz", "github-mcp-server"],
    "linux:ia32": ["Linux", "i386", "tar.gz", "github-mcp-server"],
  };
  const selected = targets[key];
  if (!selected) fail(`Unsupported platform/architecture: ${key}`);
  const [osName, cpu, extension, executable] = selected;
  return {
    key,
    asset: `github-mcp-server_${osName}_${cpu}.${extension}`,
    extension,
    executable,
  };
}

function installDirectory() {
  if (platform() === "win32") {
    return join(process.env.LOCALAPPDATA || join(homedir(), "AppData", "Local"), "search-before-build", "github-mcp");
  }
  return join(process.env.XDG_DATA_HOME || join(homedir(), ".local", "share"), "search-before-build", "github-mcp");
}

async function fetchChecked(url, options = {}) {
  const response = await fetch(url, {
    redirect: "follow",
    ...options,
    headers: { "User-Agent": USER_AGENT, ...(options.headers || {}) },
  });
  if (!response.ok) fail(`HTTP ${response.status} from ${url}`);
  return response;
}

async function releaseInfo(asset) {
  const latest = await fetchChecked(`${RELEASES}/latest`);
  const match = latest.url.match(/\/tag\/([^/?#]+)/);
  if (!match) fail(`Could not resolve the latest official GitHub MCP release tag from ${latest.url}`);
  const tag = decodeURIComponent(match[1]);
  const expanded = await fetchChecked(`${RELEASES}/expanded_assets/${encodeURIComponent(tag)}`);
  const html = await expanded.text();
  const escaped = asset.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const nearby = new RegExp(`${escaped}[\\s\\S]{0,800}?sha256:([a-f0-9]{64})`, "i").exec(html);
  if (!nearby) fail(`The official release ${tag} does not publish ${asset} with a SHA-256 digest`);
  return {
    tag,
    digest: nearby[1].toLowerCase(),
    url: `${RELEASES}/download/${encodeURIComponent(tag)}/${asset}`,
  };
}

async function download(url, destination) {
  const response = await fetchChecked(url);
  await pipeline(response.body, createWriteStream(destination));
}

async function sha256(path) {
  const hash = createHash("sha256");
  await pipeline(createReadStream(path), hash);
  return hash.digest("hex");
}

function findFile(root, filename) {
  for (const entry of readdirSync(root)) {
    const path = join(root, entry);
    const stats = statSync(path);
    if (stats.isDirectory()) {
      const nested = findFile(path, filename);
      if (nested) return nested;
    } else if (entry === filename) {
      return path;
    }
  }
  return undefined;
}

function extract(archive, destination, extension) {
  mkdirSync(destination, { recursive: true });
  const result = extension === "zip"
    ? spawnSync("powershell.exe", [
        "-NoProfile",
        "-NonInteractive",
        "-Command",
        "& { param($archive, $destination) Expand-Archive -LiteralPath $archive -DestinationPath $destination -Force }",
        archive,
        destination,
      ], { stdio: "inherit" })
    : spawnSync("tar", ["-xzf", archive, "-C", destination], { stdio: "inherit" });
  if (result.error || result.status !== 0) fail(`Failed to extract ${basename(archive)}`);
}

function resolveCommand(command) {
  if (platform() !== "win32" || command.includes("\\") || command.includes("/")) return command;
  const found = spawnSync("where.exe", [command], { encoding: "utf8" });
  if (found.status !== 0) return command;
  const candidates = found.stdout.split(/\r?\n/).filter(Boolean);
  return candidates.find((path) => /\.(exe|cmd|bat)$/i.test(path)) || candidates[0] || command;
}

function run(command, commandArgs, options = {}) {
  return spawnSync(resolveCommand(command), commandArgs, {
    encoding: "utf8",
    ...options,
  });
}

function available(command) {
  const probe = run(command, ["--version"]);
  return !probe.error && probe.status === 0;
}

function detectAgent() {
  const requested = valueAfter("--agent") || "auto";
  if (["claude", "codex"].includes(requested)) return requested;
  if (requested !== "auto") fail(`Unsupported --agent value: ${requested}`);
  const found = ["claude", "codex"].filter(available);
  if (found.length === 1) return found[0];
  if (found.length === 0) fail("Neither Claude Code nor Codex CLI is available for automatic MCP configuration");
  fail("Both Claude Code and Codex are installed; the calling Agent must pass --agent claude or --agent codex");
}

function alreadyConfigured(agent) {
  const result = run(agent, ["mcp", "get", SERVER_NAME]);
  return result.status === 0;
}

function configure(agent, executable) {
  if (alreadyConfigured(agent) && !args.has("--force")) {
    console.log(`${SERVER_NAME} is already configured for ${agent}; leaving the existing configuration unchanged.`);
    return false;
  }
  if (alreadyConfigured(agent)) {
    const removed = run(agent, ["mcp", "remove", SERVER_NAME], { stdio: "inherit" });
    if (removed.status !== 0) fail(`Could not replace the existing ${SERVER_NAME} configuration`);
  }
  const serverArgs = [executable, "stdio", "--read-only", "--toolsets", "repos"];
  const commandArgs = agent === "claude"
    ? ["mcp", "add", "--scope", "user", SERVER_NAME, "--", ...serverArgs]
    : ["mcp", "add", SERVER_NAME, "--", ...serverArgs];
  const result = run(agent, commandArgs, { stdio: "inherit" });
  if (result.error || result.status !== 0) fail(`Failed to configure ${agent} MCP`);
  return true;
}

function rpcConnectionTest(executable, timeoutMs = 300_000) {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, ["stdio", "--read-only", "--toolsets", "repos"], {
      stdio: ["pipe", "pipe", "inherit"],
    });
    let buffer = "";
    let initialized = false;
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error("OAuth/connection test timed out"));
    }, timeoutMs);
    const send = (message) => child.stdin.write(`${JSON.stringify(message)}\n`);
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      buffer += chunk;
      for (;;) {
        const newline = buffer.indexOf("\n");
        if (newline < 0) break;
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (!line.startsWith("{")) continue;
        let message;
        try { message = JSON.parse(line); } catch { continue; }
        if (message.id === 1 && message.result && !initialized) {
          initialized = true;
          send({ jsonrpc: "2.0", method: "notifications/initialized" });
          send({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} });
        } else if (message.id === 2 && message.result) {
          const names = new Set((message.result.tools || []).map((tool) => tool.name));
          for (const required of ["search_repositories", "get_file_contents", "search_code"]) {
            if (!names.has(required)) {
              clearTimeout(timer);
              child.kill();
              reject(new Error(`Configured server did not expose required read tool: ${required}`));
              return;
            }
          }
          send({
            jsonrpc: "2.0",
            id: 3,
            method: "tools/call",
            params: { name: "search_repositories", arguments: { query: "github-mcp-server in:name org:github", perPage: 1 } },
          });
        } else if (message.id === 3) {
          clearTimeout(timer);
          child.kill();
          if (message.error) reject(new Error(`GitHub search test failed: ${message.error.message}`));
          else resolve();
        }
      }
    });
    child.on("error", (error) => { clearTimeout(timer); reject(error); });
    child.on("exit", (code) => {
      if (code && code !== 0) { clearTimeout(timer); reject(new Error(`GitHub MCP exited with code ${code}`)); }
    });
    send({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-06-18",
        capabilities: {},
        clientInfo: { name: "search-before-build-setup", version: "0.1.0" },
      },
    });
  });
}

async function main() {
  const selected = target();
  const agent = detectAgent();
  const directory = installDirectory();
  const executable = join(directory, selected.executable);
  console.log(`Detected ${selected.key}; target Agent: ${agent}`);
  console.log(`Install path: ${executable}`);

  if (args.has("--verify-release")) {
    const release = await releaseInfo(selected.asset);
    console.log(`Verified official release ${release.tag}: ${selected.asset}`);
    console.log(`Published SHA-256: ${release.digest}`);
    return;
  }

  if (args.has("--self-test")) {
    const temporary = mkdtempSync(join(tmpdir(), "search-before-build-github-mcp-self-test-"));
    try {
      const release = await releaseInfo(selected.asset);
      const archive = join(temporary, selected.asset);
      await download(release.url, archive);
      const actual = await sha256(archive);
      if (actual !== release.digest) fail(`SHA-256 mismatch for ${selected.asset}`);
      const extracted = join(temporary, "extracted");
      extract(archive, extracted, selected.extension);
      const candidate = findFile(extracted, selected.executable);
      if (!candidate) fail(`Archive did not contain ${selected.executable}`);
      if (platform() !== "win32") chmodSync(candidate, 0o755);
      const version = run(candidate, ["--version"]);
      if (version.error || version.status !== 0) fail("Downloaded GitHub MCP binary did not start");
      const stdioHelp = run(candidate, ["stdio", "--help"]);
      if (stdioHelp.error || stdioHelp.status !== 0) fail("Downloaded binary rejected the stdio command used by MCP configuration");
      console.log(`Self-test passed for official GitHub MCP ${release.tag}.`);
      console.log((version.stdout || version.stderr || "").trim());
    } finally {
      rmSync(temporary, { recursive: true, force: true });
    }
    return;
  }

  if (args.has("--dry-run")) {
    console.log("Dry run: no download, configuration change, or OAuth request was performed.");
    return;
  }

  if (!existsSync(executable) || args.has("--force-download")) {
    const temporary = mkdtempSync(join(tmpdir(), "search-before-build-github-mcp-"));
    try {
      const release = await releaseInfo(selected.asset);
      const archive = join(temporary, selected.asset);
      console.log(`Downloading official GitHub MCP ${release.tag}...`);
      await download(release.url, archive);
      const actual = await sha256(archive);
      if (actual !== release.digest) fail(`SHA-256 mismatch for ${selected.asset}`);
      const extracted = join(temporary, "extracted");
      extract(archive, extracted, selected.extension);
      const source = findFile(extracted, selected.executable);
      if (!source) fail(`Archive did not contain ${selected.executable}`);
      mkdirSync(directory, { recursive: true });
      copyFileSync(source, executable);
      if (platform() !== "win32") chmodSync(executable, 0o755);
    } finally {
      rmSync(temporary, { recursive: true, force: true });
    }
  } else {
    console.log("A GitHub MCP binary already exists; reusing it.");
  }

  const version = run(executable, ["--version"]);
  if (version.error || version.status !== 0) fail("Installed GitHub MCP binary did not start");
  configure(agent, executable);

  if (!args.has("--skip-connect-test")) {
    console.log("Starting the read-only connection test. Complete GitHub authorization in the browser if prompted...");
    await rpcConnectionTest(executable);
    console.log("GitHub repository search and read tools are available.");
  }
  console.log(`Setup complete. Reopen ${agent} if the current session does not discover the new MCP server.`);
}

main().catch((error) => {
  console.error(`GitHub MCP setup failed: ${error.message}`);
  process.exitCode = 1;
});
