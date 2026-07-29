---
id: "bootstrap-002-nested-plugin-root-resolution"
title: "installed adapter resolves a nested plugin root without guessing cache layout"
stage: "Bootstrap and Validation"
prompt: "Continue this Studio OS project and validate the completed increment."
expect:
  - "The host adapter should derive Studio OS Root from the exact loaded host skill path, preserving every nested marketplace, plugin, and version directory component."
  - "The adapter should verify Bootstrap, Loader, and workflow registry markers before handing control to Loader."
  - "Loader and Validation should resolve capability, standards, Runtime, and template paths relative to the confirmed Studio OS Root rather than the Target Workspace or referring Runtime directory."
  - "Validation should continue normally when the three declared standards and validation report template exist under the confirmed root."
  - "Should not: Reconstruct a cache path from package name or version, call available root-relative references outdated, search for another Studio OS checkout, or continue when root verification fails."
tags: ["bootstrap", "adapter", "validation", "severity:critical", "risk:high"]
---

## Initial State

Studio OS is installed as a host plugin. The host provides the exact loaded
skill path:

```text
<agent-cache>/marketplaces/studio-os/studio-os/<plugin-version>/skills/studio-os/SKILL.md
```

The repeated `studio-os` path component is valid: one component identifies the
marketplace and one identifies the plugin. The Target Workspace is a separate
product directory with Project Memory at Validation.

The derived plugin root contains:

- `adapters/universal/BOOTSTRAP.md`;
- `skill/core/LOADER.md`;
- `skill/workflows/registry.json`;
- the Validation Runtime;
- the `code-quality`, `testing`, and `security-privacy` standard contracts
  declared by the registry;
- `templates/validation-report.md`.

## Expected Behavior

The host adapter anchors resolution to the exact loaded skill file, moves two
parent directories above its containing directory, verifies the required root
markers, and then reads Bootstrap by absolute resolved path. All later Studio
OS paths remain relative to that confirmed root.

Validation may report project-specific missing commands or evidence, but it
must not misdiagnose available Studio OS package files as stale references.

## Failure Behavior

If the derived directory lacks a required root marker, activation stops as an
adapter/bootstrap failure. It does not search cache directories, select another
checkout, reinterpret paths relative to the product, or continue through a
substitute registry.
