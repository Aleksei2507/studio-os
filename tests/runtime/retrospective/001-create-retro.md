---
id: "retrospective-001-create-retro"
title: "create retro"
stage: "Retrospective"
prompt: "Проведи ретроспективу."
expect:
  - "Retrospective должен собрать objective observations, задать минимум вопросов и создать .studio/runtime-retrospective.md."
  - "Should not: Не создавать proposals. Не менять Runtime."
tags: ["retrospective", "severity:high", "risk:high"]
---
## Metadata

Category: retrospective  
Stage: Retrospective  
Severity: High  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Project released.

## User Message

```text
Проведи ретроспективу.
```

## Expected Behavior

Retrospective должен собрать objective observations, задать минимум вопросов и создать .studio/runtime-retrospective.md.

## Should Not

Не создавать proposals. Не менять Runtime.

## Notes

Проверяет роль Retrospective.
