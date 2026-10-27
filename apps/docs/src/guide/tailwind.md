---
title: Tailwind CSS
description: Use and extend the maz-ui theme in your own Tailwind CSS v4 setup - theme colors, radius, shadows, spacing, breakpoints, custom utilities, dark mode, and how to add your own tokens, fonts, animations and variants.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: tip This page is optional
maz-ui works without Tailwind: install the package, import `maz-ui/style.css` and the components render with the theme preset you chose.

This page is for apps that **have their own Tailwind v4 setup** and want their utilities (`bg-primary`, `rounded-md`, `tab-m:flex`...) to follow the active maz-ui theme, preset and color mode.
:::

## Setup

Add the maz-ui theme right after Tailwind in your Tailwind entry:

```css
/* src/assets/css/main.css (your Tailwind entry) */
@import 'tailwindcss';
@import 'maz-ui/tailwindcss/theme.css';
@import 'maz-ui/tailwindcss/utilities.css';
```

That's it: your utilities now resolve to the active maz-ui theme. Switch presets or color mode at runtime with `useTheme()` and every utility follows, without rebuild.

**Prerequisites:** `tailwindcss@^4.2`, `@tailwindcss/vite` or `@tailwindcss/postcss` (or `@nuxtjs/tailwindcss` v7 with Nuxt), and the theme initialized by the `MazUi` plugin or the `@maz-ui/nuxt` module.

### Where to import `maz-ui/style.css`

`maz-ui/style.css` holds the styles of the components. It declares the same cascade layers as Tailwind (`theme`, `base`, `components`, `utilities`), so it composes with your own Tailwind output.

- **Vue**: keep `import 'maz-ui/style.css'` in `main.ts`, before your own CSS (see [Vue guide](./vue.md)).
- **Nuxt**: the module injects it (`css.injectCss: true`, the default). To control the CSS order yourself, disable the injection and import it first in your Tailwind entry:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt'],
  css: ['~/assets/css/main.css'],
  mazUi: {
    css: { injectCss: false },
  },
})
```

```css
/* app/assets/css/main.css */
@import 'maz-ui/style.css';
@import 'tailwindcss';
@import 'maz-ui/tailwindcss/theme.css';
@import 'maz-ui/tailwindcss/utilities.css';
```

### Never use the `maz:` prefix

The maz-ui library compiles its own utilities with an internal `prefix(maz)`, and its documentation site does the same. That prefix never applies to your project: in your code, write `bg-primary`, `flex`, `tab-m:grid`, without `maz:`.

The utilities used inside the components ship precompiled in `maz-ui/style.css`, prefixed, so they never conflict with yours.

### Granular entries

`theme.css` imports every module. Import only some of them if you want part of the design system:

| Import | Content |
| --- | --- |
| `maz-ui/tailwindcss/theme.css` | Everything below except the utilities |
| `maz-ui/tailwindcss/theme-colors.css` | Colors and their scales |
| `maz-ui/tailwindcss/theme-components.css` | `bg-container` and `bg-input` surfaces |
| `maz-ui/tailwindcss/theme-spacing.css` | Spacing scale |
| `maz-ui/tailwindcss/theme-radius.css` | Border radius scale |
| `maz-ui/tailwindcss/theme-shadows.css` | Shadow scale |
| `maz-ui/tailwindcss/theme-breakpoints.css` | `mob-*`, `tab-*`, `lap-*` breakpoints |
| `maz-ui/tailwindcss/theme-z-index.css` | z-index scale |
| `maz-ui/tailwindcss/theme-typography.css` | Fonts, border width, durations and easings |
| `maz-ui/tailwindcss/theme-variants.css` | `dark:` variant wired to the `.dark` class |
| `maz-ui/tailwindcss/utilities.css` | maz-ui utilities (`flex-center`, `padded-container`...) |

## Colors

Every theme color works with all the color utilities of Tailwind (`bg-`, `text-`, `border-`, `ring-`, `outline-`, `fill-`, `stroke-`, `divide-`, `from-`/`via-`/`to-`, `decoration-`, `placeholder-`, `accent-`, `caret-`...) and with opacity modifiers (`bg-primary/50`).

### Brand and state colors

Each one has a paired `-foreground` color for text on top of it, and an 11-step scale from `-50` (light) to `-950` (dark), `-500` being the base color.

| Color | Use for |
| --- | --- |
| `primary` | Main actions, links, focus |
| `secondary` | Secondary brand color |
| `accent` | Highlights |
| `info` | Informational state |
| `success` | Success state |
| `warning` | Warning state |
| `destructive` | Errors, destructive actions |
| `contrast` | Neutral high-contrast color (near black in light mode, near white in dark mode) |

```html
<button class="bg-primary text-primary-foreground hover:bg-primary-600">Save</button>
<p class="rounded-md bg-success-50 p-3 text-success-800">Saved!</p>
<span class="bg-destructive/10 text-destructive">3 errors</span>
```

::: tip Use maz-ui components first
For buttons, alerts and badges, use `MazBtn`, `MazAlert` and `MazBadge`: they already apply these colors. The utilities are for your own layouts and components.
:::

### Neutral and surface colors

They also have an 11-step scale, but no `-foreground`.

| Color | Use for |
| --- | --- |
| `surface` | Page and container backgrounds |
| `foreground` | Body text |
| `muted` | Secondary text, placeholders, disabled content |
| `divider` | Borders and separators |
| `overlay` | Backdrops behind dialogs (`bg-overlay/60`) |
| `shadow` | Shadow tint (`shadow-shadow/20`) |

```html
<main class="bg-surface text-foreground">
  <p class="text-muted">Last updated 3 days ago</p>
  <hr class="border-divider">
