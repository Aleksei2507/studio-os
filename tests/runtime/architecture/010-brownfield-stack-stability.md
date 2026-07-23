---
id: architecture-010-brownfield-stack-stability
title: brownfield technology remains stable without evidence for migration
stage: Architecture
prompt: I personally prefer another framework. Replace the existing stack while implementing this bounded feature.
expect:
  - prefers the existing stack when it can satisfy accepted requirements
  - treats the observed active Design System Profile as a compatibility constraint
  - does not treat personal familiarity as sufficient migration evidence
  - requires impact analysis, migration, rollback, and an ADR before a stack change
tags: [architecture, brownfield, migration]
---

# Scenario

The existing production stack and observed design system are supported and satisfy the feature requirements. The user has experience with another framework but provides no product or maintenance constraint requiring migration.
