import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

import {
  parseIssueTriage,
  RC_SUMMARY_PATH,
  RC_TRIAGE_PATH,
  rcTriageId,
} from "../../scripts/release-candidate/contracts.ts";

const root = process.cwd();

describe("release candidate structure", () => {
  it("keeps a valid issue triage at the canonical path", () => {
    const triagePath = path.join(root, RC_TRIAGE_PATH);
    assert.ok(
      existsSync(triagePath),
      `Issue triage must exist at ${RC_TRIAGE_PATH}`,
    );
    const value = JSON.parse(readFileSync(triagePath, "utf8")) as unknown;
    const triage = parseIssueTriage(value, RC_TRIAGE_PATH);
    assert.equal(triage.version, 1);
    assert.equal(triage.triageId, rcTriageId);
    assert.ok(
      triage.milestoneName.trim(),
      "issue triage milestoneName must be non-empty",
    );
    assert.ok(
      triage.triagedAt.trim(),
      "issue triage triagedAt must be non-empty",
    );
    assert.ok(Array.isArray(triage.issues), "issue triage issues must be an array");
  });

  it("all listed issues have valid resolutions", () => {
    const value = JSON.parse(
      readFileSync(path.join(root, RC_TRIAGE_PATH), "utf8"),
    ) as unknown;
    const triage = parseIssueTriage(value, RC_TRIAGE_PATH);
    for (const issue of triage.issues) {
      assert.ok(
        issue.id.trim(),
        `issue ${issue.id} must have a non-empty id`,
      );
      assert.ok(
        issue.title.trim(),
        `issue ${issue.id} must have a non-empty title`,
      );
      assert.ok(
        ["closed", "deferred", "not-applicable"].includes(issue.resolution),
        `issue ${issue.id} resolution must be valid`,
      );
    }
  });

  it("exposes deterministic commands for release candidate check", () => {
    const packageJson = JSON.parse(
      readFileSync(path.join(root, "package.json"), "utf8"),
    ) as { scripts: Record<string, string> };
    assert.equal(
      packageJson.scripts["test:rc:dry"],
      "node --import tsx scripts/check-release-candidate.ts --dry",
    );
    assert.equal(
      packageJson.scripts["test:rc:check"],
      "node --import tsx scripts/check-release-candidate.ts",
    );
  });

  it("upstream evidence files are all present", () => {
    const requiredFiles = [
      "tests/installed-adapters/matrix.json",
      "tests/compatibility/baseline.json",
      "tests/compatibility/summary.json",
      "tests/runtime/critical-suite.json",
      "docs/INSTALLATION.md",
      "docs/MANUAL_TESTING.md",
      "docs/RELEASING.md",
    ];
    for (const file of requiredFiles) {
      assert.ok(
        existsSync(path.join(root, file)),
        `Required RC input file must exist: ${file}`,
      );
    }
  });

  it("RC_SUMMARY_PATH is inside tests/release-candidate", () => {
    assert.ok(
      RC_SUMMARY_PATH.startsWith("tests/release-candidate/"),
      "RC summary path must be inside tests/release-candidate/",
    );
  });

  it("release candidate section is documented in MANUAL_TESTING.md", () => {
    const manual = readFileSync(
      path.join(root, "docs/MANUAL_TESTING.md"),
      "utf8",
    );
    assert.match(manual, /## Release Candidate/);
    assert.match(manual, /npm run test:rc:dry/);
    assert.match(manual, /npm run test:rc:check/);
    assert.match(manual, /issue-triage/);
    assert.match(manual, /release-metadata/);
    assert.match(manual, /installed-adapter-matrix/);
    assert.match(manual, /compatibility-baseline/);
    assert.match(manual, /compatibility-summary/);
    assert.match(manual, /critical-suite/);
    assert.match(manual, /documentation/);
  });

  it("INSTALLATION.md documents all three adapter paths", () => {
    const installation = readFileSync(
      path.join(root, "docs/INSTALLATION.md"),
      "utf8",
    );
    assert.match(installation, /## Codex/);
    assert.match(installation, /## Claude Code/);
    assert.match(installation, /## Other Filesystem Agents/);
  });
});
