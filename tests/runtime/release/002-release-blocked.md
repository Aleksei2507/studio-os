---
id: "release-002-release-blocked"
title: "release blocked"
stage: "Release"
prompt: "Release anyway."
expect:
  - "Studio OS should warn about blockers and request explicit risk confirmation or return to rework."
  - "Should not: Release silently."
tags: ["release", "severity:high", "risk:high"]
---
## Metadata

Category: release  
Stage: Release  
Severity: High  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

QA has blocking issues.

## User Message

```text
Release anyway.
```

## Expected Behavior

Studio OS should warn about blockers and request explicit risk confirmation or return to rework.

## Should Not

Do not release silently.

## Notes

Verifies the release gate.
