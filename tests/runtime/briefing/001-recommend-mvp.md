---
id: "briefing-001-recommend-mvp"
title: "recommend mvp"
stage: "Briefing"
prompt: "Move to Briefing."
expect:
  - "Briefing should recommend an MVP decision based on Discovery with why/trade-offs instead of asking what belongs in the MVP."
  - "Should not: Start a new interview. Choose the stack."
tags: ["briefing", "severity:high", "risk:high"]
---
## Metadata

Category: briefing  
Stage: Briefing  
Severity: High  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

Discovery is completed and Project Memory contains product understanding.

## User Message

```text
Move to Briefing.
```

## Expected Behavior

Briefing should recommend an MVP decision based on Discovery with why/trade-offs instead of asking what belongs in the MVP.

## Should Not

Do not start a new interview. Do not choose the stack.

## Notes

Verifies Briefing as Product Decisions.
