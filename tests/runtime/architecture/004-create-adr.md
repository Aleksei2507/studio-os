---
id: "architecture-004-create-adr"
title: "create adr"
stage: "Architecture"
prompt: "Yes, record the decision."
expect:
  - "Studio OS should create an ADR in docs/adr/ and link it to architecture.md."
  - "Should not: Leave an important decision only in chat."
tags: ["architecture", "severity:high", "risk:medium"]
---
## Metadata

Category: architecture  
Stage: Architecture  
Severity: Medium  
Regression Risk: Medium

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

An important architectural decision has been accepted.

## User Message

```text
Yes, record the decision.
```

## Expected Behavior

Studio OS should create an ADR in docs/adr/ and link it to architecture.md.

## Should Not

Do not leave an important decision only in chat.

## Notes

Verifies ADR discipline.
