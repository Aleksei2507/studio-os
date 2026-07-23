# How Studio OS Works

> From Idea To Working Product.

Studio OS moves a project through explicit stages.

Each stage has:

- a goal;
- required inputs;
- an artifact or memory update;
- a completion checklist;
- a stop condition.

The user owns the product. Studio OS guides the process.

---

# Activation

Studio OS Core is model-independent. A host adapter only detects the request and loads `adapters/universal/BOOTSTRAP.md`.

```text
User Request
↓
Host Adapter Or Direct Bootstrap Path
↓
Universal Bootstrap
↓
Loader
↓
Selected Workflow And Active Runtime
```

Codex and Claude Code use host-specific manifests with the shared packaged skill under `skills/studio-os/`. An agent with filesystem access but no plugin system can read the Universal Bootstrap directly. Every route must reach Loader before product planning, technology selection, implementation skills, or file changes.

The Universal Bootstrap and Loader use observable intent rather than fixed language-specific commands. A request only to explain Studio OS remains a meta request; a request to use Studio OS for a supplied product or project enters the workflow.

---

# Entry Paths

## Greenfield

Goal:
Define a new product.

Greenfield creates a product.

```text
Idea
↓
Interview
↓
Discovery
↓
Briefing
```

## Brownfield

Goal:
Understand and stabilize an existing product before planning further development.

Brownfield understands and evolves an existing product.

```text
Existing Project
↓
Brownfield Onboarding
↓
Briefing
```

Brownfield Onboarding creates initial Project Memory for an existing project.

It does not develop, refactor, plan, or write architecture.

Greenfield Planning:

```text
Product Roadmap
```

Brownfield Planning:

```text
Development Roadmap
```

---

# Message Flow

After activation, Loader selects the initial workflow and Runtime. Before a later message reaches an active stage Runtime, Studio OS should classify the user's intent.

```text
User Message
↓
Conversation Router
↓
Project Mode + Work Type
↓
Selected Workflow
↓
Current Runtime
```

This prevents accidental topic changes from corrupting the current stage.

Studio OS loads only the selected workflow and active Runtime. Public documentation and unrelated Runtime files are not mandatory startup context.

The workflow registry also records Runtime readiness. A `planned` Runtime blocks execution until its contract is implemented; Studio OS must not pretend that the stage completed.

Active Runtime entries declare capabilities such as External Research, Codebase Analysis, Interface Modeling, Design System Definition, Platform Design, Implementation, Technical Validation, Product QA, and Release Operations. Capability contracts define required evidence without tying Studio OS to one AI vendor.

Active Runtime entries may also declare direct quality standards. Additional domain and stack standards are selected progressively through the Project Standards Profile.

---

# Workflow Model

Studio OS separates:

- Project Mode: how the project entered Studio OS;
- Work Type: what outcome the current request needs;
- Workflow: which Runtime sequence handles that work;
- Interaction Strategy: how Studio OS collaborates with the user.

Examples:

```text
Greenfield + New Product + Advisor
→ Greenfield workflow

Existing Studio OS project + Bugfix + Executor
→ Bugfix Work Item workflow

Brownfield-origin project + Feature + Collaborator
→ Feature Work Item workflow
```

Interaction Strategy never selects or bypasses a workflow.

---

# Interaction Layer

Studio OS adapts to how the user works.

Strategies:

- Advisor
- Collaborator
- Executor

The user does not need to configure this manually.

The strategy is inferred from observable behavior and can change during the project.

Interaction Strategy does not classify technical proficiency and does not select technology.

---

# Standards Layer

Studio OS separates collaboration style from engineering constraints.

Standards cover:

- code quality and proportionate use of SOLID;
- testing;
- security and privacy;
- accessibility and product design;
- web frontend, backend, mobile, and desktop delivery.

Architecture selects applicable standards and records them in `.studio/standards-profile.md`. Interface Design and later Runtime stages load only the rules that apply to their responsibility.

