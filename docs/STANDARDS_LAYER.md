# Standards Layer

Standards Layer controls how Studio OS builds and verifies a product after product scope is accepted.

It is separate from:

- Workflow, which selects Runtime order;
- Interaction Layer, which selects collaboration style;
- Capabilities, which describe what the AI environment can do.

## Structure

```text
skill/standards/
  STANDARD_SPEC.md
  TECHNOLOGY_SELECTION.md
  registry.json
  core/
  domains/
```

Core standards cover code quality, testing, security and privacy, and accessibility. Domain standards cover product design, web frontend, backend, mobile, and desktop delivery.

Stack-specific standards may be supplied by project instructions or the current AI adapter after Architecture accepts the stack.

Version-specific framework guidance remains in project instructions, installed technical skills, or current authoritative documentation. Studio OS core stores the stable contract and selected evidence, not a stale copy of every framework manual.

## Progressive Loading

Studio OS does not load every rule for every task.

- Design Strategy loads product-design and accessibility rules.
- Architecture loads baseline rules and relevant product domains.
- Interface Design loads product-design, accessibility, and only the accepted delivery-surface and stack rules.
- Development, Validation, QA, and Release load only rules selected in the Project Standards Profile that apply to their stage.

The accepted selection is stored in:

```text
.studio/standards-profile.md
```

An active Work Item that changes technology or standards uses `work-items/<id>/standards-profile.md` until successful Release, so unimplemented decisions do not replace canonical project truth.

## Technology Selection

Architecture selects technology from:

- accepted product and platform requirements;
- existing architecture and repository evidence;
- Studio OS implementation, validation, operations, and continued-support capability;
- accepted budget, schedule, deployment, and operational constraints;
- security, ecosystem, maintenance, migration, and lock-in risk.

The default operating model is studio-owned delivery and support. The user provides the product request and business constraints; Studio OS makes and owns the technical decisions. After Release, support continues through Feature, Bugfix, Research, and Refactor Work Item workflows.

Studio OS does not ask what the user can code or maintain. Interaction Strategy and user proficiency do not affect stack selection. External team constraints apply only when the user explicitly requests handoff or another ownership model.

## Brownfield

Brownfield Onboarding creates an `Observed` profile from repository evidence. It does not replace the stack.

Architecture may later accept or revise that profile. A stack change requires product or maintenance evidence, impact analysis, migration and rollback planning, and an ADR.

## SOLID

Studio OS uses SOLID as structural guidance:

- one bounded responsibility per Runtime and standard;
- registries allow extension without rewriting unrelated contracts;
- compatible Runtime and adapter implementations preserve shared contracts;
- each stage loads narrow interfaces;
- Runtime behavior depends on capability and standard contracts rather than vendors and frameworks.

Product code should apply the same principles only where they reduce real coupling or complexity. Studio OS does not require speculative interfaces, factories, repositories, or layers merely to appear SOLID.

## Deviations

A deviation must identify the rule, rationale, risk, compensating control, approval, and review trigger. Delivery speed by itself does not permit bypassing a quality gate.
