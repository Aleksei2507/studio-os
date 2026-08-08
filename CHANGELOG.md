# Changelog

## Unreleased

- Added a `task-decomposition` Runtime between Architecture and Development
  that turns accepted scope into bounded, estimable tasks, required in
  Greenfield/Brownfield and conditional in the Feature Work Item workflow.
- Added a Traceability ID scheme (`AC<n>` Acceptance Criteria, `IT<n>` Roadmap
  iterations, `T<n>` tasks) threaded through Briefing, Planning, Development,
  and Validation output.
- Added a local admin panel (`npm run admin`) that renders `.studio/`, `docs/`,
  and `work-items/` artifacts and lets a user leave comments that land under
  `.studio/feedback/` as plain Markdown files — read and comment-write only,
  no model calls, no new runtime dependencies.
- Added a shared `.studio/feedback/` check in Loader so any active Runtime
  surfaces unresolved comments once instead of duplicating the check per
  Runtime.

## 0.5.0

- Added a Release Candidate gate aggregator with eight deterministic evidence
  gates (release metadata, release manifest, installed adapter matrix,
  compatibility baseline, compatibility summary, critical suite, issue triage,
  and documentation) that consolidate all five milestone evidence streams into
  a single pass/fail RC readiness check.
- Added an issue triage contract and canonical triage document for
  milestone-relevant GitHub issues with closed, deferred, and not-applicable
  resolution statuses.
- Added a versioned compatibility baseline for remote (Codex CLI / o4-mini) and
  local (Ollama / llama3.2) model classes with trial record schema, zero-retry
  classification policy, workspace mutation violation detection, and
  Unknown/Compatible/Flaky/Incompatible aggregation across three required
  independent valid trials per critical scenario.
- Added an installed adapter parity matrix for Codex, Claude Code, and
  Universal adapter paths in Greenfield and Brownfield modes with portable
  evidence format and acceptance gate.
- Reframed the public landing page around the development-studio operating
  model, added an end-to-end request-and-response project example through
  deployment, a deployed product visual, and a neutral comparison of tool
  responsibilities including BMAD context.
- Added a fixture-backed Product Outcome regression that keeps an accepted
  increment distinct from an incomplete milestone, preserves Not Ready product
  state, and prevents product-source or accepted-artifact mutation.

## 0.5.0-alpha.4

- Fixed installed adapter root resolution by anchoring every package path to
  the exact loaded skill file, preserving nested cache path components,
  verifying root markers, and failing closed when the package root is invalid.
- Added a cost-gated Runtime Harness with isolated Codex CLI execution, separate structured response judgment, scenario filters, sequential runs, and per-scenario diagnostic artifacts.
- Added fixture-backed Runtime execution with disposable writable workspaces,
  before/after file snapshots, exact mutation allowlists, content assertions,
  and a real Brownfield Project Memory regression scenario.
- Added bounded multi-turn replay with persistent fixture workspaces, per-turn
  checkpoints, observable transcript carryover, turn-scoped judgment, and an
  existing-project routing migration regression.
- Added a direct local Ollama behavioral engine with structured response
  judgment, bounded filesystem actions, workspace inventory, recoverable tool
  errors, and read/write containment that keeps test expectations unavailable
  to the Runtime executor.
- Added a Greenfield Interview replay that keeps the first turn read-only,
  creates only compact Project Memory after confirmation, and stops before
  Discovery.
- Added a versioned behavioral assurance policy with zero automatic retries,
  three-trial compatibility classification, bounded exploratory runs,
  reproducible run identity, immutable trial outputs, and remote-data privacy
  requirements.
- Added exact judge-expectation anchoring, explicit valid/invalid trial
  accounting, and bounded console diagnostics while preserving complete
  workspace evidence in evaluation JSON.

## 0.5.0-alpha.3

- Made release archive fixtures use the active release version so tagged GitHub Actions runs validate the same tag as local checks.

## 0.5.0-alpha.2

- Fixed Claude Code marketplace installation on clean machines by using an explicit HTTPS release source instead of transport auto-selection.

## 0.5.0-alpha.1