Brownfield Onboarding separately records the observed interface system in `.studio/design-system-profile.md`. This keeps concrete component sources, tokens, themes, platform variants, legacy boundaries, and preservation policy distinct from general quality standards. Design Strategy and later interface-relevant stages load it progressively.

Studio OS acts as the development studio: it chooses technology, implements the product, validates it, prepares release, and remains responsible for continued support through Work Item workflows. The user is not expected to choose a stack or prove they can maintain it.

---

# Portable References

Persisted local file references use paths inside the Target Workspace. Inputs from Downloads, temporary attachment storage, or sibling repositories may be inspected when authorized, but their machine paths are never written into Project Memory or product artifacts.

Required local evidence is imported into a project-managed location with appropriate confirmation. Otherwise Studio OS records a descriptive unavailable-source entry without a local link. Stable web citations remain explicitly external.

---

# Project Lifecycle

```text
Idea
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
└─ PASS → Release → Retrospective → Project Done
```

Existing projects without `.studio/` do not start at Interview.

They enter through Brownfield Onboarding and then continue to Briefing after user confirmation.

During onboarding, Studio OS inspects actual component usage, themes, tokens, design configuration, platform resources, and available design evidence. It records an active, unknown, mixed, or not-applicable Design System Profile without replacing the current system.

Optional stages can be inserted when useful:

```text
Research
Design Strategy
Interface Design
```

Evolution is separate and is not part of the project lifecycle.

---

# 1. Idea

## Goal

Capture the initial product idea.

The idea may be rough.

Example:

> I want to build a service that helps dacha owners understand water filtration.

## Result

There is enough initial direction to start Interview.

---

# 2. Interview

## Goal

Understand the user's intent.

Interview collects enough context to start Discovery.

It does not analyze the product deeply and does not choose technologies.

## Result

Project Memory contains the first understanding of:

- product idea;
- user;
- problem;
- expected outcome;
- questions for Discovery.

---

# 3. Discovery

## Goal

Turn Interview into product understanding.

Discovery defines:

- problem;
- users;
- value;
- constraints;
- risks;
- success criteria.

## Artifact

```text
docs/discovery-summary.md
```

---

# 4. Briefing

## Goal

Turn Discovery into product decisions and MVP requirements.

Briefing defines:

- Studio Assessment: Go, Revise, More Research, or No-Go;
- evidence and confidence;
- MVP scope;
- Non Goals;
- User Scenarios;
- Constraints;
- Acceptance Criteria;
- Product Decisions.

## Artifact

```text
docs/project-brief.md
```

---

# Optional Stage — Research

Research is used when external information may materially change product decisions.

Examples:

- market and competitors;
- domain standards;
- legal constraints;
- pricing or monetization assumptions.

## Artifact

```text
docs/research-summary.md
```

---

# Optional Stage — Design Strategy

Design Strategy defines UX direction before detailed planning and development.

It should be recommended when visual direction, user trust, or interaction model matters.

It applies product-design and accessibility standards and includes platform constraints for mobile products.

## Artifact

```text
docs/design-strategy.md
```

---

# 5. Planning

## Goal

Split confirmed product decisions into small valuable iterations.

Each iteration should produce user-visible value, a working increment, or reduce critical uncertainty.

## Artifact

```text
docs/roadmap.md
```

---

# 6. Architecture

## Goal

Design the system needed to deliver the roadmap.

Architecture chooses:

- application architecture;
- stack;
- applicable engineering and domain standards;
- data model;
- integrations;
- important technical decisions.

Technology is selected from product fit, existing architecture, Studio OS implementation and support capability, operations, security, ecosystem, and long-term maintenance. Interaction Strategy and user proficiency are not technology-selection signals.

Important decisions are recorded through ADRs.

## Artifacts

```text
docs/architecture.md
docs/delivery-estimate.md
docs/adr/
.studio/standards-profile.md
```

---

# 7. Interface Design

## Goal

Turn accepted product experience and Architecture into an implementation-ready interface specification.

Interface Design defines:

