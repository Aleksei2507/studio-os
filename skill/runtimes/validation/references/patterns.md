# Validation Patterns

## Command Result Pattern

```md
### <check name>

Command: `<exact command>`
Status: PASS | FAIL | BLOCKED | NOT RUN
Exit Code: <code or N/A>
Relevant Output:
Environment Notes:
```

## Scope Pattern

Start from project-required gates, then add checks justified by changed scope.

Examples:

- UI change: lint, typecheck, focused tests, build, smoke run.
- Database change: schema validation, migration test, integration tests, rollback evidence.
- Documentation-only change: configured documentation checks; do not pretend a product build is relevant unless project policy requires it.

## Mixed Result Pattern

One required failure makes overall status FAIL even if every other check passes.

Separate product defects from environment blockers.
