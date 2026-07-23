# Backend Standard

## Goal

Provide explicit service contracts, safe data ownership, and reliable operational behavior.

## Rules

- Keep domain policy separate from transport, storage, and vendor-specific infrastructure where boundaries are material.
- Define and validate API, event, job, and persistence contracts.
- Make ownership, transaction boundaries, consistency, and concurrency behavior explicit.
- Design retries, timeouts, idempotency, and partial-failure handling for external effects.
- Preserve backward compatibility or provide an accepted migration path.
- Use least privilege for services, data stores, and operational actions.
- Emit actionable logs, metrics, traces, and health signals without sensitive data.
- Bound resource use and validate performance assumptions for critical paths.
- Test contracts and integration boundaries in addition to isolated business logic.

## Evidence

- contract and data-boundary decisions;
- failure, migration, and recovery behavior;
- integration and contract checks;
- operational signals and known limits.
