---
title: Tailwind CSS integration
description: Use maz-ui design tokens and utilities inside your own Tailwind v4 setup.
---

# Tailwind CSS integration

Since v5, **maz-ui is built on Tailwind CSS v4** with a CSS-first configuration. The entire design system — colors, spacing scales, shadows, radii, breakpoints, typography, z-index — is exposed as Tailwind theme tokens that you can reuse in your own application code.

In your own `<template>` and `<style>` blocks, `bg-primary`, `text-foreground`, `rounded`, `shadow-elevation`, `md:flex` etc. all resolve to the same tokens maz-ui uses internally. When you switch preset or bascule dark mode at runtime, **your own styles update with it** — no rebuild required.

::: tip Requirements
- Node.js ≥ 20
- Tailwind CSS ≥ 4.2
- Your bundler's Tailwind plugin (`@tailwindcss/vite` or `@tailwindcss/postcss`)
- Chromium 111+, Safari 16.4+, Firefox 128+ (v4 requires native CSS features)
:::

## Quick start — full design system

The recommended setup. Your Tailwind instance adopts the maz-ui tokens entirely: `bg-primary`, `rounded-lg`, `mob-m:flex`, `shadow-elevation` etc. are all powered by maz-ui.

### 1. Install the Tailwind Vite plugin

::: code-group
```bash [pnpm]
pnpm add -D tailwindcss @tailwindcss/vite
```
```bash [npm]
npm install -D tailwindcss @tailwindcss/vite
```
```bash [yarn]
yarn add -D tailwindcss @tailwindcss/vite
```
:::

### 2. Wire it into Vite

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
})
```

### 3. Create the Tailwind entry

```css
/* src/tailwind.css */
@import "tailwindcss";
@import "maz-ui/tailwindcss/theme.css";
@import "maz-ui/tailwindcss/utilities.css";
```

### 4. Import the entry once in your app

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import './tailwind.css'

// Bootstrap the maz-ui theme once so the --maz-* variables are injected
import { installTheme } from '@maz-ui/themes'
import mazUi from '@maz-ui/themes/presets/mazUi'

const app = createApp(App)
app.use(installTheme, { preset: mazUi })
app.mount('#app')
```

That's it. In any component, `class="flex bg-primary text-primary-foreground p-4 rounded shadow-elevation"` works and follows the active preset.

## Custom utilities

Maz-ui ships a handful of opinionated utilities on top of Tailwind. Importing `maz-ui/tailwindcss/utilities.css` makes them available in `@apply` and in `class=""`:

| Utility                    | Effect                                                                     |
| -------------------------- | -------------------------------------------------------------------------- |
| `flex-center`              | `align-items: center; justify-content: center`                              |
| `cap-f`                    | `::first-letter { text-transform: capitalize }` on the element             |
| `padded-container`         | `width: 100%; padding-inline: var(--maz-container-padding)` (responsive)   |
| `padded-container-no-p`    | Full-width container aligned to the theme's max-width, no side padding     |
| `z-default-backdrop`       | `z-index: 1050` — the stacking level used by MazDialog / MazToast          |

Example:

```vue
<template>
  <section class="padded-container flex-center">
    <p class="cap-f">welcome to my page.</p>
  </section>
</template>
```

## Available tokens

Every token below is exposed as a Tailwind theme variable and generates its corresponding utility. Values come from `@maz-ui/themes` and react to the active preset.

### Colors

Each of these colors has a base (`--color-X`) and an 11-step scale (`--color-X-50` … `--color-X-900`). The ones marked with *fg* also expose `--color-X-foreground` for accessible text-on-color:

- `primary` *fg* · `secondary` *fg* · `accent` *fg*
- `destructive` *fg* · `success` *fg* · `warning` *fg* · `info` *fg* · `contrast` *fg*
- `surface` (alias for `background`) · `foreground` · `divider` (alias for `border`)
- `elevation` (alias for `shadow`) · `overlay` · `muted`

Example: `bg-primary`, `text-primary-foreground`, `border-divider-300`, `shadow-elevation`.

### Radius

Based on `--maz-radius` (default `0.7rem`) so the whole scale moves when the theme radius is tweaked.

| Class         | Value                              |
| ------------- | ---------------------------------- |
| `rounded-xs`  | `calc(var(--maz-radius) - 8px)`    |
| `rounded-sm`  | `calc(var(--maz-radius) - 4px)`    |
| `rounded-md`, `rounded` | `var(--maz-radius)`   |
| `rounded-lg`  | `calc(var(--maz-radius) + 4px)`    |
| `rounded-xl`  | `calc(var(--maz-radius) + 8px)`    |

