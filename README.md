# Studio OS

Studio OS is a lightweight Runtime system that helps an AI assistant guide a project from idea to working product.

It is not tied to one AI model, editor, or vendor.

Read the product overview at [aleksei2507.github.io/studio-os](https://aleksei2507.github.io/studio-os/).

---

# Basic Use

With an installed host adapter:

```text
Use Studio OS.

I want to build...
```

Studio OS detects the project mode and work type, selects a workflow, and loads the active Runtime.

For an agent with filesystem access but no plugin system, provide Studio OS Root and start through the universal entry contract:

```text
Read and follow <studio-os-root>/adapters/universal/BOOTSTRAP.md.

Use Studio OS.
I want to build...
```

The Codex and Claude Code packages are declared by their host manifests and expose the same `skills/studio-os/SKILL.md`. Every entry path uses the same Universal Bootstrap; adapters do not contain workflow logic.

---

# Installation

## Codex

Add the Studio OS GitHub repository as a marketplace and install the plugin:

```bash
codex plugin marketplace add Aleksei2507/studio-os
codex plugin add studio-os@studio-os
```

Start a new Codex session after installation, then use `Use Studio OS` with a product request. The marketplace points each published plugin version at an immutable Git tag.

## Claude Code

Add the Studio OS GitHub repository as a marketplace from a Claude Code session, install the plugin, and reload:

```text
/plugin marketplace add Aleksei2507/studio-os
/plugin install studio-os@studio-os
/reload-plugins
```

Start with `/studio-os:studio-os` followed by a product request, or ask Claude Code to use Studio OS naturally. The Claude marketplace resolves the plugin from the same immutable Git tag as the published release.

## Other Filesystem Agents

Download the latest versioned ZIP and its `.sha256` file from [GitHub Releases](https://github.com/Aleksei2507/studio-os/releases). Verify the archive, extract it, and start the agent through:

```text
Read and follow <studio-os-root>/adapters/universal/BOOTSTRAP.md.

Use Studio OS.
I want to build...
```

The release archive contains the same runtime core and Universal Bootstrap as the packaged host plugins. It does not require npm at runtime.

The versioned release ZIP is a runtime distribution, not a development checkout. It includes hidden runtime entry points such as `.codex-plugin/`, `.claude-plugin/`, and `.agents/`, but intentionally omits `.github/`, `.gitattributes`, Node package files, release scripts, tests, and generated test results. Clone the Git repository when you need to develop Studio OS or run its test suites.

Maintainer release steps and publication gates are documented in [`docs/RELEASING.md`](docs/RELEASING.md).
Runtime regression levels, model-cost gates, and fixture-backed workspace checks
are documented in [`docs/runtime-testing.md`](docs/runtime-testing.md).

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
Interface Design (conditional)
↓
Development
↓
Validation
↓
QA
↓
Product Outcome
├─ CONTINUE → Next Increment → Earliest Required Runtime
└─ PASS → Release → Retrospective
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
Interface Design (conditional)
↓
Development
↓
Validation
↓
QA
↓
Product Outcome
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
Interface Design (conditional)
↓
Development
↓
Validation
↓
QA
↓
Product Outcome
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

- `adapters/universal/BOOTSTRAP.md`
- `.codex-plugin/plugin.json`
- `.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`
- `skills/studio-os/SKILL.md`
- `skill/SKILL.md`
- `skill/core/LOADER.md`
- `skill/core/INVARIANTS.md`
- `skill/core/CONVERSATION_ROUTER.md`
- `skill/core/INTERACTION.md`
- `skill/workflows/registry.json`
- `skill/workflows/*.md`
- `skill/runtimes/*/SKILL.md`
- `skill/capabilities/registry.json`
- `skill/capabilities/*.md`
- `skill/standards/registry.json`
- `skill/standards/core/*.md`
- `skill/standards/domains/*.md`

Legacy files under `skill/*.md` remain as compatibility pointers.

Studio OS uses progressive loading. It reads core rules, Project Memory, the selected workflow, and the active Runtime instead of loading every Runtime at startup.

The Universal Bootstrap runs before Loader and prevents a host agent from starting its generic planning or implementation workflow first. It also keeps Studio OS Root separate from the product Target Workspace.

`skill/workflows/registry.json` marks each Runtime as `active` or `planned`. Studio OS stops honestly when a workflow reaches a Runtime whose contract is not implemented yet.

Active Runtime entries declare environment-independent capabilities. The current AI adapter maps those capabilities to native tools, installed skills, MCP servers, CLI commands, or approved manual procedures.

Runtimes also declare direct quality standards. Architecture selects relevant domain and stack standards and stores them in `.studio/standards-profile.md`. Interface Design, Development, Validation, QA, and Release load only the standards that apply to their work.

For existing products, Brownfield Onboarding inspects actual interface evidence and creates `.studio/design-system-profile.md`. The profile identifies active component sources, foundations, platform variants, preservation rules, legacy boundaries, and uncertainty. Design Strategy preserves its experience constraints, Architecture checks technical compatibility, Interface Design confirms or extends the system, Development implements against it, and QA verifies conformance.

Development, Validation, and QA evaluate one accepted increment at a time. Product Outcome compares that evidence with the Target Milestone. It routes incomplete milestones to the next roadmap increment and allows Release only after the full accepted outcome is verified.

Technology selection considers product fit, existing architecture, Studio OS delivery and support capability, operations, security, and long-term cost. Studio OS does not choose a stack from the user's technical proficiency or transfer support responsibility to the user by default.

See `docs/STANDARDS_LAYER.md` for loading, selection, Brownfield, SOLID, and deviation rules.

---

# Interface Design

Interface Design is the product designer stage between accepted Architecture and Development. It turns accepted product and technical decisions into flows, surfaces, states, adaptive behavior, design-system foundations, component patterns, and implementation constraints.

Architecture owns technology selection. Interface Design consumes the accepted stack and loads only the matching platform guidance.

| Platform | Built-in stack mappings |
| --- | --- |
| Web | HTML + Tailwind, React, Next.js, shadcn/ui, Vue, Nuxt, Nuxt UI, Angular, Laravel, Svelte, Astro, Three.js |
| Mobile | SwiftUI, Jetpack Compose, React Native, Flutter |
| Desktop | JavaFX, WPF, WinUI 3, Avalonia, Uno Platform, UWP |

The canonical artifact is `docs/interface-design.md` or the active Work Item equivalent. Studio OS does not load every platform reference or generate an HTML review representation.

The project design system is recorded separately in `.studio/design-system-profile.md`. A Work Item that deliberately changes it uses `work-items/<id>/design-system-profile.md` until successful Release, so unimplemented design decisions do not overwrite current project truth.

---

# Project Memory

Project state lives inside the project:

```text
.studio/
  active-context.md
  design-system-profile.md
  project-state.md
  standards-profile.md
```

Project State keeps Runtime stage and product delivery status separate through `Target Milestone`, `Product Readiness`, `Current Increment`, `Increment Status`, and `Increment Progress`.

Persisted local file references are portable with the project: they use paths relative to the Target Workspace and resolve inside it. Studio OS never stores a user's home, Downloads, temporary attachment, or sibling-workspace path in `.studio/`, `docs/`, or Work Item artifacts. Stable web URLs remain valid external citations.

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
