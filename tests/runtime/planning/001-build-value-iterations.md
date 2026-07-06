---
id: "planning-001-build-value-iterations"
title: "build value iterations"
stage: "Planning"
prompt: "Переходим к Planning."
expect:
  - "Planning должен предложить roadmap из итераций ценности, не возвращаясь к определению MVP."
  - "Should not: Не спрашивать 'что строим?'. Не выбирать стек."
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

Project Brief completed.

## User Message

```text
Переходим к Planning.
```

## Expected Behavior

Planning должен предложить roadmap из итераций ценности, не возвращаясь к определению MVP.

## Should Not

Не спрашивать 'что строим?'. Не выбирать стек.

## Notes

Проверяет суть Planning.
