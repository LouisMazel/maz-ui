# @maz-ui/eslint-config

Reusable ESLint configuration for JavaScript/TypeScript projects, built on top of [`@antfu/eslint-config`](https://github.com/antfu/eslint-config).

## Features

- 🚀 **Based on @antfu/eslint-config** — modern, performant, flat-config first
- 🛡️ **TypeScript-first** — strict mode, sensible defaults
- 🎨 **Tailwind CSS v3 + v4** — via [`eslint-plugin-better-tailwindcss`](https://github.com/schoero/eslint-plugin-better-tailwindcss) (compat ESLint 7→10, both Tailwind versions)
- 🧩 **Custom `maz/` rules** — ships its own ESLint plugin namespaced `maz/*` (see [Custom rules](#custom-rules))
- 🔍 **SonarJS** — code quality / cognitive complexity
- ♿ **Vue accessibility** — opt-in `eslint-plugin-vuejs-accessibility`
- 📐 **Formatters** — Prettier-style formatting via `eslint-plugin-format`
- ⚙️ **Configurable** — pick presets, add per-file rules, custom ignore globs

## Installation

```bash
pnpm add -D @maz-ui/eslint-config eslint
```

## Basic usage

```js
// eslint.config.js
import { defineConfig } from '@maz-ui/eslint-config'

export default defineConfig()
```

Vue / Nuxt are auto-detected from your `package.json`.

## Configuration

```js
// eslint.config.js
import { defineConfig } from '@maz-ui/eslint-config'

export default defineConfig({
  env: 'production', // 'development' | 'production' — affects no-console / no-debugger severity

  // Antfu options (forwarded as-is)
  typescript: true,
  formatters: true,
  unicorn: true,

  // Maz-UI options
  sonarjs: true,
  vueAccessibility: false,
  tailwindcss: 'recommended', // see "Tailwind support" below

  // Extra ignore globs (merged with defaults)
  ignores: ['custom-dist/**'],

  // Custom rules
  rules: {
    'no-console': 'error',
  },

  // 'silent' | 'default' | 'debug' | 'verbose' — see "Logging" below.
  logLevel: 'default',
})
```

## Logging

The preset prints a titled box summarizing what it resolved (typescript, vue, tailwindcss preset, sonarjs, …). Powered by `@maz-ui/node`'s consola-based logger.

| Value                       | What you see                                       |
| --------------------------- | -------------------------------------------------- |
| `'silent'`                  | Nothing.                                           |
| `'default'` _(TTY default)_ | Titled box of resolved feature toggles.            |
| `'debug'`                   | Above + each plugin / preset / overrides addition. |
| `'verbose'`                 | Above + final block count and ignore-glob count.   |

The default is **`'default'` in interactive terminals, `'silent'` otherwise** (CI, pipes, JSON / SARIF formatters). This avoids polluting machine-readable ESLint output. Override by passing `logLevel` explicitly.

## Tailwind support

Powered by [`eslint-plugin-better-tailwindcss`](https://github.com/schoero/eslint-plugin-better-tailwindcss) — compatible with ESLint 7→10 and Tailwind v3 + v4.

| Value                   | Behavior                                                                |
| ----------------------- | ----------------------------------------------------------------------- |
| `false` _(default)_     | Disabled.                                                               |
| `true`                  | Same as `'recommended'` with default settings.                          |
| `'recommended'`         | Stylistic + correctness rules.                                          |
| `'stylistic'`           | Formatting rules only (class order, line wrapping, …).                  |
| `'correctness'`         | Validation rules only (`no-unknown-classes`, `no-conflicting-classes`). |
| `MazTailwindcssOptions` | Pick a preset and pass plugin settings.                                 |

```js
defineConfig({
  tailwindcss: {
    preset: 'recommended',
    // Tailwind v4: path to the CSS that does `@import "tailwindcss" prefix(maz)`
    entryPoint: 'src/main.css',
    // Tailwind v3 instead:
    // tailwindConfig: 'tailwind.config.ts',
    detectComponentClasses: true,
    // Custom `maz/tailwind-no-arbitrary-px` rule — see "Custom rules" below.
    noArbitraryPx: true,
  },
})
```

> [!IMPORTANT]
> The plugin's `no-unknown-classes` rule needs to know about your Tailwind setup (prefix, custom utilities, theme tokens). Without `entryPoint` (v4) or `tailwindConfig` (v3), it falls back to the default Tailwind config and will flood with false positives in projects that customize either. **Pass the path explicitly** if your Tailwind setup is non-standard.

## Custom rules

This preset ships its own ESLint plugin under the `maz/*` namespace. Rules are organized by category — `maz/tailwind-*` for Tailwind-specific rules, ready for `maz/js-*` and others as they get added.

### `maz/tailwind-no-arbitrary-px`

Forbids `px` units inside Tailwind arbitrary value classes (`w-[16px]`, `m-[-16px]`, `[gap:24px]`, …) and **autofixes** them to `rem` (or `em`) using the configured root font-size. Whitespace inside brackets (e.g. `[up to 100px]`) is left alone so plain prose is never rewritten.

> [!NOTE]
> The rule and the `maz` plugin are only registered when `tailwindcss` is enabled (any value other than `false`). With `tailwindcss: false` _(default)_ neither the plugin nor the rule appear in the final flat-config. To use the rule in a project that doesn't opt into the full Tailwind preset, register it manually (see [Use the plugin directly](#use-the-plugin-directly)).

When `tailwindcss` is on, the rule is enabled with defaults. You can tune it either way:

**Standard ESLint override** _(idiomatic, max control)_

```js
defineConfig({
  tailwindcss: 'recommended',
  rules: {
    'maz/tailwind-no-arbitrary-px': ['error', { baseFontSize: 10, unit: 'em' }],
  },
})
```

User `rules` overrides are applied in a _trailing_ block, so they win over the rule's defaults wired in by `tailwindcssConfigs`.

**Ergonomic shortcut** _(set the defaults via `tailwindcss.noArbitraryPx`)_

```js
defineConfig({
  tailwindcss: {
    preset: 'recommended',
    noArbitraryPx: {
      baseFontSize: 16, // default — convert px / 16 → rem
      unit: 'rem', // default — target unit ('rem' | 'em')
      severity: 'error', // default — 'off' | 'warn' | 'error'
    },
  },
})
```

| `noArbitraryPx` value              | Behavior                                           |
| ---------------------------------- | -------------------------------------------------- |
| `true` _(default)_                 | Enabled with defaults (`baseFontSize: 16`, `rem`). |
| `false`                            | Disabled.                                          |
| `{ baseFontSize, unit, severity }` | Override any subset of the defaults.               |

If both are set, the standard `rules` override wins (last block applied).

Examples after autofix (with `baseFontSize: 16`):

| Before                | After                   |
| --------------------- | ----------------------- |
| `w-[16px]`            | `w-[1rem]`              |
| `m-[-16px]`           | `m-[-1rem]`             |
| `tracking-[.5px]`     | `tracking-[0.03125rem]` |
| `p-[16px_8px]`        | `p-[1rem_0.5rem]`       |
| `[gap:24px]`          | `[gap:1.5rem]`          |
| `w-[calc(100%-16px)]` | `w-[calc(100%-1rem)]`   |

### Use the plugin directly

If you don't want the full Tailwind preset (or just prefer wiring rules yourself), import `mazPlugin` and register it in your own flat-config block. This is also the way to use `maz/tailwind-*` rules without enabling `tailwindcss` in `defineConfig`:

```js
import { mazPlugin } from '@maz-ui/eslint-config'

export default [{
  files: ['**/*.{ts,tsx,vue}'],
  plugins: { maz: mazPlugin },
  rules: {
    'maz/tailwind-no-arbitrary-px': ['error', { baseFontSize: 16 }],
  },
}]
```

## Advanced

### Compose your own config

```js
import {
  baseRules,
  mazPlugin,
  sonarjsRules,
  tailwindcssConfigs,
  vueRules,
} from '@maz-ui/eslint-config'

export default [
  {
    plugins: { maz: mazPlugin },
    rules: {
      ...baseRules(true), // production = true
      ...sonarjsRules,
      ...vueRules,
      'maz/tailwind-no-arbitrary-px': 'error',
    },
  },
  ...tailwindcssConfigs('stylistic', {
    entryPoint: 'src/main.css',
    noArbitraryPx: { unit: 'em' },
  }),
]
```

### Vue project

```js
defineConfig({
  vue: true, // auto-detected if `vue` / `nuxt` is in deps
  tailwindcss: 'recommended',
  rules: {
    'vue/custom-event-name-casing': ['error', 'kebab-case'],
  },
})
```

## Compatibility

- **ESLint** `^9.0.0 || ^10.0.0`
- **Node.js** `>=20.19.0`
