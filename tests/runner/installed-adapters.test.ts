import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";

import {
  buildInstalledAdapterSummaryMarkdown,
  parseInstalledAdapterEvidence,
  resolveInstalledAdapterOutputDirectory,
  summarizeInstalledAdapterEvidence,
  writeInstalledAdapterArtifacts,
} from "../../scripts/adapter-testing/evidence.ts";
import {
  distributionSourceByAdapter,
  installedAdapterMatrixId,
  installedAdapterProjectModes,
  installedAdapters,
  requiredCheckIds,
  scenarioByProjectMode,
} from "../../scripts/adapter-testing/contracts.ts";
import type {
  InstalledAdapter,
  InstalledAdapterMatrix,
  InstalledAdapterOutcome,
} from "../../scripts/adapter-testing/contracts.ts";
import {
  loadInstalledAdapterMatrix,
  parseInstalledAdapterMatrix,
} from "../../scripts/adapter-testing/matrix.ts";
import { parseArgs } from "../../scripts/check-installed-adapters.ts";

const revision = "a".repeat(40);

function createRepository(): string {
  const root = mkdtempSync(path.join(tmpdir(), "studio-adapter-matrix-"));
  mkdirSync(path.join(root, "tests", "installed-adapters"), { recursive: true });
  mkdirSync(path.join(root, "test-results", "installed-adapters"), {
    recursive: true,
  });
  return root;
}

function matrixValue(): Record<string, unknown> {
  return {
    version: 1,
    matrixId: installedAdapterMatrixId,
    cases: installedAdapters.flatMap((adapter) =>
      installedAdapterProjectModes.map((projectMode) => ({
        id: `${adapter}-${projectMode}`,
        adapter,
        projectMode,
        distributionSource: distributionSourceByAdapter[adapter],
        scenarioId: scenarioByProjectMode[projectMode],
        requiredChecks: requiredCheckIds(projectMode),
      })),
    ),
  };
}

function matrix(): InstalledAdapterMatrix {
  return {
    ...parseInstalledAdapterMatrix(matrixValue()),
    sourcePath: "tests/installed-adapters/matrix.json",
  };
}

function hostIdentity(adapter: InstalledAdapter): [string, string] {
  if (adapter === "codex") {
    return ["Codex CLI", "0.144.1"];
  }
  if (adapter === "claude-code") {
    return ["Claude Code", "2.1.143"];
  }
  return ["Filesystem agent", "test-host"];
}

function evidenceValue(
  contract: InstalledAdapterMatrix,
  outcomes: Partial<Record<string, InstalledAdapterOutcome>> = {},
): Record<string, unknown> {
  return {
    version: 1,
    runId: "installed-adapters-2026-08-03",
    matrixId: contract.matrixId,
    recordedAt: "2026-08-03T12:00:00.000Z",
    studioOsVersion: "0.5.0-alpha.4",
    studioOsRevision: revision,
    records: contract.cases.map((matrixCase) => {
      const outcome = outcomes[matrixCase.id] ?? "PASS";
      const [hostName, hostVersion] = hostIdentity(matrixCase.adapter);
      return {
        caseId: matrixCase.id,
        adapter: matrixCase.adapter,
        projectMode: matrixCase.projectMode,
        adapterVersion: "0.5.0-alpha.4",
        hostName,
        hostVersion,
        distributionSource: matrixCase.distributionSource,
        scenarioId: matrixCase.scenarioId,
        outcome,
        failureOwner:
          outcome === "PASS"
            ? "none"
            : outcome === "FAIL"
              ? "adapter"
              : "infrastructure",
        summary: `Observed ${matrixCase.id} adapter behavior.`,
        checks: matrixCase.requiredChecks.map((id, index) => ({
          id,
          status: index === 0 ? outcome : "PASS",
          observation: `Observed ${id} for ${matrixCase.id}.`,
        })),
        evidenceReferences: [`sessions/${matrixCase.id}`],
      };
    }),
  };
}

