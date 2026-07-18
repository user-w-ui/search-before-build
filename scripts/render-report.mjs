#!/usr/bin/env node

import { spawn } from "node:child_process";
import {
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const TEMPLATE_PATH = join(ROOT, "assets", "report-viewer.html");
const DEFAULT_DIRECTORY = join(tmpdir(), "search-before-build");
const DEFAULT_OUTPUT = join(DEFAULT_DIRECTORY, "latest.html");
const PLACEHOLDER = "__SEARCH_BEFORE_BUILD_REPORT_DATA__";
const MAX_INPUT_BYTES = 5 * 1024 * 1024;
const SUPPORT_ENUMS = new Set([
  "native",
  "partial",
  "extensible",
  "unsupported",
  "unverified",
]);
const RECOMMENDATIONS = new Set(["Build", "Adapt", "Use existing", "Stop"]);
const COVERAGE_STATUSES = new Set(["used", "limited", "unavailable"]);
const REQUIRED_CUSTOM_LABELS = [
  "skipToContent", "assessment", "comparisonMode", "report", "project",
  "recommendation", "strongestReuse", "biggestUnknown", "generated",
  "temporaryNotice", "contextKicker", "context", "contextDescription",
  "coverageKicker", "coverage", "coverageDescription", "matrixKicker",
  "comparison", "comparisonDescription", "capability", "currentProject",
  "candidatesKicker", "candidates", "candidatesDescription", "overview",
  "comparisonWithProject", "dimension", "notableDesigns", "reusableLessons",
  "summary", "sources", "officialAddress", "coverageNote", "saveMarkdown",
  "copyMarkdown", "openOfficial", "unknownsKicker", "unknowns",
  "unknownsDescription", "used", "limited", "unavailable", "notCompared",
  "noCandidates", "noData", "saved", "copied", "saveFailed", "copyFailed",
  "theme",
];

function fail(message) {
  throw new Error(message);
}

function parseArgs(argv) {
  const options = { input: null, output: DEFAULT_OUTPUT, open: false, consumeInput: false };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--input") {
      options.input = argv[++index];
    } else if (argument === "--output") {
      options.output = argv[++index];
    } else if (argument === "--open") {
      options.open = true;
    } else if (argument === "--consume-input") {
      options.consumeInput = true;
    } else if (argument === "--help" || argument === "-h") {
      console.log(
        "Usage: node scripts/render-report.mjs --input <report.json> [--output <report.html>] [--consume-input] [--open]",
      );
      process.exit(0);
    } else {
      fail(`Unknown argument: ${argument}`);
    }
  }

  if (!options.input) fail("--input is required.");
  if (!options.output) fail("--output requires a path.");
  options.input = resolve(options.input);
  options.output = isAbsolute(options.output) ? options.output : resolve(options.output);
  return options;
}

function requireObject(value, path) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail(`${path} must be an object.`);
  }
  return value;
}

function requireString(value, path, { allowEmpty = false } = {}) {
  if (typeof value !== "string" || (!allowEmpty && value.trim() === "")) {
    fail(`${path} must be ${allowEmpty ? "a string" : "a non-empty string"}.`);
  }
  return value;
}

function requireArray(value, path) {
  if (!Array.isArray(value)) fail(`${path} must be an array.`);
  return value;
}

function optionalString(value, path) {
  if (value === undefined || value === null) return "";
  return requireString(value, path, { allowEmpty: true });
}

function validateSupportCell(cell, path) {
  requireObject(cell, path);
  if (!SUPPORT_ENUMS.has(cell.status)) {
    fail(`${path}.status must be one of: ${[...SUPPORT_ENUMS].join(", ")}.`);
  }
  optionalString(cell.note, `${path}.note`);
}