### Breakpoints

Maz-ui adds a three-tier scale on top of the standard Tailwind breakpoints (`sm`, `md`, `lg`, `xl`, `2xl` still work).

| Class      | Min-width |
| ---------- | --------- |
| `mob-s:`   | 320px     |
| `mob-m:`   | 425px     |
| `mob-l:`   | 576px     |
| `tab-s:`   | 640px     |
| `tab-m:`   | 768px     |
| `tab-l:`   | 992px     |
| `lap-s:`   | 1024px    |
| `lap-m:`   | 1280px    |
| `lap-l:`   | 1366px    |
| `lap-xl:`  | 1440px    |
| `lap-2xl:` | 1680px    |
| `lap-3xl:` | 1920px    |

### Shadows

`shadow-xs/sm/md/lg/xl` with standard scale, plus `shadow-elevation` which hooks into the theme's `--color-elevation` so the drop tint follows the active preset.

### Z-index

`z-1`, `z-2`, `z-3`, `z-4`, `z-5`, `z-15`, `z-25`, `z-35`, `z-45`, `z-75`, `z-100`, `z-default-backdrop` (1050).

### Typography & misc

`font-sans` maps to `var(--maz-font-family)`, default border width to `var(--maz-border-width)`, default transition to 200ms cubic-bezier.

## Alternative scenarios

### Scenario B — keep your own design system, pick a few tokens

If you already have a design system and only want to reuse a handful of maz-ui tokens under your own names:

```css
@import "tailwindcss";

@theme inline {
  --color-brand: var(--maz-primary);
  --color-brand-foreground: var(--maz-primary-foreground);
  --radius-brand: var(--maz-radius);
}
```

`bg-brand`, `rounded-brand` now exist without clashing with your palette. The `--maz-*` source variables are provided at runtime by `@maz-ui/themes` as long as you install it.

### Scenario C — cherry-pick one module

Every bridge file can be imported individually if you don't want the whole design system.

```css
@import "tailwindcss";
@import "maz-ui/tailwindcss/theme-colors.css"; /* only colors */
```

The modules are:

- `theme-colors.css` — color tokens + scales
- `theme-radius.css` — radius scale anchored on `--maz-radius`
- `theme-breakpoints.css` — `mob-*`, `tab-*`, `lap-*` (standard Tailwind breakpoints are preserved)
- `theme-shadows.css` — shadow scale + `shadow-elevation`
- `theme-z-index.css` — named z-index scale
- `theme-typography.css` — font family, default border width, default transition

## Nuxt

With `@nuxtjs/tailwindcss` v6 not yet compatible with Tailwind v4, wire the plugin directly through Vite:

```ts
// nuxt.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  css: ['~/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
})
```

Then create `~/css/main.css` with the same content as the Quick start.

## Using `@apply` inside Vue `<style>` blocks

Tailwind v4's Vite plugin processes each SFC's `<style>` block in isolation. For `@apply maz:flex` (or any Tailwind utility) to resolve, each block needs a `@reference` directive pointing at your Tailwind entry:

```vue
<style scoped>
@reference "../tailwind.css";

.card {
  @apply flex gap-4 rounded-md bg-surface p-4 shadow-elevation;
}
</style>
```

This is a one-time setup per SFC that uses `@apply`. Maz-ui itself ships with `@reference` embedded in every component.

## Contract stability

The paths listed on this page are the **public API** of the Tailwind bridge. They're versioned with the library:

- `maz-ui/tailwindcss/theme.css`
- `maz-ui/tailwindcss/theme-colors.css`
- `maz-ui/tailwindcss/theme-radius.css`
- `maz-ui/tailwindcss/theme-breakpoints.css`
- `maz-ui/tailwindcss/theme-shadows.css`
- `maz-ui/tailwindcss/theme-z-index.css`
- `maz-ui/tailwindcss/theme-typography.css`
- `maz-ui/tailwindcss/utilities.css`

The **token names** (e.g. `--color-primary`, `--radius`, `--breakpoint-mob-s`, `--shadow-elevation`, `--z-default-backdrop`) are part of the contract — they won't change without a major release. Values may evolve as the design system evolves, but minor versions won't break the class surface.

## See also

- [Theming](/guide/themes) — customise or build your own preset
- [MazUiProvider](/guide/maz-ui-provider) — runtime theme + translations bootstrap
- [Migration v4 → v5](/guide/migration-v4) — upgrading from Tailwind v3
