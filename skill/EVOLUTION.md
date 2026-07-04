# Evolution Runtime

> Runtime for improving Studio OS from retrospectives.

---

# Metadata

Stage: Evolution

Version: 1.0

Optional: Yes

Requires Confirmation: Yes before applying any proposal

Creates:

- local proposals

Updates:

- no Studio OS Runtime files unless explicitly confirmed later

Next Stage:

Manual proposal review

---

# Goal

Evolution analyzes one or more project retrospectives and creates local improvement proposals for Studio OS.

Evolution is not part of the project lifecycle.

Evolution does not automatically modify Studio OS.

Evolution does not create GitHub Issues or Pull Requests by default.

---

# Required Input

Evolution requires explicit project paths from the user.

Example:

```text
/studio:evolve

Use:
- ~/Projects/fanvkusno/
- ~/Projects/gde/
- ~/Projects/water-filter/
```

For each project, Evolution looks for:

```text
.studio/runtime-retrospective.md
```

---

# Missing Paths Behavior

If the user runs `/studio:evolve` without project paths, do not fail.

Show this help:

```text
To run Evolution, I need one or more Studio OS projects to analyze.

Example:

/studio:evolve

Use:
- ~/Projects/project-a/
- ~/Projects/project-b/

I will look for `.studio/runtime-retrospective.md` in each project.
```

Then stop and wait for paths.

---

# Inputs

For each provided project path, read:

- `.studio/runtime-retrospective.md`
- `.studio/project-state.md` if available
- `.studio/active-context.md` if available

Do not scan unrelated folders.

Do not guess project locations.

---

# Evolution Mindset

Act like a maintainer of Studio OS.

Look for repeated patterns, not one-off preferences.

Do not optimize Studio OS for one user’s temporary habit unless it reveals a general problem.

---

# Classification

Classify candidate improvements as:

## Personal

Specific to one user’s preferences.

Usually do not propose as core change.

## Project-Specific

Useful for one project type.

May become optional guidance.

## Runtime

A repeated issue in stage behavior.

Good proposal candidate.

## Core

A structural issue affecting routing, memory, lifecycle, or safety.

Strong proposal candidate.

---

# Proposal Rules

A proposal must include:

- problem;
- evidence from retrospectives;
- affected Runtime or docs;
- proposed change;
- expected effect;
- risk of change;
- recommendation.

Do not create proposals without evidence.

If a problem appears once, mark it as observation.

If it appears repeatedly, mark it as candidate proposal.

---

# Output

Create local proposal files in a local proposals folder, for example:

```text
proposals/
  001-loader-invisible.md
  002-briefing-tradeoffs.md
```

If working inside the Studio OS repository, use its local `proposals/` folder.

If working inside a user project, ask where proposals should be written.

---

# Forbidden

Evolution must not:

- automatically edit Runtime files;
- automatically commit changes;
- automatically create GitHub Issues;
- automatically create Pull Requests;
- send data anywhere;
- analyze projects not explicitly provided;
- treat one user preference as a core rule without evidence.

---

# Stop Condition

After creating proposals:

1. Show a short summary of proposals.
2. Classify them as Personal, Project-Specific, Runtime, or Core.
3. Recommend which proposals are worth reviewing.
4. Wait for user approval before any patch or Runtime change.
