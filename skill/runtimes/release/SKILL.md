---
name: release
description: Decide release readiness, prepare release notes and operational safeguards, and execute external release actions only with explicit authorization. Use after sufficient Validation and QA evidence.
---

# Release Runtime

> Runtime for making an evidence-based release decision and preparing safe handoff or deployment.

## Metadata

Stage: Release

Version: 1.0

Optional: No for delivered product increments, conditional for research-only or internal work

Requires Confirmation: Yes before publishing, deploying, tagging, notifying, or another external action

Creates:

- `docs/release-notes.md` for project lifecycle;
- `work-items/<id>/release-notes.md` and `work-items/<id>/summary.md` for an active Work Item;
- `.studio/release-checklist.md` when operational handoff is required.

Updates:

- `.studio/project-state.md`;
- `.studio/active-context.md`;
- main product artifacts after a completed Work Item when required.

Next Stage: Retrospective or Project Done

## Goal

Determine whether the accepted increment is ready for release, prepare transparent release information, and prevent deployment without evidence or authorization.

## Required Capabilities

- `release-operations`

Load `skill/capabilities/release-operations.md`.

Preparation may proceed without deployment access. External release execution requires explicit permission and sufficient environment capability.

## Entry Gate

Require:

- Validation Report;
- QA Report when QA is required by the workflow;
- no unresolved release blocker;
- accepted residual risks;
- version or handoff target;
- migration and rollback information when relevant.

If a required gate is FAIL, BLOCKED, missing, or stale after changes, set Release BLOCKED.

## Inputs

Read:

- `.studio/project-state.md`;
- `.studio/active-context.md`;
- active Work Item summary when applicable;
- active Development Report path from Project Memory;
- active Validation Report path from Project Memory;
- active QA Report path when required;
- active Architecture, ADRs, and delivery constraints relevant to release;
- existing changelog, versioning, deployment, migration, and rollback instructions.

## Readiness Review

Verify:

- accepted scope and version;
- required technical checks;
- required product QA;
- configuration and secrets requirements;
- data migration and compatibility;
- deployment or handoff steps;
- rollback or recovery path;
- observability and post-release checks;
- known issues and residual risks;
- documentation and product artifact updates.

## Decision

- READY: all required gates pass and no unaccepted blocker remains.
- CONDITIONAL: release may proceed only after explicitly accepted conditions or residual risks.
- BLOCKED: a required gate, authorization, migration, rollback, or product condition is missing or failed.

Conditional does not override a failed required quality gate.

## External Action Rule

Before deploying, publishing, tagging, sending notifications, or modifying external systems:

1. State the exact target and action.
2. Show readiness decision and remaining risk.
3. Request explicit authorization.
4. Execute only the authorized scope.
5. Record result and verification.

Do not infer authorization from approval of release notes.

## Conditional References

Read `references/patterns.md` when preparing release notes, migration, rollback, or post-release verification.

Read `references/anti-patterns.md` when pressure exists to release with failed gates or to fix code inside Release.

## Output

Create Release Notes under `docs/` or the Active Work Item directory according to Project Memory, with:

- Release Identifier and Date;
- Scope;
- User-Visible Changes;
- Fixed Problems;
- Compatibility and Migration;
- Validation and QA Evidence;
- Known Issues;
- Residual Risks;
- Deployment or Handoff Notes;
- Rollback Notes;
- Readiness Decision;
- Authorization and Result when an external release occurred.

Use `templates/release-notes.md` as the output structure.

For Work Item completion, use `templates/work-item-summary.md` for `summary.md`.

Create `.studio/release-checklist.md` when deployment or operational handoff needs tracked steps.

## Work Item Completion

After a released Work Item:

- create or update its summary;
- update main product artifacts when product truth changed;
- clear `Active Work Item` after completion;
- preserve project Mode;
- record release reference in Project Memory.

## Project Memory Update

On completed release, set Release to Completed and recommend Retrospective when useful.

If BLOCKED, preserve Release as current stage and record the exact blocker.

Preserve Project Language and accepted product history.

## Forbidden

Release must not:

- fix product code or rewrite scope;
- deploy with failed required Validation or QA;
- hide known issues, migrations, or residual risks;
- publish or notify without explicit authorization;
- claim deployment succeeded without verification;
- start Retrospective automatically.

## Completion Checklist

- required gates reviewed;
- readiness decision explicit;
- notes and operational steps prepared;
- migration and rollback addressed when relevant;
- external action explicitly authorized and verified when performed;
- Project Memory and Work Item state updated.

## Stop Condition

Stop after release preparation and decision, or after an explicitly authorized release is verified and recorded. Recommend Retrospective and wait.
