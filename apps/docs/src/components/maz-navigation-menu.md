---
title: MazNavigationMenu
description: MazNavigationMenu is the menu of a site, with mega menus. One panel changes size and glides from one menu to the other, and a pill follows the pointer.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Give the top level `items`. An item with `items` (a list of links) opens a panel. An item with `to` or `href` is a plain link.

<ComponentDemo expanded>
  <div class="maz:min-h-72">
    <MazNavigationMenu :items="menuItems" />
  </div>

<template #code>

```vue
<script lang="ts" setup>
import MazNavigationMenu from 'maz-ui/components/MazNavigationMenu'

const items = [
  {
    value: 'products',
    label: 'Products',
    items: [
      { label: 'Components', description: 'More than 50 Vue components.', to: '/components', icon: 'squares-2x2' },
      { label: 'Themes', description: 'Colors, radius and dark mode.', to: '/themes', icon: 'swatch' },
    ],
  },
  { label: 'Pricing', to: '/pricing' },
]
</script>

<template>
  <MazNavigationMenu :items="items" />
</template>
```

  </template>
</ComponentDemo>

<script setup lang="ts">
  const menuItems = [
    {
      value: 'products',
      label: 'Products',
      items: [
        { label: 'Components', description: 'More than 50 Vue components.', href: '#basic-usage', icon: 'squares-2x2' },
        { label: 'Themes', description: 'Colors, radius and dark mode.', href: '#basic-usage', icon: 'swatch' },
        { label: 'Icons', description: 'Hundreds of icons, loaded on demand.', href: '#basic-usage', icon: 'sparkles' },
      ],
    },
    {
      value: 'resources',
      label: 'Resources',
      items: [
        { label: 'Documentation', href: '#basic-usage' },
        { label: 'Changelog', href: '#basic-usage' },
      ],
    },
    { label: 'Pricing', href: '#basic-usage' },
  ]
</script>

## One panel for every menu

There is a single panel. When you go from "Products" to "Resources", it changes size and glides under the new trigger, and the content slides in the direction of the move. It does not close and open again.

A pill follows the pointer (and the keyboard focus) on the top level items.

## Your own content

Set `panel: true` on an item and fill its panel with the `content` slot (for every item) or `content-<value>` (for one item). The slot receives the `item` and a `close` function.

```vue
<MazNavigationMenu :items="[{ value: 'guides', label: 'Guides', panel: true }]">
  <template #content-guides="{ close }">
    <div class="w-96 p-4">
      <p>Start here.</p>
      <MazBtn size="sm" to="/start" @click="close">Get started</MazBtn>
    </div>
  </template>
</MazNavigationMenu>
```

Use `v-model` to know or set the open item (its `value`). `openDelay` (100 ms) and `closeDelay` (200 ms) tune the hover.

## Behavior

- Hover opens the panel after a short delay. When a panel is already open, the next one opens at once.
- A click, Enter or Space opens and closes it. A panel opened by a click stays open until Escape, a click outside or the focus leaves the menu.
- Touch devices only use the click.

## Accessibility

It follows the disclosure navigation pattern of the WAI-ARIA Authoring Practices.

- A `nav` landmark with a name (`label`, "Main navigation" by default). Triggers are buttons with `aria-expanded` and `aria-controls`.
- Tab goes from an open trigger into the panel, and from the last link to the next item. Shift + Tab goes back.
- Arrow down on a trigger opens the panel and focuses its first link. Left and right arrows move between the top level items (swapped in RTL).
- Escape closes the panel and gives the focus back to its trigger.
- The panel closes when the focus leaves the menu.

## Motion

- The panel glides with `transform` and its size, and the content slides and fades, with the motion tokens of the theme.
- With reduced motion, the panel only fades and the pill jumps.
- In RTL, the panel and the slides are mirrored.

<!--@include: ./../../.vitepress/generated-docs/maz-navigation-menu.doc.md-->
