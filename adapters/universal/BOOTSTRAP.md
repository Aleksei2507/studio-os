# Studio OS Universal Bootstrap

> Vendor-neutral entry contract for activating Studio OS before a host agent starts its default work process.

## Purpose

Use this Bootstrap when the user's observable intent is to run, start, resume, or continue product work through Studio OS.

An explicit Studio OS request combined with a product idea or project task is an execution request. Do not reinterpret it as a request to explain the Studio OS repository first.

A request only to explain, inspect, or review Studio OS is a meta request. Answer it without creating or mutating product Project Memory unless the user also asks to run Studio OS on a target project.

Infer activation from intent and available project context. Do not depend on a fixed phrase or Project Language.

## Roots

Keep these locations separate:

- **Studio OS Root:** the directory containing `skill/`, `adapters/`, and this Bootstrap;
- **Target Workspace:** the product project directory supplied by the user, or the current workspace when no other target is supplied.

Never use Studio OS Root as the Target Workspace merely because the adapter was loaded from there. The two roots may be the same only when the user is explicitly developing Studio OS itself.

All Studio OS paths below are relative to Studio OS Root. Product artifacts and `.studio/` state belong to the Target Workspace.

Persist local file references in product artifacts as project-relative paths that resolve inside the Target Workspace. Never persist a machine-specific home, download, temporary, attachment-cache, or sibling-workspace path. A separately supplied local source may be inspected when authorized, but it must be imported into the project or recorded without its host path before becoming persistent evidence.

## Startup Contract

Do not plan or implement the product before Loader selects and hands control to the active Runtime.

1. Preserve the user's complete product request and Target Workspace context.
2. Read `skill/core/LOADER.md`.
3. Follow Loader's mandatory startup sequence by reading:
   - `skill/core/INVARIANTS.md`;
   - `skill/workflows/registry.json`;
   - `skill/core/INTERACTION.md`.
4. Inspect the Target Workspace only enough to determine whether Project Memory, a meaningful codebase, or neither exists.
5. Let Loader select Project Mode, Work Type when applicable, workflow, and active Runtime.
6. Read only the selected workflow, active Runtime, and the additional contracts that Runtime explicitly requires.
7. Apply the Interaction Layer and hand control to the active Runtime in the same turn.

For a Greenfield request that already contains a product idea, start Interview without asking whether Studio OS should begin. Interview must form a short initial understanding and ask the user to confirm or correct it.

For an existing Studio OS project, resume or route the request through Project Memory and Conversation Router. For a meaningful codebase without Project Memory, start Brownfield Onboarding.

## Host Boundary

Before Runtime handoff, do not:

- promise to build or deliver the requested product;
- define detailed MVP scope or treat an initial feature list as accepted scope;
- select a technology stack, library, architecture, or implementation approach;
- invoke design, coding, browser, deployment, or other implementation skills;
- create product files or write product code;
- announce the host agent's generic methodology as the Studio OS plan;
- stop after describing how Studio OS files are organized.

Host tools and skills are capability adapters. Use them only after the active Runtime declares the capability and its stage permits the action.

Do not load README or user documentation at startup. Do not preload every workflow, Runtime, standard, capability, or optional reference.

## Communication

Do not give a Studio OS architecture tour unless the user requested one. Briefly identify the selected mode and active Runtime when useful, then continue with that Runtime's required interaction.

Use Project Language for conversation and product artifacts. Keep activation behavior language-agnostic.

## Failure Behavior

If Studio OS Root or a required core file is unavailable, report an adapter/bootstrap failure and stop. Do not silently fall back to the host agent's default implementation workflow.

If the Target Workspace cannot be determined reliably, ask one focused path question. Do not ask the user to select a Studio OS mode or Runtime.
