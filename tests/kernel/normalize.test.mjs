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

test("prefers html_url over the API url and falls back to links.npm", () => {
  const github = normalizeRetrieval({
    requestId: "gh-2",
    providerHint: "github",
    categoryHint: "repo",
    outcome: "success",
    payload: {
      items: [{
        id: 1,
        full_name: "acme/tool",
        html_url: "https://github.com/acme/tool",
        url: "https://api.github.com/repos/acme/tool",
        description: "A tool.",
      }],
    },
  });
  assert.equal(github.records[0].url, "https://github.com/acme/tool");
  assert.ok(github.records[0].identities.some(
    (identity) => identity.scheme === "github" && identity.value === "acme/tool",
  ));

  const npm = normalizeRetrieval({
    requestId: "npm-2",
    providerHint: "npm",
    categoryHint: "package",
    outcome: "success",
    payload: [{
      name: "solo",
      description: "Solo package.",
      links: { npm: "https://www.npmjs.com/package/solo" },
    }],
  });
  assert.equal(npm.records[0].url, "https://www.npmjs.com/package/solo");
});

test("projects the field shapes captured by the real A/B benchmark", () => {
  const web = normalizeRetrieval({
    requestId: "web-findings",
    providerHint: "host-web",
    categoryHint: "web",
    outcome: "success",
    payload: {
      url: "https://example.com/docs",
      findings: "Runs offline and checks generated output for staleness.",
    },
  });
  assert.equal(web.records[0].status, "usable");
  assert.equal(web.records[0].text.description, "Runs offline and checks generated output for staleness.");
  assert.ok(!web.batchWarnings.some((warning) => warning.code === "unknown_shape"));

  const registry = normalizeRetrieval({
    requestId: "mcp-notable-candidates",
    providerHint: "official-mcp-registry",
    categoryHint: "mcp",
    outcome: "success",
    payload: {
      query: "fetch",
      notableCandidates: [{
        name: "ai.example/fetch",
        desc: "Fetch and read web page content.",
        repo: "https://github.com/example/fetch-mcp",
        transport: "stdio",
      }],
    },
  });
  assert.equal(registry.records.length, 1);
  assert.equal(registry.records[0].url, "https://github.com/example/fetch-mcp");
  assert.equal(registry.records[0].text.description, "Fetch and read web page content.");
  assert.deepEqual(registry.records[0].text.fragments, ["stdio"]);

  const verified = normalizeRetrieval({
    requestId: "verified-capabilities",
    providerHint: "github",
    categoryHint: "repo",
    outcome: "success",
    payload: {
      identity: "example/offline-asr",
      url: "https://github.com/example/offline-asr",
      description: "Offline speech recognition.",
      verified_capabilities: "CPU inference; timestamps; no Internet connection",
    },
  });
  assert.equal(verified.records[0].title, "example/offline-asr");
  assert.deepEqual(verified.records[0].text.fragments, [
    "CPU inference; timestamps; no Internet connection",
  ]);
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

test("flags flattened specialized payloads while raw and host-tool shapes stay silent", async () => {
  const flattened = normalizeRetrieval({
    requestId: "gh-flat",
    providerHint: "github",
    categoryHint: "repo",
    outcome: "success",
    payload: { results: [{ title: "acme/tool", url: "https://github.com/acme/tool", snippet: "A tool.", stars: 12 }] },
  });
  assert.ok(flattened.batchWarnings.some((warning) => warning.code === "flattened_payload"));

  const raw = normalizeRetrieval({
    requestId: "gh-raw",
    providerHint: "github",
    categoryHint: "repo",
    outcome: "success",
    payload: await fixture("github-search.json"),
  });
  assert.ok(!raw.batchWarnings.some((warning) => warning.code === "flattened_payload"));

  const hostWeb = normalizeRetrieval({
    requestId: "web-native",
    providerHint: "host-web",
    categoryHint: "web",
    outcome: "success",
    payload: { results: [{ title: "Page", url: "https://example.com", snippet: "Snippet." }] },
  });
  assert.ok(!hostWeb.batchWarnings.some((warning) => warning.code === "flattened_payload"));
});

test("derives Maven purl identity from group:artifact id and keeps it mergeable", () => {
  const maven = normalizeRetrieval({
    requestId: "maven-1",
    providerHint: "maven",
    categoryHint: "package",
    outcome: "success",
    payload: { results: [{ id: "org.openapitools:openapi-generator", latestVersion: "7.14.0", timestamp: 1750000000000 }] },
  });
  assert.ok(maven.records[0].identities.some(
    (identity) => identity.scheme === "purl" && identity.value === "pkg:maven/org.openapitools/openapi-generator",
  ));
  assert.equal(maven.records[0].status, "partial");
  assert.equal(maven.records[0].dates.updatedAt, new Date(1750000000000).toISOString());
  assert.ok(!maven.batchWarnings.some((warning) => warning.code === "flattened_payload"));
});

test("derives Hugging Face model kind, URL, and title from modelId", () => {
  const hf = normalizeRetrieval({
    requestId: "hf-1",
    providerHint: "hf",
    outcome: "success",
    payload: [{ modelId: "openai/whisper-large-v3", downloads: 12345, likes: 99, lastModified: "2026-07-01T00:00:00Z" }],
  });
  assert.equal(hf.records[0].kind, "model");
  assert.equal(hf.records[0].title, "openai/whisper-large-v3");
  assert.equal(hf.records[0].url, "https://huggingface.co/openai/whisper-large-v3");
  assert.equal(hf.records[0].attributes.downloads, 12345);
  assert.equal(hf.records[0].dates.updatedAt, "2026-07-01T00:00:00.000Z");
  assert.ok(!hf.batchWarnings.some((warning) => warning.code === "flattened_payload"));
});
