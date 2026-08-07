import { fileURLToPath } from "node:url";
import path from "node:path";

import {
  buildRCReportMarkdown,
  runRCGates,
  writeRCSummary,
} from "./release-candidate/aggregator.ts";
import {
  RC_SUMMARY_PATH,
  summarizeRCEvidence,
} from "./release-candidate/contracts.ts";

interface CliOptions {
  dry: boolean;
  output: string;
}

export function parseArgs(argv: string[]): CliOptions {
  let dry = false;
  let output = RC_SUMMARY_PATH;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--dry") {
      dry = true;
      continue;
    }
    if (arg === "--output") {
      output = requiredValue(argv, index, arg);
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (dry && output !== RC_SUMMARY_PATH) {
    throw new Error("--dry cannot be combined with --output.");
  }

  return { dry, output };
}

export function run(options: CliOptions, repositoryRoot = process.cwd()): number {
  const evidence = runRCGates(repositoryRoot);
  const summary = summarizeRCEvidence(evidence);

  console.log(buildRCReportMarkdown(evidence).trimEnd());

  if (!options.dry) {
    const outputPath = path.resolve(repositoryRoot, options.output);
    writeRCSummary(evidence, outputPath);
    console.log(`Summary: ${options.output}`);
  }

  if (summary.status !== "PASS") {
    console.error(
      `Release candidate check: FAIL (${summary.failCount} gate(s) failed)`,
    );
    return 1;
  }

  console.log("Release candidate check: PASS");
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