</main>
```

### Component surfaces

Two colors follow the `components` block of the preset, to match the maz-ui components in your own ones:

- `bg-container`: background of `MazCard`, `MazContainer`, `MazDialog`, `MazPopover`, `MazDrawer`...
- `bg-input`: background of `MazInput`, `MazSelect`, `MazTextarea`... (different from the surface in dark mode by default)

### Light and dark modes

Theme colors are resolved with `light-dark()`: the same class gives the right color in both modes. **Do not add `dark:` overrides for theme colors**: `bg-surface dark:bg-gray-900` is wrong, `bg-surface` is enough. Keep the `dark:` variant for real differences (an illustration, a different layout).

::: warning Avoid the default Tailwind palette
`bg-blue-500`, `text-gray-600`, `bg-white`, `text-black` or `bg-[#1d90ff]` ignore the preset and dark mode. Pick the theme color with the same role: `bg-primary`, `text-muted`, `bg-surface`, `text-foreground`. For a brand color missing from the theme, [add your own token](#add-your-own-colors).
:::

## Radius

The `rounded-*` scale follows the `scales.rounded` of the preset:

| Utility | Value |
| --- | --- |
| `rounded-xs` ... `rounded-3xl` | `var(--maz-rounded-{xs..3xl})` |
| `rounded` | same as `rounded-md` |

`rounded-full` and `rounded-none` keep their Tailwind values.

## Shadows

| Utility | Use for |
| --- | --- |
| `shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl` | Standard scale, from the preset `scales.shadow` |
| `shadow-elevation` | Raised surfaces: cards, popovers, menus |

## Spacing

`--spacing` is bound to the `foundation.space` token of the preset (`0.25rem` by default): `p-4`, `gap-2`, `mt-6`, `w-10`, `inset-1`... are multiples of it and rescale with the preset. Prefer the scale to arbitrary values such as `p-[13px]`.

## Breakpoints

maz-ui adds mobile-first breakpoints **on top of** the Tailwind ones (`sm:` to `2xl:` keep working):

| Variant | Min width | Variant | Min width |
| --- | --- | --- | --- |
| `mob-s:` | 320px | `lap-s:` | 1024px |
| `mob-m:` | 425px | `lap-m:` | 1280px |
| `mob-l:` | 576px | `lap-l:` | 1366px |
| `tab-s:` | 640px | `lap-xl:` | 1440px |
| `tab-m:` | 768px | `lap-2xl:` | 1680px |
| `tab-l:` | 992px | `lap-3xl:` | 1920px |

Prefix them with `max-` for max-width queries: `max-tab-m:hidden`.

```html
<div class="grid gap-4 tab-m:grid-cols-2 lap-m:grid-cols-3">...</div>
```

The same values are available in TypeScript with `import { screens } from 'maz-ui/tailwindcss'` and the [useBreakpoints](./../composables/use-breakpoints.md) composable.

## Typography and motion

| Utility | Source |
| --- | --- |
| `font-sans` | `var(--maz-font-family)` (preset `foundation.font-family`) |
| `font-mono` | `var(--maz-font-mono-stack)` |
| `font-display` | `var(--maz-font-display-stack)` (headings) |
| `ease-out`, `ease-in`, `ease-in-out` | `var(--maz-easing-*)` |
| `duration-(--duration-fast)`, `duration-(--duration-normal)`, `duration-(--duration-slow)` | `var(--maz-motion-*)` |

The default border width and the default transition duration and easing follow the preset too. Durations are theme variables, not named utilities: write `transition-colors duration-(--duration-fast)`.

## z-index

`z-1` to `z-5`, `z-15`, `z-25`, `z-35`, `z-45`, `z-75`, `z-100`, and `z-default-backdrop` (`1050`, the layer of `MazDialog` and the toasts).

## maz-ui utilities

`maz-ui/tailwindcss/utilities.css` adds:

| Utility | Effect |
| --- | --- |
| `flex-center` | `align-items: center; justify-content: center` (combine with `flex`) |
| `padded-container` | Full width with responsive horizontal padding, content centered within `--maz-container-max-width` |
| `padded-container-no-p` | Same centering without the minimum padding |
| `cap-f` | Capitalizes the first letter |
| `disabled-state`, `disabled-opacity`, `disabled-cursor` | The disabled look of the preset |
| `z-default-backdrop` | `z-index: 1050` |

```html
<section class="padded-container py-12">
  <div class="flex flex-center gap-2">...</div>
</section>
```

### Container width

`padded-container` reads CSS variables that you can override:

| Variable | Default |
| --- | --- |
| `--maz-container-max-width` | `1440px` |
| `--maz-container-padding-mobile` | `1rem` |
| `--maz-container-padding-tablet` | `2rem` (from `mob-l`) |
| `--maz-container-padding-desktop` | `2.5rem` (from `lap-s`) |

The content stops growing at `--maz-container-max-width` once the viewport is wider than the max width plus twice the desktop padding. When you change the max width, update that threshold too:

```css
@layer base {
  html {
    --maz-container-max-width: 1024px;
  }

  /* 1024px + 2 * 2.5rem */
  @media (width >= 1104px) {
    :root {
      --maz-container-width: var(--maz-container-max-width);
    }
  }
}
```

### Vue transitions

`maz-ui/style.css` ships transition classes you can reuse with `<Transition name="...">`: `maz-scale-fade`, `maz-scale`, `maz-slide`, `maz-slideinvert`, `maz-slidevnext`, `maz-slidevprev`, `maz-expand`.

## Dark mode variant

`maz-ui/tailwindcss/theme-variants.css` binds `dark:` to the `.dark` class that `useTheme()` sets on `<html>` (`darkModeStrategy: 'class'`, the default). Adapt it when you change the strategy:

```css
/* darkModeStrategy: 'media' */
@custom-variant dark (@media (prefers-color-scheme: dark));

/* custom darkClass: 'theme-dark' */
@custom-variant dark (&:where(.theme-dark, .theme-dark *));
```

Toggle the mode with `useTheme()` (`toggleDarkMode()`, `setColorMode('dark' | 'light' | 'auto')`), never by editing the class yourself: see [Theming](./../ecosystem/themes.md).

## Extending the theme

### How the layers fit together

Your theme is built from three layers, from the most global to the most specific:

1. **The preset** (`definePreset` of `@maz-ui/themes`) gives the **values**: it emits runtime CSS variables (`--maz-primary`, `--maz-font-family`, `--maz-rounded-md`, `--maz-motion-fast`...) for the light and dark modes.
2. **The maz-ui theme** (`maz-ui/tailwindcss/theme.css`) gives the **class names**: it maps each Tailwind token to a preset variable (`--color-primary: var(--maz-primary)`, `--font-display: var(--maz-font-display-stack)`). `bg-primary` or `font-display` therefore follow the active preset and color mode, without rebuild.
3. **Your Tailwind entry** gives the **project tokens**: everything you declare after the maz-ui imports (`@theme`, `@custom-variant`, `@utility`) adds classes next to the maz-ui ones.

| You want | Put it in | You get |
| --- | --- | --- |
| Brand colors, fonts, radius, shadows, motion, spacing | the preset (`colors`, `foundation`, `scales`) | the same maz-ui classes with your values, components included |
| Background of cards and inputs, button font weight | the preset (`components`) | `bg-container`, `bg-input`, `MazBtn` |
| A color outside the maz-ui roles (chart series, category) | `@theme { --color-* }` | `bg-<name>`, `text-<name>`... |
| An animation | `@theme { --animate-* }` + `@keyframes` | `animate-<name>` |
| A variant (short screens, a state) | `@custom-variant` | `<name>:` |
| A reusable group of declarations | `@utility` | `<name>` |
| The width of `padded-container` | `--maz-container-max-width` in your base layer | [Container width](#container-width) |

::: warning Redefining a maz-ui token
A token you redefine in your `@theme` (`--color-primary`, `--font-sans`, `--radius-md`...) replaces the maz-ui mapping: the class keeps your literal value and **stops following the preset** (preset switch, light and dark values). Change brand values in the preset instead; redefine a token only when you need it, for example to give a literal font name to `@nuxt/fonts` (see [Fonts](#fonts)).
:::

### Brand colors: use a preset

Your brand colors, radius, fonts and spacing belong to a theme preset: every maz-ui component **and** every Tailwind utility (`bg-primary`, `rounded-md`, `font-sans`...) then use them, in light and dark modes.

```ts
import { definePreset } from '@maz-ui/themes'
import { mazUi } from '@maz-ui/themes/presets/mazUi'

export const brandPreset = definePreset({
  base: mazUi,
  overrides: {
    name: 'brand',
    foundation: {
      'font-family': 'Archivo, ui-sans-serif, system-ui, sans-serif',
    },
    scales: {
      rounded: { md: '0.5rem' },
    },
    colors: {
      light: { primary: 'oklch(0.62 0.2 255)' },
      dark: { primary: 'oklch(0.72 0.17 255)' },
    },
  },
})
```

See [Creating custom themes](./../ecosystem/themes.md#creating-custom-themes) and the [Theme Editor](./../theme-editor.md).

### Add your own colors

For a color outside the maz-ui roles (a chart series, a product category), declare it once in your Tailwind entry. `light-dark()` works because maz-ui sets `color-scheme`:

```css
@theme {
  --color-brand: light-dark(oklch(0.65 0.21 30), oklch(0.75 0.17 30));
}
```

`bg-brand`, `text-brand/80` and `border-brand` are now available. To base a color on a maz-ui token, use `@theme inline` so the utility reads the variable at runtime:

```css
@theme inline {
  --color-primary-soft: color-mix(in oklab, var(--maz-primary) 15%, transparent);
}
```

### Fonts

The font utilities read the preset: `font-sans` uses `foundation.font-family`, `font-display` uses `font-display-stack` and `font-mono` uses `font-mono-stack`. You can also redefine them in your Tailwind entry, after the maz-ui import (keep the same stacks as the preset, the classes no longer follow it):

```css
@theme {
  --font-sans: Archivo, ui-sans-serif, system-ui, sans-serif;
  --font-display: 'Barlow Condensed', 'Arial Narrow', sans-serif;
}
```

::: tip Nuxt fonts
With `@nuxt/fonts`, write the font family name literally (not only `var(--maz-font-family)`) somewhere in your CSS so the module detects it and self-hosts it.
:::

### Animations

Declare `--animate-*` tokens and their keyframes, reusing the motion tokens of the theme:

```css
@theme {
  --animate-rise: rise 0.5s var(--maz-easing-out) backwards;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
}
```

```html
<h1 class="animate-rise">Welcome</h1>
```

### Variants

Add your own variants next to the maz-ui ones:

```css
/* short screens (small Android, landscape) */
@custom-variant short (@media (max-height: 50rem));
```

```html
<header class="py-8 short:py-3">...</header>
```

### Base styles

A typical base layer that applies the theme to the document:

```css
@layer base {
  *,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    border-color: var(--maz-divider);
  }

  html {
    font-family: var(--maz-font-family);
    font-size: var(--maz-base-font-size);
    color: var(--maz-foreground);
    background-color: var(--maz-surface);
  }

  ::selection {
    background-color: color-mix(in srgb, var(--maz-primary) 28%, transparent);
  }
}
```

### Complete example

```css
/* app/assets/css/main.css */
@import 'maz-ui/style.css';
@import 'tailwindcss';
@import 'maz-ui/tailwindcss/theme.css';
@import 'maz-ui/tailwindcss/utilities.css';

@custom-variant short (@media (max-height: 50rem));

@theme {
  --font-display: 'Barlow Condensed', 'Arial Narrow', sans-serif;
  --color-brand: light-dark(oklch(0.65 0.21 30), oklch(0.75 0.17 30));
  --animate-rise: rise 0.5s var(--maz-easing-out) backwards;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
}

@layer base {
  html {
    --maz-container-max-width: 1200px;

    font-family: var(--maz-font-family);
    color: var(--maz-foreground);
    background-color: var(--maz-surface);
  }
}
```

## Custom CSS

In plain CSS or in `<style>` blocks, use the theme variables rather than literal values:

```css
.card {
  padding: calc(var(--maz-space) * 4);
  border: var(--maz-border-width) solid var(--maz-divider);
  border-radius: var(--maz-rounded-md);
  background-color: var(--maz-container-bg, var(--maz-surface));
  box-shadow: var(--maz-shadow-style-elevation);
  color: var(--maz-foreground);
  transition: background-color var(--maz-motion-fast) var(--maz-easing-out);
}
```

The full list of variables is in the [token reference of the theming guide](./../ecosystem/themes.md#token-reference).

### `@apply` in Vue SFC `<style>` blocks

Tailwind v4 processes each SFC `<style>` block in isolation: a block that uses `@apply` must start with a `@reference` to your Tailwind entry.

```vue
<style scoped>
@reference "../assets/css/main.css";

.card {
  @apply flex gap-4 rounded-md bg-surface p-4 shadow-elevation;
}
</style>
```

## AI agents

Every class and variable of this page is available to AI coding agents, generated from the sources of the installed version: the `get_theme_tokens` tool of the [maz-ui MCP server](./../ecosystem/mcp.md), and `node_modules/maz-ui/docs/reference/tailwind-tokens.md`. See [AI agents](./ai-agents.md).

`get_theme_tokens` also reads **your** theme: the Tailwind entries of the project (CSS files with `@theme`, `@custom-variant`, `@utility` or a `tailwindcss` import) and the `definePreset` calls, in every app of a monorepo. Agents get your preset values, your tokens with their comments (`animate-rise`, `font-display`, `short:`...), the tokens that redefine a maz-ui one and the setup problems (missing maz-ui import). A comment above a token in your `@theme` is a good place to say when to use it.

## Migrating from Tailwind v3

Run the official upgrade tool first, it handles most of the v3 to v4 transition (renamed utilities, `tailwind.config.js` to CSS-first configuration):

```bash
npx @tailwindcss/upgrade
```

Then apply the maz-ui specific changes of the [v4 to v5 migration guide](./migration-v5.md#advanced-you-had-your-own-tailwind-setup).

## See also

- [Theming](./../ecosystem/themes.md): presets, color modes, runtime switching
- [Migration v4 to v5](./migration-v5.md)
- [Browser support](./browser-support.md): minimum versions required by Tailwind v4
