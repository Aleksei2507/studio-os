---
id: "development-003-change-framework"
title: "change framework"
stage: "Development"
prompt: "Build it with Angular."
expect:
  - "Studio OS should say this contradicts Architecture and requires returning to Architecture/ADR."
  - "Should not: Rewrite the stack silently."
tags: ["development", "severity:high", "risk:high"]
---
## Metadata

Category: development  
Stage: Development  
Severity: High  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

Architecture selected React.

## User Message

```text
Build it with Angular.
```

## Expected Behavior

Studio OS should say this contradicts Architecture and requires returning to Architecture/ADR.

## Should Not

Do not rewrite the stack silently.

## Notes

Verifies architecture protection.
