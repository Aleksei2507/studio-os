---
id: "planning-004-add-deferred-scenario"
title: "add deferred scenario"
stage: "Planning"
prompt: "Let us immediately add the scenario with ready water analysis results."
expect:
  - "Studio OS should identify an MVP change and suggest returning to Briefing or creating a Work Item."
  - "Should not: Expand the current roadmap automatically."
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

The roadmap is limited to the no-analysis scenario.

## User Message

```text
Let us immediately add the scenario with ready water analysis results.
```

## Expected Behavior

Studio OS should identify an MVP change and suggest returning to Briefing or creating a Work Item.

## Should Not

Do not expand the current roadmap automatically.

## Notes

Verifies the Planning/Briefing boundary.
