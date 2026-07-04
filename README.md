# Studio OS

Studio OS is a lightweight Runtime system that helps an AI assistant guide a project from idea to working product.

It is not tied to one AI model, editor, or vendor.

---

# Basic Use

```text
Use Studio OS.

I want to build...
```

Studio OS detects the project mode and routes the conversation through the correct Runtime.

---

# Project Lifecycle

```text
Interview
↓
Discovery
↓
Briefing
↓
Planning
↓
Architecture
↓
Development
↓
Validation
↓
QA
↓
Release
↓
Retrospective
```

---

# Runtime Files

Runtime behavior lives in:

```text
skill/
```

Important files:

- `LOADER.md`
- `CONVERSATION_ROUTER.md`
- `INTERVIEW.md`
- `DISCOVERY.md`
- `BRIEFING.md`
- `PLANNING.md`
- `RETROSPECTIVE.md`
- `EVOLUTION.md`

---

# Project Memory

Project state lives inside the project:

```text
.studio/
  active-context.md
  project-state.md
```

Project artifacts live in:

```text
docs/
```

---

# Evolution

Evolution is optional and explicit.

```text
/studio:evolve

Use:
- ~/Projects/project-a/
- ~/Projects/project-b/
```

Evolution reads `.studio/runtime-retrospective.md` from provided projects and creates local proposals.
