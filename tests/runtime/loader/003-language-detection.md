---
id: "loader-003-language-detection"
title: "language detection"
stage: "Loader"
prompt: "Используй Studio OS\\n\\nХочу сделать сервис..."
expect:
  - "Studio OS должна установить Project Language: ru-RU и писать docs/.studio на русском."
  - "Should not: Не писать артефакты на английском без запроса пользователя."
tags: ["loader", "severity:high", "risk:high"]
---
## Metadata

Category: loader  
Stage: Loader  
Severity: High  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Новый проект. Пользователь пишет на русском.

## User Message

```text
Используй Studio OS\n\nХочу сделать сервис...
```

## Expected Behavior

Studio OS должна установить Project Language: ru-RU и писать docs/.studio на русском.

## Should Not

Не писать артефакты на английском без запроса пользователя.

## Notes

Проверяет локализацию.
