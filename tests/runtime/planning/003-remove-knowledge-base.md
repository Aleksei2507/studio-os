---
id: "planning-003-remove-knowledge-base"
title: "remove knowledge base"
stage: "Planning"
prompt: "Remove the knowledge base from the plan."
expect:
  - "Studio OS should explain which roadmap items and product decisions are affected and ask for confirmation."
  - "Should not: Delete related plan parts silently."
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

The roadmap depends on a knowledge base.

## User Message

```text
Remove the knowledge base from the plan.
```

## Expected Behavior

Studio OS should explain which roadmap items and product decisions are affected and ask for confirmation.

## Should Not

Do not delete related plan parts silently.

## Notes

Verifies change impact handling.
