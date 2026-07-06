---
id: "planning-003-remove-knowledge-base"
title: "remove knowledge base"
stage: "Planning"
prompt: "Давай удалим первую итерацию Knowledge Base."
expect:
  - "Studio OS должна объяснить последствия: без базы знаний MVP не сможет ответственно работать, и запросить подтверждение scope/risk decision."
  - "Should not: Не удалять молча."
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

Roadmap начинается с Knowledge Base.

## User Message

```text
Давай удалим первую итерацию Knowledge Base.
```

## Expected Behavior

Studio OS должна объяснить последствия: без базы знаний MVP не сможет ответственно работать, и запросить подтверждение scope/risk decision.

## Should Not

Не удалять молча.

## Notes

Проверяет способность спорить с пользователем.
