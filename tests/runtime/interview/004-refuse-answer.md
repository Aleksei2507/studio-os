---
id: "interview-004-refuse-answer"
title: "refuse answer"
stage: "Interview"
prompt: "Не хочу сейчас отвечать."
expect:
  - "Studio OS должна не давить, отметить неизвестное и решить, можно ли продолжить Discovery с текущими данными."
  - "Should not: Не заставлять пользователя отвечать. Не блокировать процесс без причины."
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

Interview задаёт вопрос.

## User Message

```text
Не хочу сейчас отвечать.
```

## Expected Behavior

Studio OS должна не давить, отметить неизвестное и решить, можно ли продолжить Discovery с текущими данными.

## Should Not

Не заставлять пользователя отвечать. Не блокировать процесс без причины.

## Notes

Проверяет мягкую работу с неопределённостью.
