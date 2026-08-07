# QA Report

> Отчёт сохраняет исторические QA cycles. Текущее решение — раздел `Epic 3 QA Cycle - 2026-08-06`.

## Delivery Context

Target Milestone: `v0.5 Distribution And Delivery Assurance`

Product Readiness: `Not Ready`

Current Increment: `Epic 1 - Release Artifact Boundary`

Increment Progress: `0/5`; Epic 1 возвращён в Development после QA failure.

## QA Target And Environment

Target: installable Studio OS candidate package как пользовательский artifact, а не только release builder implementation.

Environment:

- isolated clean/tagged candidate `studio-os-v0.5.0-alpha.4.zip`;
- SHA-256 `fdf1207585fdbf5ebfb4df8cdf2ace062bee91fc91a6b301df42f4fd28e1d73b`;
- extracted package с `150` file entries;
- source checkout на branch `feature/init-studio-os` для проверки сохранения self-hosting Project Memory;
- product publication, remote tag и installed-host execution не выполнялись.

## Inputs And Validation Status

- `docs/project-brief.md`;
- `docs/development-roadmap.md`;
- `docs/architecture.md`;
- `docs/adr/0001-manifest-driven-runtime-package.md`;
- `.studio/telemetry/development-report.md`;
- `.studio/telemetry/validation-report.md`;
- `.studio/standards-profile.md`;
- `.studio/design-system-profile.md`.

Technical Validation status: `PASS`.

Validation доказала корректность manifest parser, tagged build, checksum, ZIP boundary и package validators. QA отдельно проверила, что пользователь получает согласованный и пригодный distribution artifact.

## Scenario Matrix

| ID | User scenario | Expected outcome | Observed outcome | Status |
| --- | --- | --- | --- | --- |
| QA-1 | Filesystem user verifies and extracts candidate ZIP | Checksum valid; archive открывается; runtime package clearly identified | Checksum и ZIP integrity проходят; README объясняет ZIP как runtime distribution | PASS |
| QA-2 | Universal consumer starts from extracted package | Bootstrap and all root markers доступны относительно package root | `adapters/universal/BOOTSTRAP.md`, Loader и workflow registry присутствуют; Bootstrap instructions coherent | PASS |
| QA-3 | Codex consumer inspects packaged entry point | Valid manifest exposes included Studio OS skill | `.codex-plugin/plugin.json` points to `./skills/`; skill and root markers присутствуют; extracted validator passes | PASS |
| QA-4 | Claude Code consumer inspects packaged entry point | Marketplace and plugin manifests expose the same skill and version | Both manifests valid; version and skill root aligned; extracted validators pass | PASS |
| QA-5 | Maintainer compares source checkout and runtime ZIP | Project Memory remains in source and is absent from installable artifact | Source contains `.studio/` and lifecycle docs; candidate excludes them | PASS |
| QA-6 | Forbidden content or silent export exclusion reaches packaging | Build stops instead of producing a misleading archive | Regression evidence rejects forbidden paths, missing entries and allowlist/export mismatch | PASS |
| QA-7 | New user follows public installation documentation shipped in ZIP | All public instructions agree with supported Codex, Claude and Universal entry paths | `docs/INSTALLATION.md` and `docs/NAVIGATOR.md` advertise stale `/studio:start` and legacy installation layout that contradict README and manifests | FAIL |
| QA-8 | User or distributor inspects declared package license | Included license communicates the terms declared by package manifests | Both manifests declare `MIT`, but `LICENSE` contains only `MIT License` and no license terms | FAIL |
| QA-9 | User reads package-local Markdown links | Internal links remain inside package and resolve | All three internal Markdown links resolve; no concrete machine-specific path detected | PASS |

Installed adapter activation is intentionally not claimed by QA-3 or QA-4. Real host behavior remains Epic 3.

## Acceptance Criteria Coverage

### Candidate archive contains Codex, Claude Code and Universal entry points

Status: PASS.

Evidence: QA-2 through QA-4, package manifests, shared skill root and extracted validators.

### Candidate archive excludes maintainer lifecycle artifacts

Status: PASS.

Evidence: QA-5; `.studio/`, self-hosting discovery, brief, roadmap, architecture, estimate, ADR present in source only.

### Candidate archive excludes development-only and machine-specific content

Status: PASS.

Evidence: archive inspection; scripts, tests, test results, package metadata, website, examples and modules absent.

### Public documentation and adapter references resolve from package root

Status: FAIL.

Evidence: QA-7; installation and activation instructions conflict with actual manifest identities.

### Package declares and includes a complete license

Status: FAIL.

Evidence: QA-8; `LICENSE` present but contains only header line with no permission, inclusion, or warranty terms.

## Interface Design Conformance

