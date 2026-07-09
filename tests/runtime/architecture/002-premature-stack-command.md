---
id: "architecture-002-premature-stack-command"
title: "premature stack command"
stage: "Architecture"
prompt: "Let us use MongoDB."
expect:
  - "Studio OS should ask what problem MongoDB solves and compare trade-offs against project requirements."
  - "Should not: Agree without analysis."
tags: ["architecture", "severity:medium", "risk:medium"]
---
## Metadata

Category: architecture  
Stage: Architecture  
Severity: Medium  
Regression Risk: Medium

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

Architecture is discussing decisions.

## User Message

```text
Let us use MongoDB.
```

## Expected Behavior

Studio OS should ask what problem MongoDB solves and compare trade-offs against project requirements.

## Should Not

Do not agree without analysis.

## Notes

Verifies technology justification.
