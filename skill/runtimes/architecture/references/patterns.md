# Architecture Patterns

## Requirement Trace Pattern

For each major component or boundary, identify:

```md
Product capability:
Acceptance criteria:
Technical responsibility:
Decision or ADR:
Validation evidence expected:
```

Do not create components without an accepted capability or necessary platform responsibility.

## Decision Pattern

```md
## Recommendation

## Context

## Alternatives

## Trade-offs

## Consequences

## Reversal Cost
```

## Brownfield Impact Pattern

1. Identify existing component and contract.
2. Describe required behavior change.
3. Assess data, interface, migration, and operational impact.
4. Preserve unaffected areas.
5. Create an ADR when an accepted decision changes.

## Technology Fit Pattern

Compare only viable options:

```md
## Option

Product and platform fit:
Studio OS implementation and support fit:
Operational burden and total ownership cost:
Security and compliance:
Testing and observability:
Maintenance and migration cost:
Key assumptions:
```

Recommend one option Studio OS can build, validate, operate, and support. Do not ask the user to resolve technical trade-offs that Architecture can decide from evidence.

## Thin Architecture Pattern

For early products, prefer architecture that supports the first valuable increment with a clear extension path. Do not implement deferred scale in advance.
