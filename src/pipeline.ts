import { normalizeRetrieval } from "./normalize.js";
import { rankCandidates } from "./rank.js";
import type {
  DecisionSupportArtifact,
  PipelineInput,
  RetrievalEnvelope,
  SourceCategory,
} from "./types.js";

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function validatePipelineInput(value: unknown): PipelineInput {
  if (!isObject(value)) throw new Error("Pipeline input must be a JSON object.");
  if (typeof value.query !== "string" || !value.query.trim()) {
    throw new Error("Pipeline input requires a non-empty query.");
  }
  if (!Array.isArray(value.retrievals)) {
    throw new Error("Pipeline input requires a retrievals array.");
  }
  for (const [index, retrieval] of value.retrievals.entries()) {
    if (!isObject(retrieval) || typeof retrieval.requestId !== "string") {
      throw new Error(`retrievals[${index}] requires requestId.`);
    }
    if (retrieval.outcome !== "success" && retrieval.outcome !== "error") {
      throw new Error(`retrievals[${index}].outcome must be success or error.`);
    }
    if (retrieval.outcome === "success" && !("payload" in retrieval)) {
      throw new Error(`retrievals[${index}] success outcome requires payload.`);
    }
    if (retrieval.outcome === "error" && !isObject(retrieval.error)) {
      throw new Error(`retrievals[${index}] error outcome requires error details.`);
    }
  }
  return value as unknown as PipelineInput;
}

export function runPipeline(rawInput: unknown): DecisionSupportArtifact {
  const input = validatePipelineInput(rawInput);
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  if (Number.isNaN(Date.parse(generatedAt))) throw new Error("generatedAt must be an ISO-8601 date-time.");
  const normalized = input.retrievals.map((retrieval: RetrievalEnvelope) => normalizeRetrieval(retrieval));
  const records = normalized.flatMap((result) => result.records);
  const rankResult = rankCandidates(records, input.query, input.fingerprint, input.topK ?? 5);
  const capabilities = [...new Set((input.fingerprint?.mustHaveCapabilities ?? []).map((value) => value.trim()).filter(Boolean))];
  const coverage = capabilities.map((capability) => {
    const candidateIds = rankResult.candidates
      .filter((candidate) => candidate.matchedCapabilities.includes(capability))
      .map((candidate) => candidate.id);
    return {
      capability,
      status: candidateIds.length ? "candidate_mention" as const : "missing" as const,
      candidateIds,
    };
  });
  const missingCapabilities = coverage
    .filter((item) => item.status === "missing")
    .map((item) => item.capability);
  const sourceCategories = [...new Set(
    rankResult.candidates.flatMap((candidate) => candidate.sourceCategories),
  )] as SourceCategory[];
  const evidenceLevel = rankResult.candidates.length === 0
    ? "none"
    : capabilities.length > 0 && missingCapabilities.length === 0 && sourceCategories.length >= 2
      ? "strong"
      : "weak";
  const warnings = normalized.flatMap((result) => [
    ...result.batchWarnings,
    ...result.records.flatMap((record) => record.warnings),
  ]);
  const failedRequests = input.retrievals.filter((retrieval) => retrieval.outcome === "error").length;
  return {
    schemaVersion: 1,
    generatedAt: new Date(generatedAt).toISOString(),
    query: input.query.trim(),
    candidates: rankResult.candidates,
    coverage,
    evidence: {
      level: evidenceLevel,
      basis: "heuristic_candidate_coverage",
      missingCapabilities,
      sourceCategories,
      needsFollowUp: evidenceLevel !== "strong",
      suggestedQueries: missingCapabilities.slice(0, 3).map((capability) => `${input.query} ${capability}`),
    },
    retrieval: {
      requests: input.retrievals.length,
      failedRequests,
      normalizedRecords: records.length,
      rejectedRecords: normalized.reduce((sum, result) => sum + result.rejected.length, 0),
      warnings,
    },
    metrics: {
      uniqueCandidates: rankResult.uniqueCandidates,
      returnedCandidates: rankResult.candidates.length,
      duplicateObservationsMerged: rankResult.duplicateObservationsMerged,
    },
    trace: [
      { stage: "normalize", detail: `${records.length} records from ${input.retrievals.length} retrieval requests.` },
      { stage: "identity", detail: `${rankResult.duplicateObservationsMerged} duplicate observations merged conservatively.` },
      { stage: "rank", detail: `${rankResult.uniqueCandidates} unique candidates scored with BM25F and RRF.` },
      { stage: "select", detail: `${rankResult.candidates.length} candidates selected with lexical diversity and capability coverage.` },
      { stage: "evidence", detail: `${missingCapabilities.length} must-have capabilities still missing candidate mentions.` },
    ],
  };
}
