---
id: "discovery-005-research-question-split"
title: "research question split"
stage: "Discovery"
prompt: "Продолжай."
expect:
  - "Discovery должен разделить Open Questions и Research Questions, если оба типа есть."
  - "Should not: Не заставлять пользователя отвечать на вопросы, которые должны решаться Research."
tags: ["discovery", "severity:medium", "risk:medium"]
---
## Metadata

Category: discovery  
Stage: Discovery  
Severity: Medium  
Regression Risk: Medium

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Discovery нашёл вопросы про рынок и вопросы к пользователю.

## User Message

```text
Продолжай.
```

## Expected Behavior

Discovery должен разделить Open Questions и Research Questions, если оба типа есть.

## Should Not

Не заставлять пользователя отвечать на вопросы, которые должны решаться Research.

## Notes

Проверяет качество summary.
