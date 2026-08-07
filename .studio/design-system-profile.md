# Design System Profile

Scope: Project

Status: Observed

Applicability: Active

Source: Existing Project

Name: Studio OS Public Site Visual System

Version: Unversioned; observed in project release `0.5.0-alpha.4`

Ownership: Project

Confidence: High

Preservation Policy: Preserve And Extend

Last Updated: 2026-08-02

## Evidence

- `website/index.html`
- `website/styles.css`
- `website/script.js`
- `website/assets/studio-workbench.jpg`
- `website/assets/spoke-deployed.jpg`
- `tests/structure/site.test.ts`

## Foundations

- Color and semantic roles: CSS custom properties задают paper, ink, line, teal, orange, yellow и graphite роли; светлая рабочая поверхность сочетается с темными контрастными блоками.
- Typography: отдельные display, body и utility font stacks на системных шрифтах без внешней загрузки.
- Spacing and sizing: ограниченный shell `1200px`, плотные grid-композиции, стабильные колонки и responsive перестроение.
- Shape and elevation: тонкие границы, преимущественно радиусы `3px`-`6px`, круглые только индикаторы и icon-like controls; декоративная elevation не является основной системой.
- Motion: интерактивные переходы должны уважать `prefers-reduced-motion`.
- Iconography and assets: CSS wordmark, текстовые/системные controls и два локальных raster assets; внешняя icon library не используется.

## System Boundaries

- Primary: публичный сайт в `website/`.
- Secondary: локальные изображения в `website/assets/` и copy/tab interactions в `website/script.js`.
- Legacy: не обнаружена.

## Component Sources

- Локальные семантические HTML-паттерны: header/navigation, hero, route rail, section grids, segmented tabs, process track, case messages, comparison table, install command rows, FAQ и footer.
- Локальные CSS-классы и tokens; внешняя или versioned component library не обнаружена.

## Interaction And Content Patterns

- Якорная навигация ведет к полным разделам одной страницы.
- Workflow и installation choices представлены tablists с согласованными `aria-selected`, `aria-controls` и keyboard interactions.
- Copy actions используют компактные icon-like controls с доступными именами и визуальной обратной связью.
- Контент демонстрирует полный путь студии через конкретный пример, сохраняя короткие операционные формулировки.

## Platform Variants

- Один responsive Web-интерфейс с breakpoint-адаптацией на `980px`, `760px` и `420px`.
- Отдельные native Mobile или Desktop варианты для публичного сайта не обнаружены.

## Constraints And Conventions

- Сохранять существующие CSS tokens, контрастную многосоставную палитру, grid/rail язык и компактные радиусы.
- Не добавлять внешние CSS или JavaScript зависимости без принятого архитектурного решения.
- Все публичные assets и ссылки должны оставаться переносимыми и project-relative.
- Сохранять semantic HTML, keyboard navigation, ARIA-связи и reduced-motion поддержку.
- Проверять отсутствие горизонтального переполнения и наложений на desktop и mobile.
- Не переносить визуальные правила сайта на Markdown Runtime артефакты: это отдельная системная граница.

## Conflicts And Unknowns

- Формального versioned token package, reusable component package и отдельной дизайн-документации нет.
- Явная browser support matrix не обнаружена.
- Исходники и правила обновления raster assets отдельно не описаны.

## Approved Deviations

- None.

## References

- `website/index.html`
- `website/styles.css`
- `website/script.js`
- `tests/structure/site.test.ts`
- `.github/workflows/pages.yml`
