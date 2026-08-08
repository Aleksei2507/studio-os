---
description: Open the Studio OS admin panel for this project's .studio/, docs/, and work-items/ artifacts.
---

# Open Studio OS Admin Panel

Resolve Studio OS Root the same way the loaded `skills/studio-os/SKILL.md` does (two parent directories above its containing directory), and resolve the Target Workspace as the current project. Then follow the "Local Tooling Requests" procedure in this plugin's `adapters/universal/BOOTSTRAP.md`:

1. Run:

   ```text
   node <studio-os-root>/scripts/admin-panel/server.js --workspace <target-workspace>
   ```

   with both paths filled in as absolute paths.
2. Report the bound local URL (default `http://127.0.0.1:4317`) to the user.
3. If this session cannot execute shell commands, give the exact command instead and stop — do not claim the panel started.

Do not route this through Loader, Project Mode detection, or any Runtime. Do not create or mutate Project Memory.
