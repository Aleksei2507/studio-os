export type IssueResolution = "closed" | "deferred" | "not-applicable";

export const issueResolutions: readonly IssueResolution[] = [
  "closed",
  "deferred",
  "not-applicable",
];

export const rcTriageId = "v0.5-issue-triage";
export const RC_TRIAGE_PATH = "tests/release-candidate/issue-triage.json";
export const RC_SUMMARY_PATH = "tests/release-candidate/summary.json";

export interface TriageIssue {
  id: string;
  title: string;
  resolution: IssueResolution;
  notes?: string;
  deferredTo?: string;
}

export interface IssueTriage {
  version: 1;
  triageId: string;
  milestoneName: string;
  triagedAt: string;
  issues: TriageIssue[];
  sourcePath: string;
}

export type RCGateStatus = "PASS" | "FAIL";

export interface RCGateResult {
  gate: string;
  status: RCGateStatus;
  detail: string;
}

export interface RCEvidence {
  version: 1;
  triageId: string;
  generatedAt: string;
  gates: RCGateResult[];
}

export interface RCSummary {
  status: "PASS" | "FAIL";
  passCount: number;
  failCount: number;
}

export function parseIssueTriage(
  value: unknown,
  sourcePath: string,
): IssueTriage {
  if (!isRecord(value)) {
    throw new Error("Issue triage must be a JSON object.");
  }
  if (value.version !== 1) {
    throw new Error("Issue triage version must be 1.");
  }
  requireNonEmptyString(value, "triageId", "Issue triage");
  requireNonEmptyString(value, "milestoneName", "Issue triage");
  requireNonEmptyString(value, "triagedAt", "Issue triage");
  if (!Array.isArray(value.issues)) {
    throw new Error("Issue triage issues must be an array.");
  }

  const issues = (value.issues as unknown[]).map((item, index) =>
    parseTriageIssue(item, index),
  );

  return {
    version: 1,
    triageId: value.triageId as string,
    milestoneName: value.milestoneName as string,
    triagedAt: value.triagedAt as string,
    issues,
    sourcePath,
  };
}

function parseTriageIssue(value: unknown, index: number): TriageIssue {
  if (!isRecord(value)) {
    throw new Error(`Issue triage item ${index} must be a JSON object.`);
  }
  requireNonEmptyString(value, "id", `Issue triage item ${index}`);
  requireNonEmptyString(value, "title", `Issue triage item ${index}`);
  if (!issueResolutions.includes(value.resolution as IssueResolution)) {
    throw new Error(
      `Issue triage item ${index} resolution must be one of: ${issueResolutions.join(", ")}.`,
    );
  }

  const issue: TriageIssue = {
    id: value.id as string,
    title: value.title as string,
    resolution: value.resolution as IssueResolution,
  };

  if (typeof value.notes === "string" && value.notes.trim()) {
    issue.notes = value.notes.trim();
  }
  if (
    value.resolution === "deferred" &&
    typeof value.deferredTo === "string" &&
    value.deferredTo.trim()
  ) {
    issue.deferredTo = value.deferredTo.trim();
  }

  return issue;
}

export function summarizeRCEvidence(evidence: RCEvidence): RCSummary {
  let passCount = 0;
  let failCount = 0;
  for (const gate of evidence.gates) {
    if (gate.status === "PASS") {
      passCount += 1;
    } else {
      failCount += 1;
    }
  }
  return {
    status: failCount > 0 ? "FAIL" : "PASS",
    passCount,
    failCount,
  };
}

function requireNonEmptyString(
  record: Record<string, unknown>,
  field: string,
  prefix: string,
): void {
  if (typeof record[field] !== "string" || !(record[field] as string).trim()) {
    throw new Error(`${prefix} ${field} must be a non-empty string.`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
