---
title: MazPageSection
description: MazPageSection is a full-width band of a page (header, section, footer) with responsive side padding and content centered on the page column. It works with or without Tailwind CSS.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Wrap each band of your page (header, sections, footer) in a `MazPageSection`. Its background takes the full width. Its content gets a side padding that grows with the screen, and stays centered on a column of `1440px` at most.

<ComponentDemo expanded :padding="false">
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

`as` sets the HTML tag: `div` by default, `header`, `main`, `section`, `footer`...

## Narrower content

`max-width` sets the width of the column for one section: a number in pixels, or any CSS value.

<ComponentDemo :padding="false">
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

## Without side padding

`:gutter="false"` removes the side padding. The content touches the edges of the screen until it reaches the width of the column, then stays centered. Useful for an image or a carousel on mobile. To see it, make your window narrower than `480px`.

<ComponentDemo :padding="false">
  <MazPageSection :gutter="false" :max-width="480" class="maz:bg-surface-600 maz:py-6">
    <div class="maz:bg-primary maz:p-4 maz:text-center maz:text-primary-foreground">
      No side padding, 480px at most
    </div>
  </MazPageSection>

  <template #code>

```vue
<template>
  <MazPageSection :gutter="false">
    <img src="/banner.jpg" alt="" class="w-full">
  </MazPageSection>
</template>
```

  </template>
</ComponentDemo>

## Full bleed

`full-bleed` puts the content edge to edge at every screen width: no side padding, no maximum width.

To keep a title aligned with the rest of the page, wrap it in a `MazPageSection`.

<ComponentDemo :padding="false">
  <MazPageSection full-bleed class="maz:bg-surface-600 maz:py-6">
    <MazPageSection class="maz:pb-4">
      <div class="maz:rounded-md maz:border maz:border-dashed maz:border-divider maz:bg-surface maz:p-4 maz:text-center">
        Title on the column
      </div>
    </MazPageSection>
    <div class="maz:bg-primary maz:p-4 maz:text-center maz:text-primary-foreground">
      Edge to edge
    </div>
  </MazPageSection>

  <template #code>

```vue
<template>
  <MazPageSection as="section" full-bleed class="py-12">
    <MazPageSection class="pb-6">
      <h2 class="text-title-2">Gallery</h2>
    </MazPageSection>

    <MazCarousel>...</MazCarousel>
  </MazPageSection>
</template>
```

  </template>
</ComponentDemo>

## Layout with a sidebar

The side padding follows the width of the screen. Next to a sidebar, add the `@container` class to the main area: the sections inside follow its width instead. The `@tab-m:` classes of their content follow it too.

Drag the bottom right corner of the frame: the padding shrinks and the grid goes to one column.

<ComponentDemo :padding="false">
  <div class="maz:@container maz:min-w-60 maz:max-w-full maz:resize-x maz:overflow-auto maz:rounded-md maz:border maz:border-divider">
    <MazPageSection class="maz:bg-surface-600 maz:py-4">
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

    <div class="@container flex-1">
      <MazPageSection as="main" class="py-8">
        <div class="grid gap-4 @tab-m:grid-cols-2">
          ...
        </div>
      </MazPageSection>
    </div>
  </div>
</template>
```

  </template>
</ComponentDemo>

The `container` prop makes the section itself a container, for the `@tab-m:` classes of its content. It does not change its own padding: for that, the `@container` goes on a parent.

## Good to know

- **Do not nest** two `MazPageSection`: the paddings add up. The exception is a `full-bleed` section, which has no padding.
- **Do not add `px-*`**: it conflicts with the side padding of the component. Change the padding with the [CSS variables](#defaults-for-the-whole-app) instead. A `full-bleed` section has no padding: `px-*` is fine on it.

## Defaults for the whole app

Set a default value for every section with the `defaults` option of the `MazUi` plugin (or of `@maz-ui/nuxt`). A prop set on a section still wins. See [Global defaults](./../guide/global-defaults.md).

```ts
app.use(MazUi, {
  defaults: {
    MazPageSection: { maxWidth: 1200 },
  },
})
```

The side padding is set with CSS variables:

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

The component uses the `padded-container` class (`padded-container-no-p` without side padding). You can put it on your own elements: import `maz-ui/tailwindcss/utilities.css` with Tailwind CSS (see [Tailwind CSS](./../guide/tailwind.md#page-gutter-padded-container)), `maz-ui/utilities.css` without.

```html
<section class="padded-container py-16">...</section>
```

<!--@include: ./../../.vitepress/generated-docs/maz-page-section.doc.md-->
