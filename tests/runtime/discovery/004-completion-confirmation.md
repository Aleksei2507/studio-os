---
id: "discovery-004-completion-confirmation"
title: "completion confirmation"
stage: "Discovery"
prompt: "Confirmed."
expect:
  - "Studio OS should create docs/discovery-summary.md, update .studio, and suggest Briefing without auto-starting it."
  - "Should not: Start Briefing automatically."
tags: ["discovery", "severity:medium", "risk:medium"]
---
## Metadata

Category: discovery  
Stage: Discovery  
Severity: Medium  
Regression Risk: Medium

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

Discovery prepared the summary.

## User Message

```text
Confirmed.
```

## Expected Behavior

Studio OS should create docs/discovery-summary.md, update .studio, and suggest Briefing without auto-starting it.

## Should Not

Do not start Briefing automatically.

## Notes

Verifies stage completion.
