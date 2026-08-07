# Development Report — Epic 5

**Epic:** Epic 5 - v0.5 Release Candidate  
**Date:** 2026-08-07  
**Decision:** Development Complete

## Scope

Epic 5 aggregates all five epic evidence streams into a single Release Candidate gate check. Scope is:

- An RC evidence aggregator (`scripts/release-candidate/`) that loads and validates all upstream evidence: release metadata, release manifest, installed adapter matrix, compatibility baseline, compatibility summary, critical suite, issue triage, and documentation.
- A CLI entry point (`scripts/check-release-candidate.ts`) with `--dry` and `--output` flags.
- A canonical issue triage document (`tests/release-candidate/issue-triage.json`) for milestone-relevant GitHub issues.
- Structure tests (`tests/structure/release-candidate.test.ts`) verifying all RC evidence inputs exist and the triage is valid.
- Runner tests (`tests/runner/release-candidate.test.ts`) verifying triage parsing, gate aggregation, argument parsing, and dry-mode execution.
- Two new `package.json` scripts: `test:rc:dry` and `test:rc:check`.
- A `## Release Candidate` section in `docs/MANUAL_TESTING.md` documenting all eight gates, the issue triage process, and promotion requirements.

## Files Changed

- `scripts/release-candidate/contracts.ts` (new) — types, constants, `parseIssueTriage`, `summarizeRCEvidence`
- `scripts/release-candidate/aggregator.ts` (new) — `loadIssueTriage`, `runRCGates`, `writeRCSummary`, `buildRCReportMarkdown`
- `scripts/check-release-candidate.ts` (new) — CLI entry: `parseArgs`, `run`, `main`
- `tests/release-candidate/issue-triage.json` (new) — canonical triage document (`v0.5-issue-triage`, empty issues array)
- `tests/structure/release-candidate.test.ts` (new) — 7 structure tests
- `tests/runner/release-candidate.test.ts` (new) — 21 runner tests (28 total across both files)
- `package.json` (modified) — added `test:rc:dry`, `test:rc:check`
- `docs/MANUAL_TESTING.md` (modified) — added `## Release Candidate` section

## Focused Checks

- `node --import tsx --test tests/runner/release-candidate.test.ts tests/structure/release-candidate.test.ts`: 28/28 PASS
- `npm run test:rc:dry`: 8/8 gates PASS
- All structure tests (62 total): PASS

## RC Gate Summary (dry mode)

| Gate | Status |
| --- | --- |
| `release-metadata` | PASS — v0.5.0-alpha.4 all version locations consistent |
| `release-manifest` | PASS — 28 included paths, 18 forbidden prefixes |
| `installed-adapter-matrix` | PASS — 6 cases (codex, claude-code, universal) |
| `compatibility-baseline` | PASS — 2 combinations (codex, ollama) |
| `compatibility-summary` | PASS — 2 combinations x 10 scenarios |
| `critical-suite` | PASS — v0.5-critical-lifecycle, 10 scenarios |
| `issue-triage` | PASS — 0 tracked issues, triagedAt 2026-08-07 |
| `documentation` | PASS — INSTALLATION.md, MANUAL_TESTING.md, RELEASING.md present |

Overall: PASS (8/8)

## Boundaries

- Behavioral trials (compatibility baseline execution) are not triggered by any RC gate; they remain a separate activity requiring explicit --confirm-llm-cost.
- `test:rc:check` writes `tests/release-candidate/summary.json` but does not tag, push, or create a GitHub Release.
- No publication without separate explicit Release authorization.
