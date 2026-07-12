---
name: qa
description: Evaluate a validated increment against accepted user scenarios, product scope, UX expectations, and acceptance criteria. Use after technical Validation and before Release.
---

# QA Runtime

> Runtime for deciding whether the increment works as the intended product, not merely whether automated checks pass.

## Metadata

Stage: QA

Version: 1.0

Optional: No for user-visible releases, conditional for internal-only Refactors

Requires Confirmation: Only before privileged or externally visible test actions

Creates:

- `docs/qa-report.md` for project lifecycle;
- `work-items/<id>/qa-report.md` for an active Work Item;
- evidence such as screenshots or captured outputs when relevant.

Updates:

- `.studio/project-state.md`;
- `.studio/active-context.md`.

Next Stage: Release on PASS or accepted CONCERNS, Development on FAIL

## Goal

Test the product increment from the user's point of view and determine whether accepted scenarios, scope, and quality expectations are satisfied.

## Required Capabilities

- `product-qa`

Load `skill/capabilities/product-qa.md`.

Use browser, API, CLI, device, or manual inspection capabilities appropriate to the product interface.

## Entry Gate

Require:

- a runnable or inspectable increment;
- technical Validation not in FAIL or required BLOCKED state;
- accepted scenarios and acceptance criteria;
- relevant Design Strategy for user-facing work.

If technical Validation is insufficient, mark QA BLOCKED and return to Validation.

## Inputs

Read:

- accepted canonical Project Brief and active Work Item Brief when applicable;
- selected roadmap iteration or Work Item request;
- `docs/design-strategy.md` when available;
- active Development Report path from Project Memory;
- active Validation Report path from Project Memory;
- relevant known risks and release constraints.

## QA Plan

Derive scenarios from accepted artifacts, including:

- primary user success path;
- important alternate path;
- error and recovery behavior;
- boundary and edge cases;
- regression-sensitive existing behavior;
- accessibility and UX constraints when relevant;
- explicit Non Goals and scope boundaries.

Prioritize by user impact and risk. Do not invent new product requirements during QA.

## Procedure

1. Confirm QA target, environment, and build.
2. Map acceptance criteria to executable scenarios.
3. Run the highest-value scenarios through the real interface when possible.
4. Capture evidence and observed behavior.
5. Classify findings by severity and scope.
6. Check that implementation did not silently expand or reduce accepted scope.
7. Set PASS, CONCERNS, FAIL, or BLOCKED.
8. Route defects to Development without fixing them in QA.

## QA Decision

- PASS: accepted scenarios succeed and no release-blocking finding remains.
- CONCERNS: core scenarios succeed, but accepted residual risks require explicit Release decision.
- FAIL: an acceptance criterion, critical user scenario, or product boundary is violated.
- BLOCKED: the product, environment, account, data, or capability needed for QA is unavailable.

Automated tests passing is evidence, not automatic QA PASS.

## Finding Severity

- Critical: unsafe, destructive, or core outcome impossible.
- High: primary scenario fails with no acceptable workaround.
- Medium: important degradation or confusing recovery with a workaround.
- Low: minor quality issue that does not block accepted outcome.

## Conditional References

Read `references/patterns.md` when building scenario coverage or evaluating UX and scope.

Read `references/anti-patterns.md` when automated checks pass but product behavior is poor, or when QA pressure introduces new scope.

## Output

Create QA Report under `docs/` or the Active Work Item directory according to Project Memory, with:

- QA Target and Environment;
- Inputs and Validation Status;
- Scenario Matrix;
- Acceptance Criteria Coverage;
- Findings and Evidence;
- UX and Accessibility Observations when relevant;
- Scope Verification;
- Decision;
- Release Blockers;
- Accepted Residual Risks;
- Recommended Next Stage.

Use `templates/qa-report.md` as the output structure.

## Project Memory Update

Reference QA Report and record decision, release blockers, and accepted residual risks.

On PASS, set Release as current stage. On FAIL, set Development as current stage. On BLOCKED, preserve QA and record the missing capability.

Preserve Mode, Workflow, Work Type, Active Work Item, and Project Language.

## Forbidden

QA must not:

- fix product code or change artifacts to make QA pass;
- add new product features or acceptance criteria;
- treat technical tests as complete product validation;
- ignore poor UX merely because tests pass;
- hide scope violations or residual risks;
- proceed to Release after FAIL;
- deploy or publish the product.

## Completion Checklist

- target and environment identified;
- acceptance criteria mapped to scenarios;
- primary and error paths exercised;
- evidence captured;
- scope verified;
- decision and blockers explicit;
- Project Memory updated.

## Stop Condition

Stop after QA Report and routing state are updated. Do not repair findings inside QA.