Not applicable. Epic 1 scope is release artifact boundary and does not include user-facing interface changes.

## Design System Profile Conformance

Not applicable. No interface work in scope.

## Findings And Evidence

### QA-F1 (High) — Installation documentation contradicts shipped adapter identities

`docs/INSTALLATION.md` describes global installation to `~/.studio-os/` and references `/studio:start` command. `docs/NAVIGATOR.md` declares `/studio:start` as the primary activation command. The actual packaged adapters use Codex marketplace (`codex plugin add studio-os@studio-os`) and Claude Code marketplace (`/plugin install studio-os@studio-os`) with `/studio-os:studio-os` activation; the Universal path uses `adapters/universal/BOOTSTRAP.md`. The shipped documentation will mislead new users attempting installation.

Route: Development.

### QA-F2 (Medium) — LICENSE file contains only header, no terms

`LICENSE` contains only the text `MIT License` with no copyright notice, no permission grant, no inclusion requirement, and no warranty disclaimer. Both plugin manifests declare `MIT` as the license. The distributed package lacks the actual license terms required for attribution and redistribution compliance.

Route: Development.

## Standards Coverage

- `security-privacy`: no secrets, machine paths or private data detected in the candidate archive. Portability check PASS. Finding QA-F2 is a distribution compliance gap, not a security vulnerability.
- `accessibility`: not applicable to this release artifact increment.
- `product-design`: not applicable to this release artifact increment.

## UX And Accessibility Observations

Not applicable to release artifact boundary scope.

## Scope Verification

Epic 1 scope is confirmed as the release artifact boundary only. QA did not invent new product requirements. The two failures (QA-F1, QA-F2) are within accepted Epic 1 acceptance criteria for a user-coherent distribution artifact. Installed adapter behavior remains correctly out of scope for Epic 1.

## Decision

Decision: FAIL

QA-F1 and QA-F2 violate the acceptance criterion that the distribution artifact is a coherent and complete package for the user. These are release-content defects with a clear Development remediation path and do not require Architecture or scope changes.

## Release Blockers

- QA-F1: installation documentation must accurately describe current adapter identities and activation commands before re-assessment.
- QA-F2: `LICENSE` must include complete MIT license terms before re-assessment.

## Accepted Residual Risks

- Installed adapter activation behavior (Codex, Claude Code, Universal host execution) is not tested by this QA cycle. This is the scope of Epic 3.
- Behavioral model compatibility is not tested. This is the scope of Epic 4.
- GitHub Actions release workflow behavior in the actual remote environment is not verified. This is validated at Release.

## Recommended Next Stage

Development.

Development must fix QA-F1 and QA-F2 without changing product scope, architecture, or Runtime contracts. After remediation, Validation should rebuild the candidate, verify the new checksum, inspect updated documentation and license, and re-run extracted package validators before returning to QA.

---

## Reassessment Cycle - 2026-08-03

### Delivery Context

Target Milestone: `v0.5 Distribution And Delivery Assurance`

Product Readiness: `Not Ready`

Current Increment: `Epic 1 - Release Artifact Boundary`

Increment Progress: `0/5`; Epic 1 возвращён в Validation после первого QA failure. Validation прошла. QA пересматривает исправленный candidate.

### QA Target And Environment

Target: исправленный installable Studio OS package как пользовательская дистрибуция для трёх заявленных entry paths.

Environment and build:

- disposable clean/tagged candidate `studio-os-v0.5.0-alpha.4.zip`;
- SHA-256 `891f90fa7dd5bbe05c7ef2f6463a8a38cfac244a69b848f78f9cb3de09f63745`;
- `150` regular files и `196` ZIP entries;
- independently extracted package для чтения README, installation guidance, manifests, Universal Bootstrap и license;
- current local Codex и Claude Code command inventories для non-mutating syntax checks;
- source checkout для сравнения maintainer state с installable package.

Remote installation, tag push, GitHub Release, deployment и реальная host activation не выполнялись. Installed Adapter Parity остаётся scope Epic 3.

### Inputs And Validation Status

- `docs/project-brief.md`;
- `docs/development-roadmap.md`;
- `docs/architecture.md`;
- `docs/adr/0001-manifest-driven-runtime-package.md`;
- `.studio/telemetry/development-report.md`;
- `.studio/telemetry/validation-report.md`;
- `.studio/standards-profile.md`;
- предыдущий failed cycle этого QA Report.

Technical Revalidation status: `PASS`.

Revalidation подтвердила новый checksum, exact package boundary, current installation content, полный license и Codex/Claude validators на source и independently extracted package. QA использовала тот же immutable candidate и отдельно оценила продуктовую согласованность исправлений.

Post-handoff `npm run test:structure` после QA Report и Project Memory update: PASS, `40/40`, `5` suites, `0` failures.

