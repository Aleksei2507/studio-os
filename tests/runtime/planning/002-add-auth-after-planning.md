---
id: "planning-002-add-auth-after-planning"
title: "add auth after planning"
stage: "Planning"
prompt: "Хочу добавить авторизацию пользователей."
expect:
  - "Studio OS должна сказать, что это scope change, спросить зачем и предложить Work Item или возврат к Briefing."
  - "Should not: Не добавлять итерацию молча. Не идти сразу в Architecture."
tags: ["planning", "severity:high", "risk:high"]
---
## Metadata

Category: planning  
Stage: Planning  
Severity: High  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Planning completed. Roadmap есть.

## User Message

```text
Хочу добавить авторизацию пользователей.
```

## Expected Behavior

Studio OS должна сказать, что это scope change, спросить зачем и предложить Work Item или возврат к Briefing.

## Should Not

Не добавлять итерацию молча. Не идти сразу в Architecture.

## Notes

Проверяет защиту roadmap.
