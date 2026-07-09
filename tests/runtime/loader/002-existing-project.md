---
id: "loader-002-existing-project"
title: "existing project"
stage: "Loader"
prompt: "Use Studio OS in this repository."
expect:
  - "Loader should detect existing meaningful source code without .studio/ and start Brownfield Runtime."
  - "Should not: Start Interview for an existing project."
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

The repository has source code but no .studio/ directory.

## User Message

```text
Use Studio OS in this repository.
```

## Expected Behavior

Loader should detect existing meaningful source code without .studio/ and start Brownfield Runtime.

## Should Not

Do not start Interview for an existing project.

## Notes

Verifies Brownfield startup detection.
