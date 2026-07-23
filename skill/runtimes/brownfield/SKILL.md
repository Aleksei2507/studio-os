---
name: brownfield
description: Analyze an existing codebase without Project Memory and create evidence-based onboarding artifacts, including observed standards and design-system profiles. Use when meaningful source code exists but the project has no .studio directory.
---

# Brownfield Runtime

> Runtime for connecting Studio OS to an existing project.

Brownfield Runtime creates the initial Project Memory for an existing codebase.

Brownfield Runtime does not perform development work.

---

# Metadata

Stage: Brownfield Onboarding

Version: 1.3

Optional: No for existing projects without Project Memory

Requires Confirmation: Yes before moving to Briefing

Creates:

- `.studio/project-state.md`
- `.studio/active-context.md`
- `.studio/standards-profile.md`
- `.studio/design-system-profile.md`
- `docs/discovery-summary.md`

Updates:

- None before the initial Project Memory exists

Next Stage:

Briefing

---

# Goal

Analyze an existing project and create the initial Project Memory.

Brownfield Runtime must determine:

- current product state;
- main product capabilities;
- architectural risks;
- technical boundaries;
- product boundaries;
- sources of truth;
- existing design-system boundaries when a user interface exists;
- unknown areas.

Brownfield Runtime must not:

- change code;
- refactor;
- write roadmap;
- write architecture;
- do planning;
- select or change implementation tasks.

---

# Required Capabilities

- `codebase-analysis`

Load `skill/capabilities/codebase-analysis.md` and use the repository's configured knowledge graph or code index before broad text search when available.

If source access or structural analysis is unavailable, record the limitation and do not claim complete onboarding.

## Required Standards

- `code-quality`;
- `testing`;
- `security-privacy`.

Load `skill/standards/STANDARD_SPEC.md`, `skill/standards/registry.json`, and only the baseline and domain standards needed to describe the existing project.

Brownfield uses them to create an `Observed` Project Standards Profile. It must not silently impose a new stack, architecture, or convention during onboarding.

---

# Inputs

Before starting, read available project materials.

Read:

- `README.md`
- `docs/`
- `package.json`
- `go.mod`
- `Cargo.toml`
- `pom.xml`
- `requirements.txt`
- `Dockerfile`
- `docker-compose.yml`
- Prisma schema, such as `prisma/schema.prisma`
- source code
- interface source, shared components, style and theme resources, design configuration, screenshots, and design files when available

If an expected file does not exist, record that absence only when it matters.

Do not modify any source file while reading.

A separately supplied document or reference repository outside the Target Workspace may support onboarding when access is authorized. Do not write its absolute or machine-specific path into Project Memory or product artifacts. Follow the Project-Local Reference Contract and retain reproducible evidence only through an approved project-local import, snapshot, or stable external URL.

---

# Brownfield Mindset

Act like an experienced product and technical analyst joining an existing project.

Start from evidence in the repository.

Separate what is confirmed from what is inferred.

Prefer concise, bounded findings over full source-code summaries.

The goal is onboarding memory, not a full audit.

---

# Brownfield Product Principles

Do not assume that an existing project is in an MVP stage.

If the project is already a working product, use:

```text
Current Product Scope
```

instead of:

```text
MVP Scope
```

Brownfield Briefing fixes the current product core.

It does not try to define MVP again.

Acceptance Criteria for Brownfield must describe product value from the user's point of view, not internal implementation.

Good:

- user receives a notification.

Bad:

- worker starts;

After Brownfield Briefing, Planning automatically enters:

```text
Development Planning
```

not:

```text
Product Planning
```

---

# Required Understanding

Before creating artifacts, identify:

- what the product appears to do today;
- which capabilities are already present;
- which areas are unclear;
- which docs or files are sources of truth;
- where product boundaries are visible;
- where technical boundaries are visible;
- which languages, frameworks, delivery surfaces, repository rules, and quality gates are observable;
- which interface foundations, component sources, design-system conventions, and platform variants are observable;
- which domain standards appear applicable;
- which risks should be preserved for Briefing.

If the repository does not contain enough evidence to determine an area, record it as Unknown.

---

# Design System Detection

Create `.studio/design-system-profile.md` with `Status: Observed` using `templates/design-system-profile.md`.

Inspect evidence appropriate to the detected delivery surfaces, including:

- package and dependency manifests plus actual imports or usage;
- shared component and primitive locations;
- theme providers, style configuration, semantic tokens, CSS variables, and platform theme resources;
- icon, typography, motion, and asset conventions;
- design documentation, screenshots, or linked design sources that are available in the project;
- repeated interaction, content, responsive, and platform patterns.

Use converging evidence. A dependency or framework name alone does not prove that its design system is active.

Record:

- applicability, source, name, version, ownership, and confidence;
- evidence paths and the observed foundations and component sources;
- the preservation policy that later Runtime stages must follow;
- conflicts, unknowns, and intentional platform variants;
- primary, secondary, and legacy boundaries when multiple design systems coexist.

When a coherent active system is observed, use `Applicability: Active` and `Preservation Policy: Preserve And Extend`.

When the project has no user-facing interface, use `Applicability: Not Applicable` and do not invent design-system content.

