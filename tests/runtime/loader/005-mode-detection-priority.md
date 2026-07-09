---
id: "loader-005-mode-detection-priority"
title: "mode detection priority"
stage: "Loader"
prompt: "Continue Studio OS."
expect:
  - "Loader should prioritize existing .studio/ Project Memory over source-code detection."
  - "Should not: Restart Brownfield onboarding when .studio/ already exists."
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

.studio/ exists in a repository with source code.

## User Message

```text
Continue Studio OS.
```

## Expected Behavior

Loader should prioritize existing .studio/ Project Memory over source-code detection.

## Should Not

Do not restart Brownfield onboarding when .studio/ already exists.

## Notes

Verifies detection priority.
