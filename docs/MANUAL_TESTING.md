# Studio OS Manual Testing

Use disposable branches or project copies. Do not test release actions against production systems.

Use the installed host adapter or point the AI environment at `adapters/universal/BOOTSTRAP.md` before each scenario. Start each scenario in a fresh conversation so hidden chat history cannot supply missing state.

## Automated Baseline

From the Studio OS repository:

```bash
npm run test:runner
npm run test:runtime:dry
```

Both commands must pass before manual testing.

Runtime dry tests validate scenario definitions only. They do not execute Studio OS or call an AI judge, so manual behavior checks remain required.

## Distribution Baseline

Before creating a release tag, run:

```bash
npm run release:check
python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/plugin-creator/scripts/validate_plugin.py" .
python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/scripts/quick_validate.py" skills/studio-os
claude plugin validate .
claude plugin validate .claude-plugin/plugin.json
```

Expected:

- package, host plugin, marketplace, and Git tag versions agree;
- the Codex and Claude Code plugin manifests and shared bundled skill are valid;
- no GitHub release or tag is created by these checks.

After a tagged release is published, test installation from outside the Studio OS repository:

```bash
codex plugin marketplace add Aleksei2507/studio-os
codex plugin add studio-os@studio-os
```

In a Claude Code session:

```text
/plugin marketplace add Aleksei2507/studio-os
/plugin install studio-os@studio-os
/reload-plugins
```

Start new Codex and Claude Code sessions and run the Adapter Activation scenario below. Also download the release ZIP, verify its `.sha256` file, extract it into a temporary directory, and run the filesystem-agent variant against that extracted root.

## Adapter Activation

Use an empty disposable target workspace and a fresh conversation.

With an installed Codex adapter:

```text
Use Studio OS. Build a browser Tetris game with keyboard and touch controls.
```

With an installed Claude Code adapter:

```text
/studio-os:studio-os

Build a browser Tetris game with keyboard and touch controls.
```

With a filesystem agent that has no plugin system:

```text
Read and follow <path-to-studio-os>/adapters/universal/BOOTSTRAP.md.

Use Studio OS. Build a browser Tetris game with keyboard and touch controls.
```

Expected in both cases:

- Loader selects Greenfield and hands control to Interview;
- Interview shows a short initial understanding and asks for confirmation or correction;
- the agent does not promise implementation, define detailed MVP scope, select a stack, invoke frontend implementation skills, or create product files;
- Studio OS Root is not treated as the product Target Workspace;
- README and unrelated Runtime files are not loaded at startup.

## Brownfield Design System Detection

Use a disposable existing UI project without `.studio/`. Include an actively used component library or local component layer, theme or token definitions, and at least one real interface usage path. If possible, include one unused UI dependency or a legacy interface area as counter-evidence.

Ask Studio OS to onboard the existing project.

Expected:

- Brownfield creates `.studio/design-system-profile.md` with `Status: Observed`;
- the profile identifies active component sources and foundations from converging evidence, not a dependency name alone;
- unused dependencies, secondary systems, and legacy boundaries are not reported as one primary system;
- the preservation policy is `Preserve And Extend` for an observed active system;
- a project without a user-facing interface records `Applicability: Not Applicable` instead of invented design rules;
- ambiguous interface evidence records `Applicability: Unknown` and routes later definition to Interface Design;
- onboarding does not change product code, replace the current system, or begin a migration.

## Existing Studio OS Project

Use a project that already contains `.studio/project-state.md` and accepted artifacts.

### 1. Resume And Legacy Migration

Start a fresh conversation:

```text
Read and follow <path-to-studio-os>/adapters/universal/BOOTSTRAP.md.
Continue this project.
```

Expected:

- existing Greenfield or Brownfield Mode is preserved;
- Interview or Brownfield Onboarding does not restart;
- current stage and Project Language are preserved;
- when routing fields are missing, Studio OS proposes `Workflow`, `Work Type`, and `Active Work Item` and asks before writing them;
- only the stored workflow and active Runtime are loaded.
- an existing Standards Profile is preserved, or a missing legacy profile is handled without restarting onboarding.
- an existing Design System Profile is loaded only for a relevant Runtime, and a missing legacy profile does not restart onboarding.

