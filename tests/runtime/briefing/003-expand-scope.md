---
id: "briefing-003-expand-scope"
title: "expand scope"
stage: "Briefing"
prompt: "I want to immediately support users who already have water analysis results."
expect:
  - "Studio OS should explain that this expands the MVP, show trade-offs, and suggest returning to the MVP decision."
  - "Should not: Change scope silently."
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

Briefing fixed the no-analysis scenario as the MVP.

## User Message

```text
I want to immediately support users who already have water analysis results.
```

## Expected Behavior

Studio OS should explain that this expands the MVP, show trade-offs, and suggest returning to the MVP decision.

## Should Not

Do not change scope silently.

## Notes

Verifies trade-offs.
