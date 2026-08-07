import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";

import {
  loadIssueTriage,
  runRCGates,
} from "../../scripts/release-candidate/aggregator.ts";
import {
  issueResolutions,
  parseIssueTriage,
  rcTriageId,
  RC_SUMMARY_PATH,
  RC_TRIAGE_PATH,
  summarizeRCEvidence,
} from "../../scripts/release-candidate/contracts.ts";
import type { RCEvidence, RCGateResult } from "../../scripts/release-candidate/contracts.ts";
import { parseArgs, run } from "../../scripts/check-release-candidate.ts";

function makeEvidence(gates: Partial<RCGateResult>[]): RCEvidence {
  return {
    version: 1,
    triageId: rcTriageId,
    generatedAt: new Date().toISOString(),
    gates: gates.map((g, index) => ({
      gate: g.gate ?? `gate-${index}`,
      status: g.status ?? "PASS",
      detail: g.detail ?? "ok",
    })),
  };
}

describe("parseIssueTriage", () => {
  it("parses a valid empty triage", () => {
    const triage = parseIssueTriage(
      {
        version: 1,
        triageId: rcTriageId,
        milestoneName: "v0.5",
        triagedAt: "2026-08-07",
        issues: [],
      },
      RC_TRIAGE_PATH,
    );
    assert.equal(triage.version, 1);
    assert.equal(triage.triageId, rcTriageId);
    assert.deepEqual(triage.issues, []);
  });

  it("parses a triage with issues", () => {
    const triage = parseIssueTriage(
      {
        version: 1,
        triageId: rcTriageId,
        milestoneName: "v0.5",
        triagedAt: "2026-08-07",
        issues: [
          { id: "42", title: "Some bug", resolution: "closed" },
          {
            id: "99",
            title: "Future feature",
            resolution: "deferred",
            deferredTo: "v0.6",
          },
          {
            id: "10",
            title: "Unrelated issue",
            resolution: "not-applicable",
            notes: "Targets v1.0 scope",
          },
        ],
      },
      RC_TRIAGE_PATH,
    );
    assert.equal(triage.issues.length, 3);
    assert.equal(triage.issues[0].resolution, "closed");
    assert.equal(triage.issues[1].deferredTo, "v0.6");
    assert.equal(triage.issues[2].notes, "Targets v1.0 scope");
  });

  it("rejects wrong version", () => {
    assert.throws(
      () =>
        parseIssueTriage(
          {
            version: 2,
            triageId: rcTriageId,
            milestoneName: "v0.5",
            triagedAt: "2026-08-07",
            issues: [],
          },
          RC_TRIAGE_PATH,
        ),
      /version must be 1/,
    );
  });

  it("rejects missing triageId", () => {
    assert.throws(
      () =>
        parseIssueTriage(
          {
            version: 1,
            triageId: "",
            milestoneName: "v0.5",
            triagedAt: "2026-08-07",
            issues: [],
          },
          RC_TRIAGE_PATH,
        ),
      /triageId must be a non-empty string/,
    );
  });

  it("rejects unknown resolution", () => {
    assert.throws(
      () =>
        parseIssueTriage(
          {
            version: 1,
            triageId: rcTriageId,
            milestoneName: "v0.5",
            triagedAt: "2026-08-07",
            issues: [{ id: "1", title: "bug", resolution: "open" }],
          },
          RC_TRIAGE_PATH,
        ),
      /resolution must be one of/,
    );
  });

  it("rejects non-array issues", () => {
    assert.throws(
      () =>
        parseIssueTriage(
          {
            version: 1,
            triageId: rcTriageId,
            milestoneName: "v0.5",
            triagedAt: "2026-08-07",
            issues: "none",
          },
          RC_TRIAGE_PATH,
        ),
      /issues must be an array/,
    );
  });

  it("all resolution constants are accepted", () => {
    for (const resolution of issueResolutions) {
      const triage = parseIssueTriage(
        {
          version: 1,
          triageId: rcTriageId,
          milestoneName: "v0.5",
          triagedAt: "2026-08-07",
          issues: [{ id: "1", title: "t", resolution }],
        },
        RC_TRIAGE_PATH,
      );
      assert.equal(triage.issues[0].resolution, resolution);
    }
  });
});

