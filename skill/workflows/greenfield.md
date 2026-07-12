# Greenfield Workflow

## Goal

Turn a new product idea into a validated first release.

## Select When

- `.studio/` does not exist.
- No meaningful existing codebase exists.
- The user is starting a new product.

## Sequence

```text
Interview
-> Discovery
-> Research (conditional)
-> Briefing
-> Design Strategy (conditional)
-> Planning
-> Architecture
-> Development
-> Validation
-> QA
-> Release
-> Retrospective (conditional)
```

Use Research when external evidence may materially change product decisions.

Use Design Strategy when visual direction, trust, or interaction design materially affects the product.

## Completion

The workflow completes after Release, or after Retrospective when the user chooses to run it.

Future bounded changes use a Work Item workflow instead of restarting Greenfield.
