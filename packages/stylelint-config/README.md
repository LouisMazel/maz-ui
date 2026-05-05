# @maz-ui/stylelint-config

Reusable [Stylelint](https://stylelint.io/) configuration for Vue/Nuxt/JS/TS projects, with first-class Tailwind CSS v4 support, RTL-friendly logical properties, and SCSS opt-in.

## Features

- 🚀 **Stylelint Standard base** — opinionated, maintained by the Stylelint team
- 🎨 **Tailwind v4** — at-rule whitelist, validation rules via `stylelint-plugin-tailwindcss` (3 strictness levels)
- 🌍 **RTL-friendly** — logical properties via `stylelint-use-logical-spec`
- 🔠 **Property ordering** — Recess-based by default, alphabetical or off
- 💚 **Vue/HTML/SCSS** — auto-detected from your `package.json`
- 🛠 **Configurable** — toggle features, override rules, append per-file overrides

## Installation

```bash
pnpm add -D @maz-ui/stylelint-config stylelint
```

## Basic usage

```js
// stylelint.config.mjs
import { defineConfig } from '@maz-ui/stylelint-config'

export default defineConfig()
```

Vue, Tailwind and SCSS are auto-detected from your `package.json`.

## Options

```js
defineConfig({
  vue: true, // auto-detected from `vue`/`nuxt` deps
  html: false,
  tailwind: true, // auto-detected from `tailwindcss` dep — see "Tailwind" below
  scss: false, // auto-detected from `sass`/`sass-embedded`/`node-sass`
  logical: true, // recommend logical CSS properties (RTL-friendly)
  order: 'recess', // 'recess' | 'alphabetical' | false

  ignores: ['**/legacy/**'],
  rules: {
    'no-descending-specificity': null,
  },
  overrides: [
    { files: ['**/*.legacy.css'], rules: { 'color-no-invalid-hex': null } },
  ],
  extends: ['stylelint-config-clean-order'], // layer extra shareable configs
  logLevel: 'default', // 'silent' | 'default' | 'debug' | 'verbose' — see "Logging" below
})
```

### Logging

The preset can log what it resolves and applies, which is handy when you don't understand why a rule is on or off. Pass a `logLevel` (powered by `@maz-ui/node`'s consola-based logger):

| Value                   | What you see                                                                                                                                    |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `'silent'`              | Nothing.                                                                                                                                        |
| `'default'` _(default)_ | A titled box summarizing the resolved support (vue, tailwind, scss, html, logical, order) and whether each value was auto-detected or explicit. |
| `'debug'`               | Above + each plugin / extends / overrides addition (`Loaded stylelint-use-logical-spec`, `Tailwind: loaded N plugins for "minimal" policy`, …). |
| `'verbose'`             | Above + final shape (full `extends` list, plugin/rule/override/ignore counts).                                                                  |

```js
defineConfig({ logLevel: 'debug' })
```

### Tailwind support

| Value                           | Behavior                                                                                                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `true` _(or auto-detected)_     | Same as `'minimal'`.                                                                                                                                                      |
| `'minimal'` _(default when on)_ | At-rule whitelist + `import-notation: 'string'` + `at-rule-no-deprecated`. **No plugin loaded.**                                                                          |
| `'recommended'`                 | `'minimal'` + `stylelint-plugin-tailwindcss`'s recommended preset (`no-invalid-apply`, `no-invalid-theme-function`, `no-atomic-class`, `no-apply`, `no-arbitrary-value`). |
| `'strict'`                      | `'recommended'` + `no-theme-function`, `no-screen-directive`, `no-tailwind-directive`, `no-import-directive`, `no-css-layer`.                                             |
| `false`                         | Tailwind support disabled entirely.                                                                                                                                       |

> [!IMPORTANT]
> The plugin rules in `'recommended'` and `'strict'` auto-resolve your project's Tailwind runtime from each linted file's path. Projects with a v4 prefix (`maz:`, `tw:`, …), a non-standard entry CSS, or a monorepo layout where Tailwind isn't where the plugin expects produce false positives. **`'minimal'` is the safe default.** Opt into `'recommended'` only if your project sits in the plugin's happy path.

Plugin rules come from [`stylelint-plugin-tailwindcss`](https://github.com/sonofmagic/dev-configs/tree/main/packages/stylelint-plugin-tailwindcss) and support both Tailwind v3 and v4.

### Property ordering

| Value            | Behavior                                                                   |
| ---------------- | -------------------------------------------------------------------------- |
| `'recess'`       | Extends `stylelint-config-recess-order` (default).                         |
| `'alphabetical'` | Loads `stylelint-order` and enables `order/properties-alphabetical-order`. |
| `false`          | No ordering rules.                                                         |

To swap recess for another shareable order config (e.g. `stylelint-config-clean-order`), disable the built-in strategy and extend yours:

```js
defineConfig({
  order: false,
  extends: ['stylelint-config-clean-order'],
})
```

### Layering shareable configs

The `extends` option appends entries **after** the built-ins, so user configs win Stylelint's cascade. Common cases:

```js
defineConfig({
  extends: [
    'stylelint-config-clean-order', // alternative property order
    '@stylistic/stylelint-config', // restore stylistic rules retired from core
  ],
})
```

### Auto-detection caveat (monorepos)

Auto-detection reads the `package.json` in `process.cwd()` only. In a monorepo where `tailwindcss`, `vue` or `sass` are hoisted to the root and missing from a sub-package's `package.json`, detection fails when Stylelint runs from that sub-package.

In monorepos, **set the relevant flags explicitly**:

```js
defineConfig({ vue: true, tailwind: true, scss: false })
```

## Documentation

See the full documentation at [maz-ui.com/ecosystem/stylelint-config](https://maz-ui.com/ecosystem/stylelint-config).

## Compatibility

- **Stylelint** >=16 <18
- **Node.js** >=20.19.0
