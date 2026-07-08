---
id: "interaction-006-language-agnostic"
title: "language agnostic strategy inference"
stage: "All"
prompt: "Interaction strategy must be inferred from behavior, not language-specific fixed phrases."
expect:
  - "Studio OS should infer interaction strategy from observable behavior rather than fixed Russian or English phrases."
  - "Expected: equivalent behavior in any project language should produce the same strategy."
  - "Should not: depend on phrase matching in Russian, English, or any other language."
tags: ["interaction", "language-agnostic", "severity:critical", "risk:high"]
---
## Metadata

Category: interaction
Stage: All
Severity: Critical
Regression Risk: High

## Goal

Verify that Interaction Layer is language-agnostic.

## Initial State

Interaction Layer is available.

## Scenario

Two users communicate in different languages, but both show the same observable behavior:

- they delegate decisions;
- they provide goals and constraints;
- they ask Studio OS to reduce decision load.

## Expected Behavior

Studio OS should infer the same strategy from the shared behavior, regardless of the language used.

The implementation must describe behavior patterns and must not use fixed Russian or English phrases as primary signals.

## Should Not

Do not use language-specific phrase matching. Do not make strategy depend on whether the message is written in Russian or English.

## Notes

This test validates language-agnostic Interaction Layer behavior.
