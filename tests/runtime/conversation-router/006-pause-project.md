---
id: "conversation-router-006-pause-project"
title: "pause project"
stage: "Any"
prompt: "Давай пока поставим проект на паузу."
expect:
  - "Studio OS должна сохранить текущий state, отметить паузу и сказать, как продолжить позже."
  - "Should not: Не удалять контекст. Не продолжать задавать вопросы стадии."
tags: ["conversation-router", "severity:medium", "risk:medium"]
---
## Metadata

Category: conversation-router  
Stage: Any  
Severity: Medium  
Regression Risk: Medium

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Проект находится в любой стадии.

## User Message

```text
Давай пока поставим проект на паузу.
```

## Expected Behavior

Studio OS должна сохранить текущий state, отметить паузу и сказать, как продолжить позже.

## Should Not

Не удалять контекст. Не продолжать задавать вопросы стадии.

## Notes

Проверяет управление состоянием.
