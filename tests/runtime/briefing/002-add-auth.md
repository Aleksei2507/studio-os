---
id: "briefing-002-add-auth"
title: "add auth"
stage: "Briefing"
prompt: "Хочу добавить авторизацию пользователей."
expect:
  - "Studio OS должна определить scope change и спросить, какую проблему решает авторизация, до включения в MVP."
  - "Should not: Не добавлять авторизацию автоматически. Не уходить в реализацию."
tags: ["briefing", "severity:high", "risk:high"]
---
## Metadata

Category: briefing  
Stage: Briefing  
Severity: High  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Briefing обсуждает MVP без авторизации.

## User Message

```text
Хочу добавить авторизацию пользователей.
```

## Expected Behavior

Studio OS должна определить scope change и спросить, какую проблему решает авторизация, до включения в MVP.

## Should Not

Не добавлять авторизацию автоматически. Не уходить в реализацию.

## Notes

Проверяет защиту MVP.
