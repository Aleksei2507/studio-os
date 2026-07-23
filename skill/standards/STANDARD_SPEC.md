# Standards Layer Specification

Standards Layer defines how Studio OS selects and enforces engineering and product-quality rules without hard-coding one stack into every Runtime.

## Contents

- Responsibilities and categories
- Progressive loading and profiles
- Profile bootstrap and stack adapters
- Work Item isolation
- Precedence and deviations
- Structural principles

## Responsibilities

Standards answer:

- what quality constraints apply;
- which domain-specific risks must be handled;
- which checks provide completion evidence;
- which deviations were explicitly accepted.

Standards do not select project scope, interaction strategy, or workflow.

## Categories

- `core`: broadly applicable engineering constraints.
- `domain`: constraints selected by product surface or system responsibility.
- `stack`: optional technology-specific rules supplied by the project or current AI environment.

Resolve built-in standards through `skill/standards/registry.json`.

## Progressive Loading

Do not load every standard at startup.

1. Architecture reads this specification, the registry, all baseline standards, and only domain standards relevant to the accepted product.
2. Architecture records selected standard IDs and project-specific rules in `.studio/standards-profile.md` or an active Work Item profile.
3. Interface Design, Development, Validation, and QA read the active profile and load only the listed standard contracts relevant to their responsibility.
4. Stack-specific rules are loaded only after the stack is known.

## Project Standards Profile

Use `templates/standards-profile.md`.

The profile records:

- scope: Project or Work Item;
- status: `Observed`, `Provisional`, or `Accepted`;
- product domains and delivery surfaces;
- selected core, domain, and stack standards;
- accepted technology stack and ADR references;
- Studio OS delivery, operations, and support model;
- repository conventions and project instructions;
- required Interface Design, Development, Validation, and QA gates;
- approved deviations, rationale, owner, and review trigger.

Do not store a permanent classification of the user.

The default profile assumes Studio OS owns implementation and continued support through Work Item workflows. Record external ownership or handoff only when the user explicitly requests it.

## Profile Bootstrap

- Greenfield Architecture creates an `Accepted` profile with the architecture decision.
- Brownfield Onboarding may create an `Observed` profile from repository evidence without changing technology.
- A bounded Brownfield change may use an `Observed` or `Provisional` profile when no Architecture change is required.
- Architecture must confirm or revise a non-accepted profile before introducing a new technology or boundary.

## Stack Standard Adapters

After Architecture accepts a stack, resolve version-appropriate guidance from:

- project instructions and existing conventions;
- installed technical skills or approved adapters;
- authoritative current documentation when external verification is required.

Record the selected adapter or project rule references and resulting quality gates in the profile. Do not copy volatile framework documentation into Studio OS core.

Each stack or project standard reference records its identifier, source path or adapter, applicable Runtime stages, stack or version scope, and required evidence. Built-in IDs resolve through the registry; external references resolve only through the accepted profile.

If no stack-specific adapter is available, continue with applicable core and domain standards, record the limitation, and stop only when reliable Architecture, implementation, or validation is impossible.

When a decision depends on current support status, security policy, platform rules, pricing, or ecosystem facts that are not available from project evidence, pause the affected decision and route a bounded question to Research. Do not substitute model memory for current evidence.

## Work Item Profile

The canonical `.studio/standards-profile.md` describes the released project.

When a Work Item proposes different standards or technology:

- create `work-items/<id>/standards-profile.md` for the accepted Work Item decision;
- use it together with the canonical profile during Interface Design, Development, Validation, QA, and Release;
- do not describe unimplemented technology as canonical project truth;
- merge accepted changes into `.studio/standards-profile.md` after successful Release;
- leave the canonical profile unchanged when the Work Item is rejected or cancelled.

## Precedence

Apply the strongest compatible constraint from:

1. safety, legal, privacy, and explicit project requirements;
2. accepted Architecture and ADRs;
3. repository instructions and established conventions;
4. the Project Standards Profile;
5. built-in Studio OS standards.

Existing convention is not permission to preserve a known security, data-loss, accessibility, or correctness defect. Record the conflict and route it to the responsible decision.

## Deviations

A standard may be relaxed only when:

- the exact rule is identified;
- the reason is specific to the project;
- risk and compensating control are recorded;
- the user confirms a material trade-off;
- a review trigger or expiry condition exists when appropriate.

Speed alone is not sufficient reason to bypass a quality gate.

## Structural Principles

Keep Standards Layer open to extension and closed to unrelated rewrites:

- each standard has one bounded responsibility;
- Runtime contracts depend on standard IDs, not framework-specific files;
- domain and stack rules extend core standards without weakening them silently;
- consumers load narrow contracts instead of a universal best-practices document;
- adapters may change while the standard contract remains stable.

Apply SOLID ideas where they improve cohesion, substitution, and dependency direction. Do not force object-oriented patterns or abstractions that add no project value.
