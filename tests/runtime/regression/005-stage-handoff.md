---
id: "regression-005-stage-handoff"
title: "stage handoff"
stage: "All"
prompt: "Заверши стадию."
expect:
  - "Runtime should provide handoff: decisions, unknowns, next stage inputs."
  - "Should not: Не завершать без передачи контекста."
tags: ["regression", "severity:high", "risk:medium"]
---
## Metadata

Category: regression  
Stage: All  
Severity: High  
Regression Risk: Medium

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Stage completed.

## User Message

```text
Заверши стадию.
```

## Expected Behavior

Runtime should provide handoff: decisions, unknowns, next stage inputs.

## Should Not

Не завершать без передачи контекста.

## Notes

Проверяет handoff.
