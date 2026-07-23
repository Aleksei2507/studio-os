---
name: interface-design
description: Turn accepted product experience and architecture decisions into an implementation-ready interface specification and design system. Use conditionally after Architecture for new or materially changed web, mobile, or desktop interfaces before Development.
---

# Interface Design Runtime

> Runtime for performing the product designer's delivery work without selecting technology or writing production code.

## Metadata

Stage: Interface Design

Version: 1.1

Optional: Conditional

Requires Confirmation: Yes before Development

Creates:

- `docs/interface-design.md` for the project lifecycle;
- `work-items/<id>/interface-design.md` for an active Work Item;
- `.studio/design-system-profile.md` when the project profile does not exist or accepted project-level design decisions change it;
- `work-items/<id>/design-system-profile.md` when an active Work Item proposes different design-system decisions;
- references to visual design files only when those files were actually created and inspected.

Updates:

- `.studio/project-state.md`;
- `.studio/active-context.md`.

Next Stage: Development

## Goal

Translate accepted scope, Design Strategy, Architecture, and platform constraints into a coherent interface specification that Development can implement without inventing screens, states, component behavior, or visual rules in code.

Interface Design owns detailed user flows, surfaces, states, adaptive behavior, design-system foundations, and implementation handoff. It does not replace product strategy, select the stack, or implement the interface.

## Required Capabilities

- `interface-modeling`;
- `design-system-definition`;
- `platform-design`.

Load:

- `skill/capabilities/interface-modeling.md`;
- `skill/capabilities/design-system-definition.md`;
- `skill/capabilities/platform-design.md`.

If a required capability is unavailable, produce only confirmed partial evidence, mark the stage BLOCKED, and name the missing capability. Do not pretend that an implementation-ready design exists.

## Required Standards

- `accessibility`;
- `product-design`.

Load the direct contracts above and only additional standards selected in the canonical and active Work Item Standards Profiles that apply to Interface Design.

Use the accepted delivery surface to load `web-frontend`, `mobile`, or `desktop` when selected. Load stack-specific project rules or adapters only from the accepted Standards Profile.

## Entry Gate

Require:

- accepted active scope and acceptance criteria;
- accepted Architecture and applicable ADRs, or accepted existing Architecture for a bounded Work Item;
- an Accepted, Observed, or confirmed Provisional Standards Profile that identifies the delivery surface and stack;
- Design Strategy when the workflow selected it;
- a user-facing interface that needs new or materially changed design decisions.

For Brownfield work, require an Observed, Provisional, or Accepted Project Design System Profile when one exists. A missing legacy profile does not restart onboarding; inspect the relevant evidence and create a bounded `Provisional` profile before making design-system decisions.

Run Interface Design when implementation would otherwise need to invent a flow, surface, state, responsive rule, platform behavior, component pattern, or design-system decision.

Skip it with a recorded reason when:

- the accepted scope has no user-facing interface; or
- an existing observed or accepted design system and product pattern fully resolve the bounded change.

Do not select the stage merely because the accepted technology can render a user interface.

## Inputs

Read:

- `.studio/project-state.md`;
- `.studio/active-context.md`;
- active Brief and Roadmap or Work Item request;
- active Design Strategy when available;
- active Architecture, ADRs, and delivery estimate constraints;
- canonical `.studio/standards-profile.md` and active Work Item profile when available;
- canonical `.studio/design-system-profile.md` and active Work Item Design System Profile when available;
- existing screens, design files, components, tokens, and interaction conventions for Brownfield work;
- accepted brand assets and content constraints when available.

## Required Decisions

Define only what accepted scope requires:

- primary and alternate user flows;
- surface, page, screen, view, or window inventory;
- navigation and information hierarchy;
- state model, including loading, empty, error, success, disabled, permission, offline, and interrupted states when relevant;
- responsive or adaptive behavior;
- platform interaction conventions and deliberate platform differences;
- design-system foundations and semantic tokens;
- reusable component and content patterns;
- feedback, recovery, destructive-action, and trust behavior;
- accessibility behavior;
- asset and content requirements;
- implementation and QA handoff.

## Platform Resolution

Architecture owns technology selection. Interface Design consumes the accepted stack and must not introduce a default.

Resolve the accepted stack to one or more platform families:

| Platform family | Built-in mappings |
| --- | --- |
| Web | HTML + Tailwind, React, Next.js, shadcn/ui, Vue, Nuxt, Nuxt UI, Angular, Laravel, Svelte, Astro, Three.js |
| Mobile | SwiftUI, Jetpack Compose, React Native, Flutter |
| Desktop | JavaFX, WPF, WinUI 3, Avalonia, Uno Platform, UWP |

Read only the matching platform reference:

- `references/web.md` for accepted Web surfaces;
- `references/mobile.md` for accepted iOS, Android, or cross-platform mobile surfaces;
- `references/desktop.md` for accepted desktop surfaces.

For a multi-surface product, load each relevant reference and distinguish shared design-system decisions from platform-specific behavior.

If an accepted stack is not listed, use its Architecture-defined delivery surface and accepted stack adapter. Record the missing built-in mapping, but do not change technology or ask the user to choose another framework.

## Procedure

