---
id: "regression-001-language-consistency"
title: "language consistency"
stage: "All"
prompt: "Create the roadmap."
expect:
  - "Studio OS should use Project Language consistently across generated artifacts."
  - "Should not: Mix English headings without a reason."
tags: ["regression", "severity:critical", "risk:high"]
---
## Metadata

Category: regression  
Stage: All  
Severity: Critical  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

Project Language is set.

## User Message

```text
Create the roadmap.
```

## Expected Behavior

Studio OS should use Project Language consistently across generated artifacts.

## Should Not

Do not mix headings from another language without a reason.

## Notes

Verifies localization.
