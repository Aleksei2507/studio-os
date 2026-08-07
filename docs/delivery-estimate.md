# Delivery Estimate

## Scope

Оценка покрывает оставшуюся delivery work для всех пяти Development Epics milestone `v0.5 - Distribution And Delivery Assurance` после принятия Architecture.

Включены implementation, deterministic validation, QA, adapter dogfooding, behavioral evidence, migration documentation и release-candidate preparation. Публикация release не включена без отдельного разрешения.

## Estimate Summary

| Development Epic | Relative size | Effort range |
| --- | --- | --- |
| Epic 1 - Release Artifact Boundary | Small-Medium | 2-4 engineer-days |
| Epic 2 - Critical Lifecycle Assurance | Medium | 4-7 engineer-days |
| Epic 3 - Installed Adapter Parity | Medium-Large | 4-8 engineer-days |
| Epic 4 - Remote And Local Compatibility Baseline | Medium-Large | 4-7 engineer-days |
| Epic 5 - v0.5 Release Candidate | Medium | 3-6 engineer-days |
| **Total** |  | **17-32 engineer-days** |

Calendar duration не оценивается: нет принятой capacity, доступности внешних hosts, model runtimes и времени ожидания CI. Effort ranges описывают работу Studio OS, а не обещанную дату.

## Breakdown By Iteration Or Work Item

### Epic 1 - Release Artifact Boundary: 2-4 engineer-days

- Manifest contract, loader и validation boundary: 0.5-1.5.
- Allowlisted tagged-tree resolution и archive integration: 0.5-1.
- Release fixture, forbidden-content и checksum regressions: 0.5-1.
- Release documentation, migration check и Development evidence: 0.5.

Главная неопределенность: точный public documentation allowlist и Git archive pathspec behavior в CI.

### Epic 2 - Critical Lifecycle Assurance: 4-7 engineer-days

- Critical-suite contract и runner selection: 0.5-1.
- Gap analysis десяти scenarios и deterministic checkpoints: 1-2.
- Дополнительные fixture/replay evidence и runner tests: 1.5-2.5.
- Full deterministic validation и failure triage: 1-1.5.

Главная неопределенность: какие существующие сценарии требуют нового fixture-backed workspace вместо response-only judgment.

### Epic 3 - Installed Adapter Parity: 4-8 engineer-days

- Reproducible evidence format и environment identity: 0.5-1.
- Codex installed-path dogfooding: 0.5-1.5.
- Claude Code installed-path dogfooding: 1-2.
- Universal archive dogfooding: 0.5-1.
- Cross-host triage, documentation и rerun after supported fixes: 1.5-2.5.

Главная неопределенность: host availability, authentication и host-version-specific failures.

### Epic 4 - Remote And Local Compatibility Baseline: 4-7 engineer-days

- Select and record reproducible remote/local identities: 0.5-1.
- Baseline orchestration и immutable output verification: 0.5-1.
- Execute accepted trials and classify evidence: 1.5-2.5.
- Failure ownership, regression fixes in scope и final summary: 1.5-2.5.

При текущем critical suite полный план составляет приблизительно 132 model calls:

- 12 executor turns и 10 judge calls на один suite trial;
- 3 trials на combination;
- 2 accepted remote/local combinations.

Изменение scenario turn count, judge protocol или combination count требует пересчета.

### Epic 5 - v0.5 Release Candidate: 3-6 engineer-days

- Version, manifests, public docs и issue alignment: 1-2.
- Full deterministic, plugin и skill validation: 0.5-1.
- Candidate package и three-adapter smoke evidence: 0.5-1.
- QA, Product Outcome, release evidence и blocker resolution: 1-2.

Главная неопределенность: количество milestone-relevant stale issues и blockers, найденных в installed-adapter evidence.

## Complexity Drivers

- Один source repository одновременно содержит installable Runtime, public site, dev tooling и self-hosting Project Memory.
- Hidden plugin manifests должны сохраняться в archive при строгой allowlist boundary.
- Реальный package строится только из clean tagged tree.
- Model behavior и judge behavior недетерминированы, но retries запрещены.
- Three-host dogfooding требует разной local authentication и host identity.
- Artifact paths должны оставаться переносимыми и не раскрывать локальную environment structure.
- Case-insensitive filesystem уже выявила collision между default lifecycle output и существующим product artifact.