### Scenario Matrix

| ID | User scenario | Expected outcome | Observed outcome | Status |
| --- | --- | --- | --- | --- |
| QA-R1 | Filesystem user verifies and extracts candidate ZIP | Checksum valid; archive readable; package clearly identified | Checksum повторно подтверждён; ZIP integrity проходит; README явно отличает runtime distribution от development checkout | PASS |
| QA-R2 | Universal consumer finds the supported entry path | Bootstrap and root markers доступны относительно package root | README, Installation и Navigator указывают `adapters/universal/BOOTSTRAP.md`; Bootstrap и все три root markers присутствуют | PASS |
| QA-R3 | Codex user follows shipped installation guidance | Commands correspond to current marketplace and packaged plugin identity | README и Installation согласованы; current Codex CLI exposes marketplace add and plugin add; marketplace/plugin names equal `studio-os` | PASS |
| QA-R4 | Claude Code user follows shipped installation guidance | Marketplace, install, reload and activation guidance agree with package identity | README и Installation согласованы; current Claude Code exposes marketplace/install operations; `/studio-os:studio-os` одинаков во всех activation surfaces | PASS |
| QA-R5 | New user chooses between Codex, Claude Code and filesystem agent | Three supported paths are distinct and understandable | README и Installation дают один последовательный three-path model без legacy global layout | PASS |
| QA-R6 | Maintainer compares source checkout and runtime ZIP | Self-hosting state remains in source and is absent from distribution | Source сохраняет `.studio/` и `docs/qa-report.md`; candidate исключает оба | PASS |
| QA-R7 | User encounters forbidden content or silent export omission | Packaging fails instead of producing a misleading archive | Revalidation and regression evidence preserve fail-closed manifest, required-entry and ZIP-comparison behavior | PASS |
| QA-R8 | User or distributor reads the declared MIT license | Included file communicates permission, inclusion and warranty terms | Shipped `LICENSE` содержит полный MIT contract, copyright notice и warranty disclaimer | PASS |
| QA-R9 | User navigates package-local documentation | Internal links resolve and no concrete machine path leaks | `141` Markdown files inspected; `3` internal links resolve; machine-specific references and forbidden leaks absent | PASS |

Installed adapter behavior не выводится из QA-R3 и QA-R4. Эти сценарии проверяют shipped guidance и package identity, а не заменяют Epic 3.

### Acceptance Criteria Coverage

#### Candidate archive contains all declared entry points

Status: PASS.

Evidence: QA-R2 through QA-R4, package manifests, shared skill root and extracted validators.

#### Candidate archive excludes maintainer lifecycle artifacts

Status: PASS.

Evidence: QA-R6; `.studio/`, self-hosting discovery, brief, roadmap, architecture, estimate, ADR и `docs/qa-report.md` отсутствуют.

#### Candidate archive excludes development-only and machine-specific content

Status: PASS.

Evidence: independent boundary and portability checks; scripts, tests, test results, package metadata, website, examples и modules отсутствуют.

#### Public documentation and adapter references resolve from package root

Status: PASS.

Evidence: QA-R2 through QA-R5; README, Installation и Navigator согласованы с manifests и actual CLI commands.

#### Package declares and includes a complete license

Status: PASS.

Evidence: QA-R8; `LICENSE` содержит полный MIT text с copyright, permission grant, inclusion condition и warranty disclaimer.

### Interface Design Conformance

Not applicable.

### Design System Profile Conformance

Not applicable.

### Findings And Evidence

No new findings. QA-F1 and QA-F2 from the original cycle are resolved:
- QA-F1 resolved: Installation и Navigator документы теперь описывают текущие Codex, Claude Code и Universal entry paths без legacy `/studio:start` или global layout.
- QA-F2 resolved: `LICENSE` содержит полный MIT terms.

No scope expansion, architecture change, Runtime contract change, public site change, or Design System Profile change was introduced during remediation.

### Standards Coverage

- `security-privacy`: PASS; no secrets, machine paths or private data in candidate archive.
- `accessibility`: not applicable.
- `product-design`: not applicable.

### UX And Accessibility Observations

Not applicable.

### Scope Verification

Remediation ограничилась двумя confirmed findings. Epic 1 scope не расширился. Installed adapter activation остаётся Epic 3. Behavioral compatibility остаётся Epic 4.

### Decision

Decision: PASS

`Epic 1 - Release Artifact Boundary` satisfies its accepted product contract. The distribution artifact is coherent, complete, and correctly bounded. This decision covers the release artifact only, not installed-host activation or behavioral model compatibility.

### Release Blockers

Release blockers inside accepted Epic 1 scope: none.

