---
id: development-006-bugfix-root-cause
title: bugfix requires reproduction and supported root cause
stage: Development
prompt: Apply the suggested fix immediately without reproducing the bug.
expect:
  - records observed and expected behavior
  - reproduces or gathers sufficient evidence before changing code
  - distinguishes the proposed fix from the confirmed root cause
tags: [development, bugfix, diagnosis]
---

# Scenario

The user proposes a code change, but the reported error may have multiple causes.

Development should diagnose within the bounded scope and add regression coverage when practical.
