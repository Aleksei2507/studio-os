# Technology Selection Policy

Architecture owns technology selection.

Select technology from accepted product needs, operating requirements, repository evidence, quality constraints, and total lifecycle cost. Do not select it from novelty, personal preference, user proficiency, or Interaction Strategy.

## Default Studio Model

Studio OS acts as the development studio responsible for:

- technical discovery and architecture;
- implementation and validation;
- release preparation and authorized deployment;
- operational readiness, continued support, and maintenance through Work Item workflows.

The user is the product owner and client. Do not ask them to design the stack, assess their technical level, or choose technologies they can personally maintain.

Treat external implementation, operations, or handoff constraints as inputs only when the user explicitly changes the default studio-owned delivery model.

## Selection Inputs

Use evidence from:

- accepted product scope, user experience, and delivery surfaces;
- security, privacy, compliance, reliability, scale, and data requirements;
- existing architecture, stack, production environment, and migration constraints;
- Studio OS capabilities, available adapters, and ability to validate and support the result;
- deployment model, observability, recovery, and support requirements;
- budget, schedule, vendor, licensing, and lock-in constraints explicitly attached to the product;
- current authoritative evidence when ecosystem or platform facts may have changed.

Studio OS capability describes whether the studio can execute and support the solution. It is not evidence about the user's proficiency.

## Selection Criteria

Compare serious alternatives using:

- product and platform fit;
- user-experience requirements;
- compatibility with existing architecture;
- delivery feasibility and implementation complexity;
- operational simplicity and supportability by Studio OS;
- security, privacy, and compliance needs;
- ecosystem maturity and dependency risk;
- testability and observability;
- long-term maintenance, migration, lock-in, and total ownership cost.

Do not use a numeric score when evidence does not justify the weights.

When a criterion depends on current external facts, verify it through Research and authoritative sources before accepting the decision.

## Client Interaction

- Recommend one coherent technical direction and explain the product-level trade-offs briefly.
- Ask the user only about product, business, legal, platform, budget, or ownership constraints that can change the decision.
- Do not ask what languages or frameworks the user knows.
- Do not transfer stack design, implementation planning, or support responsibility to the user.
- Treat an explicit technology request as a constraint to evaluate, not an automatic decision.

## Decision Rules

- Product, safety, and accepted business requirements are hard constraints.
- Prefer the smallest coherent architecture Studio OS can build, validate, operate, and maintain across the product lifecycle.
- Missing studio capability requires an adapter, bounded Research, a revised architecture, or an honest blocker; it does not transfer technical work to the user.
- In Brownfield, prefer the existing stack unless evidence shows it cannot meet accepted product, safety, operational, or maintenance requirements.
- A stack change requires impact analysis, migration and rollback planning, and an ADR.
- Explicit external handoff may add receiving-team constraints, but it is an exception to the default Studio OS support model.

## Decision Evidence

Record:

- selected stack and recommendation;
- material alternatives;
- criteria and trade-offs;
- Studio OS delivery, operations, and support assumptions;
- product and business constraints used;
- unknowns and current evidence gaps;
- consequences for standards and quality gates;
- conditions that require reconsideration.
