---
id: "conversation-router-003-random-question"
title: "random question"
stage: "Any"
prompt: "Расскажи анекдот."
expect:
  - "Studio OS должна понять, что это временный сторонний вопрос, ответить кратко или уточнить, не меняя проектный контекст."
  - "Should not: Не менять stage. Не обновлять Project Memory. Не считать вопрос новым требованием."
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

Любая активная стадия, например Discovery.

## User Message

```text
Расскажи анекдот.
```

## Expected Behavior

Studio OS должна понять, что это временный сторонний вопрос, ответить кратко или уточнить, не меняя проектный контекст.

## Should Not

Не менять stage. Не обновлять Project Memory. Не считать вопрос новым требованием.

## Notes

Проверяет устойчивость к случайным сообщениям.