When a user-facing interface exists but evidence is insufficient or contradictory, use `Applicability: Unknown`, record the uncertainty, and defer definition or confirmation to Interface Design.

Brownfield Onboarding observes the current system. It must not mark it Accepted, replace it, or initiate a migration.

All evidence paths written by Brownfield must be relative to the Target Workspace. Evidence outside the Target Workspace may be described without its local path or imported according to the Project-Local Reference Contract.

---

# Conversation Rules

Do not ask the user broad discovery questions before inspecting the project.

Ask one focused clarification question only if it materially changes the initial Project Memory.

Do not ask implementation, stack-selection, roadmap, or architecture-design questions.

Do not infer the current user's technical capability from the repository. Record project and team evidence separately.

If the user requests development during Brownfield Onboarding, explain that onboarding must finish first or route the request as a later Work Item.

---

# Continue Rule

Before asking any question, check:

- Can this be answered from repository evidence?
- Will the answer change `.studio/project-state.md`, `.studio/active-context.md`, either observed profile, or `docs/discovery-summary.md`?
- Is the question about onboarding, not development?

If the answer will not change the initial Project Memory, do not ask.

---

# Forbidden

Brownfield Runtime must not:

- edit source code;
- run refactors;
- create implementation tasks;
- write `docs/roadmap.md`;
- write `docs/architecture.md`;
- make planning decisions;
- select or change the technology stack;
- replace, normalize, or migrate an existing design system;
- persist an absolute, home, Downloads, temporary, attachment-cache, or sibling-workspace path;
- classify the user's technical level;
- start Briefing automatically;
- copy full discovery content into Active Context.

---

# Output

Create:

```text
.studio/project-state.md
.studio/active-context.md
.studio/standards-profile.md
.studio/design-system-profile.md
docs/discovery-summary.md
```

## `.studio/project-state.md`

Use this format:

```md
Mode: Brownfield
Workflow: brownfield
Work Type: <detected work type or Not Selected>
Active Work Item: None
Parent Workflow: None
Return Stage: None
Project Language: <language>
Target Milestone: Not Selected
Product Readiness: Not Ready
Current Increment: None
Increment Status: None
Increment Progress: 0/Unknown
Onboarding Status: Bootstrapped
Previous Stage: Brownfield Onboarding
Current Stage: Briefing
Status: Waiting Confirmation
```

## `.studio/active-context.md`

Use only these sections:

- Current Focus
- Confirmed Facts
- Current Decisions
- Unknowns
- References

Do not copy the full Discovery Summary into Active Context.

## `.studio/standards-profile.md`

Use `templates/standards-profile.md` with `Status: Observed`.

Record only repository evidence:

- current delivery surfaces and stack;
- built-in standard IDs that appear applicable;
- project instructions and conventions;
- existing test and quality commands;
- observed release and operational constraints;
- unknown or conflicting rules.

Do not record inferred personal proficiency, select a replacement technology, or mark the profile Accepted.

## `.studio/design-system-profile.md`

Use `templates/design-system-profile.md` with `Status: Observed`.

Record only observable interface evidence and distinguish confirmed facts from inference. Preserve multiple design systems as separate primary, secondary, or legacy boundaries instead of collapsing them into one.

Do not select a replacement system. Use Not Applicable or Unknown when evidence does not support an active design system.

## `docs/discovery-summary.md`

Use this structure:

- Executive Summary
- Current Product Capabilities
- Current System Understanding
- Current Risks
- Product Boundaries
- Technical Boundaries
- Current Decisions
- Unknowns
- Recommended Next Step

Recommended Next Step must always be:

```text
Briefing
```

---

# Project Memory Update

Create initial Project Memory from repository evidence.

Keep `.studio/active-context.md` short and operational.

Use `docs/discovery-summary.md` for the full Brownfield onboarding summary.

Use `.studio/standards-profile.md` for concise observed engineering constraints and checks.

Use `.studio/design-system-profile.md` for concise observed interface-system evidence and preservation constraints.

Use the project working language determined by Loader.

---

# Stage Handoff

Pass to Briefing:

- current product understanding;
- confirmed capabilities;
- product boundaries;
- technical boundaries;
- observed stack and Project Standards Profile;
- observed Project Design System Profile when applicable;
- current risks;
- unknowns;
- references that should guide product decisions.

---

# Completion Checklist

Brownfield Onboarding is complete when:

- `.studio/project-state.md` exists;
- `.studio/active-context.md` exists;
- `.studio/standards-profile.md` exists with Observed status;
- `.studio/design-system-profile.md` exists with Observed status and evidence-bounded applicability;
- `docs/discovery-summary.md` exists;
- current state is summarized;
- capabilities are listed;
- risks and unknowns are recorded;
- product and technical boundaries are recorded;
- sources of truth are referenced;
- persisted local references pass the Artifact Portability Gate;
- Recommended Next Step is Briefing.

---

# Stop Condition

After creating the five files:

- do not start Briefing automatically;
- say that Brownfield Onboarding is complete;
- give a short evidence-based summary of the product purpose, current delivery
  surface and stack, observed design system or uncertainty, and the most
  important risk or unknown;
- reference created artifacts with project-relative paths and do not expose
  machine-specific or temporary paths in the completion response;
- offer to proceed to Briefing;
- wait for user confirmation.
