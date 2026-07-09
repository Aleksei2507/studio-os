---
id: "validation-001-run-validation"
title: "run validation"
stage: "Validation"
prompt: "Check that everything works."
expect:
  - "Validation should run available checks: lint/typecheck/test/build, then create validation-report."
  - "Should not: Stop at saying it should work."
tags: ["validation", "severity:critical", "risk:high"]
---
## Metadata

Category: validation  
Stage: Validation  
Severity: Critical  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

Development completed changes.

## User Message

```text
Check that everything works.
```

## Expected Behavior

Validation should run available checks: lint/typecheck/test/build, then create validation-report.

## Should Not

Do not stop at saying it should work.

## Notes

Verifies objective validation.