1. Trace accepted scenarios and acceptance criteria to interface outcomes.
2. Inspect the Project Design System Profile and verify its evidence against the affected interface before creating new patterns.
3. Build the flow, surface, and state inventory.
4. Resolve the accepted stack to platform guidance and profile-selected standards.
5. Define navigation, information hierarchy, responsive or adaptive behavior, and platform differences.
6. Define semantic design foundations and the minimum reusable component patterns required by scope.
7. Specify content, feedback, recovery, accessibility, and trust behavior.
8. Create or reference wireframes and visual designs when they materially reduce risk and the current environment can produce and inspect them reliably.
9. Prepare the applicable Design System Profile update with proposed foundations, component sources, preservation rules, conflicts, and deviations.
10. Review every design decision against accepted scope, Architecture, standards, and Brownfield conventions.
11. Create the Interface Design artifact, present the important decisions, and request confirmation.

## Brownfield And Work Item Rule

Treat existing interface behavior as evidence, not an empty canvas.

- preserve accepted components, tokens, navigation, and interaction patterns by default;
- use the observed Design System Profile as the starting point and correct it only with stronger evidence;
- extend the existing design system before creating a parallel one;
- preserve primary, secondary, legacy, and platform boundaries instead of forcing them into one system;
- record deliberate deviations and their product rationale;
- keep intermediate Work Item design under its Active Work Item directory;
- keep Work Item design-system changes in `work-items/<id>/design-system-profile.md` until successful Release;
- update canonical product design artifacts only after accepted Release when product truth changed.

## Decision Conflicts

When Interface Design exposes a conflict:

- route scope or acceptance conflicts to Briefing;
- route experience-principle or visual-direction conflicts to Design Strategy;
- route stack, technical-boundary, feasibility, or Standards Profile conflicts to Architecture.

Stop the affected decision and preserve evidence. Do not silently revise an accepted artifact.

## Conditional References

Read `references/patterns.md` when choosing design fidelity, forming a state matrix, extending a Brownfield design system, or organizing a multi-platform handoff.

Read `references/anti-patterns.md` when the work becomes style-catalog-driven, implementation-heavy, platform-generic, or inconsistent with accepted decisions.

Read only the platform reference selected under Platform Resolution.

## Conversation Rules

- Act as the product designer for the studio and recommend a coherent direction.
- Ask for product, brand, legal, content, or business facts only when they materially change the design.
- Do not ask the user to invent a style, select a framework, or provide design expertise.
- Explain important trade-offs through user context and accepted constraints, not personal taste.
- Preserve Project Language in artifacts and handoffs.
- Keep framework details limited to implementation-relevant design constraints.

## Output

Create Interface Design under `docs/` or the Active Work Item directory according to Project Memory, with:

- Scope and Accepted Inputs;
- Platform and Stack Context;
- Existing Design Evidence;
- Design System Profile path, status, and preservation policy;
- User Flows;
- Surface Inventory;
- Navigation and Information Hierarchy;
- State Matrix;
- Responsive and Adaptive Behavior;
- Platform Conventions and Variants;
- Design System Foundations;
- Component and Content Patterns;
- Feedback, Recovery, and Trust;
- Accessibility Requirements;
- Assets and Design References;
- Standards Coverage;
- Risks and Unresolved Questions;
- Development and QA Handoff;
- Accepted Decision.

Use `templates/interface-design.md` as the output structure.

Create or update the applicable Design System Profile with `templates/design-system-profile.md`:

- use `Status: Accepted` only after the Interface Design decision is accepted;
- use `Status: Provisional` for a proposed profile that is awaiting confirmation;
- preserve `Status: Observed` when the stage only references existing evidence without accepting a change;
- use the active Work Item profile for unimplemented Work Item decisions;
- record repository or design evidence for every material correction to an observed profile.

The Markdown artifact is canonical. Do not generate an HTML review representation in this Runtime version.

## Project Memory Update

Reference the accepted Interface Design artifact and applicable Design System Profile, and record only decisions Development and QA must preserve.

Set Development as the current stage with `Waiting Confirmation`. Preserve Mode, Workflow, Work Type, Active Work Item, and Project Language.

Do not overwrite canonical Interface Design during an intermediate Work Item stage.

Do not overwrite the canonical Project Design System Profile with unimplemented Work Item decisions. Merge an accepted Work Item profile only after successful Release.

## Handoff

Pass to Development and QA:

- accepted flows, surfaces, and state matrix;
- platform and responsive behavior;
- semantic tokens and reusable patterns;
- the applicable Project or Work Item Design System Profile and its preservation policy;
- component behavior without prescribing unnecessary code structure;
- content, feedback, recovery, trust, and accessibility requirements;
- existing patterns to preserve;
- linked design evidence and unresolved risks.

## Forbidden

Interface Design must not:

- choose or change the technology stack;
- ask the user to choose a framework Studio OS can decide through Architecture;
- write production code, CSS, application components, or implementation tasks;
- change accepted scope, UX strategy, Architecture, or standards silently;
- choose a style only because it appears in a catalog or trend list;
- force one visual or interaction pattern across different platforms;
- replace Brownfield conventions without accepted rationale;
- collapse multiple observed design systems or legacy boundaries without accepted migration evidence;
- omit non-happy states or accessibility behavior;
- claim a visual design or prototype was inspected when it was not;
- generate an HTML review representation;
- start Development automatically.

## Completion Checklist

- stage selection or skip reason recorded;
- accepted scope and Architecture traced;
- existing design evidence inspected;
- Project Design System Profile verified, created, or updated at the correct project or Work Item scope;
- flows, surfaces, navigation, and states defined;
- relevant platform guidance loaded progressively;
- design-system foundations and component patterns coherent;
- responsive or adaptive and accessibility behavior explicit;
- standards and Brownfield conventions covered;
- artifact accepted and Project Memory updated;
- Development and QA handoff complete.

## Stop Condition

Stop after Interface Design is accepted, Project Memory is updated, and Development is recommended. Wait for confirmation.
