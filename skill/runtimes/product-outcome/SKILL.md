---
name: product-outcome
description: Independently compare an accepted product milestone or Work Item outcome with delivered evidence. Use after QA to decide whether the target is ready for Release, requires another roadmap increment, is blocked, or needs explicit re-scoping.
---

# Product Outcome Runtime

> Evidence gate between accepted increment quality and product-level readiness.

## Metadata

Stage: Product Outcome

Version: 1.0

Optional: No for Greenfield, Brownfield, and Feature milestone delivery

Requires Confirmation: Yes before the next Runtime or any target re-scope

Creates:

- `.studio/telemetry/product-outcome-report.md` for a project milestone;
- `work-items/<id>/product-outcome-report.md` for an active Work Item.

Updates:

- `.studio/project-state.md`;
- `.studio/active-context.md`.

Next Stage:

- Release on `PASS`;
- the earliest responsible Runtime on `CONTINUE`;
- Product Outcome on `BLOCKED`;
- Briefing on `RE-SCOPE`.

## Goal

Decide whether the accepted lifecycle milestone or active Work Item outcome is actually delivered. Keep stage completion, increment acceptance, Work Item readiness, milestone readiness, and release status separate.

Product Outcome evaluates observable criteria and evidence. It does not expose hidden chain-of-thought and does not replace Validation or QA.

## Entry Gate

Require:

- an explicit `Target Milestone` for lifecycle delivery or an accepted active Work Item outcome;
- accepted Project Brief or Work Item scope and acceptance criteria;
- an accepted Roadmap or bounded Work Item delivery plan;
- the current increment identified in Project Memory or the active Work Item delivery unit;
- required Validation evidence;
- QA `PASS` or accepted `CONCERNS` for the current increment or Work Item outcome.

If the current delivery unit has unresolved Validation or QA failure, route to the Runtime that owns the failure. Do not evaluate the target as ready.

## Inputs

Read only the evidence needed for the target:

- `.studio/project-state.md` and `.studio/active-context.md`;
- accepted Project Brief and Roadmap or active Work Item scope and plan;
- approved scope-change decisions;
- Development, Validation, and QA reports for accepted increments;
- active Work Item artifacts when applicable;
- prior Product Outcome Reports when the milestone spans multiple increments.

Do not treat a Development self-assessment or passing technical tests as product-outcome evidence by itself.

## Evidence Matrix

For every required milestone criterion or roadmap increment, record one state:

- `VERIFIED`: delivered and supported by accepted Validation and QA evidence;
- `DELIVERED-NOT-VERIFIED`: implementation exists but required evidence is incomplete;
- `PLANNED`: accepted work has not been delivered;
- `BLOCKED`: a named dependency or capability prevents completion;
- `REMOVED`: excluded only by an explicitly accepted re-scope decision.

Unknown or omitted criteria are not verified.

## Decision

Use exactly one decision:

### PASS

Use only when all required target criteria are `VERIFIED`, every required increment is accepted, and no unaccepted blocker or silent scope reduction remains.

For a lifecycle milestone, set `Product Readiness: Ready for Release`. For an active Work Item, mark only the Work Item outcome ready in its Product Outcome Report and preserve the parent Product Readiness. Route to Release after confirmation.

### CONTINUE

Use when the current increment is accepted but the target milestone still contains `PLANNED` or `DELIVERED-NOT-VERIFIED` work.

For lifecycle delivery, set `Product Readiness: Not Ready`. For a Work Item, preserve parent Product Readiness. Mark the completed increment `Accepted`, select the next accepted roadmap increment, and route to the earliest responsible Runtime after confirmation. Use Development when all required product, architecture, standards, and interface decisions already exist; otherwise route to the Runtime that owns the missing decision.

### BLOCKED

Use when a named dependency, environment, capability, approval, or evidence source prevents meaningful continuation.

For lifecycle delivery, set `Product Readiness: Blocked`. For a Work Item, record the Work Item blocker and preserve parent Product Readiness. Preserve the current target, identify the unblock condition, and do not claim completion.

### RE-SCOPE

Use when the accepted target can no longer be met, the user requests a materially different outcome, or delivered work silently omits accepted scope.

Product Outcome must not rewrite the target. Record the conflict, route to Briefing, and require explicit user confirmation before accepted scope changes.

## Procedure

1. Identify the exact Target Milestone or active Work Item outcome and canonical acceptance criteria.
2. List the roadmap increments or bounded delivery units required by that target.
3. Map each criterion and increment to accepted evidence.
4. Check approved scope changes and detect silent scope reduction.
5. Assign evidence states without inferring success from missing information.
6. Set `PASS`, `CONTINUE`, `BLOCKED`, or `RE-SCOPE`.
7. Create the Product Outcome Report.
8. Update Project Memory without starting the next Runtime.
9. Communicate the completed unit, current increment, target readiness, remaining work, and recommended next stage separately.

## Scoped Completion

Every response from this Runtime must distinguish:

- what was just accepted or completed;
- current increment and progress;
- Target Milestone Or Work Item Outcome;
- Product Readiness;
- next stage and remaining delivery units.

Do not use an unqualified completion statement. An accepted increment is not a completed milestone, and a completed Work Item is not automatically a completed product.

## Output

Use `templates/product-outcome-report.md`.

The report must contain:

- Target Milestone Or Work Item Outcome;
- Current Increment And Progress;
- Canonical Acceptance Source;
- Evidence Matrix;
- Scope Change Audit;
- Decision And Rationale Criteria;
- Remaining Increments Or Blockers;
- Recommended Next Runtime;
- Project Memory Update.

## Project Memory Update

Only Product Outcome may set `Product Readiness: Ready for Release` for a lifecycle milestone. Only Release may set `Product Readiness: Released`. A Work Item Product Outcome decision must preserve the parent Product Readiness.

On `CONTINUE`, keep the lifecycle workflow active. Do not mark Greenfield or Brownfield complete. Record the next increment and use `Status: Waiting Confirmation` before its Runtime starts.

On `RE-SCOPE`, preserve the existing Target Milestone until Briefing records an explicitly accepted replacement.

## Forbidden

Product Outcome must not:

- implement or repair product code;
- replace Validation or QA;
- infer full-product readiness from one increment, passing tests, or a bounded remediation;
- remove accepted scope without confirmation;
- count a planned future capability as a bug;
- set Release to completed;
- hide remaining increments, blockers, or missing evidence;
- start the recommended next Runtime automatically.

## Completion Checklist

- target and canonical criteria identified;
- current increment and roadmap progress explicit;
- evidence matrix complete;
- scope changes audited;
- decision uses one allowed value;
- Product Readiness or Work Item readiness updated by ownership rules;
- scoped completion communicated;
- next Runtime recommended without automatic execution.

## Stop Condition

Stop after the Product Outcome Report and Project Memory are updated and the user has a clear readiness statement. Wait for confirmation before Release, the next increment, or re-scoping.
