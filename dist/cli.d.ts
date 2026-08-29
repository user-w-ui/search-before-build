#!/usr/bin/env node
interface CliOptions {
    command: "run" | "normalize" | "help";
    input?: string;
    output?: string;
    compact: boolean;
}
declare function parseArgs(argv: string[]): CliOptions;
declare function main(): Promise<void>;
export { main, parseArgs };
