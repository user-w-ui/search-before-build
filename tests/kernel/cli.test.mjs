import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import test from "node:test";

test("CLI writes a decision-support artifact", async () => {
  const directory = await mkdtemp(join(process.cwd(), "tests", ".tmp-cli-"));
  try {
    const input = join(directory, "input.json");
    const output = join(directory, "output.json");
    await writeFile(input, JSON.stringify({
      generatedAt: "2026-08-28T00:00:00Z",
      query: "MCP registry search",
      fingerprint: { mustHaveCapabilities: ["MCP registry"] },
      retrievals: [{
        requestId: "one",
        providerHint: "web",
        categoryHint: "web",
        outcome: "success",
        payload: [{ title: "Registry", url: "https://example.com/registry", description: "MCP registry search" }],
      }],
    }), "utf8");
    const result = spawnSync(process.execPath, ["dist/cli.js", "run", "--input", input, "--output", output], {
      cwd: process.cwd(),
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
    const artifact = JSON.parse(await readFile(output, "utf8"));
    assert.equal(artifact.schemaVersion, 1);
    assert.equal(artifact.candidates[0].title, "Registry");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("CLI rejects malformed input with a useful error", async () => {
  const directory = await mkdtemp(join(process.cwd(), "tests", ".tmp-cli-"));
  try {
    const input = join(directory, "invalid.json");
    await writeFile(input, JSON.stringify({ query: "x" }), "utf8");
    const result = spawnSync(process.execPath, ["dist/cli.js", "run", "--input", input], {
      cwd: process.cwd(),
      encoding: "utf8",
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /retrievals array/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
