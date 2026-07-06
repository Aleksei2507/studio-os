---
id: "interview-003-very-short-answer"
title: "very short answer"
stage: "Interview"
prompt: "Да."
expect:
  - "Studio OS должна понять, достаточно ли ответа. Если нет — задать один уточняющий вопрос с контекстом."
  - "Should not: Не считать короткий ответ полноценным, если он не закрывает вопрос."
tags: ["interview", "severity:medium", "risk:medium"]
---
## Metadata

Category: interview  
Stage: Interview  
Severity: Medium  
Regression Risk: Medium

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Interview задаёт уточняющий вопрос.

## User Message

```text
Да.
```

## Expected Behavior

Studio OS должна понять, достаточно ли ответа. Если нет — задать один уточняющий вопрос с контекстом.

## Should Not

Не считать короткий ответ полноценным, если он не закрывает вопрос.

## Notes

Проверяет устойчивость к коротким ответам.