## Dependencies And Critical Path

Critical path:

```text
Release Artifact Boundary
-> Critical Lifecycle Assurance
-> Installed Adapter Parity and Compatibility Baseline
-> v0.5 Release Candidate
-> Product Outcome
-> explicit Release authorization
```

Dependencies:

- Git и Node.js environment, совместимый с текущим repository tooling;
- доступ к Codex и Claude Code installations для Epic 3;
- доступ к одной exact remote и одной exact local model class для Epic 4;
- stable GitHub repository, Actions, Pages и Releases contracts;
- пользовательское разрешение перед remote real-project data, tag, push или release publication.

Epic 4 может частично выполняться параллельно Epic 3 после принятия Epic 2, но итоговый release candidate требует оба evidence streams.

## Interface Design, Validation, QA, Migration, And Release Effort

### Interface Design

0 engineer-days для принятого scope. Design System Profile сохраняется без изменений. Любое interface изменение является scope trigger.

### Validation

Около 20-25% диапазона каждого Epic зарезервировано на deterministic tests, exact command evidence и regression triage.

### QA

Около 10-20% для user-observable stage outcomes, archive inspection, portability и support-claim verification.

### Migration

Epic 1 включает migration только для future release builds. Published tags не изменяются; Runtime paths и user Project Memory не мигрируют.

### Release

Epic 5 включает candidate preparation и readiness evidence. Создание tag, push и GitHub Release не входит в effort до explicit authorization.

## Operational Cost Drivers

- Remote executor и judge model usage: ориентировочно 132 calls для принятой минимальной baseline; денежная стоимость неизвестна без exact models и current pricing.
- Local model execution: денежная стоимость не оценивается; драйверы — hardware availability, inference duration и energy use.
- GitHub Actions, Pages и Releases: текущий usage сохраняется; дополнительная стоимость не подтверждена repository evidence.
- Host installation и authentication могут потребовать ручного времени, но не нового hosted infrastructure.

## Assumptions

- Existing TypeScript/Node release tooling остается базой реализации.
- Новый production dependency и hosted service не требуются.
- Critical suite остается ограниченным десятью сценариями.
- Baseline содержит две combinations: одну remote и одну local.
- Каждая combination требует три independent valid trial на scenario.
- Codex, Claude Code и Universal остаются заявленной adapter boundary.
- Public site и дизайн-система не меняются.
- Scope defects, найденные во время evidence runs, исправляются только если блокируют принятые acceptance criteria.

## Exclusions

- Новые Runtime, Work Item types и lifecycle stages.
- General workflow UX improvements вне critical failures.
- Hosted Evolution или retrospective collection service.
- IDE integration, team policy packs и multi-agent orchestration.
- Поддержка дополнительных model classes и AI hosts.
- Редизайн public site или изменение Design System Profile.
- Release publication, deployment и внешние paid services без отдельного разрешения.
- Exact calendar date и monetary cost.

## Risks

- External host или model недоступны и превращают planned trial в invalid evidence.
- Critical-suite gap потребует более сложного fixture, чем следует из scenario definition.
- Manifest allowlist по ошибке исключит runtime dependency; installed smoke tests должны обнаружить это до Release.
- GitHub или host update изменит behavior после принятой baseline.
- Compatibility failure может потребовать Runtime contract fix и повторного независимого trial set без удаления исходной evidence.
- Stale issue triage может открыть дополнительный accepted blocker.

## Confidence

Confidence: Medium

Основная architecture и repository boundaries подтверждены. Диапазон Epic 1 имеет наиболее высокую определенность. Общая confidence снижена внешними host/model dependencies и неизвестным объемом regression triage.

## Re-estimation Triggers

- изменение принятого Critical Suite или количества model combinations;
- необходимость нового provider adapter или third-party ZIP dependency;
- невозможность использовать Git pathspecs одинаково локально и в CI;
- изменение Runtime root layout или plugin manifests;
- interface или design-system scope change;
- unavailable Codex, Claude Code, remote или local model environment;
- security/privacy requirement, запрещающий текущий evidence flow;
- более двух material cross-host regressions;
- изменение milestone или Product Brief;
- подтвержденная team capacity, позволяющая перейти от effort к calendar estimate.
