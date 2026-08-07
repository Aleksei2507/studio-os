import { fileURLToPath } from "node:url";
import path from "node:path";

import {
  buildInstalledAdapterSummaryMarkdown,
  loadInstalledAdapterEvidence,
  resolveInstalledAdapterOutputDirectory,
  summarizeInstalledAdapterEvidence,
  writeInstalledAdapterArtifacts,
} from "./adapter-testing/evidence.ts";
import { loadInstalledAdapterMatrix } from "./adapter-testing/matrix.ts";

interface CliOptions {
  dry: boolean;
  evidence?: string;
  matrix: string;
  outputDir?: string;
}

export function parseArgs(argv: string[]): CliOptions {
  let dry = false;
  let evidence: string | undefined;
  let matrix = "tests/installed-adapters/matrix.json";
  let outputDir: string | undefined;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--dry") {
      dry = true;
      continue;
    }
    if (arg === "--matrix") {
      matrix = requiredValue(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--evidence") {
      evidence = requiredValue(argv, index, arg);
      index += 1;
      continue;
    }
    if (arg === "--output-dir") {
      outputDir = requiredValue(argv, index, arg);
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (dry && (evidence || outputDir)) {
    throw new Error("--dry cannot be combined with --evidence or --output-dir.");
  }
  if (!dry && !evidence) {
    throw new Error("Installed adapter evidence validation requires --evidence.");
  }
  if (outputDir && !evidence) {
    throw new Error("--output-dir requires --evidence.");
  }

  return { dry, evidence, matrix, outputDir };
}

export function run(options: CliOptions, repositoryRoot = process.cwd()): number {
  const matrix = loadInstalledAdapterMatrix(repositoryRoot, options.matrix);

  if (options.dry) {
    console.log("Mode: Installed adapter matrix validation");
    console.log(`Matrix: ${matrix.matrixId} v${matrix.version}`);
    console.log(`Source: ${matrix.sourcePath}`);
    console.log(`Cases: ${matrix.cases.length}`);
    for (const matrixCase of matrix.cases) {
      console.log(
        `PASS ${matrixCase.id} - ${matrixCase.adapter}/${matrixCase.projectMode} (${matrixCase.requiredChecks.length} checks)`,
      );
    }
    console.log("Installed adapter matrix validation summary: PASS");
    return 0;
  }

  const evidence = loadInstalledAdapterEvidence(
    repositoryRoot,
    options.evidence as string,
    matrix,
  );
  const summary = summarizeInstalledAdapterEvidence(evidence);
  console.log(buildInstalledAdapterSummaryMarkdown(evidence, matrix).trimEnd());

  if (options.outputDir) {
    const outputDirectory = resolveInstalledAdapterOutputDirectory(
      repositoryRoot,
      options.outputDir,
    );
    writeInstalledAdapterArtifacts(outputDirectory, evidence, matrix);
    console.log(`Artifacts: ${options.outputDir}`);
  }

  return summary.status === "PASS" ? 0 : 1;
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
