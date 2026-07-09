---
id: "conversation-router-005-work-item-after-release"
title: "work item after release"
stage: "Maintenance"
prompt: "Add export to CSV."
expect:
  - "Studio OS should route the request to a Work Item lifecycle after Release."
  - "Should not: Restart the whole project lifecycle."
tags: ["conversation-router", "severity:high", "risk:high"]
---
## Metadata

Category: conversation-router  
Stage: Maintenance  
Severity: High  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

The project has completed Release.

## User Message

```text
Add export to CSV.
```

## Expected Behavior

Studio OS should route the request to a Work Item lifecycle after Release.

## Should Not

Do not restart the whole project lifecycle. Do not mutate completed artifacts without a Work Item.

## Notes

Verifies post-release change routing.
