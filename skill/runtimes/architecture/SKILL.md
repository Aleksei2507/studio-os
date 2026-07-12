---
name: architecture
description: Translate an accepted Project Brief, roadmap, and existing codebase constraints into technical architecture, ADRs, and an evidence-bounded delivery estimate. Use after Planning or conditionally for a Work Item that changes accepted technical boundaries.
---

# Architecture Runtime

> Runtime for deciding how the accepted product scope should be built without implementing it.

## Metadata

Stage: Architecture

Version: 1.0

Optional: No after full Planning, conditional for bounded Work Items

Requires Confirmation: Yes before Development

Creates:

- `docs/architecture.md` and `docs/delivery-estimate.md` for project lifecycle;
- `work-items/<id>/architecture.md` and `work-items/<id>/delivery-estimate.md` for an active Work Item;
- `docs/adr/*.md` for material decisions.

Updates:

- `.studio/project-state.md`;
- `.studio/active-context.md`.

Next Stage: Development

## Goal

Define the smallest coherent technical system that can deliver the accepted roadmap while preserving product, UX, operational, and Brownfield constraints.

Architecture must make important decisions explicit and provide a delivery estimate with assumptions and confidence. It must not write product code.

## Required Capabilities

- `codebase-analysis`;
- `architecture-design`.

Load:

- `skill/capabilities/codebase-analysis.md`;
- `skill/capabilities/architecture-design.md`.

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
- project-specific instructions and constraints.

## Architecture Decisions

Define only what the accepted scope requires:

- System Context and Boundaries;
- architecture style and rationale;
- components and responsibilities;
- data ownership and model;
- interfaces and integrations;
- authentication and authorization;
- security and privacy constraints;
- reliability and failure handling;
- observability;
- deployment and environment model;
- migration and compatibility;
- testing strategy;
- technical risks and unknowns.

Avoid speculative infrastructure for deferred scope.

## Procedure

1. Map roadmap capabilities and acceptance criteria to technical responsibilities.
2. Inspect existing architecture and conventions before proposing change.
3. Identify decisions with meaningful alternatives or long-term cost.
4. Recommend one coherent architecture and explain trade-offs.
5. Record consequential decisions as ADRs.
6. Define migration, rollback, or compatibility strategy when current behavior changes.
7. Create a delivery estimate from the accepted design.
8. Show a concise decision summary and request confirmation.

## Brownfield And Work Item Rule

Prefer the existing architecture when it can satisfy accepted requirements.

For a Work Item:

- document impact rather than redesigning the whole system;
- update the main architecture only when system truth changes;
- create an ADR when changing an accepted decision;
- preserve stable and legacy boundaries recorded during onboarding.

## Delivery Estimation

Create Delivery Estimate under `docs/` or the Active Work Item directory after architecture decisions are coherent.

Estimate:

- implementation effort by roadmap iteration or Work Item;
- complexity drivers;
- dependencies and critical path;
- validation, QA, migration, and release effort;
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

## Output: Architecture

Create Architecture under `docs/` or the Active Work Item directory according to Project Memory, with:

- Scope and Inputs;
- System Context;
- Architecture Overview;
- Components and Responsibilities;
- Data Ownership and Model;
- Interfaces and Integrations;
- Security and Privacy;
- Reliability and Failure Handling;
- Observability;
- Deployment and Environments;
- Migration and Compatibility;
- Testing Strategy;
- Architecture Decisions and ADR references;
- Risks and Unknowns;
- Development Handoff.

Use `templates/architecture.md` and `templates/delivery-estimate.md` as output structures.

## Output: ADR

Create an ADR for a decision that is costly to reverse, changes a boundary, introduces a major dependency, or revises accepted architecture.

Use canonical `docs/adr/` when the decision changes system truth. Work Item-only analysis may remain inside its Architecture artifact.

Each ADR records status, context, decision, alternatives, consequences, and affected scope.

## Project Memory Update

Reference Architecture, Delivery Estimate, and new ADRs. Record only constraints and decisions required by Development.

Do not overwrite canonical Architecture during an intermediate Work Item stage unless an accepted ADR and product decision explicitly change system truth.

Set Development as the next stage with `Waiting Confirmation` after acceptance. Preserve Mode, Workflow, Work Type, Active Work Item, and Project Language.

## Handoff

Pass to Development:

- selected roadmap iteration or Work Item;
- component boundaries;
- accepted ADRs;
- data and interface contracts;
- migration constraints;
- testing strategy;
- estimate assumptions and highest risks.

## Forbidden

Architecture must not:

- write or modify product code;
- change accepted product scope;
- choose technology only from personal preference or novelty;
- redesign stable Brownfield areas without requirement or evidence;
- hide unresolved security, migration, or dependency risks;
- provide false precision in estimates;
- start Development automatically.

## Completion Checklist

- accepted scope mapped to architecture;
- existing evidence inspected;
- boundaries and responsibilities explicit;
- material decisions recorded;
- security, reliability, deployment, and testing addressed when relevant;
- delivery estimate includes ranges and assumptions;
- Project Memory updated;
- Development handoff complete.

## Stop Condition

Stop after Architecture and Delivery Estimate are accepted, Project Memory is updated, and Development is recommended. Wait for confirmation.
