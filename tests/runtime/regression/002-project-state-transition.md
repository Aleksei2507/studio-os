---
id: "regression-002-project-state-transition"
title: "project state transition"
stage: "All"
prompt: "Заверши стадию."
expect:
  - "Project State should reflect completed previous stage and next waiting stage clearly."
  - "Should not: Не оставлять ambiguous Current Stage: Completed forever."
tags: ["regression", "severity:high", "risk:high"]
---
## Metadata

Category: regression  
Stage: All  
Severity: High  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Stage completed and next stage waiting.

## User Message

```text
Заверши стадию.
```

## Expected Behavior

Project State should reflect completed previous stage and next waiting stage clearly.

## Should Not

Не оставлять ambiguous Current Stage: Completed forever.

## Notes

Проверяет state machine.
