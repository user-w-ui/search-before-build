import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { normalizeRetrieval } from "../../dist/normalize.js";

async function fixture(name, json = true) {
  const text = await readFile(new URL(`../fixtures/retrieval/${name}`, import.meta.url), "utf8");
  return json ? JSON.parse(text) : text;
}

test("normalizes nested GitHub results without requiring optional fields", async () => {
  const result = normalizeRetrieval({
    requestId: "github-1",
    providerHint: "github",
    categoryHint: "repo",
    outcome: "success",
    payload: await fixture("github-search.json"),
  });
  assert.equal(result.records.length, 2);
  assert.equal(result.records[0].title, "rthomas24/web-vector");
  assert.equal(result.records[0].attributes.stars, 4);
  assert.ok(result.records[0].identities.some((identity) => identity.scheme === "github"));
});

test("normalizes MCP nested server objects", async () => {
  const result = normalizeRetrieval({
    requestId: "mcp-1",
    providerHint: "official-mcp-registry",
    categoryHint: "mcp",
    outcome: "success",
    payload: await fixture("mcp-registry.json"),
  });
  assert.equal(result.records.length, 2);
  assert.equal(result.records[0].kind, "mcp");
  assert.equal(result.records[0].title, "io.github.acme/research-kit");
  assert.equal(result.records[0].url, "https://github.com/acme/research-kit");
});

test("normalizes Atom XML and DuckDuckGo HTML with zero parser dependencies", async () => {
  const atom = normalizeRetrieval({
    requestId: "paper-1",
    providerHint: "arxiv",
    categoryHint: "paper",
    outcome: "success",
    payload: await fixture("arxiv-feed.xml", false),
  });
  assert.equal(atom.records[0].title, "BMX: Entropy-weighted lexical retrieval");
  assert.equal(atom.records[0].url, "https://arxiv.org/abs/2408.06643");

  const html = normalizeRetrieval({
    requestId: "web-1",
    providerHint: "duckduckgo",
    categoryHint: "web",
    outcome: "success",
    payload: await fixture("duckduckgo.html", false),
  });
  assert.equal(html.records[0].title, "Agent search planner");
  assert.equal(html.records[0].url, "https://example.com/agent-search");
});

test("unknown and failed payloads degrade observably instead of throwing", () => {
  const unknown = normalizeRetrieval({
    requestId: "unknown-1",
    outcome: "success",
    payload: { opaque: { value: 42 } },
  });
  assert.equal(unknown.records[0].status, "unusable");
  assert.ok(unknown.batchWarnings.some((warning) => warning.code === "unknown_shape"));

  const failed = normalizeRetrieval({
    requestId: "failed-1",
    outcome: "error",
    error: { kind: "timeout", message: "deadline exceeded" },
  });
  assert.equal(failed.records.length, 0);
  assert.equal(failed.batchWarnings[0].code, "retrieval_error");
});
