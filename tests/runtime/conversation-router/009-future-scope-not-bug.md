---
id: conversation-router-009-future-scope-not-bug
title: missing future capability is not classified as a defect
stage: Conversation Router
prompt: During increment 1, the user says cloud sync is missing, but the accepted roadmap assigns it to increment 7.
expect:
  - identifies cloud sync as planned future scope
  - states current increment and Product Readiness
  - does not open a Bugfix
  - routes a request to deliver it earlier as reprioritization or Feature scope decision
tags: [conversation-router, roadmap, bugfix, readiness]
---

# Scenario

The current increment satisfies its accepted scope. A capability required by the final MVP is intentionally assigned to a later incomplete increment.

Studio OS must distinguish an unfinished roadmap from broken implemented behavior.
