# Studio OS Universal Bootstrap

> Vendor-neutral entry contract for activating Studio OS before a host agent starts its default work process.

## Purpose

Use this Bootstrap when the user's observable intent is to run, start, resume, or continue product work through Studio OS.

An explicit Studio OS request combined with a product idea or project task is an execution request. Do not reinterpret it as a request to explain the Studio OS repository first.

A request only to explain, inspect, or review Studio OS is a meta request. Answer it without creating or mutating product Project Memory unless the user also asks to run Studio OS on a target project.

Infer activation from intent and available project context. Do not depend on a fixed phrase or Project Language.

## Roots

Keep these locations separate:

- **Studio OS Root:** the verified directory containing `skill/`, `adapters/`, and this Bootstrap;
- **Target Workspace:** the product project directory supplied by the user, or the current workspace when no other target is supplied.

Never use Studio OS Root as the Target Workspace merely because the adapter was loaded from there. The two roots may be the same only when the user is explicitly developing Studio OS itself.

When a host adapter activated this file, keep the Studio OS Root it already
derived and verified from the exact loaded host skill path. When the user or
host supplies this Bootstrap directly, use the exact absolute path of this
loaded `BOOTSTRAP.md` as the sole anchor and derive Studio OS Root as two parent
directories above its containing directory.

Before startup, verify these root markers:

- `adapters/universal/BOOTSTRAP.md`;
- `skill/core/LOADER.md`;
- `skill/workflows/registry.json`.

All `skill/`, `templates/`, and `adapters/` paths are relative to the confirmed
Studio OS Root. They are not relative to the current working directory, Target
Workspace, active Runtime directory, or the file that mentions them. Product
artifacts and `.studio/` state belong to the Target Workspace.

Do not reconstruct a plugin or cache path from package metadata, omit repeated
directory components, or search for another checkout when the confirmed root
fails verification.

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

## Local Tooling Requests

Some requests ask Studio OS to run one of its own bundled local tools rather than do product work — for example, opening the admin panel that renders `.studio/`, `docs/`, and `work-items/` artifacts (`scripts/admin-panel/`).

Infer this from observable intent (open/start/launch combined with admin/panel/dashboard, or an equivalent phrase in Project Language), not a fixed phrase.

When recognized:

1. Do not route through Loader, Project Mode detection, or any Runtime. This is not product work; it must not create or mutate Project Memory. It is not restricted by the Host Boundary rules above, which govern product implementation, not Studio OS's own bundled tooling.
2. Determine Studio OS Root (already resolved above) and the Target Workspace whose artifacts should be rendered — normally the current Target Workspace from this same request.
3. If the current host can execute shell commands, run:

   ```text
   node <studio-os-root>/scripts/admin-panel/server.js --workspace <target-workspace>
   ```

   with both paths filled in as absolute paths, then report the bound local URL (`http://127.0.0.1:<port>`, default port 4317, override with `--port <n>`) to the user. Inside the Studio OS development checkout only, `npm run admin -- --workspace <target-workspace>` is an equivalent convenience alias; it does not exist in an installed copy, so prefer the direct `node` form when unsure.
4. If the host cannot execute commands (filesystem-only capability), tell the user the exact command from step 3 to run themselves, with both paths filled in, and stop. Do not claim the panel started.
5. Never treat this as an execution request for the product itself, and never let it substitute for Loader routing when the user's next message is actually product work.

This rule is host-agnostic: it applies identically through the Claude Code, Codex, or Universal adapter path.

## Communication

Do not give a Studio OS architecture tour unless the user requested one. Briefly identify the selected mode and active Runtime when useful, then continue with that Runtime's required interaction.

Use Project Language for conversation and product artifacts. Keep activation behavior language-agnostic.

## Failure Behavior

If Studio OS Root, a root marker, or a required core file is unavailable,
report an adapter/bootstrap failure and stop. Do not silently fall back to the
host agent's default implementation workflow, search for a substitute Studio
OS checkout, or describe unresolved package paths as outdated references.

If the Target Workspace cannot be determined reliably, ask one focused path question. Do not ask the user to select a Studio OS mode or Runtime.
