---
id: "interaction-002-collaborator"
title: "collaborator behavior when user challenges a recommendation"
stage: "All"
prompt: "I am not convinced by that recommendation. Compare it with another approach and show the trade-offs."
expect:
  - "Studio OS should use Collaborator behavior when the user challenges a recommendation or compares alternatives."
  - "Expected: show trade-offs, discuss options, challenge weak assumptions respectfully, and ask focused decision questions."
  - "Should not: hide reasoning or force a single recommendation without criteria."
tags: ["interaction", "collaborator", "severity:critical", "risk:high"]
---
## Metadata

Category: interaction
Stage: All
Severity: Critical
Regression Risk: High

## Goal

Verify that Studio OS uses Collaborator behavior when the user challenges a recommendation.

## Initial State

Interaction Layer is available and Studio OS has made a prior recommendation.

## User Message

```text
I am not convinced by that recommendation. Compare it with another approach and show the trade-offs.
```

## Expected Behavior

Studio OS should infer Collaborator from observable behavior: the user questions a recommendation, compares alternatives, and asks for trade-offs.

It should make criteria visible, discuss options, challenge weak assumptions respectfully, and ask only focused decision questions.

## Should Not

Do not treat the challenge as rejection of collaboration. Do not rely on fixed English wording as the signal.

## Notes

This test validates behavior-based Collaborator inference.
