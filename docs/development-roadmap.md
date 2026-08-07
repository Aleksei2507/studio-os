# Development Roadmap

> Этот Brownfield-артефакт использует отдельное имя, потому что существующий `docs/ROADMAP.md` является продуктовым roadmap Studio OS и совпадает с Runtime default path на case-insensitive файловых системах.

## Goal

Завершить `v0.5 - Distribution And Delivery Assurance` и получить доказуемо переносимую Studio OS: пользователь устанавливает ее через любой заявленный adapter path, входит в правильный workflow и получает предсказуемые lifecycle boundaries, а maintainer видит воспроизводимую compatibility и release evidence.

Roadmap развивает существующий продукт и не создает новый. Product Readiness остается `Not Ready`, пока Product Outcome не подтвердит все пять Development Epics как единый Target Milestone.

## Roadmap Principles

- Сохранять принятые Current Product Scope, product boundaries, technical boundaries, Runtime architecture и дизайн-систему.
- Каждый Epic должен давать пользователю новую надежность или устранять критическую неопределенность.
- Сначала отделить публичный Runtime artifact от self-hosting Project Memory, затем наращивать evidence поверх стабильной package boundary.
- Разделять deterministic repository gates, isolated behavioral trials и installed-adapter dogfooding; один слой не заменяет другой.
- Не скрывать failed, flaky, incompatible или invalid evidence повторными прогонами.
- Работать по одному принятому инкременту и не считать отдельный успешный Epic готовностью всего milestone.
- Не публиковать tag, release или deployment без отдельного явного разрешения.

## Development Epics

### Epic 1 - Release Artifact Boundary

#### Goal

Зафиксировать границу между installable Studio OS Runtime и внутренними self-hosting артефактами проекта.

#### Business Value

Пользователь получает чистую переносимую дистрибуцию без maintainer Project Memory, локального lifecycle context или dev-only содержимого. Maintainer может безопасно использовать Studio OS для разработки самой Studio OS.

#### Scope

- Определить intended content публичного Runtime package для Codex, Claude Code и Universal consumers.
- Исключить `.studio/` и self-hosting lifecycle artifacts из публичной дистрибуции независимо от того, остаются ли они tracked в source checkout.
- Сохранить необходимые Runtime entry points, public documentation, manifests и Universal Bootstrap.
- Сохранить различие между development checkout и installable ZIP.
- Сделать package boundary проверяемой до публикации release.

#### Output

- Принятый и проверяемый Release Artifact Contract.
- Воспроизводимый candidate archive с доказательством состава и checksum.
- Regression evidence, которая обнаруживает повторное попадание maintainer-only artifacts.

#### Acceptance Criteria

- Candidate archive содержит все заявленные Codex, Claude Code и Universal entry points.
- Candidate archive не содержит `.studio/`, self-hosting discovery, brief, roadmap и другие maintainer lifecycle artifacts.
- Candidate archive не содержит repository tests, test results, release tooling или machine-specific data.
- Public documentation и adapter references внутри archive разрешаются относительно package root.
- Проверка package boundary завершается ошибкой при появлении запрещенного содержимого.
- Source checkout сохраняет Project Memory и документы, необходимые для дальнейшего self-hosting development.

#### Dependencies

- Принятый `docs/project-brief.md`.
- Существующий version и release contract.

#### Handoff To Architecture

- Определить устойчивый механизм package allowlist или exclusion boundary без дублирования Runtime source of truth.
- Определить, как автоматически классифицировать public, runtime, maintainer и dev-only artifacts.
- Сохранить текущие release guarantees и обратную совместимость трех adapter paths.

### Epic 2 - Critical Lifecycle Assurance

#### Goal

Определить ограниченный critical suite и закрыть ключевые lifecycle риски воспроизводимой automated evidence.

#### Business Value

Пользователь получает подтверждение, что Studio OS правильно начинает, продолжает и завершает работу с проектом, а не только успешно читает отдельный prompt.

#### Scope

Critical suite ограничивается следующими десятью существующими поведениями:

1. `bootstrap-001-explicit-greenfield-activation`;
2. `bootstrap-002-nested-plugin-root-resolution`;
3. `fixture-001-brownfield-project-memory`;
4. `fixture-002-existing-project-routing-replay`;
5. `fixture-003-greenfield-interview-replay`;
6. `fixture-004-incomplete-milestone-after-qa`;
7. `interaction-006-language-agnostic`;
8. `regression-010-project-local-file-references`;
9. `release-003-explicit-authorization`;
10. `release-005-milestone-requires-product-outcome`.

Epic должен подтвердить activation, root resolution, Greenfield, Brownfield, resume, scoped readiness, language-agnostic collaboration, portability и release authorization boundaries.

#### Output

