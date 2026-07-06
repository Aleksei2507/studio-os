---
id: "architecture-002-premature-stack-command"
title: "premature stack command"
stage: "Architecture"
prompt: "Давай MongoDB."
expect:
  - "Studio OS должна спросить, какую проблему решает MongoDB, и сравнить trade-offs с требованиями проекта."
  - "Should not: Не соглашаться без анализа."
tags: ["architecture", "severity:medium", "risk:medium"]
---
## Metadata

Category: architecture  
Stage: Architecture  
Severity: Medium  
Regression Risk: Medium

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Architecture обсуждает решения.

## User Message

```text
Давай MongoDB.
```

## Expected Behavior

Studio OS должна спросить, какую проблему решает MongoDB, и сравнить trade-offs с требованиями проекта.

## Should Not

Не соглашаться без анализа.

## Notes

Проверяет обоснование технологий.
