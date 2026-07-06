---
id: "discovery-001-start-from-analysis"
title: "start from analysis"
stage: "Discovery"
prompt: "Переходим к Discovery."
expect:
  - "Discovery должен сначала показать понимание на основе Interview, затем задать только действительно нужные вопросы."
  - "Should not: Не начинать с вопроса без анализа. Не повторять Interview."
tags: ["discovery", "severity:high", "risk:high"]
---
## Metadata

Category: discovery  
Stage: Discovery  
Severity: High  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Interview completed. Есть active-context.md.

## User Message

```text
Переходим к Discovery.
```

## Expected Behavior

Discovery должен сначала показать понимание на основе Interview, затем задать только действительно нужные вопросы.

## Should Not

Не начинать с вопроса без анализа. Не повторять Interview.

## Notes

Проверяет границу Interview/Discovery.
