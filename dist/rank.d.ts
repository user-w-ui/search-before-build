import type { FunctionalFingerprint, NormalizedRecord, RankedCandidate } from "./types.js";
export declare function tokenize(text: string): string[];
export interface RankResult {
    candidates: RankedCandidate[];
    uniqueCandidates: number;
    duplicateObservationsMerged: number;
}
export declare function rankCandidates(records: NormalizedRecord[], query: string, fingerprint?: FunctionalFingerprint, topK?: number): RankResult;
