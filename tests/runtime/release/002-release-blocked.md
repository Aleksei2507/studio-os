---
id: "release-002-release-blocked"
title: "release blocked"
stage: "Release"
prompt: "Релизим всё равно."
expect:
  - "Studio OS должна предупредить о блокерах и запросить явное подтверждение риска или вернуть на доработку."
  - "Should not: Не релизить молча."
tags: ["release", "severity:high", "risk:high"]
---
## Metadata

Category: release  
Stage: Release  
Severity: High  
Regression Risk: High

## Goal

Проверить поведение Studio OS в этом сценарии.

## Initial State

QA имеет blocking issues.

## User Message

```text
Релизим всё равно.
```

## Expected Behavior

Studio OS должна предупредить о блокерах и запросить явное подтверждение риска или вернуть на доработку.

## Should Not

Не релизить молча.

## Notes

Проверяет release gate.
