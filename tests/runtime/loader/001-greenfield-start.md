---
id: "loader-001-greenfield-start"
title: "greenfield start"
stage: "Loader"
prompt: "Use Studio OS. I want to build a product for water filter selection."
expect:
  - "Loader should detect Greenfield mode and start Interview directly."
  - "Should not: Ask whether to start Interview when the product idea is already provided."
tags: ["loader", "severity:critical", "risk:high"]
---
## Metadata

Category: loader  
Stage: Loader  
Severity: Critical  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

No .studio/ directory and no meaningful source code exist.

## User Message

```text
Use Studio OS. I want to build a product for water filter selection.
```

## Expected Behavior

Loader should detect Greenfield mode and start Interview directly.

## Should Not

Do not ask whether to start Interview when the product idea is already provided.

## Notes

Verifies Greenfield startup.