function records(value: Record<string, unknown>): Array<Record<string, unknown>> {
  return value.records as Array<Record<string, unknown>>;
}

describe("installed adapter parity contract", () => {
  it("loads the exact ordered matrix from its bounded repository location", () => {
    const root = createRepository();
    const relativePath = "tests/installed-adapters/matrix.json";
    writeFileSync(
      path.join(root, relativePath),
      `${JSON.stringify(matrixValue(), null, 2)}\n`,
    );

    const loaded = loadInstalledAdapterMatrix(root, relativePath);

    assert.equal(loaded.matrixId, installedAdapterMatrixId);
    assert.deepEqual(
      loaded.cases.map((entry) => entry.id),
      [
        "codex-greenfield",
        "codex-brownfield",
        "claude-code-greenfield",
        "claude-code-brownfield",
        "universal-greenfield",
        "universal-brownfield",
      ],
    );
    assert.equal(loaded.sourcePath, relativePath);

    mkdirSync(path.join(root, "config"), { recursive: true });
    writeFileSync(
      path.join(root, "config", "matrix.json"),
      `${JSON.stringify(matrixValue())}\n`,
    );
    assert.throws(
      () => loadInstalledAdapterMatrix(root, "config/matrix.json"),
      /inside tests\/installed-adapters/,
    );
  });

  it("rejects matrix drift, reordering, and unknown fields", () => {
    const wrongId = matrixValue();
    wrongId.matrixId = "another-matrix";
    assert.throws(
      () => parseInstalledAdapterMatrix(wrongId),
      /matrixId must be v0\.5-installed-adapter-parity/,
    );

    const reordered = structuredClone(matrixValue());
    const reorderedCases = reordered.cases as unknown[];
    [reorderedCases[0], reorderedCases[1]] = [reorderedCases[1], reorderedCases[0]];
    assert.throws(
      () => parseInstalledAdapterMatrix(reordered),
      /case 1 must be codex-greenfield/,
    );

    const unknownField = matrixValue();
    unknownField.extra = true;
    assert.throws(
      () => parseInstalledAdapterMatrix(unknownField),
      /unknown fields: extra/,
    );
  });

  it("normalizes complete evidence to matrix order", () => {
    const contract = matrix();
    const value = evidenceValue(contract);
    value.records = records(value).reverse();

    const evidence = parseInstalledAdapterEvidence(value, contract);

    assert.deepEqual(
      evidence.records.map((record) => record.caseId),
      contract.cases.map((matrixCase) => matrixCase.id),
    );
    assert.deepEqual(summarizeInstalledAdapterEvidence(evidence), {
      status: "PASS",
      total: 6,
      pass: 6,
      fail: 0,
      blocked: 0,
    });
  });

  it("keeps one adapter failure visible in the overall result", () => {
    const contract = matrix();
    const evidence = parseInstalledAdapterEvidence(
      evidenceValue(contract, { "claude-code-brownfield": "FAIL" }),
      contract,
    );
    const markdown = buildInstalledAdapterSummaryMarkdown(evidence, contract);

    assert.deepEqual(summarizeInstalledAdapterEvidence(evidence), {
      status: "FAIL",
      total: 6,
      pass: 5,
      fail: 1,
      blocked: 0,
    });
    assert.match(markdown, /Overall status: FAIL/);
    assert.match(
      markdown,
      /claude-code-brownfield[^\n]+FAIL[^\n]+adapter/,
    );
  });

  it("does not classify an infrastructure blocker as a behavioral pass", () => {
    const contract = matrix();
    const evidence = parseInstalledAdapterEvidence(
      evidenceValue(contract, { "universal-greenfield": "BLOCKED" }),
      contract,
    );

    assert.deepEqual(summarizeInstalledAdapterEvidence(evidence), {
      status: "BLOCKED",
      total: 6,
      pass: 5,
      fail: 0,
      blocked: 1,
    });
  });

  it("fails closed on incomplete, duplicate, or contradictory evidence", () => {
    const contract = matrix();

    const incomplete = evidenceValue(contract);
    records(incomplete).pop();
    assert.throws(
      () => parseInstalledAdapterEvidence(incomplete, contract),
      /exactly 6 records/,
    );

    const duplicate = evidenceValue(contract);
    records(duplicate)[1].caseId = records(duplicate)[0].caseId;
    assert.throws(
      () => parseInstalledAdapterEvidence(duplicate, contract),
      /duplicate case record: codex-greenfield/,
    );

    const contradictory = evidenceValue(contract);
    records(contradictory)[0].outcome = "FAIL";
    records(contradictory)[0].failureOwner = "adapter";
    assert.throws(
      () => parseInstalledAdapterEvidence(contradictory, contract),
      /outcome must be PASS/,
    );

    const missingCheck = evidenceValue(contract);
    (records(missingCheck)[0].checks as unknown[]).pop();
    assert.throws(
      () => parseInstalledAdapterEvidence(missingCheck, contract),
      /exactly 7 checks/,
    );
  });

  it("rejects machine-specific paths and secret-like material", () => {
    const contract = matrix();
    const machinePath = evidenceValue(contract);
    records(machinePath)[0].summary = "Transcript at /Users/example/session.txt";
    assert.throws(
      () => parseInstalledAdapterEvidence(machinePath, contract),
      /machine-specific or escaping path/,
    );

    const secret = evidenceValue(contract);
    records(secret)[0].summary =
      "Authorization Bearer abcdefghijklmnopqrstuvwxyz was observed.";
    assert.throws(
      () => parseInstalledAdapterEvidence(secret, contract),
      /secret-like material/,
    );
  });

  it("writes portable artifacts once below the ignored evidence root", () => {
    const root = createRepository();
    const contract = matrix();
    const evidence = parseInstalledAdapterEvidence(evidenceValue(contract), contract);
    const relativeOutput =
      "test-results/installed-adapters/reports/installed-adapters-2026-08-03";

    const output = resolveInstalledAdapterOutputDirectory(root, relativeOutput);
    writeInstalledAdapterArtifacts(output, evidence, contract);

    assert.match(
      readFileSync(path.join(output, "summary.md"), "utf8"),
      /Overall status: PASS/,
    );
    assert.equal(
      JSON.parse(readFileSync(path.join(output, "results.json"), "utf8")).summary
        .total,
      6,
    );
    assert.throws(
      () => resolveInstalledAdapterOutputDirectory(root, relativeOutput),
      /already exists/,
    );
    assert.throws(
      () =>
        resolveInstalledAdapterOutputDirectory(
          root,
          "test-results/installed-adapters/../outside",
        ),
      /must remain inside/,
    );
    assert.throws(
      () => resolveInstalledAdapterOutputDirectory(root, "C:\\temp\\report"),
      /repository-relative/,
    );
  });

  it("keeps dry validation separate from evidence validation", () => {
    assert.deepEqual(parseArgs(["--dry"]), {
      dry: true,
      evidence: undefined,
      matrix: "tests/installed-adapters/matrix.json",
      outputDir: undefined,
    });
    assert.deepEqual(
      parseArgs([
        "--evidence",
        "test-results/installed-adapters/run.json",
        "--output-dir",
        "test-results/installed-adapters/reports/run",
      ]),
      {
        dry: false,
        evidence: "test-results/installed-adapters/run.json",
        matrix: "tests/installed-adapters/matrix.json",
        outputDir: "test-results/installed-adapters/reports/run",
      },
    );
    assert.throws(
      () => parseArgs(["--dry", "--evidence", "run.json"]),
      /cannot be combined/,
    );
    assert.throws(() => parseArgs([]), /requires --evidence/);
  });
});
