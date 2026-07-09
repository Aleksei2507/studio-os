---
id: "regression-004-every-question-changes-artifact"
title: "every question changes artifact"
stage: "All"
prompt: "Continue."
expect:
  - "Every question should be tied to an artifact decision, quality gate, or routing decision."
  - "Should not: Ask curious but useless questions."
tags: ["regression", "severity:high", "risk:high"]
---
## Metadata

Category: regression  
Stage: All  
Severity: High  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

Runtime is about to ask a question.

## User Message

```text
Continue.
```

## Expected Behavior

Every question should be tied to an artifact decision, quality gate, or routing decision.

## Should Not

Do not ask curious but useless questions.

## Notes

Verifies the main principle.
