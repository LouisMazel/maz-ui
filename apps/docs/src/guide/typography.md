---
title: Typography
description: The maz-ui type scale - 12 levels (display, title-1 to title-4, body, label, caption...) as text-* and type-* Tailwind classes, fonts, the rich-text class for raw HTML, and how to customize the scale in a preset or the theme editor.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Each level of the scale sets the font family, size, weight, line height and letter spacing **together**. The scale is defined per [preset](./../ecosystem/themes.md#typography), exposed as CSS variables (`--maz-typography-<level>-<key>`) and used by the components, so the text of the whole app stays consistent and follows the active theme.

::: tip Tailwind
The classes come from `maz-ui/tailwindcss/utilities.css`, see [Tailwind CSS](./tailwind.md#setup). Without Tailwind, the components still follow the scale, and `maz-ui/utilities.css` gives the same classes (`text-title-1`, `type-label`...) without variants. Do not import both. See [Vite plugin](./../ecosystem/vite-plugin.md#projects-without-tailwind) to purge it.
:::

## Fonts

| Utility | Source |
| --- | --- |
| `font-sans` | `var(--maz-font-family)` (preset `foundation.font-family`) |
| `font-display` | `var(--maz-font-display-stack)`, used by the titles |
| `font-mono` | `var(--maz-font-mono-stack)`, used by `code` |

Sizes are in `rem`, so they follow the `base-font-size` of the preset's `foundation`.

## Type scale

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-3">
    <p class="maz:m-0 maz:text-overline maz:text-primary">Overline</p>
    <p class="maz:m-0 maz:text-display">Display</p>
    <p class="maz:m-0 maz:text-title-1">Title 1</p>
    <p class="maz:m-0 maz:text-title-2">Title 2</p>
    <p class="maz:m-0 maz:text-title-3">Title 3</p>
    <p class="maz:m-0 maz:text-title-4">Title 4</p>
    <p class="maz:m-0 maz:text-body-lg">Body large: the lead paragraph under a title.</p>
    <p class="maz:m-0 maz:text-body">Body: the default reading text of the app.</p>
    <p class="maz:m-0 maz:text-body-sm">Body small: table cells, descriptions.</p>
    <p class="maz:m-0 maz:text-label">Label: form labels, tabs, menu items</p>
    <p class="maz:m-0 maz:text-caption">Caption: hints, metadata, timestamps</p>
    <p class="maz:m-0 maz:text-body">Inline <span class="maz:text-code">text-code</span> in a sentence.</p>
  </div>

<template #code>

```html
<p class="text-overline text-primary">Overline</p>
<h1 class="text-display">Display</h1>
<h2 class="text-title-1">Title 1</h2>
<p class="text-body-lg">Body large</p>
<p class="text-body">Body</p>
<p class="text-caption">Caption</p>
```

  </template>
</ComponentDemo>

| Class | Use for | HTML | Default size | Weight | Leading |
| --- | --- | --- | --- | --- | --- |
| `text-display` | Hero and landing headlines | `h1` of a landing page | `clamp(2.25rem, 1.6rem + 2.4vw, 3.25rem)` | 700 | 1.1 |
| `text-title-1` | Page title, one per page | `h1` | `2rem` | 700 | 1.2 |
| `text-title-2` | Section title | `h2` | `1.5rem` | 600 | 1.25 |
| `text-title-3` | Sub-section, card and dialog title | `h3` | `1.25rem` | 600 | 1.3 |
| `text-title-4` | Group of fields, list header, widget | `h4` | `1.0625rem` | 600 | 1.4 |
| `text-body-lg` | Lead paragraph | `p` | `1.125rem` | 400 | 1.65 |
| `text-body` | Default reading text | `p`, `li` | `1rem` | 400 | 1.6 |
| `text-body-sm` | Dense text: tables, descriptions | `td`, `small` | `0.875rem` | 400 | 1.5 |
| `text-label` | Form labels, tabs, menu items | `label`, `th` | `0.875rem` | 500 | 1.4 |
| `text-caption` | Hints, metadata, timestamps (muted) | `figcaption`, `small` | `0.75rem` | 400 | 1.4 |
| `text-overline` | Eyebrow above a title, category | `p`, `span` | `0.75rem` | 600 | 1.4 |
| `text-code` | Inline code, identifiers, keys (mono) | `code`, `kbd` | `0.875em` | 400 | 1.5 |

The defaults above are those of the base preset: the system presets (macOS, Windows, GNOME) ship the scale of their platform.

- Titles use the display font and `text-wrap: balance`, body levels `text-wrap: pretty`.
- Only `text-caption` sets a color (`muted`): add a color class when needed (`text-title-2 text-primary`, `text-caption text-foreground`).
- Responsive: `text-title-2 lap-s:text-title-1`.
- Numbers in tables, prices and counters: add `tabular-nums`.
- The Tailwind sizes (`text-xs` to `text-9xl`) keep working: the scale is opt-in.

## `text-*` vs `type-*`

- `text-<level>` applies the whole level, font size included. Use it by default.
- `type-<level>` applies everything **but the font size**: the font, weight, line height and letter spacing of the level, at the size of the element. Use it for text sized elsewhere, by a `size` prop or a Tailwind size.

```html
<!-- Whole level -->
<h3 class="text-title-3">Billing</h3>

<!-- Weight and spacing of a label, size chosen by the context -->
<label class="type-label text-sm">Email</label>
<span class="type-label text-xs">Beta</span>
```

## Semantic HTML

The level is visual, the tag stays semantic: `<h2 class="text-title-3">` is fine.

```html
<header>
  <p class="text-overline text-primary">Pricing</p>
  <h1 class="text-title-1">Choose your plan</h1>
  <p class="text-body-lg">Start free, upgrade when you grow.</p>
</header>

<section>
  <h2 class="text-title-2">Features</h2>
  <p class="text-body">Everything you need.</p>
  <p class="text-body-sm">Billed monthly.</p>
  <small class="text-caption">Prices exclude taxes.</small>
</section>

<label for="email" class="text-label">Email</label>
<p id="email-hint" class="text-caption">We never share it.</p>
```

## Rich text

`rich-text` is the maz-ui equivalent of Tailwind `prose`. It styles HTML you do not write yourself (Markdown, CMS content, the output of a rich text editor) and applies the type scale semantically, in light and dark mode.

<ComponentDemo>
  <div class="maz:rich-text">
    <h2>Release notes</h2>
    <p>The <strong>new editor</strong> ships today. Read the <a href="#rich-text">migration guide</a> or press <kbd>Ctrl</kbd> + <kbd>K</kbd> to search.</p>
    <h3>Highlights</h3>
    <ul>
      <li>Faster loading with <code>defineAsyncComponent</code></li>
      <li>Dark mode for every block</li>
    </ul>
    <blockquote>Small steps, every week.</blockquote>
    <table>
      <thead><tr><th>Plan</th><th>Price</th></tr></thead>
      <tbody><tr><td>Free</td><td>0</td></tr></tbody>
    </table>
  </div>

<template #code>

```html
<article class="rich-text" v-html="html" />

<article class="rich-text rich-text-sm">...</article>
<article class="rich-text rich-text-lg">...</article>
```

  </template>
</ComponentDemo>

| Element | Level |
| --- | --- |
| `h1` to `h4` | `title-1` to `title-4` |
| `h5`, `h6` | `label` |
| `p`, `li`, `a`, `strong` | `body` |
| `blockquote` | `body-lg` size |
| `table`, `td` | `body-sm` |
| `th`, `dt` | `label` |
| `code`, `kbd`, `pre code` | `code` |
| `figcaption` | `caption` |

- `rich-text-sm` and `rich-text-lg` set `--maz-rich-text-scale` (`0.875` and `1.125`), which multiplies every size above. Set the variable yourself for another scale.
- `--maz-rich-text-size` forces the base size, `--maz-rich-text-max-width` changes the `70ch` reading width (`max-w-none` removes it).
- `not-rich-text` on an element opts it and its children out (an embedded component, a custom block).
- `MazCodeHighlight` blocks keep their own style inside.
- Changing a level in the preset restyles `rich-text` too.

## Customize the scale

In a [preset](./../ecosystem/themes.md#typography), set the levels in the `typography` block: `font`, `size`, `weight`, `leading`, `tracking` (and `color` for `caption`). A key you leave out keeps the value of the base preset.

```ts
import { definePreset } from '@maz-ui/themes'

export const brandPreset = definePreset({
  base: 'maz-ui',
  overrides: {
    typography: {
      'display': { size: 'clamp(2.5rem, 2rem + 3vw, 4rem)', weight: '800' },
      'title-1': { size: '2.25rem', tracking: '-0.03em' },
      'body': { leading: '1.7' },
    },
  },
})
```

Each key becomes a CSS variable, `--maz-typography-<level>-<key>` (for example `--maz-typography-title-1-size`), so you can also override it in CSS, for a section or the whole app.

The [theme editor](./../theme-editor.md) has a **Type** panel to edit every level on live components and copy the result as a preset.

## Components

The components follow the scale, so a preset change restyles them:

- `MazDialog`, `MazDrawer`, `MazBottomSheet` and `MazCard` titles: `text-title-3`.
- Hints and helper texts of the form fields: `text-body-sm`.
- Tabs, list items, toasts and segmented controls: `type-label`.
- `MazSidebarGroup` label: `text-overline`.
- `MazMarkdownEditor` preview: `rich-text`.

## Best practices

- Pick a level by its role, not by its look: `text-title-2` for a section title, `text-caption` for a hint.
- Do not hard-code `text-2xl font-bold` for titles nor `text-xs text-muted` for hints: use `text-title-*` and `text-caption`.
- Use `type-<level>` when the size comes from elsewhere, and add a color class only when the level has none.
- Use `rich-text` for raw HTML (Markdown, CMS) instead of styling each tag.
- Avoid arbitrary sizes (`text-[13px]`). To change the look of a level, change the preset.
- AI agents: the `review_code` tool of the [MCP server](./../ecosystem/mcp.md) suggests the level for ad hoc combinations and reports arbitrary sizes.
