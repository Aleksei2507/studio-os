---
name: design-strategy
description: Define the product's user experience, interaction model, trust requirements, and visual direction before Planning or implementation. Use conditionally when interface decisions materially affect product value, usability, or Architecture.
---

# Design Strategy Runtime

> Runtime for deciding what user experience the product needs without designing detailed components or writing code.

## Metadata

Stage: Design Strategy

Version: 1.0

Optional: Conditional

Requires Confirmation: Yes before accepting the strategy

Creates:

- `docs/design-strategy.md` for project lifecycle;
- `work-items/<id>/design-strategy.md` for an active Work Item.

Updates:

- `.studio/project-state.md`;
- `.studio/active-context.md`.

Next Stage: Planning

## Goal

Translate accepted user scenarios and constraints into a coherent UX and visual direction that Planning and Architecture can preserve.

Design Strategy decides experience principles. It does not produce detailed screens, component specifications, CSS, or implementation architecture.

## Required Capabilities

- `ux-analysis`

Load `skill/capabilities/ux-analysis.md`.

## Entry Gate

Run Design Strategy when one or more are true:

- interaction quality is central to product value;
- user trust, accessibility, or error recovery is material;
- primary device changes product behavior;
- visual direction affects positioning;
- a Brownfield change introduces a new interaction model.

Skip it with a recorded reason when existing design conventions and accepted scenarios are sufficient.

## Inputs

Read:

- `docs/discovery-summary.md`;
- active Brief path from Project Memory;
- `docs/research-summary.md` when available;
- existing product screens or design artifacts for Brownfield;
- `.studio/project-state.md`;
- `.studio/active-context.md`.

## Required Decisions

Define:

- User Context;
- Primary Device and supported contexts;
- Primary User Flow;
- Interaction Model;
- Information Hierarchy;
- Trust and Feedback Model;
- Accessibility direction;
- UX Principles;
- Visual Direction;
- existing patterns to preserve or intentionally change;
- design risks and unresolved questions.

## Procedure

1. Start from accepted user scenarios and product positioning.
2. Identify the highest-risk user interaction.
3. Recommend one primary UX direction.
4. Explain why it fits the user context and product constraints.
5. Present alternatives only when they represent real trade-offs.
6. Record Brownfield conventions that must be preserved.
7. Confirm the direction before updating Project Memory.

## Conditional References

Read `references/patterns.md` when forming alternatives or a Brownfield UX direction.

Read `references/anti-patterns.md` when the discussion moves into detailed UI, implementation, or decorative style without product rationale.

## Conversation Rules

- Recommend a direction instead of asking the user to invent a style.
- Use product criteria, not personal taste.
- Use visible reasoning through user context and trade-offs.
- Ask one focused question only when it changes `docs/design-strategy.md`.
- Preserve Project Language.

## Output

Create the Design Strategy under `docs/` or the Active Work Item directory according to Project Memory, with:

- Product and Design Context;
- User Context;
- Primary Device;
- Primary User Flow;
- Interaction Model;
- Information Hierarchy;
- Trust, Feedback, and Error Recovery;
- Accessibility Direction;
- UX Principles;
- Visual Direction;
- Existing Patterns To Preserve for Brownfield;
- Alternatives and Trade-offs;
- Risks and Unknowns;
- Accepted Decision.

Use `templates/design-strategy.md` as the output structure.

## Project Memory Update

Reference the artifact and record only the accepted experience principles, critical constraints, and Architecture inputs.

Do not overwrite canonical Design Strategy during an intermediate Work Item stage.

Preserve Mode, Workflow, Work Type, and Project Language.

## Handoff

Pass to Planning and Architecture:

- primary flow;
- UX principles;
- primary device;
- trust and accessibility constraints;
- design decisions that create technical requirements;
- unresolved design risks.

## Forbidden

Design Strategy must not:

- design detailed screens or components;
- write CSS or product code;
- select application architecture or database;
- choose style without product rationale;
- replace existing Brownfield patterns without an accepted reason;
- start Planning automatically.

## Completion Checklist

- user context explicit;
- primary flow and device defined;
- UX and visual direction recommended;
- trust and accessibility addressed when relevant;
- alternatives limited to real trade-offs;
- decision accepted;
- artifact and Project Memory updated.

## Stop Condition

Stop after the user accepts or requests revision of the strategy. Recommend Planning and wait for confirmation.
