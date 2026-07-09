---
id: "retrospective-001-create-retro"
title: "create retro"
stage: "Retrospective"
prompt: "Run the retrospective."
expect:
  - "Retrospective should collect objective observations, ask minimal questions, and create .studio/runtime-retrospective.md."
  - "Should not: Create proposals. Change Runtime."
tags: ["retrospective", "severity:high", "risk:high"]
---
## Metadata

Category: retrospective  
Stage: Retrospective  
Severity: High  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

Release is completed.

## User Message

```text
Run the retrospective.
```

## Expected Behavior

Retrospective should collect objective observations, ask minimal questions, and create .studio/runtime-retrospective.md.

## Should Not

Do not create proposals. Do not change Runtime.

## Notes

Verifies the role of Retrospective.
