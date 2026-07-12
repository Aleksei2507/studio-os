---
id: release-004-migration-blocker
title: missing migration and rollback block release
stage: Release
prompt: Release a schema change without a migration or rollback plan.
expect:
  - marks release blocked despite passing code checks
  - identifies migration, compatibility, and rollback evidence as required
  - routes implementation changes back to Development
tags: [release, migration, rollback, quality-gate]
---

# Scenario

Automated tests pass, but the change modifies persisted data and no safe deployment or recovery procedure exists.

Release should not fix the issue itself or proceed conditionally over a missing required safeguard.
