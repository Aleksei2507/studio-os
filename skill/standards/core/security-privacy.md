# Security And Privacy Standard

## Goal

Protect users, data, credentials, and operations across design, implementation, validation, and release.

## Rules

- Identify trust boundaries, sensitive data, privileged actions, and abuse paths relevant to scope.
- Enforce authentication and authorization at trusted boundaries, not only in UI.
- Validate untrusted input and encode output for its destination.
- Keep secrets out of source, artifacts, logs, screenshots, and client bundles.
- Minimize data collection, retention, permissions, and external sharing.
- Protect sensitive data in transit and at rest according to project risk and requirements.
- Use safe dependency and configuration defaults; review material third-party risk.
- Avoid logging credentials, tokens, personal data, or confidential payloads.
- Design migrations, destructive operations, and privileged automation with rollback or recovery.
- Do not claim compliance without the required policy and evidence.

## Evidence

- relevant threats and controls;
- permission and data-flow decisions;
- security checks or review results;
- known limitations and release blockers.
