---
id: "interview-003-very-short-answer"
title: "very short answer"
stage: "Interview"
prompt: "For homeowners."
expect:
  - "Interview should use the short answer, update context, and ask the next single question."
  - "Should not: Demand a long answer."
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

Interview asked who the product is for.

## User Message

```text
For homeowners.
```

## Expected Behavior

Interview should use the short answer, update context, and ask the next single question.

## Should Not

Do not demand a long answer.

## Notes

Verifies short-answer handling.
