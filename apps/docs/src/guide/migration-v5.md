---
title: Maz-UI v5.0.0 Migration Guide
description: Upgrade from Maz-UI v4 to v5 — Tailwind CSS v4, CSS-first configuration, and new consumer integration API
---

# {{ $frontmatter.title }}

Maz-UI v5 is a **major** that moves the entire design system to **Tailwind CSS v4** with a CSS-first configuration. This guide walks you through everything you need to update in a consumer app.

::: warning Solo maintainer notice
Maz-UI is maintained by a single developer. After the v5 stable release, **v4 will no longer receive any support** — no security fixes, no backports. Please migrate.
:::

::: tip TL;DR
1. Bump your Node to **≥ 20**, target **Chromium 111+ / Safari 16.4+ / Firefox 128+**.
2. Install Tailwind v4 in your app (`tailwindcss@^4.2`, `@tailwindcss/vite`).
3. Replace your `tailwind.config.{ts,js}` with a CSS entry that imports `maz-ui/tailwindcss/theme.css`.
4. Run the codemod on your source: `npx @maz-ui/codemod tailwind-v4 ./src`.
5. For each SFC `<style>` block that uses `@apply`, prepend `@reference` to your Tailwind entry.
6. Deal with manual follow-ups listed below.
:::

## What's new / what breaks

### Tailwind v4 CSS-first

Tailwind v4 shipped a new architecture:

- Configuration lives in CSS via `@theme` instead of `tailwind.config.js`.
- `@tailwind base/components/utilities` is replaced by `@import "tailwindcss"`.
- Several utilities were renamed (one step down on each scale).
- Classes with a library prefix switch from the `maz-` form (`maz-flex`) to the v4 `maz:` form (`maz:flex`).
- The important modifier moves from prefix to suffix: `!maz-m-0` → `maz:m-0!`.
- CSS-variable arbitrary values have a shorthand: `bg-[var(--x)]` → `bg-(--x)`.

### Browser support

v5 requires native support for:

