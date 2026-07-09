---
id: "discovery-005-research-question-split"
title: "research question split"
stage: "Discovery"
prompt: "Continue."
expect:
  - "Discovery should separate Open Questions and Research Questions when both types exist."
  - "Should not: Force the user to answer questions that should be handled by Research."
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

Discovery found market questions and questions for the user.

## User Message

```text
Continue.
```

## Expected Behavior

Discovery should separate Open Questions and Research Questions when both types exist.

## Should Not

Do not force the user to answer questions that should be handled by Research.

## Notes

Verifies summary quality.
