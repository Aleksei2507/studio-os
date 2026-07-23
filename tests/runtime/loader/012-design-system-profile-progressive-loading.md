---
id: loader-012-design-system-profile-progressive-loading
title: design system profile is loaded only for relevant runtimes
stage: Loader
prompt: Resume the accepted Briefing work.
expect:
  - loads Project State Active Context the selected workflow and Briefing Runtime
  - does not load the Design System Profile merely because it exists
  - loads the profile later for Design Strategy Architecture Interface Design Development or QA only when interface-system evidence affects the work
tags: [loader, design-system, progressive-loading]
---

# Scenario

The Brownfield project has `.studio/design-system-profile.md`, but the stored active stage is Briefing and the current decision does not need interface-system evidence.
