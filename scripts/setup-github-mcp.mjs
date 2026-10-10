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
// An empty --oauth-scopes requests no OAuth scopes, so GitHub's consent page asks
// only for public read access. The repository search and read tools stay visible
// because the server marks them as public reads.
const SERVER_ARGS = ["stdio", "--read-only", "--toolsets", "repos", "--oauth-scopes="];
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

class HttpStatusError extends Error {}

// Node's fetch ignores proxy settings. curl honors HTTPS_PROXY and friends; on
// Windows the system proxy lives in the registry, so pass it explicitly.
function proxyUrl() {
  for (const name of ["HTTPS_PROXY", "https_proxy", "HTTP_PROXY", "http_proxy", "ALL_PROXY", "all_proxy"]) {
    if (process.env[name]) return process.env[name];
  }
  if (platform() !== "win32") return undefined;
  const key = "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings";
  const enabled = spawnSync("reg", ["query", key, "/v", "ProxyEnable"], { encoding: "utf8" });
  if (!/ProxyEnable\s+REG_DWORD\s+0x1\b/i.test(enabled.stdout || "")) return undefined;
  const server = spawnSync("reg", ["query", key, "/v", "ProxyServer"], { encoding: "utf8" });
  const value = /ProxyServer\s+REG_SZ\s+(\S+)/i.exec(server.stdout || "")?.[1];
  if (!value) return undefined;
  const address = value.includes("=")
    ? (/(?:^|;)https=([^;]+)/i.exec(value) || /(?:^|;)http=([^;]+)/i.exec(value))?.[1]
    : value;
  if (!address) return undefined;
  return /^[a-z]+:\/\//i.test(address) ? address : `http://${address}`;
}

async function fetchGet(url, destination, timeoutMs) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new HttpStatusError(`HTTP ${response.status} from ${url}`);
  if (destination) {
    await pipeline(response.body, createWriteStream(destination));
    return { url: response.url };
  }
  return { url: response.url, text: await response.text() };
}

function curlGet(url, destination, timeoutMs) {
  const marker = "\n@@search-before-build-final-url@@";
  const proxy = proxyUrl();
  const result = run("curl", [
    "-fsSL",
    "--retry", "2",
    "--connect-timeout", "20",
    "--max-time", String(Math.ceil(timeoutMs / 1000)),
    "-A", USER_AGENT,
    ...(proxy ? ["--proxy", proxy] : []),
    ...(destination ? ["-o", destination] : []),
    "-w", `${marker}%{url_effective}`,
    url,
  ], { maxBuffer: 32 * 1024 * 1024 });
  if (result.error || result.status !== 0) {
    throw new Error((result.stderr || result.error?.message || `curl exited with ${result.status}`).trim());
  }
  const output = result.stdout || "";
  const split = output.lastIndexOf(marker);
  const text = split >= 0 ? output.slice(0, split) : output;
  const finalUrl = split >= 0 ? output.slice(split + marker.length).trim() : url;
  return destination ? { url: finalUrl } : { url: finalUrl, text };
}

async function httpGet(url, { destination, timeoutMs = 60_000 } = {}) {
  try {
    return await fetchGet(url, destination, timeoutMs);
  } catch (error) {
    if (error instanceof HttpStatusError) throw error;
    try {
      return curlGet(url, destination, timeoutMs);
    } catch (curlError) {
      fail([
        `Could not reach GitHub (${url}).`,
        `Node fetch: ${error.message}; curl: ${curlError.message}`,
        "Check the network connection. If GitHub is only reachable through a proxy, set HTTPS_PROXY",
        "(for example http://127.0.0.1:7890) or enable the system proxy, then run the setup again.",
      ].join("\n"));
    }
  }
}

