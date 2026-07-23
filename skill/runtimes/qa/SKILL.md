---
name: qa
description: Evaluate a validated increment against accepted user scenarios, product scope, UX expectations, and acceptance criteria. Use after technical Validation and before Product Outcome or Release.
---

# QA Runtime

> Runtime for deciding whether the increment works as the intended product, not merely whether automated checks pass.

## Metadata

Stage: QA

Version: 1.3

Optional: No for user-visible releases, conditional for internal-only Refactors

Requires Confirmation: Only before privileged or externally visible test actions

Creates:

- `docs/qa-report.md` for project lifecycle;
- `work-items/<id>/qa-report.md` for an active Work Item;
- evidence such as screenshots or captured outputs when relevant.

Updates:

- `.studio/project-state.md`;
- `.studio/active-context.md`.

Next Stage: Product Outcome when selected by the workflow, otherwise Release on PASS or accepted CONCERNS; Development, Interface Design, Design Strategy, or Briefing on FAIL according to defect ownership

## Goal

Test the product increment from the user's point of view and determine whether accepted scenarios, scope, and quality expectations are satisfied.

## Required Capabilities

- `product-qa`

Load `skill/capabilities/product-qa.md`.

Use browser, API, CLI, device, or manual inspection capabilities appropriate to the product interface.

## Required Standards

- `security-privacy`;
- `accessibility`;
- `product-design`.

Load the direct contracts above and only additional standards selected in the canonical and active Work Item Standards Profiles that apply to QA.

For mobile products, apply the selected `mobile` standard and require representative device, lifecycle, network, permission, and accessibility evidence where relevant. For web or backend surfaces, apply their selected domain standards only to observable product behavior and accepted quality gates.

## Entry Gate

Require:

- a runnable or inspectable increment;
- stored Target Milestone, Product Readiness, and current increment matching the QA target;
- technical Validation not in FAIL or required BLOCKED state;
- accepted scenarios and acceptance criteria;
- relevant Design Strategy for user-facing work;
- accepted Interface Design when the workflow selected it;
- the applicable Project or Work Item Design System Profile when interface conformance is in scope.

If technical Validation is insufficient, mark QA BLOCKED and return to Validation.

## Inputs

Read:

- accepted canonical Project Brief and active Work Item Brief when applicable;
- selected roadmap iteration or Work Item request;
- `docs/design-strategy.md` when available;
- active `docs/interface-design.md` or Work Item Interface Design when available;
- active Development Report path from Project Memory;
- active Validation Report path from Project Memory;
- canonical `.studio/standards-profile.md` and active `work-items/<id>/standards-profile.md` when available;
- canonical `.studio/design-system-profile.md` and active `work-items/<id>/design-system-profile.md` when interface conformance is in scope;
- relevant known risks and release constraints.

## QA Plan

Derive scenarios from accepted artifacts, including:

- primary user success path;
- important alternate path;
- error and recovery behavior;
- boundary and edge cases;
- regression-sensitive existing behavior;
- accessibility and UX constraints when relevant;
- accepted flows, states, responsive or adaptive behavior, platform variants, and design-system rules when Interface Design exists;
- active design-system foundations, component behavior, preservation boundaries, and approved deviations from the applicable profile;
- selected domain-standard scenarios and quality gates;
- explicit Non Goals and scope boundaries.

Prioritize by user impact and risk. Do not invent new product requirements during QA.

## Procedure

1. Confirm QA target, environment, and build.
2. Map acceptance criteria to executable scenarios.
3. Map applicable Project Standards Profile and Design System Profile rules to observable QA evidence.
4. Run the highest-value scenarios through the real interface when possible.
5. Capture evidence and observed behavior.
6. Classify findings by severity and scope.
7. Check that implementation did not silently expand or reduce accepted scope or introduce an unapproved parallel design system.
8. Set PASS, CONCERNS, FAIL, or BLOCKED.
9. Route implementation defects to Development and accepted-design defects to the Runtime that owns the decision, without fixing them in QA.

## QA Decision

- PASS: accepted scenarios succeed and no release-blocking finding remains.
- CONCERNS: core scenarios succeed, but accepted residual risks require explicit Release decision.
- FAIL: an acceptance criterion, critical user scenario, or product boundary is violated.
- BLOCKED: the product, environment, account, data, or capability needed for QA is unavailable.

Automated tests passing is evidence, not automatic QA PASS.

For FAIL routing:

- use Development when implementation diverges from accepted artifacts;
- use Interface Design when the implementation matches an incomplete or defective detailed design;
- use Design Strategy when the accepted experience principle or visual direction is wrong;
- use Briefing when scope or acceptance criteria are wrong or missing.

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

- Delivery Context: Target Milestone, Product Readiness, current increment, and progress;
- QA Target and Environment;
- Inputs and Validation Status;
- Scenario Matrix;
- Acceptance Criteria Coverage;
- Interface Design Conformance when applicable;
- Design System Profile Conformance when applicable;
- Findings and Evidence;
- Standards Coverage;
- UX and Accessibility Observations when relevant;
- Scope Verification;
- Decision;
- Release Blockers;
- Accepted Residual Risks;
- Recommended Next Stage.

Use `templates/qa-report.md` as the output structure.

## Project Memory Update

Reference QA Report and record decision, release blockers, and accepted residual risks.

On PASS or accepted CONCERNS, set `Increment Status: Accepted` and route to Product Outcome when the selected workflow includes it; otherwise route to Release. On FAIL, set the responsible Runtime as current stage and record the evidence. On BLOCKED, preserve QA, set `Increment Status: Blocked` when required, and record the missing capability.

Preserve Mode, Workflow, Work Type, Active Work Item, Project Language, and Product Readiness. QA accepts an increment; it does not declare the Target Milestone ready.

## Forbidden

QA must not:

- fix product code or change artifacts to make QA pass;
- revise accepted Interface Design inside QA;
- revise the Design System Profile or approve an implementation deviation inside QA;
- add new product features or acceptance criteria;
- treat technical tests as complete product validation;
- ignore poor UX merely because tests pass;
- ignore a required mobile, accessibility, privacy, or domain-standard scenario;
- hide scope violations or residual risks;
- imply that QA acceptance of one increment completes the Target Milestone;
- proceed to Release after FAIL;
- deploy or publish the product.

## Completion Checklist

- target and environment identified;
- acceptance criteria mapped to scenarios;
- primary and error paths exercised;
- evidence captured;
- applicable standards covered or explicitly blocked;
- accepted Interface Design checked when applicable;
- applicable Design System Profile and approved deviations checked when relevant;
- scope verified;
- decision and blockers explicit;
- Project Memory updated.

## Stop Condition

Stop after QA Report and routing state are updated. Name the accepted or rejected increment and Product Readiness separately. Do not repair findings inside QA.
