---
title: MazPageSection
description: MazPageSection is a full-width band of a page (header, section, footer) with responsive side padding and content centered on the page column. It works with or without Tailwind CSS.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Wrap each band of your page in a `MazPageSection`. The band takes the full width, so its background goes edge to edge, and its content:

- gets a side padding of `1rem` on mobile, `2rem` from `576px` and `2.5rem` from `1024px`;
- stops growing at `1440px` and stays centered.

<ComponentDemo expanded>
  <MazPageSection class="maz:bg-surface-600 maz:py-6">
    <div class="maz:rounded-md maz:border maz:border-dashed maz:border-divider maz:bg-surface maz:p-4 maz:text-center">
      Content of the section
    </div>
  </MazPageSection>

  <template #code>

```vue
<script lang="ts" setup>
import MazPageSection from 'maz-ui/components/MazPageSection'
</script>

<template>
  <MazPageSection as="header" class="border-b border-divider py-4">
    <nav>...</nav>
  </MazPageSection>

  <MazPageSection as="main" class="py-12">
    <h1>Projects</h1>
  </MazPageSection>

  <MazPageSection as="footer" class="bg-surface-600 py-8">
    ...
  </MazPageSection>
</template>
```

  </template>
</ComponentDemo>

Use `as` to pick the HTML tag (`div` by default): `header`, `main`, `section`, `footer`...

## Narrower content

`max-width` sets the width of the content column for this section only: a string with any CSS unit, or a number in pixels.

<ComponentDemo>
  <MazPageSection :max-width="480" class="maz:bg-surface-600 maz:py-6">
    <div class="maz:rounded-md maz:border maz:border-dashed maz:border-divider maz:bg-surface maz:p-4 maz:text-center">
      480px at most
    </div>
  </MazPageSection>

  <template #code>

```vue
<template>
  <MazPageSection :max-width="480" class="py-6">
    ...
  </MazPageSection>

  <MazPageSection max-width="70ch" class="py-6">
    ...
  </MazPageSection>
</template>
```

  </template>
</ComponentDemo>

## Full bleed

`full-bleed` keeps the content on the same column as the other sections, without the side padding: for a carousel or an image that touches the edges of the screen on mobile.

<ComponentDemo>
  <MazPageSection full-bleed :max-width="480" class="maz:bg-surface-600 maz:py-6">
    <div class="maz:bg-primary maz:p-4 maz:text-center maz:text-primary-foreground">
      No side padding
    </div>
  </MazPageSection>

  <template #code>

```vue
<template>
  <MazPageSection full-bleed>
    <img src="/banner.jpg" alt="" class="w-full">
  </MazPageSection>
</template>
```

  </template>
</ComponentDemo>

## Container

By default, the side padding follows the width of the screen. In a layout with a sidebar, the main area is narrower than the screen: make it a container, and what is inside follows its width instead.

`container` makes the section a container (`@container`): the container query classes of its children (`@tab-m:grid-cols-2`) and the `MazPageSection` inside follow its width. Drag the bottom right corner of the frame to make it narrower: the grid of the demo (`@mob-m:grid-cols-2`) switches to one column under `425px`, whatever the width of the screen.

<ComponentDemo>
  <div class="maz:min-w-60 maz:max-w-full maz:resize-x maz:overflow-auto maz:rounded-md maz:border maz:border-divider">
    <MazPageSection container class="maz:bg-surface-600 maz:py-4">
      <div class="maz:grid maz:gap-2 maz:@mob-m:grid-cols-2">
        <div v-for="item in 4" :key="item" class="maz:rounded-md maz:bg-surface maz:p-4 maz:text-center">
          Card {{ item }}
        </div>
      </div>
    </MazPageSection>
  </div>

  <template #code>

```vue
<template>
  <div class="flex">
    <MazSidebar>...</MazSidebar>

    <MazPageSection as="main" container class="flex-1 py-8">
      <div class="grid gap-4 @tab-m:grid-cols-2">
        ...
      </div>
    </MazPageSection>
  </div>
</template>
```

  </template>
</ComponentDemo>

## Good to know

- **Do not nest** two `MazPageSection`: the padding adds up. Inside a section, use a plain `div`, or `full-bleed` to stay on the column without the padding.
- **Do not add `px-*`** to the component: it sets the side padding too, and the result depends on the order of the CSS. Change the gutter with the [CSS variables](#defaults-for-the-whole-app).

## Defaults for the whole app

Every prop can get a default for the whole app through the `defaults` option of the `MazUi` plugin (or of `@maz-ui/nuxt`): a width for every section without setting it on each one. A prop set on a section still wins. See [Global defaults](./../guide/global-defaults.md).

```ts
app.use(MazUi, {
  defaults: {
    MazPageSection: { maxWidth: 1200 },
  },
})
```

The side padding has no prop: set it with CSS variables, as well as the width of the column (the `maxWidth` default above is simpler for the width alone):

| Variable | Default |
| --- | --- |
| `--maz-container-max-width` | `1440px` |
| `--maz-container-padding-mobile` | `1rem` |
| `--maz-container-padding-tablet` | `2rem` (from `576px`) |
| `--maz-container-padding-desktop` | `2.5rem` (from `1024px`) |

```css
:root {
  --maz-container-max-width: 1200px;
  --maz-container-padding-desktop: 3rem;
}
```

## Without the component

`MazPageSection` renders the `padded-container` utility (`padded-container-no-p` with `full-bleed`). You can put these classes on your own elements: with Tailwind CSS, import `maz-ui/tailwindcss/utilities.css` (see [Tailwind CSS](./../guide/tailwind.md#page-gutter-padded-container)); without, import `maz-ui/utilities.css`. The component needs neither: its styles are in `maz-ui/style.css`.

```html
<section class="padded-container py-16">...</section>
```

<!--@include: ./../../.vitepress/generated-docs/maz-page-section.doc.md-->
