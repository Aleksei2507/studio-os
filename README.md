# Studio OS

Studio OS is a lightweight Runtime system that helps an AI assistant guide a project from idea to working product.

It is not tied to one AI model, editor, or vendor.

---

# Basic Use

```text
Use Studio OS.

I want to build...
```

Studio OS detects the project mode and work type, selects a workflow, and loads the active Runtime.

---

# Project Types

Studio OS supports two project entry points.

## Greenfield

```text
Greenfield
↓
Interview
↓
Discovery
↓
Briefing
↓
Planning
↓
Architecture
↓
Development
↓
Validation
↓
QA
↓
Release
↓
Retrospective
```

Start with an idea.

Greenfield is used for new products.

## Brownfield

```text
Brownfield
↓
Brownfield Onboarding
↓
Briefing
↓
Planning
↓
Architecture
↓
Development
↓
Validation
↓
QA
↓
Release
↓
Retrospective
```

Start with an existing codebase.

Brownfield is used for existing codebases.

Studio OS automatically detects the correct mode.

Studio OS automatically detects:

- Existing Studio OS projects
- Brownfield projects
- Greenfield projects
- Project Language

Project mode describes the project entry point. It does not describe every future task.

For an existing Studio OS project, Studio OS also classifies the current Work Type:

- Feature
- Bugfix
- Research
- Refactor

Each Work Type uses its own workflow without restarting the full product lifecycle.

---

# Workflow Composition

```text
Project Mode
+ Work Type
+ Interaction Strategy
↓
Selected Workflow
↓
Active Runtime
```

- Project Mode: Greenfield, Brownfield, or existing Studio OS project.
- Work Type: New Product, Feature, Bugfix, Research, or Refactor.
- Interaction Strategy: Advisor, Collaborator, or Executor.
- Workflow: the Runtime sequence for the current work.

These concerns are independent.

---

# Greenfield Lifecycle

```text
Interview
↓
Discovery
↓
Briefing
↓
Planning
↓
Architecture
↓
Development
↓
Validation
↓
QA
↓
Release
↓
Retrospective
```

---

# Runtime Files

Runtime behavior lives in:

```text
skill/runtimes/<runtime-id>/SKILL.md
```

Important files:

- `skill/SKILL.md`
- `skill/core/LOADER.md`
- `skill/core/INVARIANTS.md`
- `skill/core/CONVERSATION_ROUTER.md`
- `skill/core/INTERACTION.md`
- `skill/workflows/registry.json`
- `skill/workflows/*.md`
- `skill/runtimes/*/SKILL.md`

Legacy files under `skill/*.md` remain as compatibility pointers.

Studio OS uses progressive loading. It reads core rules, Project Memory, the selected workflow, and the active Runtime instead of loading every Runtime at startup.

`skill/workflows/registry.json` marks each Runtime as `active` or `planned`. Studio OS stops honestly when a workflow reaches a Runtime whose contract is not implemented yet.

---

# Project Memory

Project state lives inside the project:

```text
.studio/
  active-context.md
  project-state.md
```

Project artifacts live in:

```text
docs/
```

---

# Evolution

Evolution is optional and explicit.

```text
/studio:evolve

Use:
- ~/Projects/project-a/
- ~/Projects/project-b/
```

Evolution reads `.studio/runtime-retrospective.md` from provided projects and creates local proposals.
