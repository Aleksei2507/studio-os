# Installation

Studio OS устанавливается один раз через adapter поддерживаемого AI host или используется из versioned Runtime ZIP. Один installation может работать с любым количеством отдельных проектов.

## Codex

Добавьте GitHub repository как marketplace и установите plugin:

```bash
codex plugin marketplace add Aleksei2507/studio-os
codex plugin add studio-os@studio-os
```

После установки начните новую Codex session и отправьте запрос:

```text
Use Studio OS.

I want to build...
```

## Claude Code

В Claude Code добавьте тот же marketplace, установите plugin и перезагрузите plugins:

```text
/plugin marketplace add Aleksei2507/studio-os
/plugin install studio-os@studio-os
/reload-plugins
```

Запустите Studio OS через `/studio-os:studio-os` вместе с product request или попросите Claude Code использовать Studio OS естественным языком.

## Other Filesystem Agents

Скачайте `studio-os-v<version>.zip` и соответствующий `.sha256` из GitHub Releases. Проверьте checksum перед распаковкой.

macOS:

```bash
shasum -a 256 -c studio-os-v<version>.zip.sha256
```

Linux с GNU coreutils:

```bash
sha256sum -c studio-os-v<version>.zip.sha256
```

После распаковки передайте агенту точный Studio OS Root и начните через Universal Bootstrap:

```text
Read and follow <studio-os-root>/adapters/universal/BOOTSTRAP.md.

Use Studio OS.
I want to build...
```

Runtime ZIP не требует npm и содержит тот же canonical Runtime, который используют host plugins.

## Runtime And Project Boundary

- Installed Studio OS Runtime и Target Workspace являются разными roots.
- Runtime files не копируются в каждый product project.
- Studio OS создает `.studio/`, `docs/`, `work-items/` и product files только в Target Workspace согласно активному workflow.
- Versioned ZIP является installable Runtime distribution, а не development checkout.
- Для изменения Studio OS или запуска repository tests используйте Git clone, а не release ZIP.

Все Runtime paths разрешаются относительно подтвержденного Studio OS Root. Сохраняемые project artifacts используют только project-relative local references.
