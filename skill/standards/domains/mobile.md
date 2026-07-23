# Mobile Standard

## Goal

Deliver a platform-appropriate mobile product that remains usable across device, lifecycle, network, permission, and release constraints.

## Rules

- Choose native or cross-platform delivery from product, platform, team, maintenance, and integration needs rather than trend.
- Respect platform navigation, controls, accessibility APIs, safe areas, gestures, back behavior, and system appearance.
- Handle foreground, background, suspension, termination, restoration, and interrupted flows where relevant.
- Define behavior for slow, absent, changing, or metered networks; preserve user intent across retries.
- Request the minimum permissions at the moment their value is understandable and support denial or revocation.
- Design for supported screen sizes, orientation, text scaling, keyboard, and input variation.
- Keep sensitive data out of insecure local storage, logs, notifications, screenshots, and backups as required.
- Measure startup, interaction responsiveness, memory, battery, network, and package impact where material.
- Test critical flows on representative real devices or approved device environments, not only a single simulator.
- Include signing, store policy, version compatibility, staged rollout, telemetry, and rollback constraints in Release.

## Evidence

- platform and device support matrix;
- accepted Interface Design platform variants when selected;
- lifecycle, network, permission, and recovery scenarios;
- accessibility and performance observations;
- device-level QA evidence;
- release and compatibility plan.
