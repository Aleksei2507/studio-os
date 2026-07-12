# Architecture Anti-Patterns

## Stack First

Failure: selecting technology before mapping product capabilities and constraints.

Recovery: return to accepted requirements and compare options against explicit criteria.

## Architecture By Fashion

Failure: introducing microservices, event systems, or complex infrastructure because they appear modern.

Recovery: require a concrete boundary, scale, reliability, ownership, or deployment need.

## Brownfield Rewrite

Failure: replacing working architecture instead of integrating a bounded change.

Recovery: perform impact analysis and preserve unaffected components.

## Implementation Leakage

Failure: writing production code or low-level tasks during Architecture.

Recovery: record contracts, decisions, and Development handoff instead.

## False Estimate Precision

Failure: promising exact dates or costs without capacity and dependency evidence.

Recovery: use a range, explain assumptions, set confidence, and list re-estimation triggers.
