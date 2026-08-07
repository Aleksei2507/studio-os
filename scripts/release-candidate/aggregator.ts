import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import {
  installedAdapters,
  installedAdapterProjectModes,
} from "../adapter-testing/contracts.ts";
import { loadInstalledAdapterMatrix } from "../adapter-testing/matrix.ts";
import {
  readReleaseManifest,
  readReleaseMetadata,
  validateReleaseMetadata,
} from "../build-release.ts";
import { loadCompatibilityBaseline } from "../compatibility-baseline/aggregator.ts";
import {
  compatibilityBaselineId,
  compatibilitySuiteId,
} from "../compatibility-baseline/contracts.ts";
import {
  parseIssueTriage,
  RC_TRIAGE_PATH,
  summarizeRCEvidence,
} from "./contracts.ts";
import type {
  IssueTriage,
  RCEvidence,
  RCGateResult,
} from "./contracts.ts";

export function loadIssueTriage(repositoryRoot: string): IssueTriage {
  const triagePath = path.resolve(repositoryRoot, RC_TRIAGE_PATH);
  if (!existsSync(triagePath)) {
    throw new Error(`Issue triage not found: ${RC_TRIAGE_PATH}`);
  }
  let value: unknown;
  try {
    value = JSON.parse(readFileSync(triagePath, "utf8"));
  } catch (error) {
    throw new Error(
      `Failed to parse issue triage: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  return parseIssueTriage(value, RC_TRIAGE_PATH);
}

function tryGate(gate: string, fn: () => string): RCGateResult {
  try {
    const detail = fn();
    return { gate, status: "PASS", detail };
  } catch (error) {
    return {
      gate,
      status: "FAIL",
      detail: error instanceof Error ? error.message : String(error),
    };
  }
}

export function runRCGates(repositoryRoot: string): RCEvidence {
  const generatedAt = new Date().toISOString();
  const gates: RCGateResult[] = [];

  gates.push(
    tryGate("release-metadata", () => {
      const metadata = readReleaseMetadata();
      const tag = validateReleaseMetadata(metadata);
      return `${tag} — all version locations consistent`;
    }),
  );

  gates.push(
    tryGate("release-manifest", () => {
      const manifest = readReleaseManifest(repositoryRoot);
      const pathCount =
        manifest.includeTrees.length + manifest.includeFiles.length;
      return `version ${manifest.version} — ${pathCount} included paths, ${manifest.forbiddenPrefixes.length} forbidden prefixes`;
    }),
  );

  gates.push(
    tryGate("installed-adapter-matrix", () => {
      const matrix = loadInstalledAdapterMatrix(repositoryRoot);
      const expectedCount =
        installedAdapters.length * installedAdapterProjectModes.length;
      if (matrix.cases.length !== expectedCount) {
        throw new Error(
          `Expected ${expectedCount} adapter cases, found ${matrix.cases.length}`,
        );
      }
      return `${matrix.matrixId} — ${matrix.cases.length} cases (${installedAdapters.join(", ")})`;
    }),
  );

  gates.push(
    tryGate("compatibility-baseline", () => {
      const baseline = loadCompatibilityBaseline(repositoryRoot);
      if (baseline.baselineId !== compatibilityBaselineId) {
        throw new Error(
          `Expected baselineId ${compatibilityBaselineId}, found ${baseline.baselineId}`,
        );
      }
      const engines = baseline.combinations.map((c) => c.engine).join(", ");
      return `${baseline.baselineId} — ${baseline.combinations.length} combinations (${engines})`;
    }),
  );

  gates.push(
    tryGate("compatibility-summary", () => {
      const summaryPath = path.resolve(
        repositoryRoot,
        "tests/compatibility/summary.json",
      );
      if (!existsSync(summaryPath)) {
        throw new Error("tests/compatibility/summary.json not found");
      }
      const summary = JSON.parse(readFileSync(summaryPath, "utf8")) as {
        version: unknown;
        baselineId: unknown;
        suiteId: unknown;
        combinations: Array<{ combinationId: string; scenarios: unknown[] }>;
      };
      if (summary.version !== 1) {
        throw new Error("summary.json version must be 1");
      }
      if (summary.baselineId !== compatibilityBaselineId) {
        throw new Error(
          `summary.json baselineId must be ${compatibilityBaselineId}`,
        );
      }
      if (summary.suiteId !== compatibilitySuiteId) {
        throw new Error(
          `summary.json suiteId must be ${compatibilitySuiteId}`,
        );
      }
      if (
        !Array.isArray(summary.combinations) ||
        summary.combinations.length === 0
      ) {
        throw new Error("summary.json must have at least one combination");
      }
      const scenarioCounts = summary.combinations
        .map((c) => c.scenarios.length)
        .join("/");
      return `${summary.combinations.length} combinations, ${scenarioCounts} scenarios per combination`;
    }),
  );

  gates.push(
    tryGate("critical-suite", () => {
      const suitePath = path.resolve(
        repositoryRoot,
        "tests/runtime/critical-suite.json",
      );
      if (!existsSync(suitePath)) {
        throw new Error("tests/runtime/critical-suite.json not found");
      }
      const suite = JSON.parse(readFileSync(suitePath, "utf8")) as {
        version: unknown;
        suiteId: unknown;
        scenarios: Array<{ id: string }>;
      };
      if (suite.version !== 1) {
        throw new Error("critical-suite.json version must be 1");
      }
      if (suite.suiteId !== compatibilitySuiteId) {
        throw new Error(
          `critical-suite.json suiteId must be ${compatibilitySuiteId}`,
        );
      }
      if (!Array.isArray(suite.scenarios) || suite.scenarios.length === 0) {
        throw new Error("critical-suite.json must have at least one scenario");
      }
      return `${suite.suiteId} — ${suite.scenarios.length} scenarios`;
    }),
  );

  gates.push(
    tryGate("issue-triage", () => {
      const triage = loadIssueTriage(repositoryRoot);
      return `${triage.triageId} — ${triage.issues.length} tracked issue(s), triagedAt ${triage.triagedAt}`;
    }),
  );

  gates.push(
    tryGate("documentation", () => {
      const failures: string[] = [];

      const manualPath = path.resolve(
        repositoryRoot,
        "docs/MANUAL_TESTING.md",
      );
      if (!existsSync(manualPath)) {
        failures.push("docs/MANUAL_TESTING.md not found");
      } else {
        const manual = readFileSync(manualPath, "utf8");
        for (const section of [
          "## Installed Adapter Matrix",
          "## Compatibility Baseline",
          "## Distribution Baseline",
          "## Release Candidate",
        ]) {
          if (!manual.includes(section)) {
            failures.push(`docs/MANUAL_TESTING.md missing: ${section}`);
          }
        }
      }

      const installationPath = path.resolve(
        repositoryRoot,
        "docs/INSTALLATION.md",
      );
      if (!existsSync(installationPath)) {
        failures.push("docs/INSTALLATION.md not found");
      } else {
        const installation = readFileSync(installationPath, "utf8");
        for (const section of [
          "## Codex",
          "## Claude Code",
          "## Other Filesystem Agents",
        ]) {
          if (!installation.includes(section)) {
            failures.push(`docs/INSTALLATION.md missing: ${section}`);
          }
        }
      }

      if (!existsSync(path.resolve(repositoryRoot, "docs/RELEASING.md"))) {
        failures.push("docs/RELEASING.md not found");
      }

      if (failures.length > 0) {
        throw new Error(failures.join("; "));
      }

      return "INSTALLATION.md, MANUAL_TESTING.md, RELEASING.md all present with required sections";
    }),
  );

  return {
    version: 1,
    triageId: rcTriageId,
    generatedAt,
    gates,
  };
}

const rcTriageId = "v0.5-issue-triage";

export function writeRCSummary(
  evidence: RCEvidence,
  outputPath: string,
): void {
  const dir = path.dirname(outputPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
}

export function buildRCReportMarkdown(evidence: RCEvidence): string {
  const summary = summarizeRCEvidence(evidence);
  const lines: string[] = [
    "# Release Candidate Gates",
    "",
    `Generated: ${evidence.generatedAt}`,
    `Triage: \`${evidence.triageId}\``,
    "",
    "| Gate | Status | Detail |",
    "| --- | --- | --- |",
  ];

  for (const gate of evidence.gates) {
    lines.push(`| \`${gate.gate}\` | ${gate.status} | ${gate.detail} |`);
  }

  lines.push(
    "",
    `Overall: **${summary.status}** (${summary.passCount} pass, ${summary.failCount} fail)`,
  );

  return lines.join("\n");
}
