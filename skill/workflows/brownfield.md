# Brownfield Workflow

## Goal

Understand an existing codebase, create Project Memory, and guide a confirmed development effort without reinventing the product.

## Select When

- `.studio/` does not exist.
- A meaningful existing codebase exists.

This mode decision takes priority over the requested change. Complete Brownfield Onboarding before starting a Work Item workflow.

## Sequence

```text
Brownfield Onboarding
-> Briefing
-> Research (conditional)
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

Brownfield Briefing documents Current Product Scope. Brownfield Planning creates a Development Roadmap.

Brownfield Onboarding also creates an Observed Project Design System Profile. It records active, absent, unknown, mixed, and legacy interface-system evidence without replacing the current system. Design Strategy preserves its experience constraints; Architecture uses it for technical compatibility; Interface Design confirms or extends it; Development and QA preserve and verify it.

Run Design Strategy when the accepted work materially changes experience principles or visual direction.

Run Interface Design when implementation requires new interface decisions. Start from the Project Design System Profile and preserve established screens, components, tokens, and platform conventions unless an accepted product decision requires change.

Development, Validation, and QA operate on one accepted roadmap increment at a time. Product Outcome routes an accepted but incomplete milestone to the next roadmap increment instead of treating the increment as the whole delivery.

## Completion

After Product Outcome confirms the accepted Target Milestone and the first Studio OS-guided Release completes, future bounded changes use Work Item workflows.
