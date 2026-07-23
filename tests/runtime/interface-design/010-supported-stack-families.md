---
id: interface-design-010-supported-stack-families
title: interface design resolves supported stacks by platform family
stage: Interface Design
prompt: Apply the correct design guidance for the stack already accepted by Architecture.
expect:
  - supports HTML Tailwind React Next.js shadcn/ui Vue Nuxt Nuxt UI Angular Laravel Svelte Astro and Three.js as web mappings
  - supports SwiftUI Jetpack Compose React Native and Flutter as mobile mappings
  - supports JavaFX WPF WinUI 3 Avalonia Uno Platform and UWP as desktop mappings
  - loads only the platform family and accepted stack adapter needed for the project
tags: [interface-design, platforms, stacks]
---

# Scenario

Architecture may select any supported delivery stack from product and operational evidence.

Interface Design must adapt its handoff without becoming the technology-selection stage.