- user flows, surfaces, navigation, and states;
- responsive or adaptive behavior;
- Web, Mobile, or Desktop platform conventions;
- semantic design foundations and reusable component patterns;
- accessibility, feedback, recovery, content, and trust behavior;
- Development and QA constraints.

Architecture selects technology. Interface Design uses the accepted stack and loads only matching platform and stack guidance.

For Brownfield work, Interface Design starts from `.studio/design-system-profile.md`. It preserves and extends observed systems by default, records multiple or legacy boundaries explicitly, and requires an accepted reason for migration. Development implements against the applicable profile and QA checks observable conformance.

The stage is conditional. It runs when Development would otherwise need to invent material interface decisions and is skipped with a recorded reason when no interface exists or established patterns fully resolve the work.

## Artifact

```text
docs/interface-design.md
.studio/design-system-profile.md
```

---

# 8. Development

## Goal

Build working increments according to the roadmap and architecture.

Development should not silently change product scope or architecture.

It implements against the accepted Project Standards Profile and records standards evidence or approved deviations.

## Artifact

Working product increment.

Development also records:

```text
.studio/telemetry/development-report.md
```

---

# 9. Validation

## Goal

Collect objective technical facts.

Examples:

- install;
- lint;
- typecheck;
- tests;
- build;
- smoke run.

Validation maps selected standards to reproducible commands or explicit blocked evidence.

## Artifact

```text
.studio/telemetry/validation-report.md
```

---

# 10. QA

## Goal

Check the product against acceptance criteria and user scenarios.

QA is product validation, not only technical validation.

It checks applicable domain rules, including mobile lifecycle and device behavior, accessibility, privacy, and product-design expectations when selected.

## Artifact

```text
docs/qa-report.md
```

---

# 11. Product Outcome

## Goal

Compare accepted milestone criteria and roadmap increments with delivered Validation and QA evidence.

An accepted increment does not complete the Target Milestone automatically.

Decisions:

- `PASS`: the complete Target Milestone is ready for Release;
- `CONTINUE`: select the next incomplete roadmap increment;
- `BLOCKED`: preserve scope and record the unblock condition;
- `RE-SCOPE`: return to Briefing for explicit confirmation.

## Artifact

```text
.studio/telemetry/product-outcome-report.md
```

---

# 12. Release

## Goal

Prepare the product for handoff or deployment.

## Artifact

```text
docs/release-notes.md
```

---

# 13. Retrospective

## Goal

Capture experience from using Studio OS on the project.

Retrospective does not improve Studio OS directly.

It creates input for optional Evolution.

## Artifact

```text
.studio/runtime-retrospective.md
```

---

# Project Done

After Product Outcome `PASS`, Release, and an optional Retrospective, the project lifecycle is complete.

Future changes should be handled as Work Items.

---

# Work Item Workflows

A Work Item is a bounded change to an existing Studio OS project.

Available workflow types:

- Feature;
- Bugfix;
- Research;
- Refactor.

Each workflow reuses only the Runtime stages it needs. A Bugfix does not restart Discovery. A Feature uses Briefing, Design Strategy, Planning, Architecture, or Interface Design only when scope, experience, sequencing, technical impact, or detailed interface decisions require them.

---

# Evolution

Evolution is an optional Studio OS maintenance workflow.

It is started manually:

```text
/studio:evolve

Use:
- ~/Projects/project-a/
- ~/Projects/project-b/
```

Evolution reads `.studio/runtime-retrospective.md` from explicitly provided projects and creates local proposals.

It does not automatically change Studio OS.

---

# Main Rule

Do not skip stages unless Studio OS explicitly explains why a stage is unnecessary.

Each stage exists to reduce errors in the next stage.

The goal remains:

> Move the user from idea to high-quality working product.

---

## Project Language

Studio OS ведёт проект на языке пользователя.

Если пользователь общается на русском, артефакты в `docs/` и файлы памяти в `.studio/` тоже создаются на русском.

Язык проекта фиксируется в `.studio/project-state.md` и сохраняется между стадиями.

Смена языка проекта возможна только по явному запросу пользователя.
