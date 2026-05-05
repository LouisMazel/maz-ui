---
title: '@maz-ui/eslint-config'
description: ESLint flat-config preset for Vue/Nuxt/JS/TS projects, layered on @antfu/eslint-config with SonarJS, Tailwind v3+v4 and a11y add-ons.
---

# {{ $frontmatter.title }}

`@maz-ui/eslint-config` ships an opinionated ESLint **flat config** for the kind of stack maz-ui itself uses: TypeScript, Vue 3 / Nuxt 3, optional Tailwind CSS (v3 or v4), and tests. It is built on top of [`@antfu/eslint-config`](https://github.com/antfu/eslint-config) so you get a battle-tested baseline, then layered with quality rules from [SonarJS](https://github.com/SonarSource/eslint-plugin-sonarjs), Tailwind rules from [`eslint-plugin-better-tailwindcss`](https://github.com/schoero/eslint-plugin-better-tailwindcss), and accessibility rules from [`eslint-plugin-vuejs-accessibility`](https://github.com/vue-a11y/eslint-plugin-vuejs-accessibility).

## Installation

```bash
pnpm add -D @maz-ui/eslint-config eslint
```

The Tailwind plugin and other peer/transitive dependencies are bundled as direct dependencies, so you don't need to install them yourself.

## Basic usage

Create `eslint.config.ts` (or `.mjs`/`.js`) at the root of your project:

```ts
import { defineConfig } from '@maz-ui/eslint-config'

export default defineConfig()
```

That's it. Vue is auto-detected from your `package.json` (presence of `vue` or `nuxt`).

## Configuration

```ts
import { defineConfig } from '@maz-ui/eslint-config'

export default defineConfig({
  // Toggle features explicitly (each one is also auto-detected from your deps).
  typescript: true, // default
  vue: true, // auto-detected
  sonarjs: true, // default
  tailwindcss: false, // see "Tailwind support" below
  vueAccessibility: false, // optional
  formatters: true, // CSS/HTML/JSON/YAML/Markdown formatting via dprint

  // 'production' downgrades console.log to error, 'development' keeps it warning.
  env: 'production',

  // Extra ignore globs (merged with sensible defaults).
  ignores: ['**/*.generated.ts'],

  // Direct rule overrides applied on top of the resolved config.
  rules: {
    'no-console': 'error',
    'vue/custom-event-name-casing': ['error', 'kebab-case'],
  },

  // Log verbosity — see "Logging" below.
  logLevel: 'default',
})
```

## Logging

The preset prints a titled box summarizing what it resolved (typescript, vue, tailwindcss preset, sonarjs, …) when ESLint loads. Powered by [`@maz-ui/node`](https://www.npmjs.com/package/@maz-ui/node)'s consola-based logger.

| `logLevel` | What you see |
| --- | --- |
| `'silent'` | Nothing. |
| `'default'` *(TTY default)* | A titled box summarizing the resolved feature toggles, with `(auto-detected)` / `(default)` annotations next to each value. |
| `'debug'` | Adds one line per major block applied (Vue rules, SonarJS preset, vue-a11y, Tailwind plugin, test relaxations, user overrides). |
| `'verbose'` | Adds the final shape: total block count and ignore-glob count. |

```ts
defineConfig({ logLevel: 'debug' })
```

The default is **`'default'` in interactive terminals (TTY) and `'silent'` otherwise** — CI, lint-staged, pipes, and JSON / SARIF formatters all write to stdout, where the box would corrupt machine-readable output. `logLevel` always wins when set explicitly.

You can also append raw flat-config items as additional arguments — they merge after the built-in configs:

```ts
export default defineConfig(
  { typescript: true },
  {
    files: ['**/*.legacy.ts'],
    rules: { 'ts/no-explicit-any': 'off' },
  },
)
```

## Tailwind support

Powered by [`eslint-plugin-better-tailwindcss`](https://github.com/schoero/eslint-plugin-better-tailwindcss) — supports both **Tailwind v3 and v4**, and ESLint 7→10.

The `tailwindcss` option accepts several shapes:

| Value | Behavior |
| --- | --- |
| `false` *(default)* | Disabled. |
| `true` | Same as `'recommended'` with default settings. |
| `'recommended'` | Stylistic + correctness rules. |
| `'stylistic'` | Formatting rules only — class order, line wrapping, no duplicate classes, etc. |
| `'correctness'` | Validation rules only — `no-unknown-classes`, `no-conflicting-classes`. |
| `MazTailwindcssOptions` | Pick a preset and pass plugin settings (Tailwind config path, prefix entry point, …). |

```ts
defineConfig({
  tailwindcss: {
    preset: 'recommended',
    // Tailwind v4 — path to the CSS that does `@import "tailwindcss" prefix(maz)`.
    entryPoint: 'src/main.css',
    // Tailwind v3 instead — path to your config file.
    // tailwindConfig: 'tailwind.config.ts',
    // Tailwind v4: detect custom @layer components classes (cards, btns, …).
    detectComponentClasses: true,
    // Monorepo: directory used to resolve `tailwindcss` and the config file.
    cwd: 'apps/web',
  },
})
```

::: warning Plugin needs to know your Tailwind setup
The plugin's correctness rules (`no-unknown-classes`, `no-conflicting-classes`) auto-resolve your Tailwind installation. Without `entryPoint` (v4) or `tailwindConfig` (v3), the plugin falls back to the **default Tailwind config** and won't know about your prefix, custom utilities, or theme tokens — which produces a flood of false positives in non-vanilla setups.

If you customize Tailwind in any meaningful way (prefix, extend theme, custom utilities), set `entryPoint` or `tailwindConfig` explicitly. If you hit false positives anyway, downgrade to `'stylistic'` (formatting only) or disable individual rules:

```ts
defineConfig({
  tailwindcss: 'recommended',
  rules: {
    'better-tailwindcss/no-unknown-classes': 'off',
  },
})
```
:::

The plugin recognizes the most common class-name utilities out of the box (`clsx`, `cn`, `tw-merge`, `cva`, `tv`, …); see the [plugin docs](https://github.com/schoero/eslint-plugin-better-tailwindcss) for the full list and how to register your own.

## What it includes

- **Antfu base** — TypeScript-aware rules, Stylistic formatting, modern import order.
- **SonarJS** — code quality and complexity heuristics, with a relaxed set for `*.spec.ts` / `*.test.ts`.
- **Vue rules** (when Vue/Nuxt is detected) — block-tag order, naming conventions, template a11y.
- **Tailwind plugin** (opt-in) — class ordering, duplicate / deprecated / unknown / conflicting class detection — see [Tailwind support](#tailwind-support).
- **Markdown** — prose linting baseline.
- **vueAccessibility** (opt-in) — `eslint-plugin-vuejs-accessibility` rules with the AudioWorklet globals fix.

## Advanced

### Compose your own config

```ts
import {
  baseRules,
  sonarjsRules,
  tailwindcssConfigs,
  vueRules,
} from '@maz-ui/eslint-config'

export default [
  {
    rules: {
      ...baseRules(true), // production = true → no-console: 'error'
      ...sonarjsRules,
      ...vueRules,
    },
  },
  // Drop in just the Tailwind block, with whatever preset and settings you want.
  ...tailwindcssConfigs('stylistic', { entryPoint: 'src/main.css' }),
]
```

### Auto-detection caveat (monorepos)

Auto-detection of Vue / Nuxt reads the `package.json` in `process.cwd()` only. In a monorepo where `vue` is hoisted to the root and missing from a sub-package's `package.json`, detection silently fails. Set `vue: true` explicitly in those cases:

```ts
defineConfig({ vue: true, tailwindcss: { preset: 'recommended', cwd: 'apps/web' } })
```

## Compatibility

| Tool | Required version |
| --- | --- |
| ESLint | `>=9.0.0 <11.0.0` |
| Node.js | `>=20.19.0` |
| TypeScript | `^5.0.0` |
| Tailwind CSS | `^3.3.0 \|\| ^4.0.0` *(when `tailwindcss` is on)* |
