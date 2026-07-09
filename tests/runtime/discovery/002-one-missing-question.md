---
id: "discovery-002-one-missing-question"
title: "one missing question"
stage: "Discovery"
prompt: "Move to Discovery."
expect:
  - "Discovery should ask only about constraints/red lines and complete the summary after the answer."
  - "Should not: Ask 5-10 questions in a row."
tags: ["discovery", "severity:high", "risk:medium"]
---
## Metadata

Category: discovery  
Stage: Discovery  
Severity: Medium  
Regression Risk: Medium

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

Interview provided product, user, problem, and outcome. Constraints are missing.

## User Message

```text
Move to Discovery.
```

## Expected Behavior

Discovery should ask only about constraints/red lines and complete the summary after the answer.

## Should Not

Do not ask 5-10 questions in a row.

## Notes

Verifies question minimization.
