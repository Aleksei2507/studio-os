---
id: "regression-005-stage-handoff"
title: "stage handoff"
stage: "All"
prompt: "Complete the stage."
expect:
  - "A completed stage should leave enough context for the next Runtime."
  - "Should not: Complete without handoff context."
tags: ["regression", "severity:high", "risk:medium"]
---
## Metadata

Category: regression  
Stage: All  
Severity: Medium  
Regression Risk: Medium

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

A stage is ready to complete.

## User Message

```text
Complete the stage.
```

## Expected Behavior

A completed stage should leave enough context for the next Runtime.

## Should Not

Do not complete without handoff context.

## Notes

Verifies handoff.
