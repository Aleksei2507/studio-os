import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import path from "node:path";

import {
  aggregateCompatibilityResults,
  buildSummaryMarkdown,
  loadCompatibilityBaseline,
  loadTrialRecords,
  summarizeCompatibilityResults,
  writeSummary,
} from "./compatibility-baseline/aggregator.ts";

interface CliOptions {
  dry: boolean;
  baseline: string;
  trialsDir: string;
  output: string;
  suiteFile: string;
}

export function parseArgs(argv: string[]): CliOptions {
  let dry = false;
  let baseline = "tests/compatibility/baseline.json";
  let trialsDir = "test-results/compatibility";
  let output = "tests/compatibility/summary.json";
  let suiteFile = "tests/runtime/critical-suite.json";

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--dry") {
      dry = true;
      continue;
    }
    if (arg === "--baseline") {
      baseline = requiredValue(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--trials") {
      trialsDir = requiredValue(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--output") {
      output = requiredValue(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--suite") {
      suiteFile = requiredValue(argv, index, arg);
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (dry && trialsDir !== "test-results/compatibility") {
    throw new Error("--dry cannot be combined with --trials.");
  }
  if (dry && output !== "tests/compatibility/summary.json") {
    throw new Error("--dry cannot be combined with --output.");
  }

  return { dry, baseline, trialsDir, output, suiteFile };
}

export function run(options: CliOptions, repositoryRoot = process.cwd()): number {
  const baseline = loadCompatibilityBaseline(repositoryRoot, options.baseline);

  if (options.dry) {
    console.log("Mode: Compatibility baseline validation");
    console.log(`Baseline: ${baseline.baselineId} v${baseline.version}`);
    console.log(`Source: ${baseline.sourcePath}`);
    console.log(
      `Suite: ${baseline.suiteId} (requiredTrials: ${baseline.requiredTrials})`,
    );
    console.log(`Combinations: ${baseline.combinations.length}`);
    for (const combo of baseline.combinations) {
      console.log(`PASS ${combo.id} - ${combo.engine}/${combo.executorModel}`);
    }
    console.log("Compatibility baseline validation: PASS");
    return 0;
  }

  const suitePath = path.resolve(repositoryRoot, options.suiteFile);
  const suite = JSON.parse(readFileSync(suitePath, "utf8")) as {
    scenarios: Array<{ id: string }>;
  };
  const scenarioIds = suite.scenarios.map((s) => s.id);

  const trialsDirectory = path.resolve(repositoryRoot, options.trialsDir);
  const trials = loadTrialRecords(trialsDirectory);

  const summary = aggregateCompatibilityResults(baseline, trials, scenarioIds);

  const outputPath = path.resolve(repositoryRoot, options.output);
  writeSummary(summary, outputPath);

  console.log(buildSummaryMarkdown(summary, baseline).trimEnd());
  console.log(`Summary: ${options.output}`);

  const result = summarizeCompatibilityResults(summary);

  if (result.incompatibleCount > 0) {
    console.error(
      `Compatibility check: FAIL (${result.incompatibleCount} Incompatible scenario(s))`,
    );
    return 1;
  }
  if (result.unknownCount > 0) {
    console.error(
      `Compatibility check: FAIL (${result.unknownCount} Unknown scenario(s) — insufficient valid trial evidence)`,
    );
    return 1;
  }
  if (result.flaky > 0) {
    console.error(
      `Compatibility check: FAIL (${result.flaky} Flaky scenario(s))`,
    );
    return 1;
  }
  console.log("Compatibility check: PASS");
  return 0;
}

function requiredValue(argv: string[], index: number, option: string): string {
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${option} requires a value.`);
  }
  return value;
}

async function main(): Promise<void> {
  try {
    process.exitCode = run(parseArgs(process.argv.slice(2)));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  void main();
}