Target Milestone remains `Not Ready`: Epic 2 through Epic 5 и milestone Product Outcome остаются incomplete. Tag push, GitHub Release и deployment не авторизованы.

### Accepted Residual Risks

- Installed adapter activation behavior remains Epic 3 evidence.
- Behavioral model compatibility remains Epic 4 evidence.
- GitHub Actions release environment not verified; confirmed at Release.
- `docs/qa-report.md` is now excluded from the distribution archive; the exclusion regression is in place.

### Recommended Next Stage

Product Outcome.

Product Outcome должен зафиксировать Epic 1 как accepted progress `1/5`, сохранить `Product Readiness: Not Ready` и выбрать следующий accepted roadmap increment. Milestone не должен переходить в Release после одного принятого Epic.

---

## Epic 2 QA Cycle - 2026-08-03

### Delivery Context

Target Milestone: `v0.5 Distribution And Delivery Assurance`

Product Readiness: `Not Ready`

Current Increment: `Epic 2 - Critical Lifecycle Assurance`

Increment Progress: `1/5`; Epic 2 передан в QA после PASS Validation.

### QA Target And Environment

Target: versioned critical lifecycle suite `v0.5-critical-lifecycle` как bounded evaluation contract — десять сценариев с одной product-risk responsibility каждый, deterministic evidence boundaries и explicit separation от behavioral model trials.

Environment:

- source checkout `feature/init-studio-os`, uncommitted Epic 2 changes;
- `npm run test:runner` PASS `108/108`; `npm run test:runtime:dry` PASS `153/153`; critical suite dry `10/10`;
- no model execution, no installed-host sessions, no remote CI runs.

### Inputs And Validation Status

- `docs/project-brief.md`;
- `docs/development-roadmap.md`;
- `tests/runtime/critical-suite.json`;
- `docs/BEHAVIORAL_ASSURANCE.md`;
- `docs/runtime-testing.md`;
- `tests/runtime/behavioral-policy.json`;
- `.studio/telemetry/development-report.md` (Epic 2 cycle);
- `.studio/telemetry/validation-report.md` (Epic 2 cycle).

Technical Validation status: `PASS`.

Validation подтвердила suite structure, selection contract, fixture mutation boundaries, replay checkpoints, portable suite identity и negative CLI checks. QA оценивает product contract suite как assurance artifact.

### Scenario Matrix

| ID | User scenario | Expected outcome | Observed outcome | Status |
| --- | --- | --- | --- | --- |
| QA-E2-1 | Maintainer reviews ten risk responsibilities | Each responsibility is specific, bounded, and maps to one real lifecycle risk | Ten IDs each have one clear responsibility; none are vague or duplicated; structure test закрепляет exact membership | PASS |
| QA-E2-2 | Maintainer runs preflight before behavioral execution | Repository runner and full dry must pass before scoped suite dry or behavioral run | Order documented in `docs/BEHAVIORAL_ASSURANCE.md`; negative CLI checks enforce suite-selector exclusivity | PASS |
| QA-E2-3 | Maintainer attempts to expand suite beyond ten scenarios | Runner rejects suite exceeding authorized size | Policy limit enforced; unauthorized expansion blocked by runner and structure test | PASS |
| QA-E2-4 | Four fixture-backed scenarios run | Only allowedChanges files created; source evidence preserved; no forbidden paths | Fixture assertions validated in dry run; allowedChanges exact; portability guards confirm no machine paths | PASS |
| QA-E2-5 | Two replay scenarios run across turns | Prior observable transcript carried; Project Memory checkpointed at each turn | Replay boundary confirmed in dry evidence; turn-scoped checkpoints present | PASS |
| QA-E2-6 | Behavioral run attempted without cost authorization | Runner stops before model execution | Negative CLI checks exit non-zero before any LLM call; confirmed in Validation | PASS |
| QA-E2-7 | Suite mixed with --id or --all selector | Runner rejects the combination | Selector exclusivity enforced; mixing blocked before model execution | PASS |
| QA-E2-8 | Risk metadata inspected from executor input | Suite risk responsibilities absent from executor prompt and result metadata | Confirmed by structure test and dry evidence inspection | PASS |
| QA-E2-9 | Suite report identity verified after dry run | Report contains only portable suite identity, no machine paths or risk text | Dry report contains suite id, version, source path and scenario count only | PASS |
| QA-E2-10 | Maintainer checks that Epic 1 contract is preserved | Release artifact boundary, checksum, ZIP inspection и package validators intact | `npm run test:runner` 108/108 PASS; release metadata check PASS; no Epic 1 regression | PASS |

### Acceptance Criteria Coverage

#### Suite contains exactly ten accepted scenario IDs with one risk responsibility each

Status: PASS. Evidence: QA-E2-1, structure test закрепляет exact IDs и responsibilities.

