---
name: work-item
description: Classify and initialize a bounded change in an existing Studio OS project, then select the Feature, Bugfix, Research, or Refactor workflow. Use when .studio exists and the user asks to add, fix, investigate, or restructure something.
---

# Work Item Intake Runtime

## Metadata

Stage: Work Item Intake

Version: 1.0

Requires Confirmation: Only when classification or scope is unclear

Creates:

- `work-items/YYYY-MM-DD-short-name/request.md`

Updates:

- `.studio/project-state.md`
- `.studio/active-context.md`

Next: Selected Work Item workflow

## Goal

Turn a bounded request into explicit Work Type, scope, evidence, and workflow selection without restarting the product lifecycle.

Work Item Intake routes work. It does not implement, research, plan, or redesign the requested change.

## Inputs

Read:

- `skill/core/INVARIANTS.md`;
- `skill/core/PROJECT_MEMORY.md`;
- `.studio/project-state.md`;
- `.studio/active-context.md`;
- accepted product artifacts affected by the request;
- the current user request.

## Classification

Classify from the requested outcome:

- Feature: add or expand user-visible capability.
- Bugfix: correct behavior that is wrong or regressed.
- Research: produce evidence or a decision without implementation.
- Refactor: improve internal structure while preserving product behavior.

If the request combines types, choose the type that controls acceptance and record the secondary concerns.

If classification changes the workflow materially and confidence is low, ask one focused question.

## Scope Check

Determine whether the request:

- fits the current product goal;
- changes accepted scope or Non Goals;
- changes an architecture decision;
- can be handled as a bounded Work Item;
- belongs to a separate project.

Do not accept a product-direction change as an ordinary Work Item without confirmation.

## Workflow Selection

Select:

- Feature -> `work-item-feature`;
- Bugfix -> `work-item-bugfix`;
- Research -> `work-item-research`;
- Refactor -> `work-item-refactor`.

Interaction strategy does not select workflow.

## Output

Create `request.md` with:

- Request;
- Expected Outcome;
- Work Type;
- Selected Workflow;
- Product Fit;
- Affected Artifacts;
- Known Constraints;
- Acceptance Evidence;
- Unknowns;
- Recommended Next Runtime.

For Bugfix include observed behavior, expected behavior, and available reproduction evidence.

Use `templates/work-item-request.md` as the output structure.

## Project Memory Update

Set:

```md
Mode: <preserve Greenfield or Brownfield>
Workflow: <selected-workflow>
Work Type: <work-type>
Active Work Item: <work-item-path>
Previous Stage: <previous-stage>
Current Stage: <next-runtime>
Status: Waiting Confirmation | In Progress
```

Reference the Work Item request from Active Context without copying it.

## Forbidden

Work Item Intake must not:

- write product code;
- perform diagnosis or research;
- create a roadmap or architecture;
- silently change accepted product scope;
- classify from language-specific phrases;
- restart Greenfield or Brownfield onboarding when Project Memory exists.

## Handoff

Pass the request, Work Type, selected workflow, affected artifacts, constraints, and unresolved questions to the next Runtime.

## Completion Checklist

- request recorded;
- Work Type explicit;
- workflow selected;
- affected artifacts identified;
- Project Memory updated;
- next Runtime identified.

## Stop Condition

Stop after Work Item state is recorded and control is handed to the selected workflow. Do not execute the requested change during intake.