async function releaseInfo(asset) {
  const latest = await httpGet(`${RELEASES}/latest`);
  const match = latest.url.match(/\/tag\/([^/?#]+)/);
  if (!match) fail(`Could not resolve the latest official GitHub MCP release tag from ${latest.url}`);
  const tag = decodeURIComponent(match[1]);
  const escaped = asset.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let digest;
  try {
    const checksums = await httpGet(`${RELEASES}/download/${encodeURIComponent(tag)}/github-mcp-server_${tag.replace(/^v/, "")}_checksums.txt`);
    digest = new RegExp(`^([a-f0-9]{64})\\s+\\*?${escaped}\\s*$`, "im").exec(checksums.text)?.[1];
  } catch {
    digest = undefined;
  }
  if (!digest) {
    const expanded = await httpGet(`${RELEASES}/expanded_assets/${encodeURIComponent(tag)}`);
    digest = new RegExp(`${escaped}[\\s\\S]{0,800}?sha256:([a-f0-9]{64})`, "i").exec(expanded.text)?.[1];
  }
  if (!digest) fail(`The official release ${tag} does not publish ${asset} with a SHA-256 digest`);
  return {
    tag,
    digest: digest.toLowerCase(),
    url: `${RELEASES}/download/${encodeURIComponent(tag)}/${asset}`,
  };
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

async function downloadVerified(selected, directory) {
  const release = await releaseInfo(selected.asset);
  const archive = join(directory, selected.asset);
  console.log(`Downloading official GitHub MCP ${release.tag} (${selected.asset})...`);
  await httpGet(release.url, { destination: archive, timeoutMs: 600_000 });
  const actual = await sha256(archive);
  if (actual !== release.digest) fail(`SHA-256 mismatch for ${selected.asset}`);
  const extracted = join(directory, "extracted");
  extract(archive, extracted, selected.extension);
  const binary = findFile(extracted, selected.executable);
  if (!binary) fail(`Archive did not contain ${selected.executable}`);
  if (platform() !== "win32") chmodSync(binary, 0o755);
  return { release, binary };
}

function resolveCommand(command) {
  if (platform() !== "win32" || command.includes("\\") || command.includes("/")) return command;
  const found = spawnSync("where.exe", [command], { encoding: "utf8" });
  if (found.status !== 0) return command;
  const candidates = found.stdout.split(/\r?\n/).filter(Boolean);
  return candidates.find((path) => /\.exe$/i.test(path))
    || candidates.find((path) => /\.(cmd|bat)$/i.test(path))
    || candidates[0]
    || command;
}

function run(command, commandArgs, options = {}) {
  const resolved = resolveCommand(command);
  // npm installs claude/codex on Windows as .cmd shims, which Node refuses to
  // spawn directly (EINVAL since the CVE-2024-27980 fix). Run them through
  // cmd.exe with every argument quoted.
  if (platform() === "win32" && /\.(cmd|bat)$/i.test(resolved)) {
    const quote = (value) => `"${String(value).replace(/"/g, '""')}"`;
    const line = [resolved, ...commandArgs].map(quote).join(" ");
    return spawnSync(process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", `"${line}"`], {
      encoding: "utf8",
      windowsVerbatimArguments: true,
      ...options,
    });
  }
  return spawnSync(resolved, commandArgs, {
    encoding: "utf8",
    ...options,
  });
}

function available(command) {
  const probe = run(command, ["--version"]);
  return !probe.error && probe.status === 0;
}

// Older binaries cannot narrow the OAuth request, so upgrade them in place.
function supportsScopedOAuth(executable) {
  const help = run(executable, ["stdio", "--help"]);
  return !help.error && help.status === 0 && `${help.stdout}${help.stderr}`.includes("--oauth-scopes");
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

// Reads the registration the host will actually launch: command, the exact
// argument list, and environment. Codex reports structured JSON; Claude Code
// prints one "Args:" line and an indented KEY=value block under "Environment:".
function readRegistration(agent) {
  if (agent === "codex") {
    const result = run(agent, ["mcp", "get", SERVER_NAME, "--json"]);
    if (result.status !== 0) return undefined;
    const text = result.stdout || "";
    try {
      const transport = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)).transport || {};
      return { command: transport.command, args: transport.args || [], env: transport.env || {} };
    } catch {
      return { command: undefined, args: undefined, env: {} };
    }
  }
  const result = run(agent, ["mcp", "get", SERVER_NAME]);
  if (result.status !== 0) return undefined;
  const lines = (result.stdout || "").split(/\r?\n/);
  const field = (name) => lines.find((line) => line.trim().startsWith(`${name}:`))?.trim().slice(name.length + 1).trim();
  const env = {};
  const start = lines.findIndex((line) => line.trim() === "Environment:");
  for (const line of start >= 0 ? lines.slice(start + 1) : []) {
    const match = /^\s+([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(line);
    if (!match) break;
    env[match[1]] = match[2];
  }
  // Claude prints arguments space-joined; compare that exact text.
  return { command: field("Command"), argsText: field("Args"), env };
}

function sameRegistration(registration, executable, env) {
  if (!registration) return false;
  const normalize = (path) => (platform() === "win32" ? `${path}`.replace(/\//g, "\\").toLowerCase() : `${path}`);
  const argsMatch = registration.args !== undefined
    ? JSON.stringify(registration.args) === JSON.stringify(SERVER_ARGS)
    : registration.argsText === SERVER_ARGS.join(" ");
  const keys = (object) => JSON.stringify(Object.entries(object).sort(([a], [b]) => a.localeCompare(b)));
  return normalize(registration.command) === normalize(executable) && argsMatch && keys(registration.env) === keys(env);
}

function configure(agent, executable, env) {
  const existing = readRegistration(agent);
  if (sameRegistration(existing, executable, env) && !args.has("--force")) {
    console.log(`${SERVER_NAME} is already configured for ${agent} with the read-only, no-scope settings; leaving it unchanged.`);
    return false;
  }
  if (existing !== undefined) {
    console.log(`Replacing the existing ${SERVER_NAME} registration because it differs from the read-only, no-scope settings.`);
    const removed = run(agent, ["mcp", "remove", SERVER_NAME], { stdio: "inherit" });
    if (removed.status !== 0) fail(`Could not replace the existing ${SERVER_NAME} configuration`);
  }
  const envArgs = Object.entries(env).flatMap(([key, value]) => [agent === "claude" ? "-e" : "--env", `${key}=${value}`]);
  const commandArgs = agent === "claude"
    ? ["mcp", "add", "--scope", "user", SERVER_NAME, ...envArgs, "--", executable, ...SERVER_ARGS]
    : ["mcp", "add", SERVER_NAME, ...envArgs, "--", executable, ...SERVER_ARGS];
  const result = run(agent, commandArgs, { stdio: "inherit" });
  if (result.error || result.status !== 0) fail(`Failed to configure ${agent} MCP`);
  // Verify what the host will launch, not just what was requested: another scope
  // may define the same server name and take precedence.
  if (!sameRegistration(readRegistration(agent), executable, env)) {
    fail(`${agent} reports a ${SERVER_NAME} configuration that does not match the read-only, no-scope settings. Another configuration with the same name (for example a project or local scope) may override it; remove it and run the setup again.`);
  }
  return true;
}

// The MCP server reaches api.github.com through Go's HTTP client, which honors
// HTTPS_PROXY but not the Windows system proxy, and the host may not pass the
// installer's environment through. When GitHub is reachable only through a
// proxy, pin that proxy in the registration and the connection test.
async function serverEnvironment() {
  const probe = "https://api.github.com/";
  try {
    await fetchGet(probe, undefined, 15_000);
    return {};
  } catch (error) {
    if (error instanceof HttpStatusError) return {};
  }
  const proxy = proxyUrl();
  if (!proxy) return {};
  try {
    curlGet(probe, undefined, 20_000);
  } catch {
    return {};
  }
  console.log(`GitHub is reachable only through the proxy ${proxy.replace(/\/\/[^@/]*@/, "//***@")}; saving it as HTTPS_PROXY in the MCP configuration. Run the setup again if the proxy address changes.`);
  return { HTTPS_PROXY: proxy };
}

function resultText(result) {
  return (result?.content || [])
    .filter((item) => item?.type === "text")
    .map((item) => item.text)
    .join("\n")
    .trim();
}

// The first tool call starts GitHub authorization. With a usable browser the call
// waits for it; otherwise the server returns sign-in instructions (a link or a
// device code) as plain text and asks the client to retry after authorizing.
function rpcConnectionTest(executable, env = {}, timeoutMs = 300_000) {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, SERVER_ARGS, {
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, ...env },
    });
    let buffer = "";
    let log = "";
    let initialized = false;
    let nextId = 3;
    let shownInstructions = "";
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk) => { log = `${log}${chunk}`.slice(-4000); });
    const finish = (error) => {
      clearTimeout(timer);
      child.kill();
      if (error) {
        const tail = log.trim().split(/\r?\n/).slice(-5).join("\n");
        reject(new Error(tail ? `${error.message}\nServer log:\n${tail}` : error.message));
      } else {
        resolve();
      }
    };
    const timer = setTimeout(() => finish(new Error("GitHub authorization was not completed within 5 minutes")), timeoutMs);
    const send = (message) => child.stdin.write(`${JSON.stringify(message)}\n`);
    const search = () => send({
      jsonrpc: "2.0",
      id: nextId++,
      method: "tools/call",
      params: { name: "search_repositories", arguments: { query: "github-mcp-server in:name org:github", perPage: 1 } },
    });
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
              finish(new Error(`Configured server did not expose required read tool: ${required}`));
              return;
            }
          }
          search();
        } else if (typeof message.id === "number" && message.id >= 3) {
          if (message.error) {
            finish(new Error(`GitHub search test failed: ${message.error.message}`));
            return;
          }
          const text = resultText(message.result);
          if (message.result?.isError) {
            finish(new Error(`GitHub search test failed: ${text || "unknown error"}`));
          } else if (/^[[{]/.test(text)) {
            finish();
          } else {
            if (text && text !== shownInstructions) {
              shownInstructions = text;
              console.log(`\nGitHub sign-in is required. Follow these instructions, then wait here:\n${text}\n`);
            }
            setTimeout(search, 5_000);
          }
        }
      }
    });
    child.on("error", (error) => finish(error));
    child.on("exit", (code) => {
      if (code && code !== 0) finish(new Error(`GitHub MCP exited with code ${code}`));
    });
    send({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-06-18",
        capabilities: {},
        clientInfo: { name: "search-before-build-setup", version: "0.3.1" },
      },
    });
  });
}

