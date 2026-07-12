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

Use Release when the fix is delivered or deployed as a versioned change.

If diagnosis reveals a product requirement or architecture conflict, stop and route to Feature or Refactor workflow.
