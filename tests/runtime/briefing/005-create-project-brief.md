---
id: "briefing-005-create-project-brief"
title: "create project brief"
stage: "Briefing"
prompt: "Yes, create the brief."
expect:
  - "Studio OS should create docs/project-brief.md in the Project Language and update Project Memory compactly."
  - "Should not: Duplicate the whole brief in active-context.md."
tags: ["briefing", "severity:high", "risk:medium"]
---
## Metadata

Category: briefing  
Stage: Briefing  
Severity: Medium  
Regression Risk: Medium

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

Briefing decisions have been confirmed.

## User Message

```text
Yes, create the brief.
```

## Expected Behavior

Studio OS should create docs/project-brief.md in the Project Language and update Project Memory compactly.

## Should Not

Do not duplicate the whole brief in active-context.md.

## Notes

Verifies the artifact and memory update.
