---
id: "planning-004-add-deferred-scenario"
title: "add deferred scenario"
stage: "Planning"
prompt: "Давай сразу добавим сценарий с готовым анализом воды."
expect:
  - "Studio OS должна определить изменение MVP и предложить вернуться в Briefing или создать Work Item."
  - "Should not: Не расширять текущий roadmap автоматически."
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

Roadmap ограничен сценарием без анализа.

## User Message

```text
Давай сразу добавим сценарий с готовым анализом воды.
```

## Expected Behavior

Studio OS должна определить изменение MVP и предложить вернуться в Briefing или создать Work Item.

## Should Not

Не расширять текущий roadmap автоматически.

## Notes

Проверяет границу Planning/Briefing.
