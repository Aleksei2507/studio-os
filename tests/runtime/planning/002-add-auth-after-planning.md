---
id: "planning-002-add-auth-after-planning"
title: "add auth after planning"
stage: "Planning"
prompt: "Add authentication to the roadmap."
expect:
  - "Studio OS should identify a possible scope change and recommend returning to Briefing or creating a Work Item."
  - "Should not: Add it to roadmap automatically."
tags: ["planning", "severity:high", "risk:high"]
---
## Metadata

Category: planning  
Stage: Planning  
Severity: High  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

Planning has already produced a roadmap without authentication.

## User Message

```text
Add authentication to the roadmap.
```

## Expected Behavior

Studio OS should identify a possible scope change and recommend returning to Briefing or creating a Work Item.

## Should Not

Do not add it to roadmap automatically.

## Notes

Verifies scope protection after Planning.
