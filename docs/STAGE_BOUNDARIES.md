# Stage Boundaries

> Every Studio OS stage has a clear responsibility boundary.

Main rule:

> A stage must perform only its own work.

When a stage starts performing the next stage's work, Studio OS is behaving incorrectly.

This document is a user-facing overview. Canonical executable boundaries live in `skill/runtimes/*/SKILL.md`.

---

# Idea

## Goal

Capture the initial product idea.

## Allowed

- Describe the idea freely.
- Provide any level of detail.

## Forbidden

- Analyze the idea.
- Design the product.
- Select technology.

## Result

A product idea exists.

---

# Interview

## Goal

Understand the author's intent.

## Allowed

- Ask focused questions.
- Clarify answers.
- Form hypotheses.
- Verify understanding.

## Forbidden

- Research technology.
- Research competitors.
- Make product conclusions without user confirmation.
- Create Project Brief.

## Result

The initial product intent is understood.

---

# Discovery

## Goal

Build a coherent understanding of the product.

## Allowed

- Describe the problem and target user.
- Define product value.
- Identify constraints and risks.
- Define success criteria.
- Record open questions.

## Forbidden

- Select stack, databases, or libraries.
- Design APIs or architecture.
- Plan implementation.

## Artifact

`docs/discovery-summary.md`

---

# Research

## Goal

Collect external evidence that can affect a product decision.

## Allowed

- Research competitors and substitutes.
- Analyze the market.
- Research monetization approaches and domain practices.
- Recommend evidence-based improvements.

## Forbidden

- Change the product idea without confirmation.
- Force a recommendation without evidence.
- Make irreversible product decisions for the user.
- Present model memory as current research.
- Invent sources, competitors, prices, market data, or regulations.

## Artifact

`docs/research-summary.md`

---

# Briefing

## Goal

Turn accepted product understanding into requirements.

## Allowed

- Create Project Brief.
- Define MVP or current product scope.
- Define Non Goals.
- Define Acceptance Criteria.
- Define user scenarios.

## Forbidden

- Design architecture.
- Select technology.
- Plan implementation.

## Artifact

`docs/project-brief.md`

---

# Design Strategy

## Goal

Define the product's UX and visual direction.

## Allowed

- Define the primary device and interaction model.
- Recommend a UX and visual direction.
- Present material alternatives and trade-offs.
- Explain why the direction fits the product.
- Record the accepted decision.
- Apply product-design and accessibility standards.
- Account for mobile platform constraints when relevant.
- Preserve observed Project Design System Profile constraints for Brownfield work.

## Forbidden

- Design detailed components or screens.
- Implement layout or CSS.
- Select technical architecture.
- Impose a visual style without product rationale.
- Replace existing design-system boundaries without evidence and an accepted reason.

## Artifact

`docs/design-strategy.md`

---

# Planning

## Goal

Split accepted scope into small, valuable iterations.

## Allowed

- Create Roadmap.
- Define iterations and dependencies.
- Sequence work by product value and risk.

## Forbidden

- Design architecture.
- Implement code.

## Artifact

`docs/roadmap.md`

---

# Architecture

## Goal

Define the technical system needed to deliver and support the product.

## Allowed

- Select stack, databases, and libraries.
- Design APIs, components, data ownership, and deployment.
- Create ADRs.
- Select applicable engineering and domain standards.
- Evaluate whether Studio OS can implement, validate, operate, and support the solution.
- Make evidence-based technical decisions for the client.
- Create `.studio/standards-profile.md`.
- Check the observed Project Design System Profile for technical compatibility.

## Forbidden

- Implement product code.
- Select a stack from Interaction Strategy, profession, or inferred user proficiency.
- Transfer stack selection or support responsibility to the client by default.
- Replace an observed design system as a side effect of stack selection.

## Artifacts

- `docs/architecture.md`
- `docs/delivery-estimate.md`
- `docs/adr/`
- `.studio/standards-profile.md`

---

# Interface Design

## Goal

Turn accepted product experience and Architecture into an implementation-ready interface specification.

## Allowed

- Define detailed user flows, surfaces, navigation, and state behavior.
- Define responsive or adaptive behavior.
- Define semantic design-system foundations and reusable component patterns.
- Apply Web, Mobile, or Desktop conventions from the accepted delivery surface and stack.
- Preserve and extend Brownfield design systems.
- Verify, create, or update the applicable Project or Work Item Design System Profile.
- Create or reference inspectable wireframes and visual designs when the environment supports them.
- Create `docs/interface-design.md` or the active Work Item equivalent.

## Forbidden