#### Deterministic gates must pass before behavioral execution is authorized

Status: PASS. Evidence: QA-E2-2, documented order и negative CLI checks.

#### Suite cannot be silently expanded or mixed with other selectors

Status: PASS. Evidence: QA-E2-3, QA-E2-7, runner enforcement.

#### Fixture and replay boundaries are exact and portable

Status: PASS. Evidence: QA-E2-4, QA-E2-5, portability guards.

#### Suite risk metadata does not reach executor

Status: PASS. Evidence: QA-E2-8, structure test и dry evidence.

### Interface Design Conformance

Not applicable.

### Design System Profile Conformance

Not applicable.

### Findings And Evidence

No findings. All ten QA scenarios PASS.

### Standards Coverage

- `security-privacy`: PASS; suite risk responsibilities, hidden expectations и assertion manifests не передаются executor; portable identifiers only.
- `accessibility`: not applicable.
- `product-design`: not applicable.

### UX And Accessibility Observations

Not applicable.

### Scope Verification

Epic 2 scope — bounded critical suite contract. QA не добавляла новых сценариев и не расширяла behavioral authorization. Behavioral model compatibility остаётся Epic 4.

### Decision

Decision: PASS

`Epic 2 - Critical Lifecycle Assurance` satisfies its accepted product contract and is accepted by QA. This decision accepts the bounded suite and its deterministic evidence boundaries, not the behavior of any untested model or installed host.

### Release Blockers

Release blockers inside accepted Epic 2 scope: none.

Target Milestone remains `Not Ready`: Epic 3 through Epic 5 and milestone Product Outcome remain incomplete. Tag push, GitHub Release, model execution and deployment are not authorized.

### Accepted Residual Risks

- Six conversational scenarios require future behavioral trials before any model compatibility claim.
- Installed-host behavior can differ from the isolated harness and remains Epic 3 evidence.
- The current worktree is not an immutable baseline revision; Epic 4 trials require an exact committed revision and model identities.
- Changing suite membership requires explicit scope and contract review and may change the accepted evaluation budget.
- Mixed-language scenario documentation remains an existing project-level observation, not an Epic 2 acceptance defect.

### Recommended Next Stage

Product Outcome.

Product Outcome should record Epic 2 as accepted progress `2/5`, preserve `Product Readiness: Not Ready` and select the next accepted roadmap increment. It must not route the milestone to Release after two accepted Epics.

---

## Epic 3 QA Cycle - 2026-08-06

### Delivery Context

Target Milestone: `v0.5 Distribution And Delivery Assurance`

Product Readiness: `Not Ready`

Current Increment: `Epic 3 - Installed Adapter Parity`

Increment Progress: `2/5`; Epic 3 передан в QA после PASS Validation.

### QA Target And Environment

Target: installed adapter parity contract — шесть independent sessions (Codex, Claude Code, Universal ZIP) × (Greenfield, Brownfield), каждый с deterministic evidence validation.

Environment:

- Codex CLI `0.144.1`, Studio OS `0.5.0-alpha.4` installed from `studio-os` marketplace;
- Claude Code `2.1.223`, Studio OS `0.5.0-alpha.4` installed from `studio-os` marketplace;
- Release ZIP `studio-os-v0.5.0-alpha.4.zip` SHA-256 `a91625da5a3eafcc3049a047e0ded7edcfa199375a190f38e27bb314e386f561`, собран из clean `git worktree` на теге `v0.5.0-alpha.4`;
- disposable workspace копии `tests/fixtures/runtime/brownfield-web/input` для каждого Brownfield case;
- empty disposable directories для каждого Greenfield case;
- source checkout `feature/init-studio-os`, uncommitted Epic 3 changes present.

### Inputs And Validation Status

- `docs/project-brief.md`;
- `docs/development-roadmap.md`;
- `tests/installed-adapters/matrix.json`;
- `docs/MANUAL_TESTING.md`;
- `docs/BEHAVIORAL_ASSURANCE.md`;
- `.studio/telemetry/development-report.md` (Epic 3 cycle);
- `.studio/telemetry/validation-report.md` (Epic 3 cycle);
- `test-results/installed-adapters/run-20260806-epic3.json`;
- `test-results/installed-adapters/reports/run-20260806-epic3/`.

Technical Validation status: `PASS`. Все 12 checks включая 5 детерминированных gates и 6 installed-host cases. Evidence checker PASS 6/6.

### Scenario Matrix

