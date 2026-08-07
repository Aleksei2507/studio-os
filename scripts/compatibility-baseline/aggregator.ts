import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

import {
  classifyCompatibility,
  overallCombinationClassification,
  parseCompatibilityBaseline,
  parseCompatibilityTrialRecord,
} from "./contracts.ts";
import type {
  CompatibilityBaseline,
  CompatibilitySummary,
  CompatibilityTrialRecord,
  CombinationScenarioSummary,
  CombinationSummary,
} from "./contracts.ts";

export function loadCompatibilityBaseline(
  repositoryRoot: string,
  relPath = "tests/compatibility/baseline.json",
): CompatibilityBaseline {
  const absolutePath = path.resolve(repositoryRoot, relPath);
  if (!existsSync(absolutePath)) {
    throw new Error(`Compatibility baseline not found: ${relPath}`);
  }
  let value: unknown;
  try {
    value = JSON.parse(readFileSync(absolutePath, "utf8"));
  } catch (error) {
    throw new Error(
      `Failed to parse compatibility baseline: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  return parseCompatibilityBaseline(value, relPath);
}

export function loadTrialRecords(
  trialsDirectory: string,
): CompatibilityTrialRecord[] {
  if (!existsSync(trialsDirectory)) {
    return [];
  }

  const records: CompatibilityTrialRecord[] = [];

  for (const entry of readdirSync(trialsDirectory, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }
    const runDirectory = path.join(trialsDirectory, entry.name);
    for (const subEntry of readdirSync(runDirectory, { withFileTypes: true })) {
      if (!subEntry.isFile() || !subEntry.name.endsWith(".json")) {
        continue;
      }
      const recordPath = path.join(runDirectory, subEntry.name);
      let value: unknown;
      try {
        value = JSON.parse(readFileSync(recordPath, "utf8"));
      } catch (error) {
        throw new Error(
          `Failed to parse trial record ${recordPath}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
      try {
        records.push(parseCompatibilityTrialRecord(value));
      } catch (error) {
        throw new Error(
          `Invalid trial record ${recordPath}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  }

  return records;
}

export function aggregateCompatibilityResults(
  baseline: CompatibilityBaseline,
  trials: CompatibilityTrialRecord[],
  scenarioIds: string[],
): CompatibilitySummary {
  const generatedAt = new Date().toISOString();

  const combinations: CombinationSummary[] = baseline.combinations.map(
    (combo) => {
      const comboTrials = trials.filter((t) => t.combinationId === combo.id);

      const scenarios: CombinationScenarioSummary[] = scenarioIds.map(
        (scenarioId) => {
          const scenarioTrials = comboTrials.filter(
            (t) => t.scenarioId === scenarioId,
          );
          const validTrials = scenarioTrials.filter((t) => t.validTrial);
          const invalidTrials = scenarioTrials.filter((t) => !t.validTrial);
          const passedTrials = validTrials.filter((t) => t.status === "PASS");
          const failedTrials = validTrials.filter((t) => t.status !== "PASS");
          const mutationViolation = scenarioTrials.some(
            (t) => t.workspaceMutationViolation,
          );

          return {
            scenarioId,
            classification: classifyCompatibility(
              passedTrials.length,
              validTrials.length,
              mutationViolation,
            ),
            validTrials: validTrials.length,
            passedTrials: passedTrials.length,
            failedTrials: failedTrials.length,
            invalidTrials: invalidTrials.length,
            workspaceMutationViolation: mutationViolation,
          };
        },
      );

      return {
        combinationId: combo.id,
        engine: combo.engine,
        executorModel: combo.executorModel,
        judgeModel: combo.judgeModel,
        overallClassification: overallCombinationClassification(scenarios),
        scenarios,
      };
    },
  );

  return {
    version: 1,
    baselineId: baseline.baselineId,
    suiteId: baseline.suiteId,
    generatedAt,
    combinations,
  };
}

export function writeSummary(
  summary: CompatibilitySummary,
  outputPath: string,
): void {
  const dir = path.dirname(outputPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`);
}

export function buildSummaryMarkdown(
  summary: CompatibilitySummary,
  baseline: CompatibilityBaseline,
): string {
  const lines: string[] = [
    "# Compatibility Baseline Summary",
    "",
    `Baseline: \`${summary.baselineId}\``,
    `Suite: \`${summary.suiteId}\`  (required trials: ${baseline.requiredTrials})`,
    `Generated: ${summary.generatedAt}`,
    "",
  ];

  for (const combo of summary.combinations) {
    lines.push(
      `## ${combo.combinationId}`,
      "",
      `Engine: ${combo.engine} | Executor: \`${combo.executorModel}\` | Judge: \`${combo.judgeModel}\``,
      `Overall: **${combo.overallClassification}**`,
      "",
      "| Scenario | Classification | Valid | Pass | Fail | Invalid |",
      "| --- | --- | --- | --- | --- | --- |",
    );
    for (const scenario of combo.scenarios) {
      lines.push(
        `| \`${scenario.scenarioId}\` | ${scenario.classification} | ${scenario.validTrials} | ${scenario.passedTrials} | ${scenario.failedTrials} | ${scenario.invalidTrials} |`,
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}

export function summarizeCompatibilityResults(
  summary: CompatibilitySummary,
): { status: "PASS" | "FAIL"; unknownCount: number; incompatibleCount: number; flaky: number } {
  let unknownCount = 0;
  let incompatibleCount = 0;
  let flaky = 0;
  for (const combo of summary.combinations) {
    for (const scenario of combo.scenarios) {
      if (scenario.classification === "Unknown") unknownCount += 1;
      if (scenario.classification === "Incompatible") incompatibleCount += 1;
      if (scenario.classification === "Flaky") flaky += 1;
    }
  }
  const status =
    incompatibleCount > 0 || unknownCount > 0 ? "FAIL" : "PASS";
  return { status, unknownCount, incompatibleCount, flaky };
}
