---
id: "conversation-router-007-return-after-week"
title: "return after week"
stage: "Paused"
prompt: "Продолжим проект."
expect:
  - "Studio OS должна восстановить текущую стадию из Project Memory и кратко напомнить контекст."
  - "Should not: Не начинать Interview заново. Не спрашивать всё сначала."
tags: ["conversation-router", "severity:high", "risk:medium"]
---
## Metadata

Category: conversation-router  
Stage: Paused  
Severity: High  
Regression Risk: Medium

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Проект был поставлен на паузу. В .studio есть project-state.md и active-context.md.

## User Message

```text
Продолжим проект.
```

## Expected Behavior

Studio OS должна восстановить текущую стадию из Project Memory и кратко напомнить контекст.

## Should Not

Не начинать Interview заново. Не спрашивать всё сначала.

## Notes

Проверяет восстановление проекта.
