---
id: "interaction-003-executor"
title: "executor behavior for concrete bounded instruction"
stage: "All"
prompt: "Add the missing regression test file and run the runtime dry check. Do not change anything else."
expect:
  - "Studio OS should use Executor behavior when the user gives a concrete bounded instruction."
  - "Expected: execute the requested change, keep the response short and action-oriented, and warn only on conflicts with constraints or quality gates."
  - "Should not: reinterpret the concrete request as a broad discovery process."
tags: ["interaction", "executor", "severity:critical", "risk:high"]
---
## Metadata

Category: interaction
Stage: All
Severity: Critical
Regression Risk: High

## Goal

Verify that Studio OS uses Executor behavior when the user gives a concrete bounded instruction.

## Initial State

Interaction Layer is available.

## User Message

```text
Add the missing regression test file and run the runtime dry check. Do not change anything else.
```

## Expected Behavior

Studio OS should infer Executor from observable behavior: the decision is already made, the task is bounded, and the user expects execution rather than exploration.

It should perform the requested work, avoid broad methodology discussion, and report the result concisely.

## Should Not

Do not ask the user to choose a strategy. Do not expand project scope.

## Notes

This test validates behavior-based Executor inference.
