# Desktop Standard

## Goal

Deliver a platform-appropriate desktop product that remains usable across window, input, display, operating-system, and lifecycle conditions.

## Rules

- Support keyboard and pointer operation with visible focus and discoverable commands.
- Define window resizing, minimum dimensions, restored state, multi-window behavior, and high-DPI scaling when relevant.
- Use native menus, dialogs, file operations, clipboard, notifications, and accessibility APIs where appropriate.
- Keep dense information scannable and repeated workflows efficient without hiding critical actions.
- Preserve user intent across long-running operations, interruption, window closure, and application restart where required.
- Handle operating-system appearance, text scaling, localization, input methods, and platform conventions.
- Keep platform integration and permissions explicit and minimize sensitive data exposure in local state, logs, notifications, and screenshots.
- Test representative window sizes, display scaling, keyboard-only operation, and supported operating systems.
- Include packaging, signing, update, compatibility, telemetry, and rollback constraints in Release.

## Evidence

- supported operating-system, display, and input matrix;
- window, focus, shortcut, and lifecycle behavior;
- accessibility and platform-integration observations;
- desktop QA evidence;
- packaging and update plan.
