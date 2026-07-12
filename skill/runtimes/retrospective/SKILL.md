---
name: retrospective
description: Capture objective observations and user feedback about a completed Studio OS project, stage, or Work Item. Use after delivery when the user chooses to review the Studio OS process.
---

# Retrospective Runtime

> Runtime для сбора опыта применения Studio OS после завершения проекта, этапа или Work Item.

---

# Metadata

Stage: Retrospective

Version: 1.0

Optional: Yes

Requires Confirmation: Yes

Creates:

- .studio/runtime-retrospective.md

Updates:

- .studio/active-context.md
- .studio/project-state.md

Next Stage:

Evolution

---

# Goal

Цель Retrospective — собрать опыт использования Studio OS.

Retrospective не улучшает Studio OS напрямую.

Retrospective не меняет Runtime.

Retrospective не создаёт proposals.

Она только фиксирует:

- что работало хорошо;
- что мешало;
- где Studio OS задавала лишние вопросы;
- где не хватило вопросов;
- где были повторы;
- где пользователь вмешивался в процесс;
- какие стадии были полезными;
- какие стадии нужно улучшить.

---

# Inputs

Перед началом Retrospective прочитай:

- .studio/project-state.md
- .studio/active-context.md

При наличии также прочитай:

- docs/discovery-summary.md
- docs/project-brief.md
- docs/roadmap.md
- docs/architecture.md
- docs/qa-report.md
- docs/release-notes.md

Если существуют telemetry-файлы, прочитай:

- .studio/telemetry/runtime-events.md
- .studio/telemetry/validation-report.md

---

# Retrospective Mindset

Во время Retrospective AI ведёт себя как фасилитатор.

Главная задача — понять опыт пользователя, а не защищать Studio OS.

Не спорь с пользователем.

Не объясняй, почему Studio OS была права.

Не предлагай сразу решения.

Сначала зафиксируй опыт.

---

# Objective Data

Перед вопросами к пользователю AI должен собрать объективные наблюдения.

Например:

- какие стадии были пройдены;
- какие артефакты были созданы;
- где были возвраты назад;
- где пользователь просил остановиться;
- где пользователь исправлял направление;
- где были технические ошибки;
- где были провалены проверки.

Если данных нет — не выдумывай.

---

# User Feedback

Retrospective должна задавать минимум вопросов.

Обычно достаточно трёх:

1. Что в работе Studio OS было самым полезным?
2. Что раздражало или мешало?
3. Если бы можно было изменить одну вещь в Studio OS — что бы это было?

Если ответы пользователя уже известны из контекста, не спрашивай повторно.

---

# Output

Создай:

.studio/runtime-retrospective.md

Документ должен содержать:

- Executive Summary
- Project Context
- Stages Completed
- Objective Observations
- User Feedback
- Friction Points
- Helpful Behaviors
- Repeated Issues
- Candidate Improvements
- Notes For Evolution

---

# Candidate Improvements

Candidate Improvements — это не proposals.

Это только наблюдения, которые могут стать входом для Evolution.

Например:

- Loader слишком много общается с пользователем.
- Interview иногда задаёт лишний вопрос перед завершением.
- Discovery может дублировать Interview.
- Briefing может повторять разделы Discovery.

Не предлагай изменения Runtime в Retrospective.

Только фиксируй кандидаты.

---

# Project Memory Update

После создания Retrospective обнови:

.studio/project-state.md

Current Stage:

Retrospective

Status:

Completed

Next Stage:

Evolution

Также обнови:

.studio/active-context.md

Добавь:

- что ретроспектива завершена;
- где лежит runtime-retrospective.md;
- какие основные наблюдения зафиксированы.

---

# Completion Checklist

Retrospective считается завершённой, если:

- объективные наблюдения собраны;
- пользовательский фидбек собран или явно пропущен;
- .studio/runtime-retrospective.md создан;
- Candidate Improvements зафиксированы;
- Project Memory обновлена.

---

# Stop Condition

После завершения Retrospective:

1. Сообщи пользователю, что Retrospective завершена.
2. Покажи краткий список Candidate Improvements.
3. Предложи перейти к Evolution.
4. Не начинай Evolution автоматически.
5. Дождись подтверждения пользователя.

---

# Runtime Rules

Retrospective не должна менять Studio OS.

Retrospective не должна создавать patches.

Retrospective не должна создавать proposals.

Retrospective только готовит качественный вход для Evolution.

Evolution решает, какие наблюдения превращать в proposals.
