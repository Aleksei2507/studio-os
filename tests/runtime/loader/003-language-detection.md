---
id: "loader-003-language-detection"
title: "language detection"
stage: "Loader"
prompt: "Use Studio OS\n\nI want to build a service..."
expect:
  - "Studio OS should set Project Language: en-US and write docs/.studio in English."
  - "Should not: Write artifacts in another language without a user request."
tags: ["loader", "severity:high", "risk:high"]
---
## Metadata

Category: loader  
Stage: Loader  
Severity: High  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

New project. The user writes in English.

## User Message

```text
Use Studio OS

I want to build a service...
```

## Expected Behavior

Studio OS should set Project Language: en-US and write docs/.studio in English.

## Should Not

Do not write artifacts in another language without a user request.

## Notes

Verifies localization.
