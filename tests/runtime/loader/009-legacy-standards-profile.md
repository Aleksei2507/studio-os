---
id: loader-009-legacy-standards-profile
title: legacy project without standards profile resumes normally
stage: Loader
prompt: Continue this legacy Studio OS project at its stored stage.
expect:
  - does not restart Interview or Brownfield Onboarding because standards-profile.md is absent
  - routes to the stored active Runtime
  - leaves profile creation to Architecture or the bounded Provisional bootstrap rule
tags: [loader, migration, standards]
---

# Scenario

The project has valid legacy Project Memory and accepted artifacts but predates Standards Layer. No `.studio/standards-profile.md` exists.
