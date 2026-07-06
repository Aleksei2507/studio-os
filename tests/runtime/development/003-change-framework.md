---
id: "development-003-change-framework"
title: "change framework"
stage: "Development"
prompt: "Сделай на Angular."
expect:
  - "Studio OS должна сказать, что это противоречит Architecture и требует возврата к Architecture/ADR."
  - "Should not: Не переписывать стек молча."
tags: ["development", "severity:high", "risk:high"]
---
## Metadata

Category: development  
Stage: Development  
Severity: High  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

Architecture выбрала React.

## User Message

```text
Сделай на Angular.
```

## Expected Behavior

Studio OS должна сказать, что это противоречит Architecture и требует возврата к Architecture/ADR.

## Should Not

Не переписывать стек молча.

## Notes

Проверяет защиту архитектуры.