function installBinary(source, executable) {
  mkdirSync(installDirectory(), { recursive: true });
  try {
    copyFileSync(source, executable);
  } catch (error) {
    if (["EBUSY", "EPERM", "ETXTBSY"].includes(error.code)) {
      fail("The existing GitHub MCP program is in use. Close Claude Code / Codex sessions that use it, then run the setup again.");
    }
    throw error;
  }
  if (platform() !== "win32") chmodSync(executable, 0o755);
}

async function main() {
  if (typeof fetch !== "function") fail("Node.js 18 or later is required to run the GitHub MCP setup.");
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
      const { release, binary: candidate } = await downloadVerified(selected, temporary);
      const version = run(candidate, ["--version"]);
      if (version.error || version.status !== 0) fail("Downloaded GitHub MCP binary did not start");
      const stdioHelp = run(candidate, ["stdio", "--help"]);
      if (stdioHelp.error || stdioHelp.status !== 0) fail("Downloaded binary rejected the stdio command used by MCP configuration");
      if (!supportsScopedOAuth(candidate)) fail("Downloaded binary does not support --oauth-scopes");
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

  const reusable = existsSync(executable) && supportsScopedOAuth(executable);
  if (!reusable || args.has("--force-download")) {
    if (existsSync(executable) && !reusable) console.log("The installed GitHub MCP program is outdated; upgrading it.");
    const temporary = mkdtempSync(join(tmpdir(), "search-before-build-github-mcp-"));
    try {
      const { binary } = await downloadVerified(selected, temporary);
      installBinary(binary, executable);
    } finally {
      rmSync(temporary, { recursive: true, force: true });
    }
  } else {
    console.log("A current GitHub MCP program already exists; reusing it.");
  }

  const version = run(executable, ["--version"]);
  if (version.error || version.status !== 0) fail("Installed GitHub MCP binary did not start");
  const env = await serverEnvironment();
  configure(agent, executable, env);

  if (!args.has("--skip-connect-test")) {
    console.log("Starting the read-only connection test.");
    console.log("A GitHub page will open in the browser. Sign in if asked and approve the GitHub MCP Server; this setup requests no extra permission scopes.");
    await rpcConnectionTest(executable, env);
    console.log("GitHub repository search and read tools are available.");
  }
  console.log(`Setup complete. Start a new ${agent} session so the new MCP server is loaded.`);
  console.log("GitHub keeps this sign-in only while a session runs, so each new session briefly opens GitHub in the browser on its first search; after the first approval it normally needs no extra clicks.");
  console.log("If you previously authorized the GitHub MCP Server with broader permissions, GitHub may reuse them. To reset to the minimum, revoke it at https://github.com/settings/applications and sign in again. The server runs read-only either way.");
}

main().catch((error) => {
  console.error(`GitHub MCP setup failed: ${error.message}`);
  process.exitCode = 1;
});
