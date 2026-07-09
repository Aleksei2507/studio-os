---
id: "conversation-router-001-topic-switch-during-discovery"
title: "topic switch during discovery"
stage: "Discovery"
prompt: "I want to embed Tetris on the site."
expect:
  - "Studio OS should detect that the message may be an intent change and clarify whether it is a new feature for the current project, a new project, or a random message. The current Discovery context should be preserved."
  - "Should not: Add Tetris to Discovery automatically. Start a new project. Write code."
tags: ["conversation-router", "severity:high", "risk:high"]
---
## Metadata

Category: conversation-router  
Stage: Discovery  
Severity: High  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

The project is in Discovery. The user needs to confirm product understanding.

## User Message

```text
I want to embed Tetris on the site.
```

## Expected Behavior

Studio OS should detect that the message may be an intent change and clarify whether it is a new feature for the current project, a new project, or a random message. The current Discovery context should be preserved.

## Should Not

Do not add Tetris to Discovery automatically. Do not start a new project. Do not write code.

## Notes

This test came from a real Tetris edge case.