- Select or change the technology stack.
- Ask the client to choose a framework for Studio OS.
- Change accepted scope, Design Strategy, or Architecture silently.
- Write production code, CSS, or application components.
- Apply the same controls and navigation to every platform without evidence.
- Claim visual validation that did not occur.
- Generate an HTML review representation.

## Artifacts

- `docs/interface-design.md`
- `.studio/design-system-profile.md` or the active Work Item equivalent

---

# Development

## Goal

Implement the accepted product increment.

## Allowed

- Write code.
- Refactor within accepted boundaries.
- Fix defects.
- Apply the active Project Standards Profile.
- Implement the accepted Interface Design when selected.
- Implement against the applicable Design System Profile when interface code is affected.

## Forbidden

- Change product requirements.
- Change accepted architecture without an ADR and confirmation.
- Change stack or standards policy independently.
- Invent or revise material interface decisions inside implementation.
- Introduce a parallel component library, token set, or theme without an accepted design decision.

## Artifacts

- Working product increment.
- `.studio/telemetry/development-report.md`

---

# Work Item Intake

## Goal

Classify a bounded change to an existing Studio OS project and select Feature, Bugfix, Research, or Refactor workflow.

## Allowed

- Check alignment with the current product goal.
- Identify affected artifacts.
- Create `work-items/*/request.md`.
- Select the matching workflow.

## Forbidden

- Write code.
- Perform Research.
- Design architecture.
- Change product scope silently.

## Artifact

`work-items/*/request.md`

---

# Validation

## Goal

Collect objective technical evidence for the increment.

## Allowed

- Run install, lint, typecheck, test, build, and smoke checks.
- Record exact commands and results.
- Map the active Standards Profile to reproducible evidence.
- Block transition when a required check fails.

## Forbidden

- Report an unexecuted check as successful.
- Replace QA with technical checks.
- Ignore a failure to advance the workflow.
- Report PASS without required standards evidence.

## Artifact

`.studio/telemetry/validation-report.md`

---

# QA

## Goal

Evaluate the increment as the intended product.

## Allowed

- Test accepted user scenarios and error paths.
- Verify Acceptance Criteria.
- Inspect the relevant build and real interface.
- Check applicable design, accessibility, privacy, and domain standards.
- Check observable Design System Profile conformance and approved deviations.

## Forbidden

- Add new product features.
- Fix code inside QA.
- Treat passing technical tests as automatic product PASS.

## Artifact

`docs/qa-report.md`

---

# Product Outcome

## Goal

Compare accepted Target Milestone criteria with evidence from all required roadmap increments.

## Allowed

- Build a milestone evidence matrix.
- Audit approved and unapproved scope changes.
- Return `PASS`, `CONTINUE`, `BLOCKED`, or `RE-SCOPE`.
- Route an incomplete milestone to the next accepted increment.
- Set `Product Readiness: Ready for Release` only on `PASS`.

## Forbidden

- Implement or repair code.
- Replace Validation or QA.
- Treat one accepted increment as the complete milestone.
- Remove accepted scope without explicit confirmation.
- Start Release or the next increment automatically.

## Artifact

`.studio/telemetry/product-outcome-report.md` or the active Work Item equivalent.

---

# Release

## Goal

Decide release readiness and prepare safe delivery.

## Allowed

- Review readiness evidence.
- Prepare release notes and operational steps.
- Mark the release READY, CONDITIONAL, or BLOCKED.
- Execute only explicitly authorized external release actions.

## Forbidden

- Fix code inside Release.
- Override failed required gates.
- Release a lifecycle milestone without Product Outcome `PASS`.
- Describe a bounded increment or Work Item release as completion of the whole product.
- Deploy, publish, tag, or notify without explicit authorization.

## Artifact

`docs/release-notes.md`

---

# Maintenance

## Goal

Continue Studio OS-owned product support after Release.

## Allowed

- Route product changes through Feature, Bugfix, Research, or Refactor Work Item workflows.
- Release updates.
- Maintain product documentation and accepted project truth.

## Forbidden

- Apply untracked production changes outside a Work Item workflow.
- Transfer support responsibility to the client without an explicit ownership change.

---

# Retrospective

## Goal

Record the experience of using Studio OS after a project, Release, or Work Item.

## Allowed

- Collect objective observations.
- Request concise user feedback.
- Record Candidate Improvements.

## Forbidden

- Change Studio OS automatically.
- Create patches instead of observations.
- Defend previous Studio OS behavior against user criticism.

## Artifact

`.studio/runtime-retrospective.md`

---

# Evolution

## Goal

Improve Studio OS deliberately.

## Allowed

- Analyze feedback.
- Create RFCs.
- Propose changes.

## Forbidden

- Change Studio OS automatically.

All changes go through an RFC and require project-owner approval.