- Versioned critical-suite contract с явной связью каждого сценария с риском из Project Brief.
- Fixture/replay и deterministic workspace evidence для поведения, которое меняет Project Memory или файлы.
- Bounded behavioral selection, пригодный для повторяемых remote и local trials.

#### Acceptance Criteria

- Каждый critical scenario имеет одну понятную product-risk responsibility.
- File-mutating behavior проверяет разрешенные изменения, неизменность source и portability.
- Cross-turn behavior проверяет observable conversation history и Project Memory checkpoints.
- Scenario definitions не раскрываются Runtime executor как скрытые ответы.
- Critical suite остается в пределах десяти сценариев без молчаливого расширения evaluation budget.
- Все deterministic gates проходят до любого behavioral execution.

#### Dependencies

- Epic 1: Release Artifact Boundary.
- Принятая behavioral assurance policy.

#### Handoff To Architecture

- Разделить проверки между deterministic runner, fixture/replay harness и installed-adapter evidence.
- Определить недостающие observable checkpoints без привязки к hidden chain-of-thought.
- Сохранить zero-retry, privacy и explicit-cost boundaries.

### Epic 3 - Installed Adapter Parity

#### Goal

Подтвердить одинаковые activation и stage-boundary outcomes для реальных установок Codex, Claude Code и Universal ZIP.

#### Business Value

Пользователь может выбрать поддерживаемый AI host по своим условиям и получить одну Studio OS, а не три расходящиеся версии workflow.

#### Scope

- Проверить установку Codex adapter из предназначенного для пользователя distribution source.
- Проверить установку Claude Code adapter из предназначенного для пользователя distribution source.
- Проверить Universal Bootstrap из извлеченного и проверенного candidate archive.
- Для каждого path проверить чистый Greenfield workspace и существующий Brownfield workspace.
- Проверить nested installed root resolution и отсутствие зависимости от repository checkout.
- Собирать только observable, portable и privacy-safe evidence.

#### Output

- Installed Adapter Matrix для Codex, Claude Code и Universal.
- Evidence package с версиями host, adapter и Studio OS, входным сценарием и observable outcome.
- Видимые blocker records для несовместимых или недоступных environments.

#### Acceptance Criteria

- Каждый adapter разрешает точный Studio OS Root из загруженного package, а не ищет другой checkout.
- В Greenfield каждый adapter передает управление Interview и не начинает implementation.
- В Brownfield каждый adapter создает только onboarding artifacts, сохраняет source и останавливается перед Briefing.
- Adapter-specific activation не меняет канонические Runtime rules или Project Language.
- Failure одного adapter path остается видимым и не маскируется успехом другого.
- Evidence не содержит home, temporary, Downloads, attachment-cache или sibling-workspace paths.

#### Dependencies

- Epic 1: чистый candidate artifact.
- Epic 2: принятый critical behavior contract.

#### Handoff To Architecture

- Определить воспроизводимую изоляцию host environments и version pinning.
- Определить общий evidence format без введения host-specific Runtime forks.
- Разделить host activation failures, Runtime regressions и infrastructure failures.

### Epic 4 - Remote And Local Compatibility Baseline

#### Goal

Сформировать честную compatibility baseline для одной точно идентифицированной remote model class и одной точно идентифицированной local model class.

#### Business Value

Пользователь и maintainer понимают, где Studio OS совместима, нестабильна или несовместима, и могут принимать решение на основе evidence, а не единичного удачного прогона.

#### Scope

- Выбрать по одной воспроизводимо идентифицируемой remote и local model class в рамках Architecture constraints.
- Зафиксировать executor model, judge model, engine, adapter, provider или host version и Studio OS revision.
- Выполнить по три независимых валидных trial каждого critical scenario для каждой принятой baseline combination.
- Классифицировать Compatible, Flaky, Incompatible и Unknown по принятой policy.
- Отделить invalid trials и infrastructure errors от behavioral results.
- Сохранить evaluation budget и privacy boundaries.

#### Output

- Immutable trial records.
- Compatibility summary для принятых remote и local combinations.
- Regression triage с владельцем каждого failure class.

#### Acceptance Criteria

- Каждая baseline combination имеет точные воспроизводимые identities.
- Для каждого critical scenario существует три независимых valid trial или явно сохраняется `Unknown` с причиной нехватки valid evidence.
- Автоматические retries отсутствуют.
- Failed и invalid records сохраняются отдельно и не перезаписываются.
- Deterministic workspace violation немедленно остается failure независимо от judge response.
- Checked-in summaries не содержат полные приватные transcripts или machine-specific paths.

#### Dependencies

- Epic 2: bounded critical suite.
- Epic 3 не блокирует isolated model trials, но обе evidence lines обязательны перед Epic 5.

#### Handoff To Architecture

