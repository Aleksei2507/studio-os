---
id: "architecture-001-start-from-roadmap"
title: "start from roadmap"
stage: "Architecture"
prompt: "Move to Architecture."
expect:
  - "Architecture should read project-brief and roadmap, then propose architectural decisions with trade-offs."
  - "Should not: Ask for the MVP again. Write code."
tags: ["architecture", "severity:high", "risk:high"]
---
## Metadata

Category: architecture  
Stage: Architecture  
Severity: High  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

Roadmap is completed. The stack has not been selected yet.

## User Message

```text
Move to Architecture.
```

## Expected Behavior

Architecture should read project-brief and roadmap, then propose architectural decisions with trade-offs.

## Should Not

Do not ask for the MVP again. Do not write code.

## Notes

Verifies the Architecture start boundary.
