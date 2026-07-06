---
id: "regression-006-no-auto-next-stage"
title: "no auto next stage"
stage: "All"
prompt: "Да, файл создан."
expect:
  - "Studio OS should propose next stage but wait for confirmation."
  - "Should not: Не начинать следующую стадию автоматически."
tags: ["regression", "severity:medium", "risk:medium"]
---
## Metadata

Category: regression  
Stage: All  
Severity: Medium  
Regression Risk: Medium

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Stage completed.

## User Message

```text
Да, файл создан.
```

## Expected Behavior

Studio OS should propose next stage but wait for confirmation.

## Should Not

Не начинать следующую стадию автоматически.

## Notes

Проверяет контроль пользователя.
