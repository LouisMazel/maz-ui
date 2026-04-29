---
title: '@maz-ui/eslint-config'
description: ESLint flat-config preset for Vue/Nuxt/JS/TS projects, layered on @antfu/eslint-config with SonarJS, Tailwind and a11y add-ons.
---

# {{ $frontmatter.title }}

`@maz-ui/eslint-config` ships an opinionated ESLint **flat config** for the kind of stack maz-ui itself uses: TypeScript, Vue 3 / Nuxt 3, optional Tailwind CSS, and tests. It is built on top of [`@antfu/eslint-config`](https://github.com/antfu/eslint-config) so you get a battle-tested baseline, then layered with quality rules from [SonarJS](https://github.com/SonarSource/eslint-plugin-sonarjs) and accessibility rules from [`eslint-plugin-vuejs-accessibility`](https://github.com/vue-a11y/eslint-plugin-vuejs-accessibility).

## Installation

```bash
pnpm add -D @maz-ui/eslint-config eslint
```

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
  tailwindcss: false, // optional, requires eslint-plugin-tailwindcss
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
})
```

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

## What it includes

- **Antfu base** — TypeScript-aware rules, Stylistic formatting, modern import order.
- **SonarJS** — code quality and complexity heuristics, with a relaxed set for `*.spec.ts` / `*.test.ts`.
- **Vue rules** (when Vue/Nuxt is detected) — block-tag order, naming conventions, template a11y.
- **Tailwind plugin** (opt-in) — class ordering, no-contradicting classes, valid Tailwind syntax.
- **Markdown** — prose linting baseline.

## Advanced

You can import the individual rule sets if you want to compose your own config:

```ts
import { baseRules, sonarjsRules, tailwindcssRules, vueRules } from '@maz-ui/eslint-config'

export default [
  {
    rules: {
      ...baseRules(true),
      ...sonarjsRules,
      // ...
    },
  },
]
```

## Compatibility

| Tool | Required version |
| --- | --- |
| ESLint | `>=9.0.0 <11.0.0` |
| Node.js | `>=20.19.0` |
| TypeScript | `^5.0.0` |