function validatePayload(payload) {
  requireObject(payload, "report");
  if (payload.schemaVersion !== 1) fail("report.schemaVersion must equal 1.");
  requireString(payload.language, "report.language");
  if (!new Set(["assess", "compare"]).has(payload.mode)) {
    fail("report.mode must be assess or compare.");
  }
  requireString(payload.topic, "report.topic");
  requireString(payload.projectName, "report.projectName");
  requireString(payload.generatedAt, "report.generatedAt");
  if (Number.isNaN(Date.parse(payload.generatedAt))) {
    fail("report.generatedAt must be an ISO-8601 date-time.");
  }

  const recommendation = requireObject(payload.recommendation, "report.recommendation");
  if (!RECOMMENDATIONS.has(recommendation.value)) {
    fail("report.recommendation.value must be Build, Adapt, Use existing, or Stop.");
  }
  requireString(recommendation.reason, "report.recommendation.reason");
  requireString(recommendation.reusableOption, "report.recommendation.reusableOption");
  requireString(recommendation.biggestUnknown, "report.recommendation.biggestUnknown");

  requireArray(payload.fingerprint, "report.fingerprint").forEach((item, index) => {
    requireObject(item, `report.fingerprint[${index}]`);
    requireString(item.label, `report.fingerprint[${index}].label`);
    requireString(item.value, `report.fingerprint[${index}].value`);
  });

  requireArray(payload.coverage, "report.coverage").forEach((item, index) => {
    requireObject(item, `report.coverage[${index}]`);
    requireString(item.label, `report.coverage[${index}].label`);
    if (!COVERAGE_STATUSES.has(item.status)) {
      fail(`report.coverage[${index}].status must be used, limited, or unavailable.`);
    }
    requireString(item.detail, `report.coverage[${index}].detail`);
  });

  const candidateIds = new Set();
  requireArray(payload.competitors, "report.competitors").forEach((candidate, index) => {
    const path = `report.competitors[${index}]`;
    requireObject(candidate, path);
    const id = requireString(candidate.id, `${path}.id`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
      fail(`${path}.id must use lowercase kebab-case.`);
    }
    if (candidateIds.has(id)) fail(`${path}.id must be unique.`);
    candidateIds.add(id);
    requireString(candidate.name, `${path}.name`);
    optionalString(candidate.url, `${path}.url`);
    requireString(candidate.category, `${path}.category`);
    requireString(candidate.overview, `${path}.overview`);
    requireArray(candidate.comparison, `${path}.comparison`).forEach((row, rowIndex) => {
      requireObject(row, `${path}.comparison[${rowIndex}]`);
      requireString(row.dimension, `${path}.comparison[${rowIndex}].dimension`);
      requireString(row.candidate, `${path}.comparison[${rowIndex}].candidate`);
      requireString(row.current, `${path}.comparison[${rowIndex}].current`);
    });
    requireArray(candidate.notableDesigns, `${path}.notableDesigns`).forEach((item, itemIndex) => {
      requireObject(item, `${path}.notableDesigns[${itemIndex}]`);
      requireString(item.title, `${path}.notableDesigns[${itemIndex}].title`);
      requireString(item.detail, `${path}.notableDesigns[${itemIndex}].detail`);
    });
    requireArray(candidate.reusableLessons, `${path}.reusableLessons`).forEach((item, itemIndex) => {
      requireString(item, `${path}.reusableLessons[${itemIndex}]`);
    });
    requireString(candidate.summary, `${path}.summary`);
    optionalString(candidate.coverageNote, `${path}.coverageNote`);
    requireArray(candidate.sources, `${path}.sources`).forEach((source, sourceIndex) => {
      requireObject(source, `${path}.sources[${sourceIndex}]`);
      requireString(source.label, `${path}.sources[${sourceIndex}].label`);
      requireString(source.url, `${path}.sources[${sourceIndex}].url`);
    });
  });

  requireArray(payload.capabilities, "report.capabilities").forEach((capability, index) => {
    const path = `report.capabilities[${index}]`;
    requireObject(capability, path);
    requireString(capability.name, `${path}.name`);
    validateSupportCell(capability.current, `${path}.current`);
    const candidates = requireObject(capability.candidates, `${path}.candidates`);
    for (const [candidateId, cell] of Object.entries(candidates)) {
      if (!candidateIds.has(candidateId)) {
        fail(`${path}.candidates references unknown competitor id: ${candidateId}.`);
      }
      validateSupportCell(cell, `${path}.candidates.${candidateId}`);
    }
  });

  requireArray(payload.unknowns, "report.unknowns").forEach((item, index) => {
    requireString(item, `report.unknowns[${index}]`);
  });
  const labels = payload.labels === undefined ? {} : requireObject(payload.labels, "report.labels");
  const language = payload.language.toLowerCase();
  if (!language.startsWith("zh") && !language.startsWith("en")) {
    const missingLabels = REQUIRED_CUSTOM_LABELS.filter(
      (key) => typeof labels[key] !== "string" || labels[key].trim() === "",
    );
    if (missingLabels.length) {
      fail(`REQUIRED_CUSTOM_LABELS: ${missingLabels.join(", ")}.`);
    }
  }
}

function encodePayload(payload) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64");
}

function writeAtomically(outputPath, contents) {
  mkdirSync(dirname(outputPath), { recursive: true });
  const temporaryPath = `${outputPath}.${process.pid}.tmp`;
  writeFileSync(temporaryPath, contents, "utf8");
  renameSync(temporaryPath, outputPath);
}

function isInside(child, parent) {
  const path = relative(resolve(parent), resolve(child));
  return path !== "" && !path.startsWith("..") && !isAbsolute(path);
}

function openFile(path) {
  let command;
  let args;
  if (process.platform === "win32") {
    command = "explorer.exe";
    args = [path];
  } else if (process.platform === "darwin") {
    command = "open";
    args = [path];
  } else {
    command = "xdg-open";
    args = [path];
  }
  const child = spawn(command, args, { detached: true, stdio: "ignore" });
  child.unref();
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.consumeInput && !isInside(options.input, DEFAULT_DIRECTORY)) {
    fail(`Refusing to consume input outside ${DEFAULT_DIRECTORY}.`);
  }
  const inputBuffer = readFileSync(options.input);
  if (inputBuffer.byteLength > MAX_INPUT_BYTES) {
    fail(`Input exceeds ${MAX_INPUT_BYTES} bytes.`);
  }
  const payload = JSON.parse(inputBuffer.toString("utf8"));
  validatePayload(payload);

  const template = readFileSync(TEMPLATE_PATH, "utf8");
  if (template.split(PLACEHOLDER).length !== 2) {
    fail(`Template must contain exactly one ${PLACEHOLDER} placeholder.`);
  }
  const html = template.replace(PLACEHOLDER, encodePayload(payload));
  writeAtomically(options.output, html);

  if (options.consumeInput) rmSync(options.input);
  if (options.open) openFile(options.output);
  console.log(options.output);
}

try {
  main();
} catch (error) {
  console.error(`render-report: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
