# Code Quality Standard

## Goal

Keep implementation understandable, changeable, and consistent with the project without introducing ceremony that does not reduce risk.

## Rules

- Follow repository instructions, language idioms, formatting, naming, and module boundaries.
- Keep each module or component responsible for one coherent concern.
- Depend on stable contracts at boundaries and keep infrastructure details replaceable where replacement is plausible.
- Prefer composition and explicit data flow over hidden coupling.
- Validate data at trust boundaries and make error behavior explicit.
- Preserve type safety when the stack supports it; do not bypass it with broad escape hatches.
- Introduce an abstraction only when it removes demonstrated complexity, duplication, or coupling.
- Keep changes bounded to accepted scope and preserve unrelated behavior.
- Review new dependencies for necessity, maintenance, license, security, and operational cost.
- Document only non-obvious decisions and public contracts.

## SOLID Use

Use SOLID as design criteria, not a quota:

- separate responsibilities that change for different reasons;
- extend through stable boundaries when variation is real;
- preserve consumer expectations when substituting implementations;
- expose narrow contracts;
- keep policy independent from replaceable infrastructure.

Do not create interfaces, classes, repositories, factories, or layers solely to claim SOLID compliance.

## Evidence

- diff follows project conventions;
- responsibilities and dependencies remain clear;
- no unexplained dependency or abstraction;
- lint, type, compile, or equivalent checks pass when applicable.