### Portable Reference Migration

Create a disposable legacy artifact containing one absolute path to a file inside the Target Workspace and one path to a local file outside it. Resume the project.

Expected:

- the internal path is rewritten relative to the Target Workspace when equivalence is certain;
- the external path is not retained or silently copied;
- Studio OS requests one focused import decision only if that evidence is required for active work;
- otherwise the source becomes a descriptive `Availability: External, not stored` record;
- existing mode, workflow, stage, language, and accepted decisions remain intact;
- stable `https` research citations remain unchanged.

### 2. Feature Work Item

Request one bounded user-visible capability.

Expected:

- Work Type becomes Feature;
- workflow becomes `work-item-feature`;
- `work-items/YYYY-MM-DD-short-name/request.md` is created;
- subsequent Brief, Design Strategy, Roadmap, Architecture, Interface Design, Validation, QA, and Release artifacts remain inside that Work Item directory;
- canonical `docs/` artifacts are not overwritten before accepted release;
- project Mode remains unchanged;
- the accepted Project Standards Profile remains canonical unless Architecture explicitly changes it;
- a Work Item technology or standards change remains in `work-items/<id>/standards-profile.md` until successful Release;
- Briefing, Design Strategy, Planning, Architecture, and Interface Design run only when their documented conditions apply;
- Work Item Intake does not write code.

### 3. Bugfix Work Item

Report incorrect existing behavior with observed and expected outcomes.

Expected:

- workflow becomes `work-item-bugfix`;
- Development gathers reproduction and root-cause evidence;
- the full Greenfield lifecycle does not restart;
- Validation runs after the fix and records exact commands;
- QA and Release follow workflow conditions.

### 4. Research Work Item

Ask a current external question that affects a product decision.

Expected:

- workflow becomes `work-item-research`;
- current direct sources and access dates are used;
- facts, inference, assumptions, and unknowns are separate;
- no code is written;
- findings do not trigger Development automatically.

## New Greenfield Project

Create an empty disposable directory with no `.studio/`, product artifacts, or meaningful source code.

Start a fresh conversation:

```text
Read and follow <path-to-studio-os>/adapters/universal/BOOTSTRAP.md.

I want to build <idea>.
```

Expected:

- Mode is Greenfield;
- workflow is `greenfield`;
- Work Type is New Product;
- Interview starts directly without asking whether to begin;
- Studio OS first shows its understanding and asks one useful question;
- no architecture or code is created during Interview or Discovery.

Continue through these checkpoints:

### Discovery

- `docs/discovery-summary.md` is created only after confirmation;
- problem, target user, value, constraints, success criteria, risks, and research questions are explicit.

### Research

Choose an idea with a current competitor, pricing, market, or regulatory question.

- Research runs only when evidence can change a decision;
- sources are current and linked;
- competitors include substitutes and current manual behavior;
- unsupported market numbers are omitted;
- `docs/research-summary.md` ends with recommendation and confidence.

### Briefing

- `docs/project-brief.md` contains Go, Revise, More Research, or No-Go;
- evidence strength and confidence are visible;
- the user confirms product direction;
- Briefing does not choose stack or architecture.

### Design Strategy

For a user-facing product, verify that the stage defines user experience and visual direction without writing CSS or detailed components. In Brownfield, it should read the Project Design System Profile and preserve its established experience constraints unless accepted product evidence requires revision.

### Planning And Architecture

- every roadmap iteration produces value or reduces important uncertainty;
- `docs/architecture.md` traces technical responsibilities to accepted scope;
- material decisions produce ADRs;
- `docs/delivery-estimate.md` uses ranges, assumptions, risks, confidence, and re-estimation triggers.
- `.studio/standards-profile.md` selects baseline and only relevant domain standards;
- technology selection uses product, Studio OS support, operational, and lifecycle evidence without asking about user proficiency;
- a consequential stack choice records alternatives and an ADR.

### Interface Design

For a user-facing product that needs material interface decisions, verify that:

