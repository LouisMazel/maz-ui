---
title: Free colors
description: Give a free CSS color (hex, oklch, rgb, var(--brand)) to the maz-ui components that carry data (badges, progress bars, avatars, indicators, timeline steps, spotlight cards) - the text, border, tint and halo are derived from it.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Most components only take the [colors of the theme](./../ecosystem/themes.md) (`primary`, `success`...): they derive hover, focus, text and contrast from the tokens. A few components show **data** (a category, a series, a person, a business status): they also take any CSS color in their `color` prop.

```vue
<template>
  <MazBadge color="#e11d48">Bug</MazBadge>
  <MazBadge color="oklch(0.7 0.15 150)" pastel>Feature</MazBadge>
  <MazBadge color="var(--label-docs)" outlined>Docs</MazBadge>

  <MazProgressBar :value="65" color="#8b5cf6" />
  <MazAvatar caption="Louis Mazel" color="var(--user-color)" />
</template>
```

## Accepted values

| Value | Example |
| --- | --- |
| Hex | `#e11d48`, `#e11d4880` |
| Color function | `oklch(0.7 0.15 150)`, `rgb(34 197 94)`, `hsl(210 90% 50%)`, `color-mix(in srgb, red, blue)` |
| CSS variable | `var(--brand)`, `var(--maz-primary)` |

A named color (`red`) is not accepted: it would be ambiguous with the names of the theme colors. The type of the prop keeps the autocompletion of the theme colors and rejects a typo (`"primry"`).

## What is derived

The component computes the rest from your color with `oklch()` and `color-mix()`, so it works with any value, a variable included:

- **Text on the color**: black or white, chosen from the lightness of the color.
- **Pastel tint**: the color at 20% over the background, with a text darker in light mode and lighter in dark mode.
- **Border, halo, gradient**: the color itself, a `color-mix()` of it or a shifted lightness.

The theme colors keep their `-foreground` token and their own derivation.

::: tip Free color or theme color?
Use a free color when the color **is** the data (a label color chosen by the user, a series of a chart, a status of your business). Use a theme color when it carries a **role** of the interface (action, state, validation, brand): the theme then adapts it to dark mode and the platform presets.
:::

::: warning Dark mode
A free color is the same in light and dark. Pick it with enough contrast on both backgrounds, or give a variable that changes with the mode: `var(--label)` with `--label: light-dark(#be123c, #fb7185)`.
:::

## Components

| Component | What takes the color |
| --- | --- |
| [MazBadge](./../components/maz-badge.md#free-color) | Background, text, border and `pastel` tint |
| [MazProgressBar](./../components/maz-progress-bar.md#free-colors) | The bar and each segment |
| [MazCircularProgressBar](./../components/maz-circular-progress-bar.md#free-color) | The stroke gradient |
| [MazIndicator](./../components/maz-indicator.md#free-color) | Background and text |
| [MazAvatar](./../components/maz-avatar.md#free-color) | Background and text of the initials |
| [MazTimeline](./../components/maz-timeline.md#step-colors) | The color of one step (`color` of a step) |
| [MazCardSpotlight](./../components/maz-card-spotlight.md#free-color) | The halo and the border tint |

The other components (buttons, fields, tabs, alerts, spinners...) only take theme colors.
