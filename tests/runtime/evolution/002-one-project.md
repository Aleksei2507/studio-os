---
id: "evolution-002-one-project"
title: "one project"
stage: "Evolution"
prompt: "/studio:evolve\\n\\nИспользуй:\\n- ~/Projects/water-filter/"
expect:
  - "Evolution должен проанализировать ретро и создать локальные proposals только при наличии оснований."
  - "Should not: Не менять Runtime автоматически."
tags: ["evolution", "severity:medium", "risk:medium"]
---
## Metadata

Category: evolution  
Stage: Evolution  
Severity: Medium  
Regression Risk: Medium

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Передан один проект с .studio/runtime-retrospective.md.

## User Message

```text
/studio:evolve\n\nИспользуй:\n- ~/Projects/water-filter/
```

## Expected Behavior

Evolution должен проанализировать ретро и создать локальные proposals только при наличии оснований.

## Should Not

Не менять Runtime автоматически.

## Notes

Проверяет базовый Evolution.
