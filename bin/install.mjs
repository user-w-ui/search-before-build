#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const PLUGIN = "search-before-build";
const MARKETPLACE = "search-before-build";
const SOURCE = "user-w-ui/search-before-build";
const PACKAGE = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const RELEASE_REF = `v${PACKAGE.version}`;

function run(args, options = {}) {
  // pnpm's Windows shim is a .cmd file. Node cannot execute it directly,
  // while cmd.exe resolves it correctly through PATHEXT.
  const windows = process.platform === "win32";
  const command = windows ? process.env.ComSpec || "cmd.exe" : "codex";
  const commandArgs = windows ? ["/d", "/s", "/c", "codex", ...args] : args;
  const result = spawnSync(command, commandArgs, {
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit",
  });

  if (result.error) {
    if (result.error.code === "ENOENT") {
      throw new Error("Codex CLI was not found. Install Codex, then run this command again.");
    }
    throw result.error;
  }
  if (result.status !== 0) {
    const detail = options.capture ? result.stderr.trim() || result.stdout.trim() : "";
    throw new Error(detail || `codex ${args.join(" ")} failed.`);
  }
  return result.stdout;
}

function installedMarketplaceNames() {
  const output = run(["plugin", "marketplace", "list", "--json"], { capture: true });
  const parsed = JSON.parse(output);
  return new Set((parsed.marketplaces || []).map((marketplace) => marketplace.name));
}

function usage() {
  console.log("Usage: npx @superq/search-before-build install");
}

function main() {
  const [command] = process.argv.slice(2);
  if (command === "--help" || command === "-h") {
    usage();
    return;
  }
  if (command !== "install") {
    usage();
    process.exitCode = 1;
    return;
  }

  const marketplaces = installedMarketplaceNames();
  if (marketplaces.has(MARKETPLACE)) {
    console.log(`Removing the existing ${MARKETPLACE} marketplace binding...`);
    run(["plugin", "marketplace", "remove", MARKETPLACE]);
  }
  console.log(`Adding the ${MARKETPLACE} marketplace at ${RELEASE_REF}...`);
  run(["plugin", "marketplace", "add", SOURCE, "--ref", RELEASE_REF]);

  console.log(`Installing ${PLUGIN}...`);
  run(["plugin", "add", `${PLUGIN}@${MARKETPLACE}`]);
  console.log("Installed. Start a new Codex task to use Search Before Build.");
}

try {
  main();
} catch (error) {
  console.error(`Installation failed: ${error.message}`);
  process.exitCode = 1;
}
