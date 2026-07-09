---
id: "interview-004-refuse-answer"
title: "refuse answer"
stage: "Interview"
prompt: "I do not know yet."
expect:
  - "Interview should record uncertainty and continue with a question that can reduce it."
  - "Should not: Block progress completely."
tags: ["interview", "severity:medium", "risk:medium"]
---
## Metadata

Category: interview  
Stage: Interview  
Severity: Medium  
Regression Risk: Medium

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

Interview asked a question the user cannot answer yet.

## User Message

```text
I do not know yet.
```

## Expected Behavior

Interview should record uncertainty and continue with a question that can reduce it.

## Should Not

Do not block progress completely. Do not invent certainty.

## Notes

Verifies uncertainty handling.
