# migrate-tw-prefix

Internal one-shot migration script to rewrite Tailwind v3 `maz-` prefixed classes to the v4 `maz:` prefix syntax inside the maz-ui library source.

Ran during **Phase 3** of the v5 migration (see `plans/2026-02-24-tailwind-v4-migration.md`). Not published.

## What it does

1. `maz-<utility>` → `maz:<utility>`
2. `<variant>:maz-<utility>` → `maz:<variant>:<utility>` (multi-variant preserved in order)
3. `!maz-<utility>` / `<variant>:!maz-<utility>` → `maz:<variant>:<utility>!` (v4 suffix syntax for important)
4. v3 utilities renamed in v4:
   - `rounded-sm` → `rounded-xs`
   - `outline-none` → `outline-hidden`
   - `backdrop-blur-sm` → `backdrop-blur-xs`
   - `bg-gradient-to-*` → `bg-linear-to-*`
   - bare `shadow` → `shadow-sm`

## Scope

- `*.vue` files: transforms the `<template>` and `<style>` blocks only. The `<script>` block is left untouched, which protects `import … from 'maz-ui'` statements from being mangled.
- `*.css` files: whole file.
- The token parser also protects the literal `maz-ui` and `maz-ui/…` paths inside any context.

## Usage

```bash
# Dry run (no writes), default root is packages/lib/src
pnpm dlx tsx tools/migrate-tw-prefix/cli.ts --dry-run

# Apply the transforms on the default root
pnpm dlx tsx tools/migrate-tw-prefix/cli.ts

# Apply on custom roots
pnpm dlx tsx tools/migrate-tw-prefix/cli.ts packages/lib/src apps/vue-app/src
```

## Tests

```bash
npx vitest run tools/migrate-tw-prefix/transform.test.ts
```

The test suite uses Gherkin-style describes and covers all transform rules, edge cases (package name `maz-ui`, arbitrary values, fractions), and file-level scenarios (template vs script vs style).

## Limitations

- Dynamic class names computed at runtime (`` `maz-${color}` ``) inside `<script>` blocks are **not** rewritten. These must be updated manually before Phase 3 runs.
- `<script>` blocks are skipped entirely to avoid touching imports and string literals that are not template classes. Any hardcoded class strings declared in script (e.g., in a `computed`) must be reviewed manually.
