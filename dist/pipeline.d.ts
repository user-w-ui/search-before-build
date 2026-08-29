import type { DecisionSupportArtifact, PipelineInput } from "./types.js";
export declare function validatePipelineInput(value: unknown): PipelineInput;
export declare function runPipeline(rawInput: unknown): DecisionSupportArtifact;
