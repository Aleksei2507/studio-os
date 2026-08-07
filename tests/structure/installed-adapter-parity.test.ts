import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

import {
  findMarkdownFiles,
  validateRuntimeTest,
} from "../../scripts/run-runtime-tests.ts";
import { loadInstalledAdapterMatrix } from "../../scripts/adapter-testing/matrix.ts";

const root = process.cwd();
const matrix = loadInstalledAdapterMatrix(root);
const expectedIds = [
  "codex-greenfield",
  "codex-brownfield",
  "claude-code-greenfield",
  "claude-code-brownfield",
  "universal-greenfield",
  "universal-brownfield",
];

describe("installed adapter parity structure", () => {
  it("keeps one canonical case for every adapter and project mode", () => {
    assert.equal(matrix.version, 1);
    assert.equal(matrix.matrixId, "v0.5-installed-adapter-parity");
    assert.deepEqual(
      matrix.cases.map((matrixCase) => matrixCase.id),
      expectedIds,
    );
    assert.deepEqual(
      matrix.cases.map((matrixCase) => matrixCase.distributionSource),
      [
        "github-marketplace",
        "github-marketplace",
        "github-marketplace",
        "github-marketplace",
        "release-zip",
        "release-zip",
      ],
    );
  });

  it("resolves every matrix case to one valid Runtime scenario", () => {
    const scenarios = findMarkdownFiles(path.join(root, "tests", "runtime")).map(
      (filePath) =>
        validateRuntimeTest(filePath, readFileSync(filePath, "utf8"), root),
    );

    for (const matrixCase of matrix.cases) {
      const matches = scenarios.filter(
        (scenario) => scenario.id === matrixCase.scenarioId,
      );
      assert.equal(
        matches.length,
        1,
        `${matrixCase.id} must resolve ${matrixCase.scenarioId} exactly once`,
      );
    }
  });

  it("exposes deterministic commands and the independent validation protocol", () => {
    const packageJson = JSON.parse(
      readFileSync(path.join(root, "package.json"), "utf8"),
    );
    assert.equal(
      packageJson.scripts["test:adapters:dry"],
      "node --import tsx scripts/check-installed-adapters.ts --dry",
    );
    assert.equal(
      packageJson.scripts["test:adapters:check"],
      "node --import tsx scripts/check-installed-adapters.ts",
    );

    const manualTesting = readFileSync(
      path.join(root, "docs", "MANUAL_TESTING.md"),
      "utf8",
    );
    assert.match(manualTesting, /## Installed Adapter Matrix/);
    assert.match(manualTesting, /npm run test:adapters:dry/);
    assert.match(manualTesting, /npm run test:adapters:check --/);
    assert.match(manualTesting, /Codex.*Claude Code.*Universal/s);
    assert.match(manualTesting, /Greenfield.*Brownfield/s);
    assert.match(manualTesting, /explicit authorization/i);
    assert.match(manualTesting, /do not store raw transcripts/i);

    for (const caseId of expectedIds) {
      assert.match(manualTesting, new RegExp(`\\b${caseId}\\b`));
    }
  });
});
