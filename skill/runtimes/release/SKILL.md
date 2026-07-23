---
name: release
description: Decide release readiness, prepare release notes and operational safeguards, and execute external release actions only with explicit authorization. Use after Product Outcome PASS for lifecycle or Feature targets, or after sufficient Validation and QA evidence for workflows that do not select Product Outcome.
---

# Release Runtime

> Runtime for making an evidence-based release decision and preparing safe handoff or deployment.

## Metadata

Stage: Release

Version: 1.3

Optional: No for delivered product increments, conditional for research-only or internal work

Requires Confirmation: Yes before publishing, deploying, tagging, notifying, or another external action

Creates:

- `docs/release-notes.md` for project lifecycle;
- `work-items/<id>/release-notes.md` and `work-items/<id>/summary.md` for an active Work Item;
- `.studio/release-checklist.md` when operational handoff is required.

Updates:

- `.studio/project-state.md`;
- `.studio/active-context.md`;
- `.studio/design-system-profile.md` after a successful Work Item release changed the implemented interface system;
- main product artifacts after a completed Work Item when required.

Next Stage: Retrospective or Project Done for a released Target Milestone; stored Return Stage for a bounded Work Item

## Goal

Determine whether the explicitly named release unit is operationally ready, prepare transparent release information, and prevent deployment without Product Outcome evidence, required quality evidence, or authorization.

## Required Capabilities

- `release-operations`

Load `skill/capabilities/release-operations.md`.

Preparation may proceed without deployment access. External release execution requires explicit permission and sufficient environment capability.

## Required Standards

- `security-privacy`.

Load `skill/standards/core/security-privacy.md` and only additional standards selected in the canonical and active Work Item Standards Profiles that apply to Release.

## Entry Gate

Require:

- Product Outcome `PASS` and `Product Readiness: Ready for Release` when releasing a Greenfield or Brownfield Target Milestone;
- Work Item Product Outcome `PASS` when the selected Feature workflow includes that gate, while preserving parent Product Readiness;
- Validation Report;
- QA Report when QA is required by the workflow;
- no unresolved release blocker;
- accepted residual risks;
- version or handoff target;
- migration and rollback information when relevant.

If a required gate is FAIL, BLOCKED, missing, or stale after changes, set Release BLOCKED.

A Bugfix or other bounded workflow that does not select Product Outcome may release only its explicitly named Work Item scope. It must preserve the parent product readiness and must not describe the Work Item as the completed product.

## Inputs

Read:

- `.studio/project-state.md`;
- `.studio/active-context.md`;
- active Work Item summary when applicable;
- active Development Report path from Project Memory;
- active Validation Report path from Project Memory;
- active QA Report path when required;
- active Architecture, ADRs, and delivery constraints relevant to release;
- canonical `.studio/standards-profile.md` and active `work-items/<id>/standards-profile.md` when available;
- canonical `.studio/design-system-profile.md` and active `work-items/<id>/design-system-profile.md` when the Work Item changes the implemented interface system;
- existing changelog, versioning, deployment, migration, and rollback instructions.

## Readiness Review

Verify:

- Product Outcome Report and Target Milestone identity when required;
- accepted scope and version;
- required technical checks;
- required product QA;
- configuration and secrets requirements;
- data migration and compatibility;
- deployment or handoff steps;
- rollback or recovery path;
- observability and post-release checks;
- release conditions required by selected standards, including mobile signing, compatibility, rollout, or store constraints when applicable;
- known issues and residual risks;
- documentation and product artifact updates.
- accepted Work Item Design System Profile changes match the released implementation and QA evidence when present.

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

- Delivery Context: released unit, Target Milestone, Product Readiness, current increment, and progress;
- Release Identifier and Date;
- Scope;
- User-Visible Changes;
- Fixed Problems;
- Compatibility and Migration;
- Validation and QA Evidence;
- Product Outcome Evidence when the workflow selects it;
- Standards and Release Conditions;
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
- merge an accepted Work Item Standards Profile into `.studio/standards-profile.md` when released technology or quality constraints changed;
- merge an accepted Work Item Design System Profile into `.studio/design-system-profile.md` when the released interface system changed;
- clear `Active Work Item` after completion;
- restore `Parent Workflow`, `Return Stage`, Target Milestone, current increment, increment status, and progress from the Work Item request, then clear the temporary routing fields;
- preserve project Mode;
- record release reference in Project Memory.

## Project Memory Update

On a completed Target Milestone release backed by Product Outcome `PASS`, set `Product Readiness: Released`, set Release to Completed, and recommend Retrospective when useful.

On any bounded Work Item release, preserve the parent `Product Readiness`, name the released Work Item, and restore the parent delivery context according to Project Memory.

If BLOCKED, preserve Release as current stage and record the exact blocker.

Preserve Project Language and accepted product history.

## Forbidden

Release must not:

- fix product code or rewrite scope;
- deploy with failed required Validation or QA;
- release while a required Project Standards Profile gate is failed or missing;
- merge an unimplemented or unreleased Work Item Design System Profile into canonical project memory;
- release a lifecycle milestone without Product Outcome `PASS`;
- promote a bounded Work Item or increment release into full-product completion;
- hide known issues, migrations, or residual risks;
- publish or notify without explicit authorization;
- claim deployment succeeded without verification;
- start Retrospective automatically.

## Completion Checklist

- required gates reviewed;
- readiness decision explicit;
- notes and operational steps prepared;
- migration and rollback addressed when relevant;
- selected release standards and profile gates reviewed;
- accepted Design System Profile changes merged only after successful release;
- external action explicitly authorized and verified when performed;
- Project Memory and Work Item state updated.

## Stop Condition

Stop after release preparation and decision, or after an explicitly authorized release is verified and recorded. Name the released unit and resulting Product Readiness separately. Recommend Retrospective and wait.