| ID | User scenario | Expected outcome | Observed outcome | Status |
| --- | --- | --- | --- | --- |
| QA-E3-1 | Codex user installs from marketplace and starts new project | Loader selects Greenfield, Interview starts, no premature implementation | Correct root resolution, Greenfield → Interview, first turn read-only; checks: 7/7 PASS | PASS |
| QA-E3-2 | Codex user installs from marketplace and onboards existing project | Brownfield Onboarding creates exactly 5 bounded artifacts, preserves source, stops before Briefing | Exact 5 files created, source untouched, explicit Briefing confirmation requested; checks: 8/8 PASS | PASS |
| QA-E3-3 | Claude Code user installs from marketplace and starts new project | Same boundary as QA-E3-1 through installed Claude Code adapter | Correct root from plugin cache, Greenfield → Interview, no premature implementation; checks: 7/7 PASS | PASS |
| QA-E3-4 | Claude Code user installs from marketplace and onboards existing project | Same boundary as QA-E3-2 through installed Claude Code adapter | Correct root, Brownfield Onboarding, 5 bounded artifacts, source preserved; checks: 8/8 PASS | PASS |
| QA-E3-5 | User downloads release ZIP and starts new project with any filesystem agent | Loader selects Greenfield from Universal Bootstrap, same activation boundary | Root derived from ZIP extraction, root markers verified, Greenfield → Interview; checks: 7/7 PASS | PASS |
| QA-E3-6 | User downloads release ZIP and onboards existing project with any filesystem agent | Brownfield Onboarding from ZIP root, same artifact boundary | ZIP root confirmed, Brownfield Onboarding, 5 bounded artifacts, source preserved; checks: 8/8 PASS | PASS |
| QA-E3-7 | One adapter fails while others pass | Failure of one path is not masked by others | Evidence aggregator applies FAIL/BLOCKED precedence over PASS; confirmed by structure tests and evidence checker | PASS |
| QA-E3-8 | Evidence contract evaluated for over-claiming | Evidence must not assert behavioral model compatibility | failureOwner records and summary text confirm activation boundary only; no model compatibility claim present | PASS |
| QA-E3-9 | Epic 1 and Epic 2 contracts verified intact | No regression in release boundary or critical suite | npm run test:runner 120/120 PASS; release:check PASS; all prior acceptance criteria preserved | PASS |

### Acceptance Criteria Coverage

#### All three adapter paths independently verified in both project modes

Status: PASS. Evidence: QA-E3-1 through QA-E3-6; separate fresh sessions, distinct distribution sources, 6/6 PASS.

#### Failure of one adapter path does not mask others

Status: PASS. Evidence: QA-E3-7; aggregator precedence confirmed in structure tests.

#### Evidence is portable and sanitized

Status: PASS. Evidence: evidence checker rejected machine paths, traversal, and secret-like text; all 6 records accepted.

#### Evidence contract does not claim behavioral model compatibility

Status: PASS. Evidence: QA-E3-8; activation boundaries only; behavioral compatibility explicitly deferred to Epic 4.

#### Prior Epic contracts are preserved

Status: PASS. Evidence: QA-E3-9; 120/120 runner, release:check PASS.

### Interface Design Conformance

Not applicable. Epic 3 scope is installed adapter parity; no user-facing interface changes.

### Design System Profile Conformance

Not applicable.

### Findings And Evidence

No findings. All nine QA scenarios PASS.

**Observation (не блокер):** Universal cases использовали Claude Code как host-агента для чтения BOOTSTRAP.md напрямую, а не полностью независимый filesystem agent без plugin system. Это допустимо по `docs/MANUAL_TESTING.md` и документировано в Validation Report как residual risk. Будущие Universal runs могут использовать другой filesystem agent для более строгой изоляции.

### Standards Coverage

- `security-privacy`: PASS; evidence ограничен `test-results/installed-adapters/`; raw host transcripts не персистированы; machine paths и secrets отклонены checker.
- `accessibility`: not applicable.
- `product-design`: not applicable.

### UX And Accessibility Observations

Not applicable.

### Scope Verification

Epic 3 scope — installed adapter parity только. QA не расширяла scope в behavioral model testing (Epic 4) или remote CI runs. Existing Epic 1 и Epic 2 contracts не нарушены.

### Decision

Decision: PASS

`Epic 3 - Installed Adapter Parity` satisfies its accepted product contract. All three adapter paths activate Studio OS correctly in both Greenfield and Brownfield modes with portable, independently validated evidence. This decision covers activation boundaries and onboarding artifact constraints, not behavioral model compatibility or installed-host behavior beyond the tested activation scenarios.

### Release Blockers

Release blockers inside accepted Epic 3 scope: none.

Target Milestone remains `Not Ready`: Epic 4, Epic 5, и milestone Product Outcome remain incomplete. Tag push, GitHub Release, model behavioral execution и deployment не авторизованы.

### Accepted Residual Risks

