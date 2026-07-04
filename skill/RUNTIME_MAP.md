# Runtime Map

Conversation Router runs before active stage handling.

```text
USER MESSAGE
    ↓
CONVERSATION_ROUTER
    ↓
LOADER / CURRENT RUNTIME
```

Project lifecycle:

```text
LOADER
    ↓
INTERVIEW
    ↓
DISCOVERY
    ↓
BRIEFING
    ↓
PLANNING
    ↓
ARCHITECTURE
    ↓
DEVELOPMENT
    ↓
VALIDATION
    ↓
QA
    ↓
RELEASE
    ↓
RETROSPECTIVE
    ↓
PROJECT DONE
```

Optional stages may be inserted only when useful:

```text
RESEARCH
DESIGN_STRATEGY
```

Evolution is not part of the project lifecycle.

It is started manually:

```text
/studio:evolve

Use:
- ~/Projects/project-a/
- ~/Projects/project-b/
```

Evolution reads `.studio/runtime-retrospective.md` from each supplied project and generates local proposals.
