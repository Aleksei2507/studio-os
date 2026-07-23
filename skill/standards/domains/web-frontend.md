# Web Frontend Standard

## Goal

Deliver a resilient, accessible web interface that fits the product and existing frontend architecture.

## Rules

- Use semantic HTML and platform behavior before custom interaction primitives.
- Preserve responsive layout across accepted viewport and input ranges.
- Keep server, URL, form, and local UI state ownership explicit; avoid duplicate sources of truth.
- Handle loading, empty, error, stale, optimistic, and retry states where data flow requires them.
- Keep components cohesive and composition-oriented; extract only demonstrated reuse or complexity.
- Prevent layout shift, content overlap, inaccessible focus, and text overflow.
- Budget performance according to user context and measure material regressions.
- Keep client-side security boundaries honest; authorization belongs on trusted systems.
- Test accepted browser support and critical flows through the rendered interface.

## Evidence

- responsive and state coverage;
- accepted Interface Design conformance when selected;
- accessibility and browser QA;
- relevant bundle, rendering, or interaction checks;
- consistency with the selected design system and frontend conventions.
