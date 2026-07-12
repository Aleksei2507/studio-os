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

Before a message reaches a stage Runtime, Studio OS should classify the user's intent.

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

Active Runtime entries declare capabilities such as External Research, Codebase Analysis, Implementation, Technical Validation, Product QA, and Release Operations. Capability contracts define required evidence without tying Studio OS to one AI vendor.

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
Development
↓
Validation
↓
QA
↓
Release
↓
Retrospective
↓
Project Done
```

Existing projects without `.studio/` do not start at Interview.

They enter through Brownfield Onboarding and then continue to Briefing after user confirmation.

Optional stages can be inserted when useful:

```text
Research
Design Strategy
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
- data model;
- integrations;
- important technical decisions.

Important decisions are recorded through ADRs.

## Artifacts

```text
docs/architecture.md
docs/delivery-estimate.md
docs/adr/
```

---

# 7. Development

## Goal

Build working increments according to the roadmap and architecture.

Development should not silently change product scope or architecture.

## Artifact

Working product increment.

Development also records:

```text
.studio/telemetry/development-report.md
```

---

# 8. Validation

## Goal

Collect objective technical facts.

Examples:

- install;
- lint;
- typecheck;
- tests;
- build;
- smoke run.

## Artifact

```text
.studio/telemetry/validation-report.md
```

---

# 9. QA

## Goal

Check the product against acceptance criteria and user scenarios.

QA is product validation, not only technical validation.

## Artifact

```text
docs/qa-report.md
```

---

# 10. Release

## Goal

Prepare the product for handoff or deployment.

## Artifact

```text
docs/release-notes.md
```

---

# 11. Retrospective

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

After Retrospective, the project lifecycle is complete.

Future changes should be handled as Work Items.

---

# Work Item Workflows

A Work Item is a bounded change to an existing Studio OS project.

Available workflow types:

- Feature;
- Bugfix;
- Research;
- Refactor.

Each workflow reuses only the Runtime stages it needs. A Bugfix does not restart Discovery. A Feature uses Briefing, Planning, or Architecture only when scope, sequencing, or technical impact requires them.

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
