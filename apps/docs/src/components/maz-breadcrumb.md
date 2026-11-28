---
title: MazBreadcrumb
description: MazBreadcrumb shows where the user is in the site (Home / Projects / Maz UI). When it does not fit on one line, the middle folds behind a button that unfolds it.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Give the `items`, from the root to the current page. The last one is the current page: it is not a link and has `aria-current="page"`.

<ComponentDemo expanded>
  <MazBreadcrumb :items="items" />

<template #code>

```vue
<script lang="ts" setup>
import MazBreadcrumb from 'maz-ui/components/MazBreadcrumb'

const items = [
  { label: 'Home', to: '/', icon: 'home' },
  { label: 'Projects', to: '/projects' },
  { label: 'Maz UI' },
]
</script>

<template>
  <MazBreadcrumb :items="items" />
</template>
```

  </template>
</ComponentDemo>

<script setup lang="ts">
  const items = [
    { label: 'Home', href: '#basic-usage', icon: 'home' },
    { label: 'Projects', href: '#basic-usage' },
    { label: 'Maz UI' },
  ]
  const longItems = [
    { label: 'Home', href: '#folding' },
    { label: 'Projects', href: '#folding' },
    { label: 'Company', href: '#folding' },
    { label: 'Design team', href: '#folding' },
    { label: 'Website redesign', href: '#folding' },
    { label: 'Mockups', href: '#folding' },
    { label: 'Final version' },
  ]
</script>

Each item takes a `label`, a `to` (vue-router or Nuxt) or an `href`, and an `icon`.

## Folding

When the crumbs do not fit on one line, the middle ones fold behind a "..." button. The first and the last crumbs always stay. Drag the corner of the box to try it.

A click on the button shows the hidden crumbs one after the other and moves the focus to the first of them.

<ComponentDemo>
  <div class="maz:overflow-auto maz:rounded-lg maz:border maz:border-divider maz:p-3 maz:resize-x" style="width: 24rem; max-width: 100%;">
    <MazBreadcrumb :items="longItems" />
  </div>
</ComponentDemo>

The width is measured with a `ResizeObserver`. The line keeps its height, so nothing shifts when the crumbs fold.

## Separator and size

Use the `separator` slot to replace the chevron. Use `size` for the text size.

```vue
<MazBreadcrumb :items="items" size="sm">
  <template #separator>/</template>
</MazBreadcrumb>
```

The `item` slot replaces a whole crumb. It receives the `item`, its `index` and `current`.

## Accessibility

- It is a `nav` with an accessible name (`label`, "Breadcrumb" by default) and an ordered list.
- The last crumb has `aria-current="page"`.
- The separators are hidden from screen readers.
- The "..." button has a text for screen readers ("Show the hidden pages").
- The chevron is mirrored in RTL.

<!--@include: ./../../.vitepress/generated-docs/maz-breadcrumb.doc.md-->
