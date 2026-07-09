---
id: "loader-004-brownfield-start"
title: "brownfield start"
stage: "Loader"
prompt: "Use Studio OS for this existing project."
expect:
  - "Loader should choose Brownfield when existing source code is present and no .studio/ exists."
  - "Should not: Treat the project as Greenfield."
tags: ["loader", "brownfield", "severity:critical", "risk:high"]
---
## Metadata

Category: loader  
Stage: Loader  
Severity: Critical  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

Existing source code is present and .studio/ is missing.

## User Message

```text
Use Studio OS for this existing project.
```

## Expected Behavior

Loader should choose Brownfield when existing source code is present and no .studio/ exists.

## Should Not

Do not treat the project as Greenfield.

## Notes

Verifies mode detection.
