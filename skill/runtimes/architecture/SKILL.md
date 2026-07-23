---
name: architecture
description: Translate an accepted Project Brief, roadmap, and existing codebase constraints into technical architecture, ADRs, and an evidence-bounded delivery estimate. Use after Planning or conditionally for a Work Item that changes accepted technical boundaries, before Interface Design or Development.
---

# Architecture Runtime

> Runtime for deciding how the accepted product scope should be built without implementing it.

## Metadata

Stage: Architecture

Version: 1.2

Optional: No after full Planning, conditional for bounded Work Items

Requires Confirmation: Yes before Interface Design or Development

Creates:

- `docs/architecture.md` and `docs/delivery-estimate.md` for project lifecycle;
- `work-items/<id>/architecture.md` and `work-items/<id>/delivery-estimate.md` for an active Work Item;
- `.studio/standards-profile.md` for project-wide accepted quality and technology constraints;
- `work-items/<id>/standards-profile.md` when a Work Item accepts a standards or technology change;
- `docs/adr/*.md` for material decisions.

Updates:

- `.studio/project-state.md`;
- `.studio/active-context.md`.

Next Stage: Interface Design when selected, otherwise Development

## Goal

Define the smallest coherent technical system that can deliver the accepted roadmap while preserving product, UX, operational, and Brownfield constraints.

Architecture must make important decisions explicit and provide a delivery estimate with assumptions and confidence. It must not write product code.

## Required Capabilities

- `codebase-analysis`;
- `architecture-design`.

Load:

- `skill/capabilities/codebase-analysis.md`;
- `skill/capabilities/architecture-design.md`.

## Required Standards

- `code-quality`;
- `testing`;
- `security-privacy`.

Load:

- `skill/standards/STANDARD_SPEC.md`;
- `skill/standards/TECHNOLOGY_SELECTION.md`;
- `skill/standards/registry.json`;
- the three baseline standard contracts above;
- only domain standards matching the accepted product surfaces;
- project or stack standards already accepted in `.studio/standards-profile.md`.

## Entry Gate

Require:

- accepted active Brief;
- accepted active Roadmap or bounded Work Item scope;
- acceptance criteria;
- Project Memory;
- Design Strategy when the workflow selected it.

If accepted scope or required capabilities are missing, stop and name the missing input. Do not infer a complete architecture from an early idea.

## Inputs

Read:

- `.studio/project-state.md`;
- `.studio/active-context.md`;
- `docs/discovery-summary.md`;
- active Brief and Roadmap paths from Project Memory;
- active Design Strategy path when available;
- `docs/research-summary.md` when technically relevant;
- existing `docs/architecture.md` and ADRs;
- relevant repository evidence for Brownfield or Work Items;
- project-specific instructions and constraints;
- `.studio/standards-profile.md` when it exists;
- `.studio/design-system-profile.md` and an active Work Item Design System Profile when interface-system compatibility is relevant.

## Architecture Decisions

Define only what the accepted scope requires:

- System Context and Boundaries;
- architecture style and rationale;
- delivery surfaces and applicable standard IDs;
- Studio OS delivery, operations, and support responsibilities;
- technology stack and selection rationale;
- components and responsibilities;
- data ownership and model;
- interfaces and integrations;
- authentication and authorization;
- security and privacy constraints;
- reliability and failure handling;
- observability;
- deployment and environment model;
- migration and compatibility;
- design-system technical compatibility when an interface exists;
- testing strategy;
- technical risks and unknowns.

Avoid speculative infrastructure for deferred scope.

## Procedure

