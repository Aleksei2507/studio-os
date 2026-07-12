# Capability Contract Specification

Capabilities describe what a Runtime needs from the current AI environment without naming a vendor-specific tool.

## Runtime Declaration

Runtime capability IDs live in `skill/workflows/registry.json`.

Before execution:

1. Resolve each capability through `skill/capabilities/registry.json`.
2. Determine whether the current environment can provide it.
3. Load only the required capability contract.
4. Map the capability to available tools, skills, commands, or manual procedures.
5. Stop when a required capability is unavailable and reliable work is impossible.

## Availability

- `available`: the environment provides sufficient tools and access.
- `unavailable`: a required tool, permission, data source, or runtime is missing.
- `unknown`: availability cannot be established without one focused check.

Do not equate a model's general knowledge with an available capability.

## Evidence

Every capability contract defines the evidence required to claim completion.

Examples:

- Research: source links and access dates.
- Codebase analysis: repository files and symbol paths.
- Validation: commands, exit status, and relevant output.
- QA: acceptance scenario evidence.
- Release: readiness decision and authorization record.

## Adapter Boundary

An adapter may map one capability to:

- a native tool;
- an installed skill;
- an MCP server;
- a CLI command;
- a documented manual procedure.

Runtime contracts must not require a specific adapter implementation.
