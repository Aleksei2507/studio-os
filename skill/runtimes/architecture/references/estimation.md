# Delivery Estimation

## Estimate Units

Prefer effort ranges appropriate to available evidence:

- relative size when team and delivery data are unknown;
- engineer-days or engineer-weeks when work decomposition is credible;
- calendar ranges only when team capacity, parallelism, availability, and external dependencies are known;
- cost ranges only when rates and operational assumptions are provided.

## Required Structure

```md
# Delivery Estimate

## Scope

## Estimate Summary

## Breakdown By Iteration Or Work Item

## Complexity Drivers

## Dependencies And Critical Path

## Validation, QA, Migration, And Release Effort

## Operational Cost Drivers

## Assumptions

## Exclusions

## Risks

## Confidence

## Re-estimation Triggers
```

## Confidence

- High: scope and architecture are accepted, dependencies known, comparable delivery evidence exists.
- Medium: main design is clear but some integration or operational uncertainty remains.
- Low: important scope, dependency, or environment evidence is missing.

## Re-estimation Triggers

State which events invalidate the range, such as scope change, unknown legacy behavior, unavailable API, migration volume, security review, or team capacity change.

Never hide uncertainty inside a wide unexplained range.
