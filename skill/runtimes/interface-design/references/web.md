# Web Interface Design Reference

Load this reference only for accepted Web delivery surfaces.

## Platform Contract

- Preserve semantic document and control behavior before inventing custom interaction.
- Define keyboard, pointer, touch, focus, hover, active, disabled, and reduced-motion behavior when relevant.
- Define URL, deep-link, browser back, refresh, and recoverable navigation behavior.
- Specify responsive content priority, wrapping, overflow, sticky or fixed regions, and supported viewport ranges.
- Include loading, empty, stale, optimistic, error, retry, and offline behavior required by accepted data flows.
- Treat accessibility and layout stability as design constraints.
- Keep visual hierarchy appropriate to product use; operational tools should optimize repeated scanning and action rather than imitate marketing pages.

## Accepted Stack Mappings

### HTML + Tailwind

Specify semantic structure and design tokens. Development decides the exact utility composition and maps accepted semantic tokens to project configuration.

### React, Next.js, And shadcn/ui

Identify reusable interface patterns, route-level experiences, client-visible state, and existing primitives to preserve. Do not prescribe component internals, server boundaries, or state libraries from design preference.

### Vue, Nuxt, And Nuxt UI

Define observable component contracts, navigation states, and progressive interaction. Reuse accepted UI primitives and leave composition and rendering architecture to Development.

### Angular

Define interaction, forms, navigation, responsive behavior, and semantic component roles. Do not introduce a component library unless Architecture accepted it.

### Laravel

Account for full-page, partial, or client-side transitions according to accepted Architecture. Specify validation, preserved input, loading, and failure feedback without choosing Blade, Livewire, or Inertia inside Interface Design.

### Svelte And Astro

Identify which regions require interaction and which remain content-oriented. Development owns hydration, island, and component implementation decisions.

### Three.js

Use only when accepted Architecture requires a 3D experience. Define controls, camera intent, loading and fallback states, reduced-motion behavior, input alternatives, responsive framing, and non-3D recovery. Do not use 3D as decoration that obstructs the primary outcome.
