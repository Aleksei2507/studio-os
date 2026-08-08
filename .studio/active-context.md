# Active Context

## Current Focus

`v0.5 Distribution And Delivery Assurance` released (`Product Readiness: Ready For Release`, `Release (v0.5.0)` completed). Active work moved to a new post-release Feature Work Item: `work-items/2026-08-07-admin-panel-task-tracing/` — (1) a local read + comment-write admin panel over `.studio/`, `docs/`, `work-items/` artifacts with zero model calls, and (2) a new `task-decomposition` Runtime plus a Traceability ID threaded through Brief -> Roadmap Iteration -> Task -> Development Report -> Validation evidence. `Current Stage: Briefing` for this Work Item. Parent Workflow `brownfield` has `Return Stage: None` — nothing pending on the released milestone.

Historical v0.5 delivery context below is preserved for reference; it is not the active focus.

## Work Item: admin-panel-task-tracing

- Briefing outcome: Go, High confidence. Brief at `work-items/2026-08-07-admin-panel-task-tracing/brief.md`.
- Confirmed MVP scope: (1) local read + comment-write admin panel, zero model calls, zero new runtime dependencies by default; (2) new `task-decomposition` Runtime producing ≤8h tasks with IDs, wired between Architecture and Development in `greenfield`/`brownfield`/`work-item-feature`; shared Traceability ID across Brief -> Roadmap Iteration -> Task -> Development Report -> Validation evidence; single Loader-level `.studio/feedback/` check instead of per-Runtime duplication.
- Non Goals: no DB/auth/real-time sync, no model calls from the panel, no ticket-tracker export, no retrofitting IDs onto released v0.5 artifacts.
- Product Decisions: 8h default task ceiling; Task Decomposition `conditional` in `work-item-feature`, `required` in full `greenfield`/`brownfield` lifecycle; feedback check centralized in `skill/core/LOADER.md`.
- Planning skipped (recorded in Completed Stages) — scope has no multi-iteration sequencing beyond what Brief already enumerates.
- Feature complete: `task-decomposition` Runtime built and dogfooded on itself (`tasks.md`, T1-T9, AC1-AC5 covered); admin panel built (`scripts/admin-panel/`) and smoke-tested live against this repository's real `.studio/`/`docs/`/`work-items/`; Traceability ID scheme threaded through Briefing/Planning/Development/Validation; `.studio/feedback/` + Loader check added.
- Validation PASS (67/67 structure, 153/153 runtime dry, live HTTP smoke test). QA PASS, no blockers. Product Outcome PASS, all 5 AC VERIFIED.
- Current Stage: Release — waiting on explicit user authorization to commit; changes are uncommitted in the working tree.

## Confirmed Facts

