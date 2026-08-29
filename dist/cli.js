#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { normalizeRetrieval } from "./normalize.js";
import { runPipeline } from "./pipeline.js";
function parseArgs(argv) {
    const command = argv[0] === "normalize" ? "normalize" : argv[0] === "run" ? "run" : argv[0] ? "help" : "help";
    const options = { command, compact: false };
    for (let index = 1; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === "--input")
            options.input = argv[++index];
        else if (arg === "--output")
            options.output = argv[++index];
        else if (arg === "--compact")
            options.compact = true;
        else
            throw new Error(`Unknown argument: ${arg}`);
    }
    return options;
}
function usage() {
    return [
        "Search Before Build decision kernel",
        "",
        "Usage:",
        "  node dist/cli.js run --input <pipeline.json> [--output <artifact.json>] [--compact]",
        "  node dist/cli.js normalize --input <envelope.json> [--output <result.json>] [--compact]",
    ].join("\n");
}
async function main() {
    const options = parseArgs(process.argv.slice(2));
    if (options.command === "help") {
        process.stdout.write(`${usage()}\n`);
        return;
    }
    if (!options.input)
        throw new Error("--input is required.");
    const inputPath = resolve(options.input);
    const input = JSON.parse(await readFile(inputPath, "utf8"));
    const result = options.command === "normalize"
        ? Array.isArray(input)
            ? input.map((envelope) => normalizeRetrieval(envelope))
            : normalizeRetrieval(input)
        : runPipeline(input);
    const json = `${JSON.stringify(result, null, options.compact ? 0 : 2)}\n`;
    if (options.output)
        await writeFile(resolve(options.output), json, "utf8");
    else
        process.stdout.write(json);
}
main().catch((error) => {
    process.stderr.write(`decision-kernel: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
});
export { main, parseArgs };
//# sourceMappingURL=cli.js.map