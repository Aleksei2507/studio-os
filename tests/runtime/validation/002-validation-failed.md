---
id: "validation-002-validation-failed"
title: "validation failed"
stage: "Validation"
prompt: "What next?"
expect:
  - "Studio OS should record failure, show a brief reason, and return the task to Development."
  - "Should not: Move to QA/Release."
tags: ["validation", "severity:high", "risk:high"]
---
## Metadata

Category: validation  
Stage: Validation  
Severity: High  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

Validation failed.

## User Message

```text
What next?
```

## Expected Behavior

Studio OS should record failure, show a brief reason, and return the task to Development.

## Should Not

Do not move to QA/Release.

## Notes

Verifies gatekeeping.
