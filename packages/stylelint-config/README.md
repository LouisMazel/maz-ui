# @maz-ui/stylelint-config

Reusable [Stylelint](https://stylelint.io/) configuration for Vue/Nuxt/JS/TS projects, with first-class Tailwind CSS v4 support, RTL-friendly logical properties, and SCSS opt-in.

## Features

- 🚀 **Stylelint Standard base** — opinionated, maintained by the Stylelint team
- 🎨 **Tailwind v4** — at-rule whitelist, `import-notation: string` enforced
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
  tailwind: true, // auto-detected from `tailwindcss` dep
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
})
```

## Documentation

See the full documentation at [maz-ui.com/ecosystem/stylelint-config](https://maz-ui.com/ecosystem/stylelint-config).

## Compatibility

- **Stylelint** >=16 <18
- **Node.js** >=20.19.0