- the stage runs after accepted Architecture and before Development;
- `docs/interface-design.md` defines flows, surfaces, navigation, states, adaptive behavior, design foundations, component patterns, accessibility, and handoff constraints;
- the accepted stack is consumed from Architecture instead of selected by the designer;
- the Project Design System Profile is verified against affected evidence and preserved or updated at the correct project or Work Item scope;
- only the relevant Web, Mobile, or Desktop reference and accepted stack adapter are loaded;
- Brownfield design systems are preserved or changed with an accepted reason;
- no production code or HTML review representation is created;
- the stage waits for confirmation before Development.

### Development And Validation

- Development implements only accepted scope and creates `.studio/telemetry/development-report.md`;
- completion output names the exact task or increment and states Target Milestone readiness separately;
- Development records applied standards and approved deviations;
- Development implements against the applicable Design System Profile without introducing a parallel component library or token set;
- Validation records exact commands, exit status, relevant output, and overall status;
- Validation maps selected standards to evidence and cannot PASS with a required standards gate blocked;
- failed Validation returns to Development instead of being fixed inside Validation.

### QA, Product Outcome, And Release

- QA exercises accepted user scenarios and creates `docs/qa-report.md`;
- QA covers selected accessibility, design, privacy, web, backend, or mobile rules that are observable at product level;
- QA checks observable Design System Profile conformance and approved deviations for interface work;
- passing automated tests alone does not guarantee QA PASS;
- Product Outcome compares the accepted increment with the Target Milestone and creates `product-outcome-report.md`;
- an accepted first increment in a multi-increment roadmap returns `CONTINUE`, preserves `Product Readiness: Not Ready`, and selects the next increment;
- only complete milestone evidence returns `PASS` and enables Release;
- Release is blocked by failed required gates or missing migration and rollback evidence;
- deployment, publication, tagging, or notification requires explicit authorization;
- `docs/release-notes.md` records the readiness decision.

### Bug Readiness Context

- report a defect while an incomplete milestone is in Development or Validation;
- Studio OS states Target Milestone, Product Readiness, current increment and progress, and current stage before routing the defect;
- incorrect accepted current behavior becomes a Bugfix;
- a capability assigned to a future roadmap increment remains planned scope rather than a Bugfix;
- after the fix, Studio OS names the repaired unit and preserves the parent milestone readiness.

## Cross-Session Test

After any completed stage, close the conversation and start a new one with only:

```text
Read and follow <path-to-studio-os>/adapters/universal/BOOTSTRAP.md.
Continue this project.
```

Expected:

- Studio OS restores state from project files rather than chat memory;
- accepted decisions are not asked again;
- only the active workflow and Runtime are loaded;
- the next stage does not start without required confirmation.

## Failure Tests

Verify at least once that Studio OS:

- stops Research when current external sources are unavailable;
- stops Development when repository or implementation capability is unavailable;
- blocks Interface Design when required modeling, design-system, or platform capability is unavailable;
- marks required blocked Validation instead of PASS;
- blocks QA when technical evidence is insufficient;
- blocks Release when required gates fail;
- never deploys from implied authorization.

Record unexpected behavior, created artifacts, and conversation excerpts. Convert reproducible failures into English scenarios under `tests/runtime/`.

Before accepting any manual scenario, scan changed `.studio/`, `docs/`, `work-items/`, and `contracts/` Markdown for absolute home, Downloads, temporary, attachment-cache, `file://`, Windows drive, UNC, and escaping traversal paths.

## Technology And Standards Tests

Run these as separate fresh conversations:

1. Delegate all technology decisions. Studio OS should recommend and own one coherent stack without asking what the user can code or maintain.
2. Ask Studio OS to build and support the product under the default model. Architecture should include implementation, operations, and continued support in the decision criteria.
3. In Brownfield, request a framework replacement based only on preference. Architecture should preserve the current stack or require migration evidence and an ADR.
4. Use an accepted mobile product with intermittent network, permissions, and device constraints. The profile should select `mobile`, `accessibility`, and relevant product-design rules and QA should require device-level scenarios.
5. Explicitly request handoff to an external engineering team. Only in this scenario should Architecture add the receiving team's stated constraints.
6. Ask Development to add speculative interfaces and layers to make trivial code SOLID. It should preserve cohesion and dependency principles without unnecessary abstractions.
7. Select one Web, one Mobile, and one Desktop stack in separate Architecture artifacts. Interface Design should load only the matching platform guidance and must not revise the selected stack.
