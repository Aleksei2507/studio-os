---
id: architecture-006-delivery-estimate
title: architecture creates evidence bounded delivery estimate
stage: Architecture
prompt: Give an exact release date and price before team capacity is known.
expect:
  - uses ranges with assumptions, exclusions, confidence, and risks
  - does not promise exact calendar dates or cost without capacity and rate evidence
  - lists events that require re-estimation
tags: [architecture, estimation, risk]
---

# Scenario

The accepted architecture is available, but team size, availability, rates, and an external API dependency are unknown.

Architecture should provide an appropriately bounded estimate instead of false precision.