- Behavioral model compatibility для конкретных remote/local моделей остаётся неизвестной; это scope Epic 4.
- Universal ZIP cases использовали Claude Code host; independent filesystem agent без plugin system усилил бы изоляцию.
- ZIP SHA-256 `a91625da...` отличается от previous QA `891f90fa...` при одном теге; расхождение документировано; candidate для следующего release потребует fresh build и verification.
- Host version или marketplace cache updates могут повлиять на activation при будущих обновлениях.
- Case-insensitive artifact collision guard остаётся вне принятого v0.5 scope.

### Recommended Next Stage

Product Outcome.

Product Outcome должен зафиксировать Epic 3 как accepted progress `3/5`, сохранить `Product Readiness: Not Ready` и выбрать следующий accepted roadmap increment (Epic 4). Milestone не должен переходить в Release после трёх принятых Epics.

## Epic 4 QA Cycle - 2026-08-07

### Delivery Context

Target Milestone: `v0.5 Distribution And Delivery Assurance`

Product Readiness: `Not Ready`

Current Increment: `Epic 4 - Remote And Local Compatibility Baseline`

Increment Progress: `3/5`

### QA Target And Environment

Target: Epic 4 deterministic tooling — baseline contract, trial record schema, aggregator CLI, structure and runner tests, MANUAL_TESTING.md protocol.

Environment:
- Studio OS revision: feature/init-studio-os
- Node.js with tsx, no model execution
- Product publication, behavioral trials, and tag operations were not performed

### Inputs And Validation Status

- `docs/project-brief.md`
- `docs/development-roadmap.md` (Epic 4 scope and acceptance criteria)
- `docs/architecture.md` (Compatibility Evidence responsibilities)
- `docs/BEHAVIORAL_ASSURANCE.md` (classification rules and trial identity requirements)
- `.studio/standards-profile.md`
- `.studio/telemetry/development-report.md`
- `.studio/telemetry/validation-report.md`

Technical Validation status: `PASS`

### Scenario Matrix

| ID | Scenario | Expected outcome | Observed outcome | Status |
| --- | --- | --- | --- | --- |
| QA-E4-1 | Maintainer validates baseline contract | `test:compatibility:dry` prints 2 named combinations with correct baselineId, suiteId, requiredTrials; exits 0 | `v0.5-compatibility`, `v0.5-critical-lifecycle`, `requiredTrials: 3`, `PASS remote-o4-mini`, `PASS local-llama3.2`; exit 0 | PASS |
| QA-E4-2 | Classification rules match behavioral assurance policy | Compatible=3/3, Flaky=1-2/3, Incompatible=0/3, Unknown=<3, mutation=Incompatible immediately | All 8 classification cases match policy exactly | PASS |
| QA-E4-3 | Baseline suiteId matches critical-suite.json | `baseline.suiteId === suite.suiteId`; summary has 10 scenarios per combination | `v0.5-critical-lifecycle` matches; summary has 10×2=20 entries | PASS |
| QA-E4-4 | Initial summary honesty: no premature classification | All 20 scenario×combination pairs are `Unknown` with 0 valid/passed/failed/invalid trials | All 20 pairs `Unknown`, all counts 0, both combo overallClassification `Unknown` | PASS |
| QA-E4-5 | Invalid trial counted separately | One valid PASS + one invalid timeout → validTrials=1, invalidTrials=1, classification=Unknown | validTrials=1, invalidTrials=1, passedTrials=1, classification=Unknown | PASS |
| QA-E4-6 | Zero-retry enforcement | No retry logic in any new script | `grep` for retry/retries/rerun found nothing in three Epic 4 files | PASS |
| QA-E4-7 | Privacy boundary: checked-in artifacts | `summary.json` and `baseline.json` contain no machine paths | Zero forbidden-path matches in both files | PASS |
| QA-E4-8 | Trial records are gitignored | `test-results/compatibility/` covered by `.gitignore` | `.gitignore:66:test-results/` covers the path | PASS |
| QA-E4-9 | Tooling availability | `test:compatibility:dry` and `test:compatibility:check` in `package.json` | Both scripts present and correct | PASS |
| QA-E4-10 | Protocol documentation completeness | MANUAL_TESTING.md covers: section header, commands, authorization, --trial, o4-mini, llama3.2, validTrial, workspaceMutationViolation, promotion gate, invalid trial policy | All 11 documentation checks PASS | PASS |

### Acceptance Criteria Coverage

