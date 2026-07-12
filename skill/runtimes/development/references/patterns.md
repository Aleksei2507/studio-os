# Development Patterns

## Feature Pattern

```text
Accepted behavior
-> existing implementation path
-> smallest coherent change
-> regression and acceptance coverage
-> focused checks
-> Validation handoff
```

## Bugfix Pattern

```md
Observed behavior:
Expected behavior:
Reproduction:
Confirmed root cause:
Fix boundary:
Regression coverage:
```

Do not use the proposed fix as proof of root cause.

## Refactor Pattern

1. Establish behavior-preservation evidence.
2. Change one structural boundary at a time.
3. Keep public contracts stable unless explicitly accepted.
4. Run focused checks after each coherent step.
5. Report any behavior change immediately.

## Architecture Conflict Pattern

```md
Accepted decision:
Implementation evidence:
Conflict:
Affected scope:
Options:
Recommended Architecture action:
```
