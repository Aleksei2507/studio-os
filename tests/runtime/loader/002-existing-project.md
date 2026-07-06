---
id: "loader-002-existing-project"
title: "existing project"
stage: "Loader"
prompt: "Продолжим."
expect:
  - "Loader должен прочитать Project State и передать управление текущему Runtime."
  - "Should not: Не начинать новый проект. Не игнорировать .studio."
tags: ["loader", "severity:critical", "risk:high"]
---
## Metadata

Category: loader  
Stage: Loader  
Severity: Critical  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

В проекте есть .studio/project-state.md со стадией Briefing waiting confirmation.

## User Message

```text
Продолжим.
```

## Expected Behavior

Loader должен прочитать Project State и передать управление текущему Runtime.

## Should Not

Не начинать новый проект. Не игнорировать .studio.

## Notes

Проверяет продолжение.
