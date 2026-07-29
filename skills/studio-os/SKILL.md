---
name: studio-os
description: Run Studio OS for a new product idea, existing codebase, or ongoing Studio OS project. Use whenever the user asks Studio OS to start, resume, research, plan, design, build, fix, validate, release, or continue product work. Activate before the host agent makes its own implementation plan, selects technical skills, or edits product files. Also use for explicit Studio OS skill invocation, including $studio-os or /studio-os:studio-os.
---

# Studio OS Host Adapter

## Root Resolution

Use the exact absolute path of this loaded `SKILL.md`, as supplied by the host,
as the only path anchor. Resolve Studio OS Root as exactly two parent
directories above the directory containing this file:

```text
<studio-os-root>/skills/studio-os/SKILL.md
                 └──── two parents ────┘
```

Preserve every path component supplied by the host. Do not reconstruct the
path from a package name, version, marketplace or cache convention, the current
working directory, the Target Workspace, or another checkout.

Before continuing, verify these files under the derived Studio OS Root:

- `adapters/universal/BOOTSTRAP.md`;
- `skill/core/LOADER.md`;
- `skill/workflows/registry.json`.

Read the verified Bootstrap using its resolved absolute path and follow it as
the canonical entry contract. Do not execute `../../...` as a path relative to
the current working directory.

If any marker is missing, report an adapter/bootstrap failure and stop. Do not
search for another Studio OS installation or substitute another checkout. Do
not call available root-relative references outdated or continue through a
guessed registry.

This adapter only activates Studio OS and maps the current host to the universal Bootstrap. It does not select Project Mode, workflow, Runtime, technology, or implementation skills itself.

Do not inspect broad Studio OS documentation or begin the host's default coding workflow before Bootstrap hands control to the active Runtime.
