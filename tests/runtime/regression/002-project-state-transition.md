---
id: "regression-002-project-state-transition"
title: "project state transition"
stage: "All"
prompt: "Complete the stage."
expect:
  - "Studio OS should update Previous Stage, Current Stage, and Status consistently."
  - "Studio OS should update increment status without promoting Target Milestone readiness."
  - "Should not: Leave ambiguous Current Stage: Completed forever."
tags: ["regression", "severity:high", "risk:high"]
---
## Metadata

Category: regression  
Stage: All  
Severity: High  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

A stage is ready to complete.

## User Message

```text
Complete the stage.
```

## Expected Behavior

Studio OS should update Previous Stage, Current Stage, and Status consistently.

## Should Not

Do not leave ambiguous Current Stage: Completed forever.

## Notes

Verifies the state machine.
