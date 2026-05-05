---
title: '@maz-ui/stylelint-config'
description: Stylelint preset for Vue/Nuxt/JS/TS projects, with first-class Tailwind CSS v4 support, RTL-friendly logical properties, and SCSS opt-in.
---

# {{ $frontmatter.title }}

`@maz-ui/stylelint-config` is the Stylelint counterpart to [`@maz-ui/eslint-config`](./eslint-config.md). It builds on Stylelint's official **standard** config and layers in the conventions used by maz-ui itself: BEM-friendly class patterns, Tailwind v4 support (at-rule whitelist + tunable plugin policy), RTL-friendly logical properties, optional SCSS support, Vue/HTML block parsing, and a single `extends` knob to compose extra shareable configs.

## Installation

```bash
pnpm add -D @maz-ui/stylelint-config stylelint
```

The peer dependencies the preset relies on (`stylelint-config-standard`, `stylelint-config-recommended-vue`, `stylelint-use-logical-spec`, `stylelint-plugin-tailwindcss`, `stylelint-order`, …) are bundled as direct dependencies, so you don't need to install them yourself.

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
| `tailwindcss` or `@tailwindcss/vite` is in dependencies | At-rule whitelist + Tailwind plugin with the `'minimal'` policy (see [Tailwind](#tailwind-css-v4) below) |
| `sass`, `sass-embedded` or `node-sass` is in dependencies | SCSS support (`stylelint-config-standard-scss`, `postcss-scss`) |

::: warning Monorepo caveat
Detection only reads the `package.json` in the current working directory. In a monorepo where `tailwindcss`, `vue` or `sass` are hoisted to the root and **not declared** in a sub-package's `package.json`, detection silently fails when Stylelint runs from that sub-package. Set the relevant flags explicitly in those cases:

```js
defineConfig({ vue: true, tailwind: true, scss: false })
```
:::

## Configuration

```js
import { defineConfig } from '@maz-ui/stylelint-config'

export default defineConfig({
  // Each one is also auto-detected — set explicitly to opt in/out.
  vue: true,
  html: false,

  // `true` → 'minimal' plugin policy. Pass 'recommended' or 'strict' to enforce
  // utility-first authoring conventions. `false` disables Tailwind support.
  tailwind: true,
  scss: false,

  // Encourage logical CSS properties for RTL-friendly authoring:
  // `inset-inline-start` instead of `left`, `margin-inline-start` instead
  // of `margin-left`, etc. Highly recommended for design systems.
  logical: true,

  // Property order strategy.
  //   'recess'        : Recess-based ordering via stylelint-config-recess-order (default)
  //   'alphabetical'  : A→Z ordering via stylelint-order
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

  // Layer extra shareable configs. Appended after the built-ins so they
  // win Stylelint's cascade.
  extends: ['stylelint-config-clean-order'],

  // Log verbosity — see "Logging" below.
  logLevel: 'default',
})
```

## Logging

The preset can explain what it resolved and which plugins / extends it added — useful when you can't figure out why a rule is on or off. Logging is powered by [`@maz-ui/node`](https://www.npmjs.com/package/@maz-ui/node)'s consola-based logger.

| `logLevel` | What you see |
| --- | --- |
| `'silent'` | Nothing. |
| `'default'` *(default)* | A titled box summarizing the resolved support (vue, tailwind, scss, html, logical, order), with `(auto-detected)` / `(default)` annotations next to each value. |
| `'debug'` | Adds one line per plugin / extends / overrides addition (`Vue: extended stylelint-config-recommended-vue`, `Tailwind: loaded 2 plugin(s) for "minimal" policy`, `User: extended stylelint-config-clean-order`, …). |
| `'verbose'` | Adds the final shape: complete `extends` list, plugin / rule / override / ignore counts. |

```js
defineConfig({ logLevel: 'debug' })
```

The `logLevel` type comes from `@maz-ui/node` and accepts the full set of consola levels (`'silent'`, `'error'`, `'warning'`, `'normal'`, `'default'`, `'debug'`, `'trace'`, `'verbose'`). The four values above are the ones the preset actually produces output for.

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

When `tailwind` is enabled (truthy or auto-detected), the preset:

- Whitelists every Tailwind v4 at-rule via `at-rule-no-unknown` (and `scss/at-rule-no-unknown` when SCSS is also on): `@apply`, `@theme`, `@layer`, `@variant`, `@custom-variant`, `@reference`, `@utility`, `@source`, `@screen`, `@starting-style`, `@tailwind`.
- Sets `at-rule-no-deprecated` to allow `@apply` (Tailwind v4 still ships it as the canonical authoring directive).
- Forces `import-notation: 'string'` — Tailwind v4 only parses the `prefix(...)` modifier on bare-string `@import` forms, never on `url()`-wrapped imports.
- Loads [`stylelint-plugin-tailwindcss`](https://github.com/sonofmagic/dev-configs/tree/main/packages/stylelint-plugin-tailwindcss) and applies a curated rule set based on the chosen policy level.

### Policy levels

The `tailwind` option accepts a strictness level. Pure `true` (or auto-detection) maps to `'minimal'`.

| Value | Plugin loaded | What runs |
| --- | --- | --- |
| `true` *(or auto-detected)* | ❌ | Same as `'minimal'`. |
| `'minimal'` | ❌ | At-rule whitelist + `import-notation: 'string'` + `at-rule-no-deprecated`. **No plugin rules.** |
| `'recommended'` | ✅ | `'minimal'` + `stylelint-plugin-tailwindcss`'s `recommended` preset (`no-invalid-apply`, `no-invalid-theme-function`, `no-atomic-class`, `no-apply`, `no-arbitrary-value`). |
| `'strict'` | ✅ | `'recommended'` + architecture-level rules (`no-theme-function`, `no-screen-directive`, `no-tailwind-directive`, `no-import-directive`, `no-css-layer`). |
| `false` | ❌ | Tailwind support disabled entirely (no at-rule whitelist, no plugin). |

```js
defineConfig({ tailwind: 'recommended' })
```

::: warning Plugin rules need to find your Tailwind runtime
Both `'recommended'` and `'strict'` enable rules from `stylelint-plugin-tailwindcss` that resolve your project's Tailwind installation from each linted file's path. Projects with a Tailwind v4 prefix (`maz:`, `tw:`, …), a non-standard entry CSS, or a monorepo layout where the plugin can't locate Tailwind will produce a flood of false positives (every `@apply maz:flex` flagged as invalid).

`'minimal'` is the safe default — it only enables the at-rule whitelist and a couple of CSS-level rules, no runtime Tailwind validation.

If you want validation but hit false positives, drop the offending rule:

```js
defineConfig({
  tailwind: 'recommended',
  rules: {
    'tailwindcss/no-invalid-apply': null,
    'tailwindcss/no-invalid-theme-function': null,
  },
})
```
:::

The plugin supports both Tailwind v3 and v4.

## Property ordering

| Value | Behavior |
| --- | --- |
| `'recess'` *(default)* | Extends `stylelint-config-recess-order`. Pragmatic, widely adopted, groups related properties. |
| `'alphabetical'` | Loads `stylelint-order` and enables `order/properties-alphabetical-order`. Strict A→Z. |
| `false` | No ordering rules. |

To swap recess for another shareable order config (e.g. `stylelint-config-clean-order`), disable the built-in strategy and extend yours via the [`extends`](#layering-shareable-configs) option:

```js
defineConfig({
  order: false,
  extends: ['stylelint-config-clean-order'],
})
```

## Layering shareable configs

The `extends` option appends entries **after** the built-ins, so user configs win Stylelint's cascade:

```js
defineConfig({
  extends: [
    'stylelint-config-clean-order', // alternative property order
    '@stylistic/stylelint-config', // restore stylistic rules retired from Stylelint core
  ],
})
```

Use this to layer additional shareable configs without rewriting the whole `defineConfig` output.

## What it includes

- **Stylelint Standard** — Idiomatic CSS rules from the official Stylelint config.
- **Property ordering** — Recess-based by default (`stylelint-config-recess-order`), alphabetical via `stylelint-order`, or off — see [Property ordering](#property-ordering).
- **Tailwind v4 support** (opt-in / auto-detected) — at-rule whitelist + `stylelint-plugin-tailwindcss` with three policy levels — see [Tailwind CSS v4](#tailwind-css-v4).
- **Vue / HTML support** (opt-in / auto-detected) — `<style>` and `<style scoped>` block parsing via `postcss-html`.
- **SCSS support** (opt-in / auto-detected) — `stylelint-config-standard-scss` + native SCSS at-rule whitelist.
- **Logical properties** — RTL-friendly authoring via `stylelint-use-logical-spec`.
- **BEM-friendly class patterns** — disables `selector-class-pattern` and `no-descending-specificity` so `m-btn__icon`, `m-btn--ghost` and `:deep(...)` selectors flow naturally.
- **Layering** — `extends` option to compose additional shareable configs on top of the resolved output.

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
  tailwindPluginMinimal,
  tailwindPluginRecommended,
  tailwindPluginStrict,
  tailwindRules,
} from '@maz-ui/stylelint-config'

export default {
  rules: {
    ...baseRules,
    ...tailwindRules,
    ...tailwindAtRuleNoUnknown,
    ...tailwindPluginMinimal,
  },
}
```

Each `tailwindPlugin*` constant is the rule object for the corresponding policy level — useful when you compose Stylelint configs by hand instead of going through `defineConfig`.

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
+  tailwind: true, // 'minimal' | 'recommended' | 'strict' | false also accepted
+  logical: true,
+})
```

## Compatibility

| Tool | Required version |
| --- | --- |
| Stylelint | `>=16.0.0 <18.0.0` |
| Node.js | `>=20.19.0` |
