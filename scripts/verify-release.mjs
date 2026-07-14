#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

function readJson(path) {
  return JSON.parse(readFileSync(new URL(path, root), "utf8"));
}

function git(args) {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `git ${args.join(" ")} failed.`);
  }
  return result.stdout.trim();
}

const packageVersion = readJson("package.json").version;
const claudeVersion = readJson(".claude-plugin/plugin.json").version;
const codexVersion = readJson(".codex-plugin/plugin.json").version;
const expectedTag = `v${packageVersion}`;

if (packageVersion !== claudeVersion || packageVersion !== codexVersion) {
  throw new Error("package.json and both plugin manifests must have the same version.");
}
if (git(["status", "--porcelain"])) {
  throw new Error("Refusing to publish from a dirty working tree.");
}

const head = git(["rev-parse", "HEAD"]);
const taggedCommit = git(["rev-parse", `${expectedTag}^{commit}`]);
if (head !== taggedCommit) {
  throw new Error(`${expectedTag} does not point to the commit being published.`);
}

console.log(`Release verified: npm ${packageVersion} -> ${expectedTag} -> ${head}`);
