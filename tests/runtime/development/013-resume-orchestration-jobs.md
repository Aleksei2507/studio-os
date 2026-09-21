---
id: development-013-resume-orchestration-jobs
title: resumed orchestration checks existing jobs and conflicting ownership
stage: Development
prompt: Resume the accepted feature after this session change.
expect:
  - reads the persisted plan and job state and rechecks the capabilities of the current host
  - checks existing native job status before creating a replacement for unfinished work
  - does not duplicate a running job or assume an unobservable old job has stopped
  - waits or serializes assignments that share file ownership or depend on unfinished work
  - does not reuse an unavailable model selector or stale catalog as permission to dispatch
  - applies the stricter current host concurrency limit and records actual resumed execution evidence
tags: [development, model-orchestration, resume, ownership]
---

# Scenario

The saved plan was created in another host with multi-model support. Its job journal records task T1 as running, with a native job ID and ownership of `src/client.ts`. Task T2 also changes `src/client.ts` and depends on T1. The current host allows only one concurrent child, has no per-child model selector, and can query job status for identities it recognizes. The last saved record does not establish whether T1 has finished.
