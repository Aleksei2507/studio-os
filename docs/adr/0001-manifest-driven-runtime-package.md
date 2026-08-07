# ADR-0001: Manifest-Driven Runtime Package

Status: Accepted

Date: 2026-08-03

## Context

Studio OS source checkout содержит несколько типов содержимого:

- installable Runtime и host manifests;
- public documentation;
- public website;
- development scripts и tests;
- self-hosting `.studio/` и lifecycle artifacts.

Current release builder вызывает `git archive` для всего tag и полагается на `.gitattributes export-ignore`. Это denylist: любой новый tracked файл включается по умолчанию. После self-hosting initialization такой подход может опубликовать maintainer Project Memory и внутренние lifecycle документы.

Принятый `Epic 1 - Release Artifact Boundary` требует fail-closed package composition без изменения Runtime root layout и трех adapter paths.

## Decision

Добавить versioned machine-readable release manifest как единственный source of truth для installable Runtime contents.

Планируемое расположение: `scripts/release-manifest.json`.

Manifest определяет:

- schema version;
- recursive Runtime roots;
- individual metadata и public files;
- required activation entry points;
- forbidden maintainer и development prefixes.

Release builder должен:

1. прочитать и структурно проверить manifest;
2. разрешить allowlisted paths через `git ls-tree` для exact release tag;
3. отклонить missing required files, unsafe paths, ambiguous overlaps и forbidden results;
4. передать те же allowlisted pathspecs в `git archive`;
5. сохранить versioned prefix и SHA-256 checksum;
6. завершиться ошибкой при любом contract violation.

`.gitattributes export-ignore` сохраняется как дополнительная защита и generic source-export convention, но больше не определяет полноту Runtime package.

Structure tests должны строить реальный tagged archive и проверять фактические entries, включая отсутствие `.studio/`, self-hosting lifecycle artifacts, website и dev-only tooling.

## Alternatives

### Extend `.gitattributes` Denylist

Преимущества:

- минимальное изменение;
- полностью поддерживается текущим `git archive`.

Недостатки:

- новые внутренние файлы публикуются по умолчанию;
- package contract распределен между repository layout, attributes и tests;
- self-hosting требует постоянного ручного обновления exclusions.

Rejected: не обеспечивает fail-closed boundary.

### Separate Runtime Repository Or Package Subtree

Преимущества:

- сильная физическая изоляция;
- простой archive root.

Недостатки:

- изменяет adapter root resolution и contributor workflow;
- требует миграции manifests, docs и tests;
- создает второй synchronization boundary.

Rejected for `v0.5`: стоимость и migration risk несоразмерны текущему требованию.

### Copy Files Into A Staging Directory

Преимущества:

- полный контроль финальной filesystem tree;
- возможность генерировать дополнительные package metadata.

Недостатки:

- добавляет второй copy implementation и риск расхождения с immutable tag;
- требует отдельно обрабатывать modes, hidden files, symlinks и cleanup;
- сложнее доказать source provenance.

Rejected: direct tagged-tree pathspec archive проще и ближе к текущей архитектуре.

## Consequences

### Positive

- Новый unclassified файл не попадает в Runtime ZIP автоматически.
- Package boundary становится versioned, reviewable и testable.
- Existing tag, checksum и GitHub Release model сохраняется.
- Runtime roots и adapter activation paths не меняются.
- Public documentation включается осознанно.

### Negative

- Новый required Runtime root или public document требует manifest update.
- Ошибка allowlist может исключить нужный файл, поэтому installed-adapter smoke tests остаются обязательными.
- Builder и release fixture получают дополнительный schema contract.

### Neutral

- Source checkout продолжает содержать website, tests, scripts и self-hosting Project Memory.
- Existing releases остаются immutable и не пересобираются.
- Manifest является development contract и может не входить в пользовательский ZIP.

## Compatibility And Rollback

- Решение применяется только к future release revisions.
- Runtime package paths и public activation commands сохраняются.
- До publication изменение можно откатить обычным commit revert.
- После publication исправление package требует нового semantic prerelease или patch tag; существующий tag не изменяется.

## Affected Scope

- `scripts/build-release.ts`;
- planned `scripts/release-manifest.json`;
- `tests/structure/release-distribution.test.ts`;
- `.gitattributes` как secondary defense;
- `docs/RELEASING.md` и Release Artifact Contract.

Не затрагиваются Runtime behavior, Project Design System, public website, Project Brief scope и host-specific activation logic.

## Reconsideration Triggers

- несколько независимых installable packages с разными root layouts;
- необходимость generated package metadata, которую нельзя получить через `git archive`;
- Git pathspec incompatibility в поддерживаемом CI;
- существенное усложнение manifest, указывающее на необходимость отдельного package subtree.
