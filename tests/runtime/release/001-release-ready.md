---
id: "release-001-release-ready"
title: "release ready"
stage: "Release"
prompt: "Prepare the release."
expect:
  - "Release should create release notes, record version/limitations, and suggest Retrospective."
  - "Should not: Skip release notes."
tags: ["release", "severity:high", "risk:high"]
---
## Metadata

Category: release  
Stage: Release  
Severity: High  
Regression Risk: High

## Goal

Verify Studio OS behavior in this scenario.

## Initial State

QA passed.

## User Message

```text
Prepare the release.
```

## Expected Behavior

Release should create release notes, record version/limitations, and suggest Retrospective.

## Should Not

Do not skip release notes.

## Notes

Verifies project completion.