- Target Milestone: `v0.5 Distribution And Delivery Assurance` из `docs/project-brief.md`.
- Accepted Development Roadmap содержит пять обязательных Epics; удаленных или re-scoped increments нет.
- Epic 1 имеет Development, повторную Validation `PASS` и QA reassessment `PASS`; manifest-driven candidate boundary является `VERIFIED` evidence.
- Epic 2 реализует versioned critical suite `v0.5-critical-lifecycle` с ровно десятью принятыми scenario IDs и одной product-risk responsibility на сценарий.
- Runner поддерживает `--suite` как canonical bounded selector, сохраняет declared order и portable suite identity, запрещает смешивание с другими selectors и custom test directories.
- Epic 2 Validation: `PASS`; focused critical tests 12/12, repository runner 108/108, full Runtime dry 153/153, scoped critical dry 10/10 и release metadata check `PASS`.
- Epic 2 QA: `PASS`; accepted risk coverage, maintainer preflight UX, fixture/replay boundaries, scope honesty и cost recovery проверены без model calls.
- Epic 2 Product Outcome: `CONTINUE`; Epics 1 и 2 `VERIFIED`.
- Epic 3 Development добавил canonical `tests/installed-adapters/matrix.json` с шестью exact cases: три adapters, каждый в Greenfield и Brownfield mode.
- Epic 3 Validation: `PASS`; все шесть installed-host cases проверены (evidence run `run-20260806-epic3`).
- Epic 3 QA: `PASS`; девять сценариев без model calls; Evidence Contract, adapter isolation, portable evidence, tooling integrity и acceptance criteria coverage подтверждены.
- Epic 3 Product Outcome: `CONTINUE`; Epics 1, 2 и 3 `VERIFIED`; прогресс `3/5`.
- Все три adapter paths (Codex marketplace, Claude Code marketplace, Universal ZIP) подтверждают правильный Studio OS Root, Greenfield Interview boundary, Brownfield onboarding boundary и source preservation.
- Epic 4 Development добавил compatibility baseline contract: `tests/compatibility/baseline.json` (2 combinations), `scripts/compatibility-baseline/contracts.ts` (types, classifiers, parsers), `scripts/compatibility-baseline/aggregator.ts` (aggregation, summary writing), `scripts/check-compatibility-baseline.ts` (CLI entry), `tests/compatibility/summary.json` (initial Unknown state), structure и runner тесты, package.json scripts, MANUAL_TESTING.md section.
- Epic 4 Validation: `PASS`; все тесты (structure + runner) проходят, CLI dry-mode работает, все поля соответствуют BEHAVIORAL_ASSURANCE.md контракту.
- Epic 4 QA: `PASS`; десять QA сценариев без model calls: baseline schema enforcement, classification algebra, trial record immutability, invalid trial handling, workspace mutation protocol, summary portability, CLI usability, gitignore coverage, MANUAL_TESTING.md documentation, package.json scripts.
- Epic 4 Product Outcome: `CONTINUE`; deterministic tooling принято; Epics 1–4 `VERIFIED`; прогресс `4/5`.
- Compatibility classification rules: Compatible=3/3, Flaky=1-2/3, Incompatible=0/3 или workspaceMutationViolation=true, Unknown=<3 valid trials.
- Zero-retry policy и explicit LLM cost gate (`--confirm-llm-cost`) сохраняются для всех behavioral trials.
- Behavioral trials (~132 model calls per combination) требуют отдельной explicit authorization; не выполнены как часть Epic 4 Development/Validation.
- Trial records gitignored под `test-results/` (line 66 `.gitignore`); checked-in summaries не содержат machine paths, transcripts, secrets.
- Evidence checker запрещает machine-specific, temporary, Downloads, attachment-cache и secret-like material.
- Architecture и Project Standards Profile покрывают весь milestone, включая critical-suite contract, existing Runtime harness, zero-retry policy, privacy и release boundaries.
- Interface Design для Epics 3–5 не требуется; public site и Design System Profile не меняются.

## Current Decisions

- Epic 4 принят; Product Outcome issued `CONTINUE`; прогресс `4/5`.
- Product Readiness сохраняется `Not Ready`; четыре accepted increments не делают milestone готовым к Release.
- Current Increment: `Epic 5 - v0.5 Release Candidate`; status `Planned`; progress `4/5`.
- Следующий шаг: Development Epic 5 только после явного подтверждения пользователя.
- Epic 5 scope: aggregate release evidence (package, installed-adapter, compatibility), align manifests, complete issue triage, conduct final Validation/QA/Product Outcome; no publication without separate Release authorization.
- Behavioral trials для Epic 4 (compatibility baseline execution) могут выполняться параллельно с Epic 5 Development, но требуют explicit cost authorization (`--confirm-llm-cost`).
- Raw host transcripts остаются local/ignored; persistent evidence содержит только bounded observations и portable identifiers.
- Tag push, GitHub Release и deployment не авторизованы.

## Unknowns

- Доступность authenticated host sessions и достаточного compute для трёх independent valid trials per combination (behavioral trials Epic 4).
- Candidate revision и новая неиспользованная semantic version для публикации (Epic 5).
- Milestone-relevant GitHub issues и их alignment с current architecture (Epic 5 scope).
- Статус behavioral trial execution: combination `remote-o4-mini` и `local-llama3.2` пока не имеют trial records; `tests/compatibility/summary.json` содержит placeholder Unknown state.
- Общий Runtime guard для case-insensitive artifact path collisions остается вне принятого v0.5 scope.

## References

- `docs/project-brief.md`
- `docs/development-roadmap.md`
- `docs/architecture.md`
- `.studio/standards-profile.md`
- `docs/BEHAVIORAL_ASSURANCE.md`
- `work-items/2026-08-07-admin-panel-task-tracing/request.md`
- `docs/runtime-testing.md`
- `tests/runtime/critical-suite.json`
- `tests/installed-adapters/matrix.json`
- `tests/compatibility/baseline.json`
- `tests/compatibility/summary.json`
- `scripts/compatibility-baseline/contracts.ts`
- `scripts/compatibility-baseline/aggregator.ts`
- `scripts/check-compatibility-baseline.ts`
- `scripts/check-installed-adapters.ts`
- `docs/MANUAL_TESTING.md`
- `scripts/runtime-testing/suite.ts`
- `.studio/telemetry/development-report.md`
- `.studio/telemetry/validation-report.md`
- `docs/qa-report.md`
- `.studio/telemetry/product-outcome-report.md`
- `test-results/installed-adapters/run-20260806-epic3.json`
