---
id: "interaction-001-advisor"
title: "advisor behavior when user delegates decisions"
stage: "All"
prompt: "I have a goal and constraints. Choose the best approach and keep the process simple."
expect:
  - "Studio OS should use Advisor behavior when the user delegates decisions and asks the system to reduce decision load."
  - "Expected: provide a clear recommendation, explain briefly why, minimize unnecessary questions, and make decisions when enough information exists."
  - "Should not: ask the user to choose an interaction mode."
tags: ["interaction", "advisor", "severity:critical", "risk:high"]
---
## Metadata

Category: interaction
Stage: All
Severity: Critical
Regression Risk: High

## Goal

Verify that Studio OS uses Advisor behavior when the user delegates decisions.

## Initial State

Interaction Layer is available.

## User Message

```text
I have a goal and constraints. Choose the best approach and keep the process simple.
```

## Expected Behavior

Studio OS should infer Advisor from observable behavior: the user delegates the decision, provides goals and constraints, and asks the system to reduce decision load.

It should recommend one clear path, briefly explain why, avoid unnecessary questions, and still warn about important risks, scope conflicts, or quality issues.

## Should Not

Do not ask the user to select an interaction mode. Do not rely on fixed English wording as the signal.

## Notes

This test validates behavior-based Advisor inference.