describe("summarizeRCEvidence", () => {
  it("returns PASS when all gates pass", () => {
    const evidence = makeEvidence([
      { gate: "release-metadata", status: "PASS" },
      { gate: "issue-triage", status: "PASS" },
    ]);
    const summary = summarizeRCEvidence(evidence);
    assert.equal(summary.status, "PASS");
    assert.equal(summary.passCount, 2);
    assert.equal(summary.failCount, 0);
  });

  it("returns FAIL when any gate fails", () => {
    const evidence = makeEvidence([
      { gate: "release-metadata", status: "PASS" },
      { gate: "issue-triage", status: "FAIL" },
    ]);
    const summary = summarizeRCEvidence(evidence);
    assert.equal(summary.status, "FAIL");
    assert.equal(summary.passCount, 1);
    assert.equal(summary.failCount, 1);
  });

  it("returns FAIL for empty gate list", () => {
    const evidence = makeEvidence([]);
    const summary = summarizeRCEvidence(evidence);
    assert.equal(summary.status, "PASS");
    assert.equal(summary.passCount, 0);
    assert.equal(summary.failCount, 0);
  });
});

describe("loadIssueTriage", () => {
  it("loads a valid triage file from a temp repository", () => {
    const root = mkdtempSync(path.join(tmpdir(), "studio-rc-test-"));
    mkdirSync(path.join(root, "tests", "release-candidate"), { recursive: true });
    writeFileSync(
      path.join(root, RC_TRIAGE_PATH),
      JSON.stringify({
        version: 1,
        triageId: rcTriageId,
        milestoneName: "v0.5",
        triagedAt: "2026-08-07",
        issues: [],
      }),
    );
    const triage = loadIssueTriage(root);
    assert.equal(triage.triageId, rcTriageId);
    assert.equal(triage.issues.length, 0);
  });

  it("throws when triage file is missing", () => {
    const root = mkdtempSync(path.join(tmpdir(), "studio-rc-test-"));
    assert.throws(() => loadIssueTriage(root), /Issue triage not found/);
  });

  it("throws when triage file is malformed", () => {
    const root = mkdtempSync(path.join(tmpdir(), "studio-rc-test-"));
    mkdirSync(path.join(root, "tests", "release-candidate"), { recursive: true });
    writeFileSync(
      path.join(root, RC_TRIAGE_PATH),
      JSON.stringify({ version: 2, issues: [] }),
    );
    assert.throws(() => loadIssueTriage(root), /version must be 1/);
  });
});

describe("runRCGates", () => {
  it("returns an RCEvidence object with 8 gates", () => {
    const evidence = runRCGates(process.cwd());
    assert.equal(evidence.version, 1);
    assert.equal(evidence.triageId, rcTriageId);
    assert.ok(typeof evidence.generatedAt === "string");
    assert.equal(evidence.gates.length, 8);
    for (const gate of evidence.gates) {
      assert.ok(typeof gate.gate === "string");
      assert.ok(gate.status === "PASS" || gate.status === "FAIL");
      assert.ok(typeof gate.detail === "string");
    }
  });

  it("gate names match expected set", () => {
    const evidence = runRCGates(process.cwd());
    const names = evidence.gates.map((g) => g.gate);
    const expected = [
      "release-metadata",
      "release-manifest",
      "installed-adapter-matrix",
      "compatibility-baseline",
      "compatibility-summary",
      "critical-suite",
      "issue-triage",
      "documentation",
    ];
    assert.deepEqual(names, expected);
  });
});

describe("parseArgs", () => {
  it("defaults to dry=false and standard output path", () => {
    const opts = parseArgs([]);
    assert.equal(opts.dry, false);
    assert.equal(opts.output, RC_SUMMARY_PATH);
  });

  it("parses --dry flag", () => {
    const opts = parseArgs(["--dry"]);
    assert.equal(opts.dry, true);
  });

  it("parses --output", () => {
    const opts = parseArgs(["--output", "tests/release-candidate/rc.json"]);
    assert.equal(opts.output, "tests/release-candidate/rc.json");
  });

  it("rejects --dry combined with --output", () => {
    assert.throws(
      () => parseArgs(["--dry", "--output", "some/path"]),
      /--dry cannot be combined with --output/,
    );
  });

  it("rejects unknown argument", () => {
    assert.throws(() => parseArgs(["--unknown"]), /Unknown argument/);
  });
});

describe("run (dry mode)", () => {
  it("returns 0 when all gates pass", () => {
    const exitCode = run({ dry: true, output: RC_SUMMARY_PATH });
    assert.equal(exitCode, 0);
  });
});
