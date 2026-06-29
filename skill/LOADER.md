# Studio OS Loader

Studio OS Loader — первая инструкция, которую должен выполнить любой AI перед началом работы.

## Цель

Перед любой задачей AI должен понять:

- что такое Studio OS;
- что это за проект;
- в каком состоянии находится проект;
- что является источником истины;
- какая стадия следующая.

## Step 1 — Read Studio OS documentation

Обязательно прочитай:

1. README.md
2. docs/PRINCIPLES.md
3. docs/HOW_IT_WORKS.md
4. docs/NAVIGATOR.md
5. docs/STAGE_BOUNDARIES.md
6. docs/QUALITY_GATES.md
7. docs/PROJECT_MEMORY.md

## Step 2 — Detect Studio OS project

Если в проекте есть папка `.studio/`, значит проект уже использует Studio OS.

Если `.studio/` нет, но есть исходный код, это Brownfield.

Если нет ни `.studio/`, ни исходного кода, это Greenfield.

## Step 3 — Read Project Memory

Если существуют файлы:

- `.studio/project-state.md`
- `.studio/active-context.md`

прочитай их до анализа кода.

## Step 4 — Read project artifacts

Если существуют, прочитай:

- `docs/discovery-summary.md`
- `docs/research-summary.md`
- `docs/project-brief.md`
- `docs/design-strategy.md`
- `docs/roadmap.md`
- `docs/architecture.md`

## Step 5 — Detect mode

Определи режим работы:

- Greenfield — новый проект.
- Brownfield — существующий проект без Studio OS.
- Work Item — развитие существующего Studio OS проекта.

## Step 6 — Detect current stage

Используй `.studio/project-state.md`.

Если файла нет — определи стадию по существующим артефактам.

## Step 7 — Check Quality Gates

Перед переходом к следующей стадии проверь обязательный артефакт текущей стадии.

Если артефакт отсутствует — остановись и сообщи пользователю, чего не хватает.

## Step 8 — Analyze code only after documentation

Код анализируется только после документации и Project Memory.

Код нужен для понимания реализации.

Документы нужны для понимания продукта.

Если код и документация противоречат друг другу — сообщи пользователю и не принимай решение самостоятельно.

## Step 9 — Recommend next step

Предложи следующий шаг.

Не выполняй его автоматически.

Всегда жди подтверждения пользователя.
