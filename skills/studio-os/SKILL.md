---
name: studio-os
description: Run Studio OS for a new product idea, existing codebase, or ongoing Studio OS project. Use whenever the user asks Studio OS to start, resume, research, plan, design, build, fix, validate, release, or continue product work. Activate before the host agent makes its own implementation plan, selects technical skills, or edits product files. Also use for explicit Studio OS skill invocation, including $studio-os or /studio-os:studio-os.
---

# Studio OS Host Adapter

Resolve Studio OS Root as the plugin root two directories above this skill directory.

Read `../../adapters/universal/BOOTSTRAP.md` and follow it as the canonical entry contract.

This adapter only activates Studio OS and maps the current host to the universal Bootstrap. It does not select Project Mode, workflow, Runtime, technology, or implementation skills itself.

Do not inspect broad Studio OS documentation or begin the host's default coding workflow before Bootstrap hands control to the active Runtime.
