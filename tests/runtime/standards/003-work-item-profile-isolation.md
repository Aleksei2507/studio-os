---
id: standards-003-work-item-profile-isolation
title: work item standards remain isolated until release
stage: Architecture
prompt: Accept a different technology and standards profile for this active Work Item.
expect:
  - "creates or updates work-items/<id>/standards-profile.md for the accepted Work Item decision"
  - does not overwrite the canonical project standards profile before successful Release
  - uses the Work Item profile for Development Validation QA and Release of that Work Item
tags: [standards, work-item, isolation]
---

# Scenario

An active Work Item has an accepted Architecture decision that changes a technical boundary. The released product still uses the canonical stack until the Work Item passes all gates and is released.
