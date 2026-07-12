# Studio OS Manual Testing

Use disposable branches or project copies. Do not test release actions against production systems.

Point the AI environment at the updated `skill/SKILL.md` before each scenario. Start each scenario in a fresh conversation so hidden chat history cannot supply missing state.

## Automated Baseline

From the Studio OS repository:

```bash
npm run test:runner
npm run test:runtime:dry
```

Both commands must pass before manual testing.

Runtime dry tests validate scenario structure. They do not execute an AI judge yet, so manual behavior checks remain required.

## Existing Studio OS Project

Use a project that already contains `.studio/project-state.md` and accepted artifacts.

### 1. Resume And Legacy Migration

Start a fresh conversation:

```text
Use Studio OS from <path-to-studio-os>/skill/SKILL.md.
Continue this project.
```

Expected:

- existing Greenfield or Brownfield Mode is preserved;
- Interview or Brownfield Onboarding does not restart;
- current stage and Project Language are preserved;
- when routing fields are missing, Studio OS proposes `Workflow`, `Work Type`, and `Active Work Item` and asks before writing them;
- only the stored workflow and active Runtime are loaded.

### 2. Feature Work Item

Request one bounded user-visible capability.

Expected:

- Work Type becomes Feature;
- workflow becomes `work-item-feature`;
- `work-items/YYYY-MM-DD-short-name/request.md` is created;
- subsequent Brief, Roadmap, Architecture, Validation, QA, and Release artifacts remain inside that Work Item directory;
- canonical `docs/` artifacts are not overwritten before accepted release;
- project Mode remains unchanged;
- Briefing, Planning, and Architecture run only when their documented conditions apply;
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
Use Studio OS from <path-to-studio-os>/skill/SKILL.md.

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

For a user-facing product, verify that the stage defines user experience and visual direction without writing CSS or detailed components.

### Planning And Architecture

- every roadmap iteration produces value or reduces important uncertainty;
- `docs/architecture.md` traces technical responsibilities to accepted scope;
- material decisions produce ADRs;
- `docs/delivery-estimate.md` uses ranges, assumptions, risks, confidence, and re-estimation triggers.

### Development And Validation

- Development implements only accepted scope and creates `.studio/telemetry/development-report.md`;
- Validation records exact commands, exit status, relevant output, and overall status;
- failed Validation returns to Development instead of being fixed inside Validation.

### QA And Release

- QA exercises accepted user scenarios and creates `docs/qa-report.md`;
- passing automated tests alone does not guarantee QA PASS;
- Release is blocked by failed required gates or missing migration and rollback evidence;
- deployment, publication, tagging, or notification requires explicit authorization;
- `docs/release-notes.md` records the readiness decision.

## Cross-Session Test

After any completed stage, close the conversation and start a new one with only:

```text
Use Studio OS from <path-to-studio-os>/skill/SKILL.md.
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
- marks required blocked Validation instead of PASS;
- blocks QA when technical evidence is insufficient;
- blocks Release when required gates fail;
- never deploys from implied authorization.

Record unexpected behavior, created artifacts, and conversation excerpts. Convert reproducible failures into English scenarios under `tests/runtime/`.
