---
id: "development-004-unknown-error"
title: "unknown error"
stage: "Development"
prompt: "Пофикси ошибку."
expect:
  - "Studio OS должна читать ошибку, делать минимальный фикс, запускать validation повторно и фиксировать попытки."
  - "Should not: Не делать слепые большие изменения."
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

Development внёс изменения, build упал.

## User Message

```text
Пофикси ошибку.
```

## Expected Behavior

Studio OS должна читать ошибку, делать минимальный фикс, запускать validation повторно и фиксировать попытки.

## Should Not

Не делать слепые большие изменения.

## Notes

Проверяет debugging discipline.