- Определить exact identity, immutable result storage и result aggregation contracts.
- Сохранить provider-neutral executor и judge boundaries.
- Определить, как baseline evidence связывается с Studio OS revision и scenario revision.

### Epic 5 - v0.5 Release Candidate

#### Goal

Собрать и оценить единый release candidate для всего Target Milestone без автоматической публикации.

#### Business Value

Пользователь получает согласованные installation instructions, проверенный package и честные support claims. Maintainer получает одно решение о готовности вместо набора разрозненных зеленых тестов.

#### Scope

- Согласовать manifests, marketplace refs, installation documentation и manual testing instructions.
- Проверить candidate archive, checksum и три adapter paths.
- Проверить critical compatibility evidence и сохранить ограничения support claims.
- Закрыть или переписать milestone-relevant GitHub issues, противоречащие текущей архитектуре.
- Провести Validation, QA и Product Outcome для всех пяти Epics.
- Подготовить release evidence без tag, push или deployment до отдельного разрешения.

#### Output

- Проверенный `v0.5` release candidate.
- Сводная validation, QA, adapter и compatibility evidence.
- Product Outcome decision для полного Target Milestone.
- Release authorization request только при `Product Readiness: Ready For Release`.

#### Acceptance Criteria

- Все deterministic repository и release gates проходят на candidate revision.
- Candidate package соответствует Release Artifact Boundary.
- Installed Adapter Matrix завершена для всех трех заявленных paths.
- Remote и local compatibility summaries соответствуют behavioral policy и не завышают support claims.
- Installation и manual testing documentation соответствуют фактическим commands и published package layout.
- Milestone-relevant issues имеют актуальное решение или явное обоснование закрытия/переноса.
- Product Outcome оценивает полный Target Milestone, а не последний успешный Epic.
- Ни tag, ни release, ни deployment не выполняются без отдельного явного разрешения.

#### Dependencies

- Принятые результаты Epics 1-4.

#### Handoff To Architecture

- Определить единый evidence aggregation и release-candidate boundary.
- Сохранить разделение Validation, QA, Product Outcome и Release authorization.
- Определить rollback и failure handling для release preparation без автоматической публикации.

## Dependencies

Основная последовательность:

```text
Epic 1: Release Artifact Boundary
-> Epic 2: Critical Lifecycle Assurance
-> Epic 3: Installed Adapter Parity
-> Epic 4: Remote And Local Compatibility Baseline
-> Epic 5: v0.5 Release Candidate
```

Epic 4 требует принятого critical suite, но isolated model trials не обязаны ждать завершения всех host dogfood прогонов. Epic 5 начинается только после принятия обоих независимых evidence streams: installed adapters и model compatibility.

## Deferred Items

- Дополнительные fixture-backed lifecycle suites вне принятого critical набора относятся к `v0.6`.
- Общие workflow wording и UX improvements относятся к `v0.7`, кроме дефектов, блокирующих critical behavior.
- Hosted retrospective intake и глобальная Evolution infrastructure относятся к `v0.8`.
- Единая языковая политика документации оформляется отдельным Work Item, если не блокирует adapter onboarding.
- IDE integration, team policy packs, context synchronization и multi-agent orchestration остаются Future Directions.
- Поддержка всех моделей, providers и host environments не входит в `v0.5`.
- Редизайн публичного сайта и изменение Project Design System не входят в roadmap.

## Risks

- Package boundary может потребовать пересмотра текущего `git archive` подхода; механизм должен быть выбран Architecture без изменения принятого product scope.
- Host marketplaces и plugin semantics могут измениться независимо от Studio OS.
- Выбранная модель может не предоставлять immutable identity, необходимую для baseline eligibility.
- Три trial для десяти сценариев и двух model classes создают существенный, но ограниченный evaluation budget.
- Judge incompatibility может блокировать valid baseline даже при корректном Runtime behavior.
- Manual adapter evidence может быть невоспроизводимой без строгого environment identity и evidence format.
- Попытка исправлять каждый найденный UX недостаток расширит milestone за принятые Non Goals.

## Handoff To Architecture

Architecture должна определить техническую форму первого Epic и общие cross-Epic contracts, не меняя roadmap scope:

- package content boundary и защита future self-hosting artifacts;
- классификация Runtime, public, maintainer и dev-only files;
- deterministic, fixture/replay, installed-adapter и behavioral evidence layers;
- version и identity contracts для Studio OS, scenarios, adapters, hosts, executor и judge models;
- immutable и portable result storage;
- privacy, cost, zero-retry и explicit-release-authorization controls;
- минимальные изменения существующего TypeScript/Node, Markdown/JSON и GitHub release stack;
- delivery estimate с диапазонами, assumptions, risks, confidence и re-estimation triggers.

Первый Architecture focus: `Epic 1 - Release Artifact Boundary`.
