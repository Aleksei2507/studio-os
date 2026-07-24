# Studio OS Roadmap

This roadmap describes the development of Studio OS itself.

## Delivered Foundation

### v0.1 - Product Foundation

- Vision, principles, workflow model, stage boundaries, quality gates, and Project Memory.

### v0.2 - End-To-End Greenfield Workflow

- Interview, Discovery, Research, Briefing, Design Strategy, Planning, Architecture, Interface Design, Development, Validation, QA, Product Outcome, Release, and Retrospective.

### v0.3 - Existing Projects

- Brownfield Onboarding, existing-project recovery, Project Memory migration, and design-system detection.

### v0.4 - Composable Workflows

- Work Item workflows, Interaction Layer, progressive Runtime loading, standards and capability registries, and Evolution input contracts.

## Current Alpha Milestone

### v0.5 - Distribution And Delivery Assurance

Delivered:

- Codex and Claude Code marketplace adapters;
- Universal Bootstrap for filesystem-capable agents;
- versioned GitHub Releases with checksummed runtime archives;
- public website and GitHub Pages deployment;
- Project-Local Reference Contract;
- Project Standards and Design System Profiles;
- scoped Product Outcome and release-readiness gates;
- deterministic structure tests and 151 Runtime scenario definitions;
- cost-gated single-turn and multi-turn Runtime execution with LLM judgment;
- a fixture-backed Brownfield workspace with deterministic Project Memory,
  source-integrity, artifact-boundary, and portability assertions;
- an existing-project Project Memory replay with confirmation-gated migration
  and per-turn workspace checkpoints;
- a direct local Ollama harness engine with bounded filesystem access and no
  shell capability;
- a Greenfield Interview replay that verifies confirmation-gated Project
  Memory creation and the Discovery stop boundary;
- a versioned behavioral assurance policy with explicit model identity,
  immutable trial output, zero automatic retries, three-trial classification,
  privacy rules, and evaluation-budget gates.

Remaining before this milestone is considered stable:

- dogfood the highest-risk scenarios across installed Codex, Claude Code, and Universal adapters;
- extend fixture-backed checks to additional lifecycle transitions;
- define behavioral compatibility baselines for remote and local models;
- close or rewrite stale GitHub issues against the current architecture.

## Next Milestones

### v0.6 - Behavioral Assurance

Goal: verify observable Studio OS behavior beyond prompt contracts.

- Additional fixture-backed lifecycle workspaces.
- Additional multi-turn conversation replay suites.
- Cross-turn artifact and lifecycle-state assertions.
- Adapter activation matrix for Codex, Claude Code, and Universal Bootstrap.
- Critical-suite compatibility baselines and regression triage.

### v0.7 - Dogfooding And Workflow UX

Goal: reduce friction discovered in real project runs.

- Discovery confidence and explicit completion evidence.
- Compact Active Context consistency.
- Clearer waiting, blocked, and readiness language.
- Maintainer issue cleanup and acceptance criteria based on observed runs.

### v0.8 - Evolution And Feedback Intake

Goal: turn project retrospectives into controlled Studio OS improvements.

- Local feedback inbox with provenance and consent.
- Deduplication and classification of recurring lessons.
- Opt-in GitHub issue export without machine-specific paths or private project data.
- Human-reviewed promotion from project feedback to Studio OS changes.
- Traceability from accepted feedback to tests and release notes.

## Future Directions

- Provider-neutral executor and judge adapters.
- Team and organization policy packs.
- IDE integration.
- Context synchronization across approved environments.
- Multi-agent orchestration where evidence shows a clear benefit.

## North Star

Studio OS is successful when a person can bring an idea or an existing product to a filesystem-capable AI agent and move from product intent to a validated, supportable release without depending on one AI vendor.
