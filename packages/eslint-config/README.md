# @maz-ui/eslint-config

Reusable ESLint configuration for JavaScript/TypeScript projects, built on top of [`@antfu/eslint-config`](https://github.com/antfu/eslint-config).

## Features

- 🚀 **Based on @antfu/eslint-config** — modern, performant, flat-config first
- 🛡️ **TypeScript-first** — strict mode, sensible defaults
- 🎨 **Tailwind CSS v3 + v4** — via [`eslint-plugin-better-tailwindcss`](https://github.com/schoero/eslint-plugin-better-tailwindcss) (compat ESLint 7→10, both Tailwind versions)
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
  },
})
```

> [!IMPORTANT]
> The plugin's `no-unknown-classes` rule needs to know about your Tailwind setup (prefix, custom utilities, theme tokens). Without `entryPoint` (v4) or `tailwindConfig` (v3), it falls back to the default Tailwind config and will flood with false positives in projects that customize either. **Pass the path explicitly** if your Tailwind setup is non-standard.

## Advanced

### Compose your own config

```js
import {
  baseRules,
  sonarjsRules,
  tailwindcssConfigs,
  vueRules,
} from '@maz-ui/eslint-config'

export default [
  {
    rules: {
      ...baseRules(true), // production = true
      ...sonarjsRules,
      ...vueRules,
    },
  },
  ...tailwindcssConfigs('stylistic', { entryPoint: 'src/main.css' }),
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