- [color-mix()](https://caniuse.com/?search=color-mix) — Chromium 111+, Safari 16.4+, Firefox 128+
- [`@property`](https://caniuse.com/?search=%40property) — same minima
- Cascade layers — available everywhere since 2023

There is no polyfill path. If you support older browsers, stay on v4.

### New consumer integration API

v5 exposes the design system as importable CSS modules:

- `maz-ui/tailwindcss/theme.css` — full bridge (colors + radius + breakpoints + …)
- `maz-ui/tailwindcss/theme-colors.css`, `theme-radius.css`, `theme-breakpoints.css`, `theme-shadows.css`, `theme-z-index.css`, `theme-typography.css` — granular modules
- `maz-ui/tailwindcss/utilities.css` — `flex-center`, `cap-f`, `padded-container`, `padded-container-no-p`, `z-default-backdrop`

See the dedicated [Tailwind CSS integration](./tailwind.md) page for the three supported scenarios (full adoption / aliased tokens / cherry-pick).

### CSS variable format

In v4, the `--maz-*` colors were emitted in the legacy raw-HSL form (`210 100% 56%`) and you had to wrap them in `hsl(...)` at the usage site.

In v5 they are emitted as complete CSS color values (`hsl(210 100% 56%)`), so:

```css
/* v4 */
background-color: hsl(var(--maz-primary));
border-color: hsl(var(--maz-primary) / 0.5);

/* v5 */
background-color: var(--maz-primary);
border-color: color-mix(in srgb, var(--maz-primary) 50%, transparent);
```

The codemod handles this automatically (including the Tailwind arbitrary-value variants).

### Removed public APIs

| API | Replacement |
| --- | --- |
| `defineMazTailwindConfig()` | CSS-first: `@import "tailwindcss"` + `@import "maz-ui/tailwindcss/theme.css"` |
| `getColors()`, `createScaleColor()`, `createSimpleColor()` from `maz-ui/tailwindcss` | Not needed — the bridge CSS generates every scale |
| `designTokens`, `zIndex`, `utilities` constants from `maz-ui/tailwindcss` | Migrated into the bridge CSS modules |
| `formatHSL(h,s,l)` from `@maz-ui/themes` | `formatAsHSL({h,s,l})` — returns complete `hsl(...)` |

Kept:

- `getNumericScreensFromTailwind` and `screens` from `maz-ui/tailwindcss` — still used by `useBreakpoints`
- `parseHSL` (now a deprecated alias for the more permissive `parseColor`)
- `generateColorScale`, `getContrastColor`, `adjustColorLightness` — same signatures, now emit `hsl(…)` strings

### Type changes

| Type | v4 | v5 |
| --- | --- | --- |
| `HSL` | template literal `` `${number} ${number}% ${number}%` `` | deprecated alias for the old form |
| `ThemeColors` fields | `HSL` | `CSSColor` (any valid CSS color string — `hsl()`, `rgb()`, `oklch()`, `#hex`, legacy raw) |

Legacy raw values in your presets keep working at runtime — they're auto-wrapped in `hsl()` by `normalizeColor()`.

## Step-by-step migration

### 1. Prerequisites

```bash
# Node
node -v  # must be >= 20
```

Check your minimum browser support matches v5. If not, stay on v4.

### 2. Install Tailwind v4

::: code-group
```bash [Vite app]
pnpm add -D tailwindcss@^4.2 @tailwindcss/vite
```
```bash [PostCSS setup]
pnpm add -D tailwindcss@^4.2 @tailwindcss/postcss
```
:::

Remove the old deps that are folded into v4:

```bash
pnpm remove tailwindcss@3 autoprefixer postcss-import postcss-nested
```

### 3. Wire up the bundler

::: code-group
```ts [Vite (recommended)]
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
})
```
```js [PostCSS]
// postcss.config.cjs
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```
```ts [Nuxt]
// nuxt.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt'],
  css: ['~/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
})
```
:::

::: warning @nuxtjs/tailwindcss
`@nuxtjs/tailwindcss@6.x` is Tailwind v3 only. Remove it and use `@tailwindcss/vite` directly, as shown above.
:::

### 4. Replace the JS Tailwind config with a CSS entry

Delete `tailwind.config.{ts,js}` (and any `defineMazTailwindConfig` import). Create a single CSS entry instead:

```css
/* src/tailwind.css */
@import "tailwindcss";
@import "maz-ui/tailwindcss/theme.css";
@import "maz-ui/tailwindcss/utilities.css";
```

Import that file **once** in your app entry (before your own styles):

```ts
import './tailwind.css'
import './assets/app.css'
```

If you want only a subset of the design system, see the [granular modules table](./tailwind.md#scenario-c-cherry-pick-one-module).

### 5. Run the codemod on your source

```bash
npx @maz-ui/codemod tailwind-v4 ./src
```

The codemod will rewrite, across `.vue`, `.ts`, `.tsx` and `.css`:

- Prefix: `maz-flex` → `maz:flex`
- Variants: `dark:maz-bg-primary` → `maz:dark:bg-primary`
- Important: `!maz-m-0` → `maz:m-0!` (and the `dark:!maz-X` / `!dark:maz-X` forms)
- Utility renames (`rounded-sm` → `rounded-xs`, `outline-none` → `outline-hidden`, `shadow` → `shadow-sm`, `shadow-sm` → `shadow-xs`, `drop-shadow` → `drop-shadow-sm`, `drop-shadow-sm` → `drop-shadow-xs`, `blur` → `blur-sm`, `blur-sm` → `blur-xs`, `backdrop-blur` → `backdrop-blur-sm`, `backdrop-blur-sm` → `backdrop-blur-xs`, `ring` → `ring-3`, every `bg-gradient-to-*` → `bg-linear-to-*`)
- Negative values: `-maz-mt-4` → `maz:-mt-4` and the `maz--X` collapsed form
- CSS-var double-wrap: `hsl(var(--maz-primary))` → `var(--maz-primary)` and the alpha variant to `color-mix(...)`
- Tailwind arbitrary values: `maz:bg-[var(--maz-primary)]` → `maz:bg-(--maz-primary)`, alpha forms similarly

It preserves the v3 `maz-ui` package name in import paths and protects custom component CSS classes (the tool reads your `<style>` blocks to avoid rewriting non-utility selectors).

Dry run first if you want to preview:

```bash
npx @maz-ui/codemod tailwind-v4 ./src --dry-run
```

### 6. Add `@reference` to SFCs using `@apply`

Tailwind v4's Vite plugin processes each `<style>` block in isolation, so for `@apply` to resolve it needs to know where the config lives:

```vue
<style scoped>
@reference "../tailwind.css";

.card {
  @apply flex gap-4 p-4 rounded-md bg-surface shadow-elevation;
}
</style>
```

One `@reference` directive at the top of each block that uses `@apply`. The codemod can inject it if you pass `--add-reference`:

```bash
npx @maz-ui/codemod tailwind-v4 ./src --add-reference=src/tailwind.css
```

### 7. Manual follow-ups

These cases cannot be automated safely — review them by hand after the codemod runs:

- **Dynamic class strings computed outside templates**. The codemod scans Vue script blocks but doesn't rewrite strings it can't parse (e.g. concatenated at runtime). Search for `maz-` in your build output and fix any leftovers.
- **Custom CSS classes that begin with `maz-`**. The codemod whitelists the ones it sees declared in your `<style>` blocks, but BEM-like classes declared via `classList.add` in JS handlers may slip through. Ex: `el.classList.add('maz-is-open')` is not touched.
- **Tailwind config customisations**. Anything beyond design tokens (custom plugins, content scanning rules, corePlugins overrides) has to be re-expressed in CSS under `@theme`, `@utility`, or `@source`. See [Tailwind v4 docs](https://tailwindcss.com/docs/theme).
- **`hsl(var(--X) / alpha)` outside the codemod's reach**. Inline styles and string templates in JS are rewritten; CSS-in-JS and scoped helpers might not be. Grep for `hsl(var(--maz-` to double-check.
- **Deep imports** `maz-ui/tailwindcss/tailwind.config` and friends — remove them, they no longer exist.

### 8. Validate

```bash
pnpm -C your-app build
pnpm -C your-app test:unit
pnpm -C your-app lint
```

Then spot-check in a browser — click through every surface that uses maz-ui, especially anything with shadows, radius, blur or gradients (the rename list above changes visual sizing).

## Full breaking-changes table

| Topic | v4 | v5 | Auto via codemod |
| --- | --- | --- | --- |
| Tailwind CLI / package | `tailwindcss@3` | `tailwindcss@^4.2` + `@tailwindcss/vite` or `@tailwindcss/postcss` | ❌ (deps change manually) |
| Config file | `tailwind.config.ts` with `defineMazTailwindConfig()` | CSS `@theme` blocks imported from `maz-ui/tailwindcss/theme.css` | ❌ |
| Class prefix (lib) | `maz-flex` | `maz:flex` | ✅ |
| Variant order | `dark:maz-border` | `maz:dark:border` | ✅ |
| Important modifier | `!maz-m-0` | `maz:m-0!` | ✅ |
| Utility: rounded | `rounded-sm` | `rounded-xs` | ✅ |
| Utility: shadow | `shadow`, `shadow-sm` | `shadow-sm`, `shadow-xs` | ✅ |
| Utility: drop-shadow | `drop-shadow`, `drop-shadow-sm` | `drop-shadow-sm`, `drop-shadow-xs` | ✅ |
| Utility: blur | `blur`, `blur-sm`, `backdrop-blur`, `backdrop-blur-sm` | `blur-sm`, `blur-xs`, `backdrop-blur-sm`, `backdrop-blur-xs` | ✅ |
| Utility: ring | `ring` (3px) | `ring-3` | ✅ |
| Utility: outline-none | `outline-none` | `outline-hidden` | ✅ |
| Utility: gradients | `bg-gradient-to-r` | `bg-linear-to-r` | ✅ |
| CSS var usage | `hsl(var(--maz-X))` | `var(--maz-X)` | ✅ |
| CSS var alpha | `hsl(var(--maz-X) / 0.5)` | `color-mix(in srgb, var(--maz-X) 50%, transparent)` | ✅ |
| CSS var in arbitrary value | `bg-[var(--maz-X)]`, `bg-[hsl(var(--maz-X))]` | `bg-(--maz-X)` | ✅ |
| `<style>` blocks using `@apply` | Plain | Must start with `@reference "path/to/tailwind.css";` | ✅ via `--add-reference` |
| Preset colour format | Raw `'210 100% 56%'` | Full `'hsl(210 100% 56%)'` (legacy raw still accepted) | ⚠️ manual |
| `HSL` type | `` `${number} ${number}% ${number}%` `` template literal | `CSSColor = string` | ❌ (search & replace) |
| `formatHSL(h,s,l)` | returns `'H S% L%'` | **removed** | ❌ (use `formatAsHSL({h,s,l})`) |
| `parseHSL(value)` | only accepts `'H S% L%'` | permissive alias of `parseColor` (any CSS color) | — |
| Browsers | Chromium 90+, Safari 14+ | Chromium 111+, Safari 16.4+, Firefox 128+ | — |

## Troubleshooting

**`Cannot apply utility class 'maz:flex' because the 'maz' variant does not exist`**
Your SFC `<style>` block is missing `@reference`. Add `@reference "<relative-path>/tailwind.css";` right after `<style scoped>`.

**`Cannot apply unknown utility class 'maz:cap-f'` (or other maz-ui custom utility)**
You haven't imported the utilities bridge. Add `@import "maz-ui/tailwindcss/utilities.css";` to your Tailwind entry.

**Colors look wrong (e.g. hsl(hsl(...))) in browser devtools**
You still have `hsl(var(--maz-X))` somewhere. Run the codemod again, or grep manually: `rg "hsl\(var\(--maz-"`.

**`@nuxtjs/tailwindcss` throws errors on startup**
v6 doesn't support Tailwind v4. Remove it and wire `@tailwindcss/vite` through `nuxt.config.vite.plugins` instead.

**Build time feels slower**
On libraries with many SFCs, the `<style>`-block pipeline adds overhead. On incremental builds (HMR) v5 is much faster — the slowdown is cold-build only.

## See also

- [Tailwind CSS integration](./tailwind.md) — consumer API, three scenarios, contract stability
- [Theming](./themes.md) — presets and custom theme authoring
- [Vue setup](./vue.md#set-up-tailwind-css-v4) / [Nuxt setup](./nuxt.md#set-up-tailwind-css-v4)
- [Official Tailwind v4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide)
