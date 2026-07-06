---
id: "evolution-003-multiple-projects"
title: "multiple projects"
stage: "Evolution"
prompt: "/studio:evolve\\n\\nИспользуй:\\n- ~/Projects/a/\\n- ~/Projects/b/\\n- ~/Projects/c/"
expect:
  - "Evolution должен искать повторяющиеся закономерности между проектами и классифицировать предложения."
  - "Should not: Не смешивать содержимое проектов. Не публиковать PR автоматически."
tags: ["evolution", "severity:high", "risk:high"]
---
## Metadata

Category: evolution  
Stage: Evolution  
Severity: High  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Переданы три проекта с ретро.

## User Message

```text
/studio:evolve\n\nИспользуй:\n- ~/Projects/a/\n- ~/Projects/b/\n- ~/Projects/c/
```

## Expected Behavior

Evolution должен искать повторяющиеся закономерности между проектами и классифицировать предложения.

## Should Not

Не смешивать содержимое проектов. Не публиковать PR автоматически.

## Notes

Проверяет multi-project analysis.
