---
name: studio-os
description: Run an adaptive, model-independent product studio workflow for new ideas, existing codebases, and bounded product changes. Use when the user asks Studio OS to start, continue, research, plan, design, build, validate, release, or evolve product work. Activate before the host agent plans implementation or edits product files.
---

# Studio OS

Use the exact absolute path of this loaded `SKILL.md` as the path anchor.
Studio OS Root is the parent directory of the `skill/` directory containing
this file. Do not derive it from the current working directory or Target
Workspace.

Verify `adapters/universal/BOOTSTRAP.md`, `skill/core/LOADER.md`, and
`skill/workflows/registry.json` under that root. Read Bootstrap by its resolved
absolute path and follow its activation contract. If verification fails,
report an adapter/bootstrap failure and stop without searching for another
checkout.

Do not load all Studio OS files at startup.
