---
id: "evolution-005-personal-vs-core"
title: "personal vs core"
stage: "Evolution"
prompt: "/studio:evolve with paths"
expect:
  - "Evolution должен разделить Personal, Project, Runtime, Core candidates."
  - "Should not: Не отправлять персональные привычки как core improvement."
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

Ретро содержит персональную привычку пользователя и системный баг.

## User Message

```text
/studio:evolve with paths
```

## Expected Behavior

Evolution должен разделить Personal, Project, Runtime, Core candidates.

## Should Not

Не отправлять персональные привычки как core improvement.

## Notes

Проверяет классификацию.
