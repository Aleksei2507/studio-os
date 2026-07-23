# Interface Design Patterns

## Flow To State Matrix

For every accepted flow, identify:

- entry and exit;
- primary action;
- required information;
- loading, empty, error, success, disabled, permission, offline, and interrupted states that can occur;
- recovery path;
- affected surface or platform variant.

Do not create states that accepted scope cannot produce.

## Progressive Fidelity

Match design fidelity to risk:

- low-risk use of an established pattern may need only a state matrix and bounded component notes;
- a new or ambiguous workflow should include wireframes;
- a high-risk interaction, novel navigation model, or multi-platform divergence should include inspectable visual designs or a prototype when the environment supports them.

Never claim visual validation from a textual specification alone.

## Design System From Decisions

Derive semantic tokens and patterns from accepted brand, product context, accessibility, content density, platform, and Brownfield evidence.

Define only the foundations and reusable patterns needed by accepted scope. Keep raw values subordinate to semantic roles.

## Brownfield Extension

Inventory existing tokens, primitives, repeated components, layout rules, interaction behavior, and known inconsistencies.

Prefer:

1. reuse;
2. compatible extension;
3. deliberate replacement only with accepted rationale and migration impact.

## Multi-Platform Handoff

Separate:

- shared product language and semantic tokens;
- shared flow intent;
- platform-specific navigation, controls, input, feedback, and layout behavior;
- stack-specific implementation notes resolved from the accepted Standards Profile.
