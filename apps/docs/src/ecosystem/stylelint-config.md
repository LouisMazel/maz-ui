---
title: '@maz-ui/stylelint-config'
description: Stylelint preset for Vue/Nuxt/JS/TS projects, with first-class Tailwind CSS v4 support, RTL-friendly logical properties, and SCSS opt-in.
---

# {{ $frontmatter.title }}

`@maz-ui/stylelint-config` is the Stylelint counterpart to [`@maz-ui/eslint-config`](./eslint-config.md). It builds on Stylelint's official **standard** config and layers in the conventions used by maz-ui itself: BEM-friendly class patterns, Tailwind v4 at-rule whitelist, RTL-friendly logical properties, optional SCSS support, and Vue/HTML block parsing.

## Installation

```bash
pnpm add -D @maz-ui/stylelint-config stylelint
```

The peer dependencies the preset relies on (`stylelint-config-standard`, `stylelint-config-recommended-vue`, `stylelint-use-logical-spec`, …) are bundled as direct dependencies, so you don't need to install them yourself.

## Basic usage

Create `stylelint.config.mjs` at the root of your project:

```js
import { defineConfig } from '@maz-ui/stylelint-config'

export default defineConfig()
```

Vue, Tailwind and SCSS are auto-detected from your `package.json`:

| Detected when… | Enables… |
| --- | --- |
| `vue` or `nuxt` is in dependencies | Vue support (`stylelint-config-recommended-vue`, `<style>` block parsing) |
| `tailwindcss` is in dependencies | Tailwind v4 at-rule whitelist (`@apply`, `@theme`, `@layer`, `@variant`, …) |
| `sass`, `sass-embedded` or `node-sass` is in dependencies | SCSS support (`stylelint-config-recommended-scss`, `postcss-scss`) |

## Configuration

```js
import { defineConfig } from '@maz-ui/stylelint-config'

export default defineConfig({
  // Each one is also auto-detected — set explicitly to opt in/out.
  vue: true,
  html: false,
  tailwind: true,
  scss: false,

  // Encourage logical CSS properties for RTL-friendly authoring:
  // `inset-inline-start` instead of `left`, `margin-inline-start` instead
  // of `margin-left`, etc. Highly recommended for design systems.
  logical: true,

  // Property order strategy.
  //   'recess'        : Recess-based ordering via stylelint-config-recess-order (default)
  //   'alphabetical'  : Strict A→Z ordering
  //   false           : Disable ordering rules
  order: 'recess',

  // Extra ignore globs (merged with sensible defaults).
  ignores: ['**/legacy/**'],

  // Direct rule overrides applied on top of the resolved config.
  rules: {
    'no-descending-specificity': null,
    'function-no-unknown': [true, { ignoreFunctions: ['v-bind', 'theme'] }],
  },

  // Per-file overrides appended last.
  overrides: [
    {
      files: ['**/*.legacy.css'],
      rules: { 'no-descending-specificity': null },
    },
  ],
})
```

## Logical properties (RTL-friendly)

When `logical: true` (default), the preset enables [`stylelint-use-logical-spec`](https://github.com/Jordan-Hall/stylelint-use-logical-spec) which warns whenever you use a physical CSS property that has a logical equivalent:

```css
/* ❌ Physical — breaks in RTL languages */
.toolbar {
  margin-left: 1rem;
  padding-right: 1rem;
  text-align: left;
  left: 0;
}

/* ✅ Logical — adapts to writing direction */
.toolbar {
  margin-inline-start: 1rem;
  padding-inline-end: 1rem;
  text-align: start;
  inset-inline-start: 0;
}
```

If you ship a design system that has to work in both LTR and RTL locales (Arabic, Hebrew, Persian, …), this rule is the cheapest way to keep your CSS direction-agnostic without auditing every property by hand.

Disable it explicitly if your project doesn't need RTL support:

```js
defineConfig({ logical: false })
```

## Tailwind CSS v4

When `tailwind: true`, the preset:

- Whitelists every Tailwind v4 at-rule via `at-rule-no-unknown` (and `scss/at-rule-no-unknown` when SCSS is also on): `@apply`, `@theme`, `@layer`, `@variant`, `@custom-variant`, `@reference`, `@utility`, `@source`, `@screen`, `@starting-style`, `@tailwind`.
- Sets `at-rule-no-deprecated` to allow `@apply` (Tailwind v4 still ships it as the canonical authoring directive).
- Forces `import-notation: 'string'` — Tailwind v4 only parses the `prefix(...)` modifier on bare-string `@import` forms, never on `url()`-wrapped imports.

## What it includes

- **Stylelint Standard** — Idiomatic CSS rules from the official Stylelint config.
- **Property ordering** (`stylelint-config-recess-order`) — Recess-based, the most widely adopted convention for non-alphabetical ordering.
- **Vue / HTML support** (opt-in / auto-detected) — `<style>` and `<style scoped>` block parsing via `postcss-html`.
- **SCSS support** (opt-in / auto-detected) — full `stylelint-config-recommended-scss` + native SCSS at-rule whitelist.
- **Logical properties** — RTL-friendly authoring.
- **BEM-friendly class patterns** — disables `selector-class-pattern` and `no-descending-specificity` so `m-btn__icon`, `m-btn--ghost` and `:deep(...)` selectors flow naturally.

## Advanced

You can import the individual rule sets to compose your own:

```js
import {
  baseRules,
  GLOBAL_IGNORES,
  logicalRules,
  scssRules,
  TAILWIND_AT_RULES,
  tailwindAtRuleNoUnknown,
  tailwindRules,
} from '@maz-ui/stylelint-config'

export default {
  rules: {
    ...baseRules,
    ...tailwindRules,
    ...tailwindAtRuleNoUnknown,
  },
}
```

## Migrating from a hand-written `.stylelintrc`

If you used the historical maz-ui Stylelint setup, the migration boils down to:

```diff
-/** @type {import('stylelint').Config} */
-export default {
-  plugins: ['stylelint-scss'],
-  extends: [
-    'stylelint-config-standard',
-    'stylelint-config-standard-scss',
-    'stylelint-config-recommended-vue',
-  ],
-  rules: {
-    'at-rule-no-unknown': [true, { ignoreAtRules: ['theme', 'apply', 'layer', /* ... */] }],
-    'scss/at-rule-no-unknown': [true, { ignoreAtRules: [/* same list */] }],
-    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['deep'] }],
-    'selector-class-pattern': null,
-    'no-descending-specificity': null,
-    'function-no-unknown': [true, { ignoreFunctions: ['v-bind'] }],
-    'nesting-selector-no-missing-scoping-root': null,
-  },
-  overrides: [
-    { files: ['**/*.vue', '**/*.html'], customSyntax: 'postcss-html' },
-  ],
-}
+import { defineConfig } from '@maz-ui/stylelint-config'
+
+export default defineConfig({
+  vue: true,
+  scss: true,
+  tailwind: true,
+  logical: true,
+})
```

## Compatibility

| Tool | Required version |
| --- | --- |
| Stylelint | `>=16.0.0 <18.0.0` |
| Node.js | `>=20.19.0` |
