---
id: "regression-003-active-context-size"
title: "active context size"
stage: "All"
prompt: "Обнови Project Memory."
expect:
  - "Active Context should store references and key decisions, not full duplicated documents."
  - "Should not: Не копировать весь project-brief/roadmap в active-context.md."
tags: ["regression", "severity:medium", "risk:medium"]
---
## Metadata

Category: regression  
Stage: All  
Severity: Medium  
Regression Risk: Medium

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Project has multiple artifacts.

## User Message

```text
Обнови Project Memory.
```

## Expected Behavior

Active Context should store references and key decisions, not full duplicated documents.

## Should Not

Не копировать весь project-brief/roadmap в active-context.md.

## Notes

Проверяет компактную память.
