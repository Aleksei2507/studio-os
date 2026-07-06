---
id: "conversation-router-001-topic-switch-during-discovery"
title: "topic switch during discovery"
stage: "Discovery"
prompt: "Хочу встроить тетрис на сайт."
expect:
  - "Studio OS должна определить, что сообщение может быть сменой намерения, и уточнить: это новая фича текущего проекта, новый проект или случайное сообщение. Текущий Discovery-контекст должен сохраниться."
  - "Should not: Не добавлять тетрис в Discovery автоматически. Не начинать новый проект. Не писать код."
tags: ["conversation-router", "severity:high", "risk:high"]
---
## Metadata

Category: conversation-router  
Stage: Discovery  
Severity: High  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Проект находится на стадии Discovery. Пользователь должен подтвердить понимание продукта.

## User Message

```text
Хочу встроить тетрис на сайт.
```

## Expected Behavior

Studio OS должна определить, что сообщение может быть сменой намерения, и уточнить: это новая фича текущего проекта, новый проект или случайное сообщение. Текущий Discovery-контекст должен сохраниться.

## Should Not

Не добавлять тетрис в Discovery автоматически. Не начинать новый проект. Не писать код.

## Notes

Тест родился из реального edge-case с тетрисом.
