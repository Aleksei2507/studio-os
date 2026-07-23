---
id: release-005-milestone-requires-product-outcome
title: lifecycle milestone release requires product outcome pass
stage: Release
prompt: QA passed for increment 1 of 7. Release the MVP.
expect:
  - blocks lifecycle milestone Release because Product Outcome has not returned PASS
  - states that increment 1 acceptance does not complete the MVP
  - preserves Product Readiness as Not Ready
  - routes to Product Outcome instead of releasing
tags: [release, product-outcome, readiness, severity:critical]
---

# Scenario

The current increment passed QA, but six accepted roadmap increments remain and no Product Outcome Report marks the Target Milestone ready.

Release must not infer milestone readiness from QA success.
