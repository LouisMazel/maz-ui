---
title: Tailwind CSS integration (optional)
description: Expose your active maz-ui theme tokens to your own Tailwind v4 setup
---

# {{ $frontmatter.title }}

::: tip This page is optional
Maz-UI works without Tailwind. You install the package, import `maz-ui/style.css`, and components render with the preset you chose — nothing else is required.

This page is for consumers who **already have a Tailwind v4 setup of their own** and want their own utilities (`bg-primary`, `rounded-md`, `tab-m:flex`, …) to pull from the active maz-ui theme.
:::

## Setup

In your Tailwind entry, add **one import** under `@import "tailwindcss"`:

```css
/* src/tailwind.css (or wherever your Tailwind entry lives) */
@import "tailwindcss";
@import "maz-ui/tailwindcss/theme.css";
```

That's it. Your Tailwind utilities now resolve to the currently-active maz-ui theme. Switch presets at runtime via `useTheme().updateTheme()` and every utility reflows automatically — no rebuild.

**Prerequisites:** `tailwindcss@^4.2`, `@tailwindcss/vite` or `@tailwindcss/postcss`, and `@maz-ui/themes` initialized in your app.

## What you get

### Brand & state colors

Each one comes with `bg-X`, `text-X`, `border-X`, an 11-step scale (`bg-X-50` → `bg-X-950`), and a paired foreground (`text-X-foreground`) suitable for text on top of that color.

| Color | Use case |
| --- | --- |
| `primary` | brand primary |
| `secondary` | brand secondary |
| `accent` | brand accent |
| `success` | success state |
| `warning` | warning state |
| `destructive` | error / danger state |
| `info` | informational state |
| `contrast` | neutral high-contrast surface (text/dark UI) |

```html
<div class="bg-primary text-primary-foreground p-4">Hello</div>
<div class="bg-success-100 text-success-700">Saved!</div>
```

::: info Alpha utilities and scales in v5
`bg-primary/60`, `text-primary/40`, `border-primary/50` and the rest of Tailwind's alpha syntax continue to work unchanged. In v5 the 50–950 scales are derived in CSS via `color-mix(in oklch, …)` and the base colors are resolved through `light-dark()`, but this is invisible at the utility level — your Tailwind classes don't change.
:::

### Neutral & surface colors

These don't have a foreground variant — they're typically used for backgrounds, text, borders or overlays directly. Each one still ships an 11-step scale.

| Color | Use case |
| --- | --- |
| `surface` | page / container backgrounds |
| `foreground` | body text |
| `divider` | borders, separators |
| `muted` | secondary text, placeholders |
| `overlay` | modal backdrops, scrims |
| `shadow` | shadow tint (used by `shadow-*` utilities) |

```html
<p class="text-foreground">Body text</p>
<p class="text-muted">Secondary text</p>
<hr class="border-divider" />
```

### Per-component surfaces

Two extra background tokens that follow the active preset's `components` block — useful when your custom components want to match the look of `MazContainer` / `MazInput`:

- `bg-container` — same as `MazContainer`'s background
- `bg-input` — same as `MazInput`'s background (different in dark mode by default)

### Spacing

`--spacing` is sourced from the preset's `foundation.space` (default `0.25rem`), so every Tailwind spacing utility (`p-1`, `gap-2`, `w-4`, …) rescales when the preset changes.

### Radius

The whole `rounded-*` scale is preset-controlled via `scales.rounded`:

| Class | Source |
| --- | --- |
| `rounded-xs` … `rounded-3xl` | `var(--maz-rounded-{xs..3xl})` |

### Shadows

| Class | Use case |
| --- | --- |
| `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl` | standard scale (preset-controlled) |
| `shadow-elevation` | elevated surfaces — cards, popovers |

### Breakpoints

Added **on top of** Tailwind's defaults (`sm`/`md`/`lg`/`xl`/`2xl` still work):

| Variant | Min-width |
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

### Typography

| Class | Source |
| --- | --- |
| `font-sans` | `var(--maz-font-family)` |
| `font-mono` | `var(--maz-font-mono-stack)` |
| `font-display` | `var(--maz-font-display-stack)` |

Default border width and the default transition duration also follow the preset (`var(--maz-border-width)`, `var(--maz-motion-normal)`).

## Using `@apply` inside Vue SFC `<style>` blocks

Tailwind v4's Vite plugin processes each SFC `<style>` block in isolation. If your SFCs use `@apply`, the block must start with a `@reference` directive pointing at your Tailwind entry:

```vue
<style scoped>
@reference "../tailwind.css";

.card {
  @apply flex gap-4 rounded-md bg-surface p-4 shadow-elevation;
}
</style>
```

One line per SFC. Maz-ui components already ship this internally.

## Migrating from Tailwind v3

If your app was on Tailwind v3, run the official Tailwind upgrade tool first — it handles 95% of the v3 → v4 transition (utility renames, `@apply !important` syntax, `tailwind.config.js` → CSS-first):

```bash
npx @tailwindcss/upgrade
```

Then apply the maz-ui-specific changes from the [v4 → v5 migration guide](./migration-v5.md#advanced-you-had-your-own-tailwind-setup).

## See also

- [Theming](./themes.md) — create a custom preset, switch themes at runtime
- [Migration v4 → v5](./migration-v5.md) — library-level changes
- [Browser Support](./browser-support.md) — exact minimum versions required by Tailwind v4
