---
id: interface-design-007-conditional-stage
title: interface design runs only when detailed interface decisions are needed
stage: Interface Design
prompt: Decide whether Interface Design should run before Development.
expect:
  - runs when accepted scope introduces or materially changes a user-facing interface
  - skips with a recorded reason when no interface exists or accepted patterns already resolve the implementation
  - does not run merely because the selected stack can render a user interface
tags: [interface-design, workflow, conditional]
---

# Scenario

The workflow must decide whether an implementation-ready interface artifact would reduce product or delivery risk.