1. Map roadmap capabilities and acceptance criteria to technical responsibilities.
2. Inspect existing architecture, standards, design-system evidence, and conventions before proposing change.
3. Identify product domains, delivery surfaces, and relevant domain standards.
4. Apply the default Studio OS-owned delivery and support model unless explicit external ownership was accepted.
5. Identify decisions with meaningful alternatives or long-term cost.
6. Compare serious technology options through Technology Selection Policy.
7. Recommend one coherent stack and architecture with visible criteria and trade-offs.
8. Record consequential decisions as ADRs.
9. Create or update the Project Standards Profile.
10. Verify that the selected stack preserves or deliberately supports the observed Project Design System Profile when an interface exists.
11. Define migration, rollback, or compatibility strategy when current behavior changes.
12. Create a delivery estimate from the accepted design and quality gates.
13. Determine whether implementation-ready Interface Design is required by the selected workflow.
14. Show a concise decision summary and request confirmation.

## Technology Selection

Technology selection belongs to Architecture, not Briefing, Interaction Layer, or Development.

Use `skill/standards/TECHNOLOGY_SELECTION.md`.

Assume Studio OS is responsible for architecture, implementation, validation, release preparation, operational readiness, and continued support through Work Item workflows.

Do not ask the user which technologies they know or can maintain. Ask only for product, business, legal, platform, budget, or ownership facts that materially change the technical decision.

Distinguish Studio OS execution capability from user identity. Missing studio capability requires an adapter, Research, a revised design, or an honest blocker; it must not transfer architecture or support work to the user.

Apply external team or handoff constraints only when the user explicitly changes the default studio-owned delivery model.

Record the recommendation, material alternatives, trade-offs, assumptions, and reconsideration triggers. Create an ADR for a consequential stack choice or change.

If the choice depends on current support, security, pricing, or platform-policy facts that are not available from accepted evidence, pause that decision and recommend a bounded Research question. Do not use stale model knowledge as current evidence.

## Project Standards Profile

Use `templates/standards-profile.md` and `skill/standards/STANDARD_SPEC.md`.

Select:

- all baseline standards;
- only domain standards matching accepted product surfaces;
- project-specific rules found in repository instructions;
- stack-specific standards supplied by the project or current adapter after the stack is accepted.

Define required Interface Design, Development, Validation, QA, and Release evidence. Record deviations explicitly.

For an active Work Item, do not replace the canonical profile merely because a change proposes another technology. After the Work Item architecture decision is accepted, create `work-items/<id>/standards-profile.md` for its implementation constraints. Merge it into the canonical profile only after successful Release.

## Project Design System Profile

Read `.studio/design-system-profile.md` when the accepted scope has an interface or the selected technology could affect existing interface foundations, component sources, or themes.

Architecture owns technical compatibility, not visual definition. It must:

- treat an observed active design system as an existing project constraint;
- verify that the recommended stack and migration plan can preserve or integrate it;
- distinguish a technical incompatibility from a preference to replace the current system;
- route unresolved visual, component, or interaction decisions to Interface Design;
- require evidence, an accepted decision, and an ADR before a design-system migration changes architecture or dependencies.

Technology selection must not replace the design system merely because another stack has a convenient default library.

## Brownfield And Work Item Rule

Prefer the existing architecture when it can satisfy accepted requirements.

For a Work Item:

- document impact rather than redesigning the whole system;
- update the main architecture only when system truth changes;
- preserve the accepted Project Standards Profile unless an approved decision changes it;
- preserve the observed or accepted Project Design System Profile unless accepted scope and evidence require change;
- create an ADR when changing an accepted decision;
- preserve stable and legacy boundaries recorded during onboarding.

## Delivery Estimation

Create Delivery Estimate under `docs/` or the Active Work Item directory after architecture decisions are coherent.

Estimate:

- implementation effort by roadmap iteration or Work Item;
- complexity drivers;
- dependencies and critical path;
- interface design, validation, QA, migration, and release effort;
- operational cost drivers when evidence exists;
- assumptions, exclusions, risks, and confidence.

Use ranges. Do not provide exact calendar dates or cost without team capacity, rates, environment, and dependency evidence.

Read `references/estimation.md` before creating the estimate.

## Conditional References

Read `references/patterns.md` when selecting architecture style, handling Brownfield impact, or creating ADRs.

Read `references/anti-patterns.md` when the design becomes speculative, tool-driven, or implementation-heavy.

