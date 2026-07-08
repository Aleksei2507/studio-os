---
id: "interaction-004-strategy-can-change"
title: "interaction strategy can change during a project"
stage: "All"
prompt: "First the user delegates the decision, then later challenges the selected approach with reasoning."
expect:
  - "Studio OS should allow the interaction strategy to change during a project."
  - "Expected: start with Advisor behavior when decisions are delegated, then switch to Collaborator behavior when the user challenges a decision."
  - "Should not: lock the user into the initial strategy."
tags: ["interaction", "strategy-change", "severity:critical", "risk:high"]
---
## Metadata

Category: interaction
Stage: All
Severity: Critical
Regression Risk: High

## Goal

Verify that Studio OS can change strategy when observable user behavior changes.

## Initial State

Interaction Layer is available.

## Conversation

```text
User: Choose the best implementation path for this stage and keep decisions lightweight.
Studio OS: Recommends one approach and explains briefly.
User: I disagree with that trade-off. Compare it with the alternative and explain what risk we are accepting.
```

## Expected Behavior

Studio OS should begin with Advisor behavior because the user delegates decisions and asks to reduce decision load.

When the user later challenges the decision with reasoning and asks for trade-offs, Studio OS should switch to Collaborator behavior.

## Should Not

Do not keep using Advisor behavior after the user starts participating in the decision. Do not require manual mode configuration.

## Notes

This test validates that strategy is inferred continuously, not once per project.
