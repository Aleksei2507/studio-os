# Release Patterns

## Readiness Pattern

```md
Validation: PASS | FAIL | BLOCKED | PARTIAL
QA: PASS | CONCERNS | FAIL | BLOCKED | Not Required
Migration ready: Yes | No | Not Required
Rollback ready: Yes | No | Not Required
Authorization: Granted | Missing | Not Required
Decision: READY | CONDITIONAL | BLOCKED
```

## Release Notes Pattern

Write for the product user and operator:

- what changed;
- why it matters;
- what they must do;
- what remains known or limited;
- how to recover if release fails.

## Deployment Pattern

```text
pre-release verification
-> explicit authorization
-> bounded deployment action
-> health and smoke verification
-> rollback if required
-> recorded result
```

## Work Item Completion Pattern

Update only main artifacts whose product truth changed. Do not copy every Work Item document into the main project.
