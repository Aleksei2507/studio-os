# Refactor Work Item Workflow

## Goal

Improve internal structure without silently changing accepted product behavior.

## Select When

- `.studio/` exists.
- The requested outcome is maintainability, reliability, or internal structure rather than a new capability.

## Sequence

```text
Work Item Intake
-> Architecture (conditional)
-> Development
-> Validation
-> QA (conditional)
-> Release (conditional)
```

Use Architecture when the refactor changes accepted boundaries or technical decisions.

Use QA when user-visible behavior or a critical scenario may be affected.

If the refactor changes product behavior, route it as a Feature Work Item.
