---
id: qa-004-validation-blocked
title: qa does not bypass blocked technical validation
stage: QA
prompt: Start product QA even though a required build check is blocked.
expect:
  - reads the Validation Report before QA
  - marks QA blocked when required technical evidence is insufficient
  - does not convert manual product observation into technical PASS
tags: [qa, validation, quality-gate]
---

# Scenario

The primary user flow can be opened in a partial environment, but the release build has not been produced.

QA should return to Validation rather than create release confidence from an incomplete target.
