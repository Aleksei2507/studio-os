---
id: "discovery-002-one-missing-question"
title: "one missing question"
stage: "Discovery"
prompt: "Переходим к Discovery."
expect:
  - "Discovery должен задать только вопрос про ограничения/красные линии и после ответа завершить summary."
  - "Should not: Не задавать 5–10 вопросов подряд."
tags: ["discovery", "severity:high", "risk:medium"]
---
## Metadata

Category: discovery  
Stage: Discovery  
Severity: High  
Regression Risk: Medium

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Interview дал продукт, пользователя, проблему, результат. Не хватает constraints.

## User Message

```text
Переходим к Discovery.
```

## Expected Behavior

Discovery должен задать только вопрос про ограничения/красные линии и после ответа завершить summary.

## Should Not

Не задавать 5–10 вопросов подряд.

## Notes

Проверяет минимизацию вопросов.
