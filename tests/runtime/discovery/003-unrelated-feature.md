---
id: "discovery-003-unrelated-feature"
title: "unrelated feature"
stage: "Discovery"
prompt: "I want to add a Snake game."
expect:
  - "Studio OS should classify this as a potential new feature/topic switch and clarify intent."
  - "Should not: Add it to Discovery Summary automatically."
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

Discovery asks the user to confirm understanding.

## User Message

```text
I want to add a Snake game.
```

## Expected Behavior

Studio OS should classify this as a potential new feature/topic switch and clarify intent.

## Should Not

Do not add it to Discovery Summary automatically.

## Notes

Verifies Conversation Router inside a stage.
