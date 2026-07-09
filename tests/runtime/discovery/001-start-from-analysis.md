---
id: "discovery-001-start-from-analysis"
title: "start from analysis"
stage: "Discovery"
prompt: "Move to Discovery."
expect:
  - "Discovery should first show understanding based on Interview, then ask only truly necessary questions."
  - "Should not: Start with a question without analysis. Repeat Interview."
tags: ["discovery", "severity:high", "risk:high"]
---
## Metadata

Category: discovery  
Stage: Discovery  
Severity: High  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

Interview completed. active-context.md exists.

## User Message

```text
Move to Discovery.
```

## Expected Behavior

Discovery should first show understanding based on Interview, then ask only truly necessary questions.

## Should Not

Do not start with a question without analysis. Do not repeat Interview.

## Notes

Verifies the Interview/Discovery boundary.
