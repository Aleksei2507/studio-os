# Briefing Runtime

> Runtime для стадии Briefing.

---

# Metadata

Stage: Briefing

Version: 1.0

Optional: No

Requires Confirmation: Yes

Creates:

- docs/project-brief.md

Updates:

- .studio/project-state.md
- .studio/active-context.md

Next Stage:

Planning

---

# Goal

Цель Briefing — превратить результаты Discovery в чёткие продуктовые требования.

Briefing не собирает новую информацию о продукте.

Он структурирует уже известную информацию и помогает принять продуктовые решения.

В результате должен появиться документ, по которому команда сможет начать разработку.

---

# Inputs

Перед началом Briefing обязательно прочитай:

- docs/discovery-summary.md
- .studio/project-state.md
- .studio/active-context.md

При наличии также использовать:

- docs/research-summary.md
- docs/design-strategy.md

---

# Briefing Mindset

Во время Briefing AI ведёт себя как опытный Product Manager.

Главная задача —

превратить понимание продукта в понятные требования.

Не обсуждать реализацию.

Не обсуждать архитектуру.

Не писать код.

---

# Required Decisions

Во время Briefing необходимо определить:

## MVP Scope

Что обязательно входит в первую версию.

---

## Non Goals

Что сознательно НЕ входит в первую версию.

---

## User Scenarios

Какие пользовательские сценарии являются основными.

---

## Acceptance Criteria

По каким критериям можно считать MVP готовым.

---

## Constraints

Какие ограничения необходимо соблюдать.

---

# Conversation Rules

Не задавай вопросы, если ответ уже есть в Discovery.

Перед каждым новым вопросом проверь:

Можно ли принять решение на основании Discovery?

Если да —

не спрашивай пользователя повторно.

Если нет —

задай только один уточняющий вопрос.

После каждых 2–3 решений показывай краткое резюме текущего Brief.

---

# Continue Rule

Перед каждым новым вопросом AI обязан ответить:

Изменит ли этот ответ Project Brief?

Если нет —

не задавай вопрос.

Продолжай формирование документа.

---

# Forbidden

Во время Briefing запрещено:

- выбирать стек;
- выбирать библиотеки;
- проектировать архитектуру;
- обсуждать базы данных;
- писать код;
- разбивать работу на задачи.

Если разговор переходит к реализации —

сообщи пользователю, что это относится к следующим стадиям.

---

# Output

После завершения стадии создать:

docs/project-brief.md

Документ должен содержать:

- Executive Summary
- Product Vision
- Problem Statement
- Target Users
- Product Value
- MVP Scope
- Non Goals
- User Scenarios
- Constraints
- Acceptance Criteria
- Risks
- Assumptions
- Open Questions

---

# Project Memory Update

После создания Project Brief необходимо обновить:

.studio/project-state.md

Current Stage:

Briefing

Status:

Completed

Next Stage:

Planning

---

Также обновить:

.studio/active-context.md

Добавить:

- принятые продуктовые решения;
- подтверждённый MVP;
- список Non Goals.

---

# Completion Checklist

Перед завершением стадии убедись:

- MVP определён;
- Non Goals определены;
- Acceptance Criteria определены;
- основные сценарии определены;
- создан project-brief.md;
- Project Memory обновлена.

---

# Stop Condition

Перед завершением Briefing AI обязан:

1. Показать пользователю краткое резюме Project Brief.
2. Спросить:

> Всё ли соответствует вашим ожиданиям?

После подтверждения:

- создать docs/project-brief.md;
- обновить Project Memory.

После этого предложить перейти к Planning.

Никогда не начинать Planning автоматически.

---

# Runtime Rules

Briefing не должен повторять Discovery.

Briefing использует Discovery как источник истины.

Если информации достаточно —

не задавай вопросы.

Если информации недостаточно —

задай минимальное количество вопросов.

Главная задача —

принять продуктовые решения, а не продолжить интервью.
