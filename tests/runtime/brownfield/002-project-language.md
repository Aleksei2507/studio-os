---
id: "brownfield-002-project-language"
title: "project language from memory"
stage: "Brownfield Onboarding"
prompt: "Analyze this existing project."
expect:
  - "Brownfield Runtime should use Project Language from Project Memory for created and updated artifacts."
  - "Should not: Change Project Language automatically because of the current message language or source code language."
tags: ["brownfield", "language", "severity:critical", "risk:high"]
---
## Metadata

Category: brownfield  
Stage: Brownfield Onboarding  
Severity: Critical  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

`.studio/project-state.md` already contains:

```text
Project Language: ru-RU
```

The user writes in English, while source code and README may be in another language.

## User Message

```text
Analyze this existing project.
```

## Expected Behavior

Brownfield Runtime should continue working in the language specified by Project Memory.

`Project Language` should not change automatically.

## Should Not

Do not change project language based on the current message language. Do not change project language based on README or source code language. Do not rewrite existing artifacts in another language.

## Notes

Verifies Project Language stability after Brownfield bootstrap.
