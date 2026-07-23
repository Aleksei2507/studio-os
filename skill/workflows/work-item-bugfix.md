# Bugfix Work Item Workflow

## Goal

Diagnose and fix incorrect behavior with the smallest safe cycle.

## Select When

- `.studio/` exists.
- Existing behavior is incorrect, regressed, or fails an accepted requirement.

## Sequence

```text
Work Item Intake
-> Development
-> Validation
-> QA
-> Release (conditional)
```

Development includes evidence-based reproduction and diagnosis before the fix.

At intake and completion, state the parent Target Milestone, Product Readiness, current increment, and interrupted stage. A completed Bugfix returns control to that delivery context after its own required gates; it does not mark the parent increment or milestone complete.

If the reported capability belongs to an incomplete future roadmap increment, do not open a Bugfix. Explain that it is planned scope and route any reprioritization through the responsible product stage.

Use Release when the fix is delivered or deployed as a versioned change.

If diagnosis reveals a product requirement or architecture conflict, stop and route to Feature or Refactor workflow.
