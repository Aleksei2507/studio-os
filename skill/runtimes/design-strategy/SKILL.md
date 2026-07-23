---
name: design-strategy
description: Define the product's user experience, interaction model, trust requirements, and visual direction before Planning, Architecture, and detailed Interface Design. Use conditionally when experience decisions materially affect product value or usability.
---

# Design Strategy Runtime

> Runtime for deciding what user experience the product needs without designing detailed components or writing code.

## Metadata

Stage: Design Strategy

Version: 1.2

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

Translate accepted user scenarios and constraints into a coherent UX and visual direction that Planning, Architecture, and Interface Design can preserve.

Design Strategy decides experience principles. It does not produce detailed screens, component specifications, CSS, or implementation architecture.

## Required Capabilities

- `ux-analysis`

Load `skill/capabilities/ux-analysis.md`.

## Required Standards

- `accessibility`;
- `product-design`.

Load:

- `skill/standards/core/accessibility.md`;
- `skill/standards/domains/product-design.md`.

When the accepted product surface is mobile, also load `skill/standards/domains/mobile.md`. For an existing project, apply relevant standards selected in `.studio/standards-profile.md`.

## Entry Gate

Run Design Strategy when one or more are true:

- interaction quality is central to product value;
- user trust, accessibility, or error recovery is material;
- primary device changes product behavior;
- visual direction affects positioning;
- a Brownfield change introduces a new interaction model.

Skip it with a recorded reason when the existing Project Design System Profile, design conventions, and accepted scenarios are sufficient.

## Inputs

Read:

- `docs/discovery-summary.md`;
- active Brief path from Project Memory;
- `docs/research-summary.md` when available;
- existing product screens or design artifacts for Brownfield;
- `.studio/project-state.md`;
- `.studio/active-context.md`;
- `.studio/standards-profile.md` when available;
- `.studio/design-system-profile.md` and an active Work Item Design System Profile when available.

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

1. Start from accepted user scenarios, product positioning, and the observed or accepted Design System Profile.
2. Identify the highest-risk user interaction.
3. Recommend one primary UX direction.
4. Explain why it fits the user context and product constraints.
5. Present alternatives only when they represent real trade-offs.
6. Record Brownfield conventions and design-system boundaries that must be preserved.
7. Identify applicable accessibility, product-design, and platform constraints for Architecture and later Interface Design.
8. Confirm the direction before updating Project Memory.

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
- Project Design System Constraints;
- Alternatives and Trade-offs;
- Risks and Unknowns;
- Applicable Standards and Architecture Inputs;
- Accepted Decision.

Use `templates/design-strategy.md` as the output structure.

## Project Memory Update

Reference the artifact and record only the accepted experience principles, critical constraints, and Architecture inputs.

Do not overwrite canonical Design Strategy during an intermediate Work Item stage.

Preserve Mode, Workflow, Work Type, and Project Language.

## Handoff

Pass to Planning, Architecture, and later Interface Design:

- primary flow;
- UX principles;
- primary device;
- trust and accessibility constraints;
- design decisions that create technical requirements;
- Project Design System Profile constraints and any accepted reason to revise them;
- applicable accessibility, product-design, and platform standards;
- unresolved design risks.

## Forbidden

Design Strategy must not:

- design detailed screens or components;
- write CSS or product code;
- select application architecture or database;
- choose style without product rationale;
- ignore applicable accessibility or platform behavior;
- replace existing Brownfield patterns without an accepted reason;
- contradict the observed or accepted Project Design System Profile without recording evidence and routing the detailed decision to Interface Design;
- start Planning automatically.

## Completion Checklist

- user context explicit;
- primary flow and device defined;
- UX and visual direction recommended;
- Project Design System Profile preserved or an evidence-backed revision need recorded;
- trust and accessibility addressed when relevant;
- applicable standards identified for Architecture;
- alternatives limited to real trade-offs;
- decision accepted;
- artifact and Project Memory updated.

## Stop Condition

Stop after the user accepts or requests revision of the strategy. Recommend Planning and wait for confirmation.
