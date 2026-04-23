---
title: Tailwind CSS integration (optional)
description: Expose your active maz-ui theme tokens to your own Tailwind v4 setup
---

# {{ $frontmatter.title }}

::: tip This page is optional
Maz-UI works without Tailwind. You install the package, import `maz-ui/styles`, and components render with the preset you chose — nothing else is required.

This page is for consumers who **already have a Tailwind v4 setup of their own** and want their own utilities (`bg-primary`, `rounded`, `md:flex-center`, `shadow-elevation`…) to pull colors, scales, and breakpoints from the **currently-active maz-ui theme**.
:::

## What the bridge gives you

You already configured a maz-ui theme via `@maz-ui/themes` — a built-in preset (`mazUi`, `ocean`, `pristine`, `obsidian`) or your own custom preset. That theme injects CSS variables (`--maz-primary`, `--maz-radius`, `--maz-font-family`, …) at runtime.

The **Tailwind bridge** is a set of small CSS files that map those `--maz-*` variables to Tailwind theme tokens (`--color-primary`, `--radius`, `--font-sans`, …) so your own Tailwind utilities resolve to the active preset:

- `class="bg-primary"` in your template → your active maz-ui primary color
- `class="rounded-lg"` → `calc(var(--maz-radius) + 4px)`
- `class="md:flex-center"` → responsive, sourced from maz-ui's breakpoint scale
- Dark mode toggle via `@maz-ui/themes` → every utility reflows automatically, no rebuild

## Prerequisites

- A working Tailwind v4 setup in your app (`tailwindcss@^4.2`, `@tailwindcss/vite` or `@tailwindcss/postcss`)
- `maz-ui` and `@maz-ui/themes` installed and the theme plugin initialized

## Setup

### 1. Import the bridge from your Tailwind entry

Wherever you have `@import "tailwindcss"` today, add the bridge imports underneath:

```css
/* src/tailwind.css (or wherever your Tailwind entry lives) */
@import "tailwindcss";

@import "maz-ui/tailwindcss/theme.css";
@import "maz-ui/tailwindcss/utilities.css";
```

That's it. Your Tailwind utilities now see every maz-ui theme token.

### 2. (Optional) Cherry-pick instead of the full bridge

`theme.css` is an aggregator. Each module can be imported individually if you only want a subset:

