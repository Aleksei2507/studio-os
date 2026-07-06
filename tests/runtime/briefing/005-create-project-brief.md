---
id: "briefing-005-create-project-brief"
title: "create project brief"
stage: "Briefing"
prompt: "Да, создавай brief."
expect:
  - "Studio OS должна создать docs/project-brief.md на Project Language и обновить Project Memory компактно."
  - "Should not: Не дублировать весь brief в active-context.md."
tags: ["briefing", "severity:high", "risk:medium"]
---
## Metadata

Category: briefing  
Stage: Briefing  
Severity: High  
Regression Risk: Medium

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

MVP decisions confirmed.

## User Message

```text
Да, создавай brief.
```

## Expected Behavior

Studio OS должна создать docs/project-brief.md на Project Language и обновить Project Memory компактно.

## Should Not

Не дублировать весь brief в active-context.md.

## Notes

Проверяет артефакт и память.