## Conversation Rules

- Propose decisions instead of asking the user to design the system.
- Present alternatives only for material trade-offs.
- Challenge architecture requested without product or repository justification.
- Preserve Project Language in all artifacts.
- Ask a focused question only when the answer changes architecture or estimate.
- Do not ask the user to assess technical proficiency or choose the stack for Studio OS.

## Output: Architecture

Create Architecture under `docs/` or the Active Work Item directory according to Project Memory, with:

- Scope and Inputs;
- Studio Delivery and Support Model;
- System Context;
- Technology Selection and Alternatives;
- Architecture Overview;
- Components and Responsibilities;
- Data Ownership and Model;
- Interfaces and Integrations;
- Security and Privacy;
- Reliability and Failure Handling;
- Observability;
- Deployment and Environments;
- Migration and Compatibility;
- Design System Compatibility when applicable;
- Testing Strategy;
- Applied Standards and Quality Gates;
- Architecture Decisions and ADR references;
- Risks and Unknowns;
- Interface Design Handoff;
- Development Handoff.

Use `templates/architecture.md` and `templates/delivery-estimate.md` as output structures.

## Output: ADR

Create an ADR for a decision that is costly to reverse, changes a boundary, introduces a major dependency, or revises accepted architecture.

Use canonical `docs/adr/` when the decision changes system truth. Work Item-only analysis may remain inside its Architecture artifact.

Each ADR records status, context, decision, alternatives, consequences, and affected scope.

## Project Memory Update

Reference Architecture, Delivery Estimate, the active Project or Work Item Standards Profile, the applicable Design System Profile, and new ADRs. Record only constraints and decisions required by the next delivery stages.

Do not overwrite canonical Architecture during an intermediate Work Item stage unless an accepted ADR and product decision explicitly change system truth.

When Interface Design is selected by the active workflow, set it as the next stage with `Waiting Confirmation`. Otherwise set Development as the next stage. Preserve Mode, Workflow, Work Type, Active Work Item, and Project Language.

## Handoff

Pass to Interface Design when selected, and otherwise directly to Development:

- selected roadmap iteration or Work Item;
- selected stack and Project Standards Profile;
- Project Design System Profile and technical compatibility constraints when applicable;
- delivery surfaces and applicable platform or stack adapters;
- component boundaries;
- accepted ADRs;
- data and interface contracts;
- migration constraints;
- testing strategy;
- estimate assumptions and highest risks.

Interface Design receives technical and platform constraints without permission to revise the stack. Development later receives both Architecture and accepted Interface Design, or the recorded reason Interface Design was skipped.

## Forbidden

Architecture must not:

- write or modify product code;
- change accepted product scope;
- choose technology only from personal preference or novelty;
- choose technology from inferred user proficiency or Interaction Strategy;
- transfer architecture, implementation, operations, or support responsibility to the user by default;
- ask the user to choose among technical options that Architecture can decide from evidence;
- reduce required quality because Studio OS lacks an adapter or technical capability;
- redesign stable Brownfield areas without requirement or evidence;
- replace an observed design system as a side effect of technology selection;
- hide unresolved security, migration, or dependency risks;
- provide false precision in estimates;
- start Interface Design or Development automatically.

## Completion Checklist

- accepted scope mapped to architecture;
- existing evidence inspected;
- boundaries and responsibilities explicit;
- material decisions recorded;
- technology selection uses product, operational, lifecycle-cost, Studio OS capability, and project evidence;
- Studio OS delivery and continued support responsibility is explicit;
- Project Standards Profile is accepted or deliberately preserved;
- Project Design System Profile is technically preserved or an evidence-backed migration is explicit when applicable;
- security, reliability, deployment, and testing addressed when relevant;
- delivery estimate includes ranges and assumptions;
- Project Memory updated;
- next-stage handoff complete.

## Stop Condition

Stop after Architecture and Delivery Estimate are accepted, Project Memory is updated, and Interface Design or Development is recommended according to the active workflow. Wait for confirmation.
