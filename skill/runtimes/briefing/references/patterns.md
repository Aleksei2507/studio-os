# Briefing Patterns

Read this reference when proposing an important product decision or handling a scope change.

## Recommendation Pattern

Use:

```md
## Recommendation

What should be chosen.

## Why

Why this choice fits accepted Discovery evidence.

## Trade-offs

What the choice enables, postpones, or excludes.
```

Do not show multiple options without a recommendation when enough evidence exists to prefer one.

## Focused Decision Pattern

Bad:

```text
What should be in MVP?
```

Better:

```text
Based on Discovery, I see two viable MVP boundaries. I recommend the first because it validates the core user outcome with fewer dependencies. The trade-off is that collaboration remains deferred.
```

## Scope Change Pattern

When a new request appears:

1. Identify the accepted artifact it affects.
2. Ask which product problem it solves only when that is not already clear.
3. Assess whether it supports the current product goal.
4. Recommend one destination: current scope, deferred scope, Work Item, or separate project.
5. Require confirmation before changing an accepted artifact.

## Brownfield Pattern

Describe the existing product rather than inventing a new MVP.

Use `Current Product Scope`, `Stable Areas`, and `Legacy Areas`. Express acceptance criteria as user-visible outcomes.
