---
id: "architecture-004-create-adr"
title: "create adr"
stage: "Architecture"
prompt: "Да, фиксируй решение."
expect:
  - "Studio OS должна создать ADR в docs/adr/ и связать его с architecture.md."
  - "Should not: Не оставлять важное решение только в чате."
tags: ["architecture", "severity:high", "risk:medium"]
---
## Metadata

Category: architecture  
Stage: Architecture  
Severity: High  
Regression Risk: Medium

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Принято важное архитектурное решение.

## User Message

```text
Да, фиксируй решение.
```

## Expected Behavior

Studio OS должна создать ADR в docs/adr/ и связать его с architecture.md.

## Should Not

Не оставлять важное решение только в чате.

## Notes

Проверяет ADR discipline.
