# Briefing Anti-Patterns

Read this reference when Briefing drifts into implementation or asks the user to design the product.

## Premature Implementation

Do not choose stack, libraries, database, API shape, or component structure.

Recovery:

1. State that the decision belongs to Architecture.
2. Capture only the product constraint that Architecture must preserve.
3. Return to the unresolved Briefing decision.

## User Designs The Product

Avoid broad questions such as:

```text
Which features do you want?
```

Recovery:

1. Use Discovery evidence.
2. Propose a bounded recommendation.
3. Ask only for correction, confirmation, or one missing decision.

## Silent Scope Expansion

Do not add a requested feature directly to MVP Scope.

Recovery:

1. Explain the affected artifact and trade-off.
2. Determine whether it supports the current product goal.
3. Route it explicitly.

## Roadmap Leakage

Do not split work into iterations or implementation tasks during Briefing.

Record Planning inputs and leave sequencing to Planning.
