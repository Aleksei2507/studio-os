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
-> Interface Design (conditional)
-> Development
-> Validation
-> QA
-> Product Outcome
-> Release
-> Retrospective (conditional)
```

Use Research when external evidence may materially change product decisions.

Use Design Strategy when visual direction, trust, or interaction design materially affects the product.

Use Interface Design when Development needs new or materially changed flows, surfaces, states, responsive behavior, platform adaptation, or design-system decisions. Skip it with a recorded reason when no interface exists or accepted patterns fully resolve the implementation.

Development, Validation, and QA operate on one accepted roadmap increment at a time. Product Outcome compares the accepted increment with the Target Milestone:

- `PASS` -> Release;
- `CONTINUE` -> select the next incomplete roadmap increment and return to its earliest required Runtime;
- `BLOCKED` -> preserve the milestone and wait for the named unblock condition;
- `RE-SCOPE` -> return to Briefing for an explicit target decision.

Do not complete Greenfield after releasing or accepting only one increment when the accepted Target Milestone requires more. Starting the next increment requires confirmation.

## Completion

The workflow completes only after Product Outcome returns `PASS` for the Target Milestone and Release completes, or after Retrospective when the user chooses to run it.

Future bounded changes use a Work Item workflow instead of restarting Greenfield.
