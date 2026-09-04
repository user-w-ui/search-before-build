import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runPipeline } from "../../dist/pipeline.js";

async function jsonFixture(name) {
  return JSON.parse(await readFile(new URL(`../fixtures/retrieval/${name}`, import.meta.url), "utf8"));
}

test("ranks the relevant candidate and merges repository/package observations", async () => {
  const artifact = runPipeline({
    generatedAt: "2026-08-28T00:00:00Z",
    query: "TypeScript BM25 reciprocal rank fusion web research",
    fingerprint: { mustHaveCapabilities: ["TypeScript", "BM25", "rank fusion"] },
    retrievals: [
      {
        requestId: "github",
        providerHint: "github",
        categoryHint: "repo",
        outcome: "success",
        payload: await jsonFixture("github-search.json"),
      },
      {
        requestId: "npm",
        providerHint: "npm",
        categoryHint: "package",
        outcome: "success",
        payload: await jsonFixture("npm-search.json"),
      },
    ],
    topK: 3,
  });
  assert.equal(artifact.candidates[0].url, "https://github.com/rthomas24/web-vector");
  assert.equal(artifact.candidates[0].observationCount, 2);
  assert.equal(artifact.metrics.duplicateObservationsMerged, 1);
  assert.deepEqual(artifact.evidence.missingCapabilities, []);
  assert.equal(artifact.generatedAt, "2026-08-28T00:00:00.000Z");
});

test("uses capability coverage to keep complementary candidates in top-k", () => {
  const artifact = runPipeline({
    generatedAt: "2026-08-28T00:00:00Z",
    query: "agent research plugin",
    fingerprint: { mustHaveCapabilities: ["candidate ranking", "citation verification"] },
    retrievals: [{
      requestId: "web",
      providerHint: "host-web",
      categoryHint: "web",
      outcome: "success",
      payload: {
        results: [
          { title: "Ranker A", url: "https://example.com/ranker-a", description: "Candidate ranking for agent research." },
          { title: "Ranker B", url: "https://example.com/ranker-b", description: "Candidate ranking for agent research with scoring." },
          { title: "Verifier", url: "https://example.org/verifier", description: "Citation verification for agent research reports." }
        ]
      },
    }],
    topK: 2,
  });
  assert.equal(artifact.candidates.length, 2);
  assert.ok(artifact.candidates.some((candidate) => candidate.title === "Verifier"));
  assert.deepEqual(artifact.evidence.missingCapabilities, []);
});

test("matches natural-language must-haves through explicit lexical aliases", () => {
  const artifact = runPipeline({
    generatedAt: "2026-08-29T00:00:00Z",
    query: "本地离线中文语音转文字，CPU 运行，带时间戳，数据不上传",
    fingerprint: {
      mustHaveCapabilities: ["带时间戳的文字稿", "数据不出本机", "纯 CPU 可运行"],
      capabilityAliases: {
        "带时间戳的文字稿": ["timestamp", "时间戳"],
        "数据不出本机": ["offline", "无需联网", "不上传"],
        "纯 CPU 可运行": ["CPU inference", "device=cpu"],
      },
    },
    retrievals: [{
      requestId: "github-asr",
      providerHint: "github",
      categoryHint: "repo",
      outcome: "success",
      payload: {
        identity: "example/offline-asr",
        url: "https://github.com/example/offline-asr",
        description: "Offline speech recognition toolkit.",
        verified_capabilities: "CPU inference; timestamps; no Internet connection",
      },
    }],
  });
  assert.deepEqual(artifact.evidence.missingCapabilities, []);
  assert.deepEqual(artifact.candidates[0].matchedCapabilities, [
    "带时间戳的文字稿",
    "数据不出本机",
    "纯 CPU 可运行",
  ]);
});

test("keeps running when one retrieval fails", async () => {
  const artifact = runPipeline({
    generatedAt: "2026-08-28T00:00:00Z",
    query: "build decision pipeline",
    retrievals: [
      { requestId: "failed", outcome: "error", error: { kind: "rate_limit", message: "429" } },
      {
        requestId: "web",
        providerHint: "web",
        categoryHint: "web",
        outcome: "success",
        payload: await jsonFixture("web-search.json"),
      },
    ],
  });
  assert.equal(artifact.retrieval.failedRequests, 1);
  assert.ok(artifact.candidates.length > 0);
  assert.ok(artifact.retrieval.warnings.some((warning) => warning.code === "retrieval_error"));
});

test("favors recent activity through the freshness feature", () => {
  const artifact = runPipeline({
    generatedAt: "2026-08-28T00:00:00Z",
    query: "search tool",
    retrievals: [
      {
        requestId: "req-a",
        providerHint: "github",
        categoryHint: "repo",
        outcome: "success",
        payload: { items: [{ full_name: "acme/fresh-tool", description: "search tool", html_url: "https://github.com/acme/fresh-tool", pushed_at: "2026-08-01T00:00:00Z" }] },
      },
      {
        requestId: "req-b",
        providerHint: "github",
        categoryHint: "repo",
        outcome: "success",
        payload: { items: [{ full_name: "acme/stale-tool", description: "search tool", html_url: "https://github.com/acme/stale-tool", pushed_at: "2020-01-01T00:00:00Z" }] },
      },
    ],
    topK: 2,
  });
  assert.equal(artifact.candidates[0].title, "acme/fresh-tool");
  assert.equal(artifact.candidates[0].features.freshnessScore, 1);
  assert.equal(artifact.candidates[1].features.freshnessScore, 0);
  assert.match(artifact.candidates[0].explanations[3], /Most recent activity 2026-08-01/);
  assert.match(artifact.candidates[1].explanations[3], /Most recent activity 2020-01-01/);
});
