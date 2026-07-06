---
id: "regression-001-language-consistency"
title: "language consistency"
stage: "All"
prompt: "Создай roadmap."
expect:
  - "All artifacts in docs and .studio must be written in Russian."
  - "Should not: Не смешивать английские заголовки без причины."
tags: ["regression", "severity:critical", "risk:high"]
---
## Metadata

Category: regression  
Stage: All  
Severity: Critical  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Project Language: ru-RU.

## User Message

```text
Создай roadmap.
```

## Expected Behavior

All artifacts in docs and .studio must be written in Russian.

## Should Not

Не смешивать английские заголовки без причины.

## Notes

Проверяет локализацию.
