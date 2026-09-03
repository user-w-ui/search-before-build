export type SourceCategory = "web" | "repo" | "package" | "mcp" | "model" | "paper" | "community" | "wiki" | "page";
export interface RetrievalError {
    kind: "timeout" | "rate_limit" | "auth" | "network" | "tool" | "unknown";
    message: string;
    retryAfterMs?: number;
}
interface RetrievalContext {
    requestId: string;
    providerHint?: string;
    categoryHint?: SourceCategory;
    query?: string;
    receivedAt?: string;
}
export type RetrievalEnvelope = RetrievalContext & ({
    outcome: "success";
    payload: unknown;
} | {
    outcome: "error";
    payload?: unknown;
    error: RetrievalError;
});
export interface NormalizationWarning {
    code: "missing_identity" | "missing_text" | "invalid_url" | "invalid_date" | "unknown_shape" | "partial_item" | "flattened_payload" | "retrieval_error";
    message: string;
    rawRef?: string;
}
export interface RecordIdentity {
    scheme: "purl" | "github" | "doi" | "arxiv" | "mcp" | "url" | "provider";
    value: string;
    confidence: "exact" | "derived";
}
export interface NormalizedRecord {
    recordId: string;
    status: "usable" | "partial" | "unusable";
    kind?: SourceCategory;
    identities: RecordIdentity[];
    title?: string;
    url?: string;
    text: {
        snippet?: string;
        description?: string;
        fragments?: string[];
    };
    dates?: {
        publishedAt?: string;
        updatedAt?: string;
    };
    attributes: Record<string, string | number | boolean | string[]>;
    provenance: {
        requestId: string;
        provider?: string;
        providerRank?: number;
        providerScore?: number;
        rawRef: string;
    };
    warnings: NormalizationWarning[];
}
export interface NormalizationResult {
    requestId: string;
    records: NormalizedRecord[];
    rejected: Array<{
        rawRef: string;
        reason: string;
    }>;
    observedCapabilities: Partial<Record<"providerScore" | "publishedDate" | "stableIdentity" | "fullText" | "multipleResults", boolean>>;
    batchWarnings: NormalizationWarning[];
}
export interface FunctionalFingerprint {
    mustHaveCapabilities?: string[];
    capabilityAliases?: Record<string, string[]>;
    desiredOutcome?: string;
    operatingMode?: string;
    dealBreakers?: string[];
}
export interface PipelineInput {
    schemaVersion?: 1;
    generatedAt?: string;
    query: string;
    fingerprint?: FunctionalFingerprint;
    retrievals: RetrievalEnvelope[];
    topK?: number;
}
export interface CandidateFeatureVector {
    lexicalFit: number;
    reciprocalRank: number;
    evidenceQuality: number;
    freshnessScore: number;
    finalScore: number;
}
export interface RankedCandidate {
    id: string;
    rank: number;
    title: string;
    url?: string;
    kind?: SourceCategory;
    identities: RecordIdentity[];
    sourceCategories: SourceCategory[];
    matchedCapabilities: string[];
    evidenceRefs: string[];
    features: CandidateFeatureVector;
    explanations: string[];
    observationCount: number;
}
export interface CapabilityCoverage {
    capability: string;
    status: "candidate_mention" | "missing";
    candidateIds: string[];
}
export interface DecisionSupportArtifact {
    schemaVersion: 1;
    generatedAt: string;
    query: string;
    candidates: RankedCandidate[];
    coverage: CapabilityCoverage[];
    evidence: {
        level: "strong" | "weak" | "none";
        basis: "heuristic_candidate_coverage";
        missingCapabilities: string[];
        sourceCategories: SourceCategory[];
        needsFollowUp: boolean;
        suggestedQueries: string[];
    };
    retrieval: {
        requests: number;
        failedRequests: number;
        normalizedRecords: number;
        rejectedRecords: number;
        warnings: NormalizationWarning[];
    };
    metrics: {
        uniqueCandidates: number;
        returnedCandidates: number;
        duplicateObservationsMerged: number;
    };
    trace: Array<{
        stage: string;
        detail: string;
    }>;
}
export {};
