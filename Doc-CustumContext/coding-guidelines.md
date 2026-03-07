# Coding Guidelines

> Share this so the AI writes code that matches your team's style — not its own defaults.

---

## Naming

- Variables/functions: [e.g. `camelCase`]
- Files: [e.g. `kebab-case.ts`]
- Components: [e.g. `PascalCase.tsx`]
- Constants: [e.g. `UPPER_SNAKE_CASE`]

## Functions

- [e.g. Prefer `async/await` over `.then()` chains]
- [e.g. Max function length: ~30 lines — extract if longer]
- [e.g. One responsibility per function]

## Error Handling

- [e.g. Always use try/catch on async calls]
- [e.g. Never swallow errors silently]
- [e.g. Return typed error objects, don't throw raw strings]

## Imports

- [e.g. No default exports — named exports only]
- [e.g. Group: external libs → internal modules → types]

## Comments

- [e.g. Only comment *why*, not *what* — the code should be self-explanatory]
- [e.g. All public functions need JSDoc]

## What to avoid

- [e.g. No `any` in TypeScript]
- [e.g. No nested ternaries]
- [e.g. No magic numbers — use named constants]
