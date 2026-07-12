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
-> Planning (conditional)
-> Architecture (conditional)
-> Development
-> Validation
-> QA
-> Release
```

Run Briefing when scope, acceptance criteria, or product fit is not already clear.

Run Planning when the feature needs multiple valuable steps or dependencies.

Run Architecture when the feature changes an accepted technical decision, boundary, data model, or integration.

## Completion

Update the main product artifacts when the feature changes current product behavior or accepted decisions.
