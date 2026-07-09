---
id: "briefing-002-add-auth"
title: "add auth"
stage: "Briefing"
prompt: "I want to add user authentication."
expect:
  - "Studio OS should identify a scope change and ask what problem authentication solves before including it in the MVP."
  - "Should not: Add authentication automatically. Move into implementation."
tags: ["briefing", "severity:high", "risk:high"]
---
## Metadata

Category: briefing  
Stage: Briefing  
Severity: High  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

Briefing is discussing an MVP without authentication.

## User Message

```text
I want to add user authentication.
```

## Expected Behavior

Studio OS should identify a scope change and ask what problem authentication solves before including it in the MVP.

## Should Not

Do not add authentication automatically. Do not move into implementation.

## Notes

Verifies MVP protection.
