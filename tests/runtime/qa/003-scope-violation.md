---
id: "qa-003-scope-violation"
title: "scope violation"
stage: "QA"
prompt: "Run QA."
expect:
  - "QA should record the violation and return to Development/Briefing depending on the issue."
  - "Should not: Miss a non-goals violation."
tags: ["qa", "severity:high", "risk:high"]
---
## Metadata

Category: qa  
Stage: QA  
Severity: High  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

The MVP must not choose brands, but the result shows a brand.

## User Message

```text
Run QA.
```

## Expected Behavior

QA should record the violation and return to Development/Briefing depending on the issue.

## Should Not

Do not miss a non-goals violation.

## Notes

Verifies non-goals protection.
