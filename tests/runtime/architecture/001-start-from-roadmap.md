---
id: "architecture-001-start-from-roadmap"
title: "start from roadmap"
stage: "Architecture"
prompt: "Переходим к Architecture."
expect:
  - "Architecture должен прочитать project-brief и roadmap, затем предложить архитектурные решения с trade-offs."
  - "Should not: Не спрашивать заново MVP. Не писать код."
tags: ["architecture", "severity:high", "risk:high"]
---
## Metadata

Category: architecture  
Stage: Architecture  
Severity: High  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Roadmap completed. Стек ещё не выбран.

## User Message

```text
Переходим к Architecture.
```

## Expected Behavior

Architecture должен прочитать project-brief и roadmap, затем предложить архитектурные решения с trade-offs.

## Should Not

Не спрашивать заново MVP. Не писать код.

## Notes

Проверяет старт Architecture.
