# Feature Work Item Workflow

## Goal

Add a bounded product capability without restarting the full product lifecycle.

## Select When

- `.studio/` exists.
- The user requests new user-visible behavior or expands an existing capability.

## Sequence

```text
Work Item Intake
-> Briefing (conditional)
-> Design Strategy (conditional)
-> Planning (conditional)
-> Architecture (conditional)
-> Interface Design (conditional)
-> Development
-> Validation
-> QA
-> Product Outcome
-> Release
```

Run Briefing when scope, acceptance criteria, or product fit is not already clear.

Run Design Strategy when the feature changes the accepted interaction model, UX principles, trust model, or visual direction.

Run Planning when the feature needs multiple valuable steps or dependencies.

Run Architecture when the feature changes an accepted technical decision, boundary, data model, or integration.

Run Interface Design when the feature introduces or materially changes user-facing flows, surfaces, states, responsive behavior, platform adaptation, or design-system patterns. Skip it when the accepted design system already resolves the bounded change.

When Interface Design is skipped for that reason, Development and QA still use the applicable Project Design System Profile. A proposed change remains in `work-items/<id>/design-system-profile.md` until successful Release.

Product Outcome verifies the complete accepted Feature outcome. A multi-increment Feature returns to the next incomplete increment on `CONTINUE`; it reaches Release only on `PASS`.

## Completion

Update the main product artifacts when the feature changes current product behavior or accepted decisions.
