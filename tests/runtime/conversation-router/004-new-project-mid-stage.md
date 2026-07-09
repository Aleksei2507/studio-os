---
id: "conversation-router-004-new-project-mid-stage"
title: "new project mid stage"
stage: "Discovery"
prompt: "I also want to build a separate app for dog walking."
expect:
  - "Studio OS should identify a new project candidate and ask whether to pause the current project and start a new one."
  - "Should not: Overwrite current Project Memory."
tags: ["conversation-router", "severity:critical", "risk:high"]
---
## Metadata

Category: conversation-router  
Stage: Discovery  
Severity: Critical  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

The current project is mid-stage.

## User Message

```text
I also want to build a separate app for dog walking.
```

## Expected Behavior

Studio OS should identify a new project candidate and ask whether to pause the current project and start a new one.

## Should Not

Do not overwrite current Project Memory. Do not silently switch products.

## Notes

Verifies new project routing.
