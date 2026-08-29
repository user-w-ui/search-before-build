import { readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { normalizeUrl } from "../dist/normalize.js";
import { runPipeline } from "../dist/pipeline.js";

function mean(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--case") options.case = argv[++index];
    else if (argv[index] === "--output") options.output = argv[++index];
    else throw new Error(`Unknown argument: ${argv[index]}`);
  }
  return options;
}

async function loadCase(path) {
  const value = JSON.parse(await readFile(path, "utf8"));
  const retrievals = await Promise.all(value.retrievals.map(async ({ fixture, ...context }) => {
    const fixturePath = resolve(fixture);
    const text = await readFile(fixturePath, "utf8");
    const payload = fixturePath.endsWith(".json") ? JSON.parse(text) : text;
    return { ...context, outcome: "success", payload };
  }));
  return { ...value, retrievals };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const names = (await readdir(resolve("bench/smoke/cases")))
    .filter((name) => name.endsWith(".json"))
    .filter((name) => !options.case || name.includes(options.case))
    .sort();
  if (!names.length) throw new Error("No benchmark cases matched.");
  const results = [];
  for (const name of names) {
    const testCase = await loadCase(resolve("bench/smoke/cases", name));
    const artifact = runPipeline({
      generatedAt: "2026-08-28T00:00:00Z",
      query: testCase.query,
      fingerprint: testCase.fingerprint,
      topK: testCase.topK,
      retrievals: testCase.retrievals,
    });
    const relevant = new Set(testCase.relevantUrls.map((url) => normalizeUrl(url)));
    const ranked = artifact.candidates.map((candidate) => normalizeUrl(candidate.url)).filter(Boolean);
    const hitRanks = ranked
      .map((url, index) => relevant.has(url) ? index + 1 : 0)
      .filter(Boolean);
    const found = new Set(ranked.filter((url) => relevant.has(url)));
    results.push({
      id: testCase.id,
      recallAtK: relevant.size ? found.size / relevant.size : 0,
      mrr: hitRanks.length ? 1 / Math.min(...hitRanks) : 0,
      candidates: artifact.candidates.length,
      normalizedRecords: artifact.retrieval.normalizedRecords,
      missingCapabilities: artifact.evidence.missingCapabilities,
    });
  }
  const summary = {
    schemaVersion: 1,
    note: "Smoke benchmark only; not a product-quality claim.",
    cases: results.length,
    meanRecallAtK: Number(mean(results.map((result) => result.recallAtK)).toFixed(4)),
    meanMrr: Number(mean(results.map((result) => result.mrr)).toFixed(4)),
    results,
  };
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  if (options.output) await writeFile(resolve(options.output), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  if (results.some((result) => result.recallAtK === 0)) process.exitCode = 1;
}

main().catch((error) => {
  process.stderr.write(`benchmark: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
