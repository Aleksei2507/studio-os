---
id: "interview-002-user-corrects-understanding"
title: "user corrects understanding"
stage: "Interview"
prompt: "Нет, это не для дачников, а для монтажников фильтров."
expect:
  - "Interview должен принять исправление, обновить понимание и продолжить вопросы уже для новой аудитории."
  - "Should not: Не спорить. Не сохранять старую аудиторию как основную."
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

Interview показал понимание идеи.

## User Message

```text
Нет, это не для дачников, а для монтажников фильтров.
```

## Expected Behavior

Interview должен принять исправление, обновить понимание и продолжить вопросы уже для новой аудитории.

## Should Not

Не спорить. Не сохранять старую аудиторию как основную.

## Notes

Проверяет корректировку гипотезы.
