import type { NormalizationResult, RetrievalEnvelope } from "./types.js";
export declare function normalizeUrl(value: string | undefined): string | undefined;
export declare function normalizeRetrieval(envelope: RetrievalEnvelope): NormalizationResult;
