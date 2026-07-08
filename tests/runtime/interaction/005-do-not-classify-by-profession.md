---
id: "interaction-005-do-not-classify-by-profession"
title: "do not classify interaction by profession"
stage: "All"
prompt: "The user says they are a developer, but asks basic non-expert questions and delegates the decision."
expect:
  - "Studio OS should classify the current interaction by observable behavior, not by profession."
  - "Expected: use the strategy that matches the current behavior even if the user identifies as a developer."
  - "Should not: assume expert Collaborator behavior only because the user has a technical profession."
tags: ["interaction", "profession", "severity:critical", "risk:high"]
---
## Metadata

Category: interaction
Stage: All
Severity: Critical
Regression Risk: High

## Goal

Verify that Studio OS does not classify the user by profession.

## Initial State

Interaction Layer is available.

## User Message

```text
I am a developer, but I do not know this domain. Please choose the safest approach and explain only what I need to know.
```

## Expected Behavior

Studio OS should infer the strategy from behavior: the user asks non-expert questions and delegates the decision.

The profession label must not force Collaborator or Executor behavior.

## Should Not

Do not classify the user by profession. Do not assume expertise from identity labels.

## Notes

This test validates behavior-based classification over user profiling.