- Added Claude Code distribution through a GitHub marketplace, a shared host-neutral adapter, version-pinned release metadata, and public installation instructions.
- Added a self-contained public landing page, responsive product workflow explorer, installation guide, and GitHub Pages deployment workflow.
- Added a Project-Local Reference Contract and Artifact Portability Gate that prevent machine-specific absolute, Downloads, temporary attachment, and sibling-workspace paths from entering persisted project artifacts while preserving stable external web citations.
- Added an evidence-based Project Design System Profile: Brownfield Onboarding detects existing interface systems, Interface Design confirms or extends them, and Architecture, Development, and QA consume the profile progressively.
- Added GitHub distribution through a Codex repository marketplace, tag-gated release workflow, versioned universal ZIP, SHA-256 checksum, and release contract tests.
- Added explicit runtime-test assurance metadata, package-lock version validation, required hidden archive-entry checks, and a documented separation between source checkouts and runtime release archives.
- Removed the redundant root `VERSION` file so release versioning has one enforced contract.

- Added a vendor-neutral Universal Bootstrap, a validated Codex plugin adapter, and activation regression coverage that prevents host agents from bypassing Loader and Interview.

- Added Product Outcome Gate, milestone and increment readiness state, roadmap iteration routing, bug readiness context, and scoped completion rules that prevent bounded task success from being reported as completed MVP delivery.

- Added a conditional Interface Design Runtime between Architecture and Development with implementation-ready Markdown artifacts, platform-aware Web, Mobile, and Desktop guidance, design-system capabilities, Standards integration, and regression coverage.

- Added progressive Standards Layer for code quality, testing, security, accessibility, product design, web frontend, backend, mobile, and desktop delivery.
- Added Project Standards Profile with observed, provisional, and accepted states.
- Added Architecture-owned technology selection using product, Studio OS delivery and support, operational, lifecycle-cost, and Brownfield evidence independently from user proficiency and Interaction Strategy.
- Added standards evidence to Development, Validation, QA, and Release gates.

End-to-end studio workflow completion.

- Added environment-independent capability contracts and registry.
- Implemented evidence-based Research with source quality rules.
- Added Studio Assessment outcomes to Briefing.
- Implemented Design Strategy and Architecture with ADR and delivery estimation.
- Implemented Development, Validation, QA, and Release Runtime contracts.
- Added complete output templates for product and telemetry artifacts.
- Added legacy Project Memory migration for existing Studio OS projects.
- Expanded structural and runtime regression coverage.

## 0.4.0-alpha

Progressive workflow composition release.

- Added language-agnostic Interaction Layer strategies.
- Split project mode, work type, workflow, and interaction strategy.
- Added declarative Greenfield, Brownfield, Feature, Bugfix, Research, Refactor, and Evolution workflows.
- Moved canonical Runtime contracts into isolated skill folders.
- Added progressive Loader context selection and compatibility entries.
- Added Work Item Intake Runtime and workflow routing scenarios.
- Added deterministic structure tests for Runtime and workflow integrity.

## 0.3.1-alpha

Localization consistency release.

- Added Project Language rules to Runtime Specification.
- Loader now detects and stores the project working language.
- Project Memory now includes `Project Language`.
- `docs/` and `.studio/` artifacts must use the same language as the project.
- Added principle: One Project, One Language.

## 0.3.0-alpha

Runtime refactoring release.

- Added Conversation Router Runtime.
- Made Loader behave as a mostly invisible router.
- Updated Interview to build an initial hypothesis before asking questions.
- Updated Discovery to analyze Interview before asking questions.
- Updated Briefing around product decisions, recommendations, and trade-offs.
- Added a real Planning Runtime focused on value-oriented iterations.
- Updated Project Memory rules to keep active context compact.
- Updated Project State recommendation to use next-stage waiting state.
- Added Evolution Runtime based on explicitly provided project paths.
- Clarified Retrospective as project lifecycle output and Evolution as separate Studio OS maintenance workflow.

## 0.2.0-alpha

- Added Retrospective flow.
- Added Runtime Map.
- Stabilized early product stages.
