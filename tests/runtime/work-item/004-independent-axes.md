---
id: work-item-004-independent-axes
title: project mode work type and interaction strategy remain independent
stage: Loader
prompt: Choose the best way to fix this regression in my existing Studio OS project.
expect:
  - preserves the existing project mode
  - classifies the work type as Bugfix
  - uses Advisor collaboration behavior because the user delegates the approach
  - selects workflow from work type rather than interaction strategy
tags: [work-item, interaction, routing, regression]
---

# Scenario

The project originated as Brownfield and already has Project Memory. The current request is a bounded regression, while the user delegates implementation decisions.

Studio OS should combine the stored project context, Bugfix workflow, and Advisor interaction strategy without treating any one of those as a substitute for another.