- `maz-ui/tailwindcss/theme-colors.css` — semantic colors + 11-step scales + aliases (`surface`/`background`, `divider`/`border`, `elevation`/`shadow`)
- `maz-ui/tailwindcss/theme-radius.css` — radius scale anchored on `--maz-radius`
- `maz-ui/tailwindcss/theme-breakpoints.css` — `mob-s` … `lap-3xl` responsive variants (added alongside Tailwind's default `sm`/`md`/`lg`/`xl`/`2xl`, not replacing them)
- `maz-ui/tailwindcss/theme-shadows.css` — shadow scale + the theme-bound `shadow-elevation`
- `maz-ui/tailwindcss/theme-z-index.css` — named z-index scale
- `maz-ui/tailwindcss/theme-typography.css` — font family, default border width, default transition

`utilities.css` is independent of the theme — it adds a handful of custom utilities (see below) that don't depend on any token.

## Available utilities from `utilities.css`

| Utility | Effect |
| --- | --- |
| `flex-center` | `align-items: center; justify-content: center` |
| `cap-f` | capitalizes the first letter via `::first-letter` |
| `padded-container` | full-width container with the theme's responsive horizontal padding |
| `padded-container-no-p` | container aligned to the theme's `--maz-container-max-width`, no side padding |
| `z-default-backdrop` | `z-index: 1050` — the stacking level used by MazDialog / MazToast |

Use them like any Tailwind utility:

```vue
<template>
  <section class="padded-container flex-center">
    <p class="cap-f">welcome to my page.</p>
  </section>
</template>
```

## Available theme tokens

### Colors

Each of these has a base (`--color-X`), a foreground (`--color-X-foreground`, only where marked), and an 11-step scale (`--color-X-50` … `--color-X-900`).

| Token | Has fg | Notes |
| --- | --- | --- |
| `primary`, `secondary`, `accent` | ✅ | brand colors |
| `destructive`, `success`, `warning`, `info`, `contrast` | ✅ | state / neutral |
| `surface` | ❌ | alias of `background` |
| `foreground` | ❌ | body text color |
| `divider` | ❌ | alias of `border` |
| `elevation` | ❌ | alias of `shadow` |
| `overlay`, `muted` | ❌ | |

Example: `bg-primary`, `text-primary-foreground`, `border-divider-300`, `shadow-elevation`.

### Radius scale

Anchored on `--maz-radius`, so the whole scale moves when the theme radius changes.

| Class | Value |
| --- | --- |
| `rounded-xs` | `calc(var(--maz-radius) - 8px)` |
| `rounded-sm` | `calc(var(--maz-radius) - 4px)` |
| `rounded-md`, `rounded` | `var(--maz-radius)` |
| `rounded-lg` | `calc(var(--maz-radius) + 4px)` |
| `rounded-xl` | `calc(var(--maz-radius) + 8px)` |

### Responsive breakpoints

Added **on top** of Tailwind's default `sm`/`md`/`lg`/`xl`/`2xl` (you keep those too):

| Class | Min-width |
| --- | --- |
| `mob-s:` | 320px |
| `mob-m:` | 425px |
| `mob-l:` | 576px |
| `tab-s:` | 640px |
| `tab-m:` | 768px |
| `tab-l:` | 992px |
| `lap-s:` | 1024px |
| `lap-m:` | 1280px |
| `lap-l:` | 1366px |
| `lap-xl:` | 1440px |
| `lap-2xl:` | 1680px |
| `lap-3xl:` | 1920px |

### Shadows

Standard `shadow-xs` / `shadow-sm` / `shadow-md` / `shadow-lg` / `shadow-xl`, plus `shadow-elevation` which uses the theme's elevation color so the drop tint follows the active preset.

### Z-index

`z-1`, `z-2`, … `z-5`, `z-15`, `z-25`, `z-35`, `z-45`, `z-75`, `z-100`, `z-default-backdrop` (1050).

### Typography & misc

`font-sans` → `var(--maz-font-family)`, default border width → `var(--maz-border-width)`, default transition → 200ms cubic-bezier.

## Using `@apply` inside Vue SFC `<style>` blocks

Tailwind v4's Vite plugin processes each SFC `<style>` block in isolation. If your SFCs use `@apply`, each block must start with a `@reference` directive pointing at your Tailwind entry, so the plugin knows which theme config to apply:

```vue
<style scoped>
@reference "../tailwind.css";

.card {
  @apply flex gap-4 rounded-md bg-surface p-4 shadow-elevation;
}
</style>
```

One line per SFC. Maz-ui components already ship this internally.

## Contract & stability

The subpaths listed above are the **public API** of the Tailwind bridge. They are versioned with the library:

- `maz-ui/tailwindcss/theme.css`
- `maz-ui/tailwindcss/theme-colors.css`
- `maz-ui/tailwindcss/theme-radius.css`
- `maz-ui/tailwindcss/theme-breakpoints.css`
- `maz-ui/tailwindcss/theme-shadows.css`
- `maz-ui/tailwindcss/theme-z-index.css`
- `maz-ui/tailwindcss/theme-typography.css`
- `maz-ui/tailwindcss/utilities.css`

Token **names** (e.g. `--color-primary`, `--radius`, `--breakpoint-mob-s`, `--shadow-elevation`) are part of the contract — they won't change without a major release. Token **values** may evolve alongside the design system in minors.

## If you are migrating from Tailwind v3

If your app was on Tailwind v3, run the official Tailwind upgrade tool before touching anything maz-ui-specific:

```bash
npx @tailwindcss/upgrade
```

It handles 95% of the v3 → v4 transition (utility renames, `@apply !important` syntax, `tailwind.config.js` → CSS-first). Then apply the maz-ui-specific changes from the [v4 → v5 migration guide](./migration-v5.md#advanced-you-had-your-own-tailwind-setup).

## See also

- [Theming](./themes.md) — create a custom preset, switch themes at runtime
- [Migration v4 → v5](./migration-v5.md) — library-level changes
- [Browser Support](./browser-support.md) — exact minimum versions required by Tailwind v4
