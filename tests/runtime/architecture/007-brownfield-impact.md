---
id: architecture-007-brownfield-impact
title: work item architecture limits itself to impact
stage: Architecture
prompt: Add one integration to the existing product.
expect:
  - inspects current architecture and affected contracts
  - preserves unrelated stable areas
  - creates an ADR only when an accepted decision or boundary changes
tags: [architecture, brownfield, work-item]
---

# Scenario

The requested feature affects one existing component and an external interface.

Architecture should document impact, migration, and failure handling without redesigning the whole system.