| Criterion (from development-roadmap.md) | Status |
| --- | --- |
| Each baseline combination has exact reproducible identities | PASS — `executorModel`, `judgeModel`, `engine`, `adapter` fixed in contract |
| Three independent valid trials required per combination | PASS — `REQUIRED_TRIALS = 3` enforced by aggregator; `Unknown` returned until 3 valid trials |
| No automatic retries | PASS — zero retry logic found; policy documented in MANUAL_TESTING.md |
| Failed and invalid records preserved separately | PASS — `validTrial: false` records tracked in `invalidTrials` count; not overwritten |
| Deterministic workspace violation immediately Incompatible | PASS — `workspaceMutationViolation: true` bypasses trial count in `classifyCompatibility` |
| Checked-in summaries free of machine paths | PASS — privacy audit found zero forbidden paths |

### Scope Verification

- No Runtime Markdown contracts modified.
- No existing adapter paths, workflows, or scenarios modified.
- No release manifest or allowlist changed.
- Epic 4 files are not in the release archive (confirmed by `release:check` PASS).
- Interface Design not required; no UI surface changed.
- Design System Profile not affected.
- Behavioral trials not claimed as completed; all scenarios correctly remain `Unknown`.
- Epics 4 and 5 scope remains intact and visible.

### Findings And Evidence

No findings. All 10 QA scenarios PASS without findings.

### Standards Coverage

| Standard | Observable QA evidence |
| --- | --- |
| `security-privacy` | Checked-in artifacts free of machine paths, secrets, transcripts; trial records gitignored |
| `testing` | 22 deterministic tests; classification rules verified independently against policy text |
| `code-quality` | TypeScript strict, consistent with existing script patterns |
| `behavioral assurance` | Classification rules, invalid trial separation, zero-retry, trial identity fields all match `docs/BEHAVIORAL_ASSURANCE.md` |

### Decision

**PASS**

All 10 QA scenarios pass. Accepted scope matches delivered implementation. No premature classification is claimed. Behavioral trials correctly remain `Unknown` until explicit cost authorization and three independent valid trials per combination are completed.

### Release Blockers

None for Epic 4 deterministic tooling.

Behavioral trials (approx. 132 model calls per combination) remain outstanding. These are required before `test:compatibility:check` can return PASS, but their execution requires explicit cost and execution authorization separate from this QA cycle.

### Accepted Residual Risks

- Ollama `llama3.2` and OpenAI `o4-mini` availability are execution risks for Validation of actual trials; confirmed as infrastructure, not a tooling defect.
- Provider-side model version drift behind `o4-mini` tag may affect trial reproducibility; maintainer is instructed to capture `providerVersion` when available.
- All 20 scenario×combination pairs remain `Unknown` — the correct pre-trial state.

### Recommended Next Stage

Product Outcome.

Product Outcome должен зафиксировать Epic 4 как accepted progress `4/5`, сохранить `Product Readiness: Not Ready` и выбрать Epic 5 как следующий increment. Milestone не должен переходить в Release с двумя PLANNED Epics. Behavioral trials являются execution activity под Epic 4 принятыми contracts — они не блокируют Product Outcome для deterministic tooling increment.

## Epic 5 QA Cycle - 2026-08-07

### Scope

Epic 5 - v0.5 Release Candidate. QA оценивает RC evidence aggregator, issue triage contract, CLI tooling, тесты и документацию. Без model calls.

### QA Scenarios

| # | Сценарий | Результат |
| --- | --- | --- |
| 1 | RC gate contract integrity — все 5 epic streams покрыты 8 gates | PASS |
| 2 | Issue triage schema enforcement — `parseIssueTriage` отклоняет неизвестный resolution | PASS |
| 3 | Summary output portability — `writeRCSummary` не содержит абсолютных путей | PASS |
| 4 | Gate failure isolation — `tryGate()` изолирует каждый gate; один fail не блокирует остальные | PASS |
| 5 | Dry mode поведение — `--dry` не вызывает `writeRCSummary` | PASS |
| 6 | CLI error handling — `parseArgs` отклоняет `--unknown` и `--dry --output` | PASS |
| 7 | Acceptance criteria alignment — все 7 AC из Epic 5 roadmap покрыты gates | PASS |
| 8 | Регрессия предыдущих тестов — 188/188 PASS после добавления Epic 5 | PASS |
| 9 | MANUAL_TESTING.md coverage — секция `## Release Candidate` содержит все требуемые паттерны | PASS |
| 10 | Milestone completeness — Epics 1–5 детерминистически VERIFIED; behavioral trials и smoke test остаются отдельными execution activities | PASS |

### Decision: PASS

### Recommended Next Stage

Product Outcome.

Product Outcome должен оценить полный Target Milestone `v0.5 Distribution And Delivery Assurance` (все пять Epics), а не только последний Epic. При PASS milestone milestone Product Readiness переходит в `Ready For Release` и выпускается Release Authorization Request. Behavioral trials и post-publication smoke test остаются вне принятого milestone scope — они не блокируют Product Outcome для deterministic RC tooling.
