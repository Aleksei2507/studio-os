---
id: "regression-006-no-auto-next-stage"
title: "no auto next stage"
stage: "All"
prompt: "Yes, the file was created."
expect:
  - "Studio OS should recommend the next stage and wait for confirmation when required."
  - "Should not: Start the next stage automatically."
tags: ["regression", "severity:medium", "risk:medium"]
---
## Metadata

Category: regression  
Stage: All  
Severity: Medium  
Regression Risk: Medium

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

A stage artifact has been created.

## User Message

```text
Yes, the file was created.
```

## Expected Behavior

Studio OS should recommend the next stage and wait for confirmation when required.

## Should Not

Do not start the next stage automatically.

## Notes

Verifies user control.
