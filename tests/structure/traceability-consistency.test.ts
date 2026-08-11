import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const root = process.cwd();
const read = (relativePath: string): string => readFileSync(path.join(root, relativePath), "utf8");

function extractSection(markdown: string, heading: string): string | null {
  const lines = markdown.split("\n");
  const startIndex = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (startIndex === -1) {
    return null;
  }
  const rest = lines.slice(startIndex + 1);
  const endOffset = rest.findIndex((line) => /^##\s+/.test(line));
  const sectionLines = endOffset === -1 ? rest : rest.slice(0, endOffset);
  return sectionLines.join("\n");
}

// Expands compact ranges like "AC1-AC5" or "T1-T9" (hyphen or en dash) in
// addition to plain comma-separated lists ("AC1, AC2, AC3").
function extractIds(text: string, prefix: "AC" | "T"): Set<string> {
  const ids = new Set<string>();
  const rangePattern = new RegExp(`${prefix}(\\d+)\\s*[-–]\\s*(?:${prefix})?(\\d+)`, "g");
  const seenRanges = new Set<string>();
  for (const match of text.matchAll(rangePattern)) {
    seenRanges.add(match[0]);
    const start = Number(match[1]);
    const end = Number(match[2]);
    if (end >= start && end - start <= 200) {
      for (let n = start; n <= end; n += 1) {
        ids.add(`${prefix}${n}`);
      }
    }
  }
  const tokenPattern = new RegExp(`${prefix}\\d+(?:\\.\\d+)?`, "g");
  for (const match of text.matchAll(tokenPattern)) {
    ids.add(match[0]);
  }
  return ids;
}

function parseBriefAcceptanceCriteria(briefText: string): Set<string> {
  const section = extractSection(briefText, "Acceptance Criteria");
  const ids = new Set<string>();
  if (section === null) {
    return ids;
  }
  for (const match of section.matchAll(/^- (AC\d+):/gm)) {
    ids.add(match[1]);
  }
  return ids;
}

function parseTaskDefinitions(tasksText: string): Map<string, Set<string>> {
  const tasks = new Map<string, Set<string>>();
  const blocks = tasksText.split(/^### /m).slice(1);
  for (const block of blocks) {
    const idMatch = block.match(/^(T\d+(?:\.\d+)?)\s*$/m);
    if (idMatch === null) {
      continue;
    }
    const satisfiesMatch = block.match(/^- Satisfies:\s*(.+)$/m);
    const satisfies = satisfiesMatch ? extractIds(satisfiesMatch[1], "AC") : new Set<string>();
    tasks.set(idMatch[1], satisfies);
  }
  return tasks;
}

function findWorkItemsWithBrief(): string[] {
  const workItemsDir = path.join(root, "work-items");
  if (!existsSync(workItemsDir)) {
    return [];
  }
  return readdirSync(workItemsDir)
    .filter((entry) => statSync(path.join(workItemsDir, entry)).isDirectory())
    .map((entry) => path.join("work-items", entry))
    .filter((relDir) => existsSync(path.join(root, relDir, "brief.md")));
}

describe("Traceability ID consistency", () => {
  const candidateRoots = [...findWorkItemsWithBrief(), "docs"];

  for (const relRoot of candidateRoots) {
    const briefPath = path.join(relRoot, relRoot === "docs" ? "project-brief.md" : "brief.md");
    if (!existsSync(path.join(root, briefPath))) {
      continue;
    }

    const acSet = parseBriefAcceptanceCriteria(read(briefPath));
    if (acSet.size === 0) {
      // Pre-traceability-scheme artifact (no numbered AC<n>) — not retrofitted, nothing to check.
      continue;
    }

    describe(relRoot, () => {
      const tasksPath = path.join(relRoot, "tasks.md");
      const hasTasks = existsSync(path.join(root, tasksPath));
      let taskDefinitions = new Map<string, Set<string>>();

      if (hasTasks) {
        taskDefinitions = parseTaskDefinitions(read(tasksPath));

        it(`${tasksPath}: every task's Satisfies references an AC<n> defined in ${briefPath}`, () => {
          for (const [taskId, satisfies] of taskDefinitions) {
            for (const ac of satisfies) {
              assert.ok(
                acSet.has(ac),
                `${taskId} declares Satisfies: ${ac}, but ${briefPath} has no such Acceptance Criterion (known: ${[...acSet].join(", ")})`,
              );
            }
          }
        });
      }

      const devReportPath = path.join(relRoot, "development-report.md");
      if (existsSync(path.join(root, devReportPath))) {
        const devReportText = read(devReportPath);

        it(`${devReportPath}: Tasks Completed references only T<n> IDs defined in ${tasksPath}`, () => {
          if (!hasTasks) {
            return;
          }
          const section = extractSection(devReportText, "Tasks Completed");
          if (section === null) {
            return;
          }
          const referenced = extractIds(section, "T");
          for (const taskId of referenced) {
            assert.ok(
              taskDefinitions.has(taskId),
              `Development Report references ${taskId}, but ${tasksPath} defines no such task (known: ${[...taskDefinitions.keys()].join(", ")})`,
            );
          }
        });

        it(`${devReportPath}: Acceptance Criteria Addressed references only AC<n> defined in ${briefPath}`, () => {
          const section = extractSection(devReportText, "Acceptance Criteria Addressed");
          if (section === null) {
            return;
          }
          const referenced = extractIds(section, "AC");
          for (const ac of referenced) {
            assert.ok(
              acSet.has(ac),
              `Development Report references ${ac}, but ${briefPath} has no such Acceptance Criterion (known: ${[...acSet].join(", ")})`,
            );
          }
        });

        // Task Decomposition is `conditional` in work-item-feature (see
        // skill/workflows/work-item-feature.md): a bounded single-unit
        // change may skip it. When it is skipped, AC<n> traceability must
        // not silently disappear along with T<n> — Development Report is
        // still required to name which Acceptance Criteria it addressed.
        if (!hasTasks) {
          it(`${devReportPath}: still names Acceptance Criteria Addressed even though ${tasksPath} does not exist (Task Decomposition skipped)`, () => {
            const section = extractSection(devReportText, "Acceptance Criteria Addressed");
            const referenced = section === null ? new Set<string>() : extractIds(section, "AC");
            assert.ok(
              referenced.size > 0,
              `${tasksPath} does not exist (Task Decomposition was skipped), so ${devReportPath} must name at least one AC<n> in "Acceptance Criteria Addressed" — traceability cannot fall back to nothing`,
            );
          });
        }
      }

      const validationReportPath = path.join(relRoot, "validation-report.md");
      if (existsSync(path.join(root, validationReportPath))) {
        it(`${validationReportPath}: Acceptance Criteria Verified references only AC<n> defined in ${briefPath}`, () => {
          const section = extractSection(read(validationReportPath), "Acceptance Criteria Verified");
          if (section === null) {
            return;
          }
          const referenced = extractIds(section, "AC");
          for (const ac of referenced) {
            assert.ok(
              acSet.has(ac),
              `Validation Report references ${ac}, but ${briefPath} has no such Acceptance Criterion (known: ${[...acSet].join(", ")})`,
            );
          }
        });
      }
    });
  }

  it("finds at least one artifact set with a numbered Acceptance Criteria scheme to check", () => {
    const checked = candidateRoots.some((relRoot) => {
      const briefPath = path.join(relRoot, relRoot === "docs" ? "project-brief.md" : "brief.md");
      if (!existsSync(path.join(root, briefPath))) {
        return false;
      }
      return parseBriefAcceptanceCriteria(read(briefPath)).size > 0;
    });
    assert.ok(checked, "expected at least one Brief with numbered AC<n> entries in this repository");
  });
});
