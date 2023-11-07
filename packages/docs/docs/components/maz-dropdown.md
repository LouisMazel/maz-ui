---
title: MazDropdown
description: MazDropdown is a standalone component
---

<!-- markdownlint-disable MD033 -->

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

<MazDropdown
  :items="[
    { label: 'Action', action: () => toast.success('CLICKED') },
    { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
    { label: 'Router Link', to: { name: 'index' } },
  ]"
>
  Dropdown Menu
</MazDropdown>

```vue
<template>
  <MazDropdown
    :items="[
      { label: 'Action', action: () => toast.success('CLICKED') },
      { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
      { label: 'Router Link', to: { name: 'index' } },
    ]"
  >
    Dropdown Menu
  </MazDropdown>
</template>

<script lang="ts" setup>
  import MazDropdown from 'maz-ui/components/MazDropdown'
</script>
```

## Custom dropdown main button

::: tip
  This component uses [MazBtn](./maz-btn.md) has menu button, so it inherits all its props
:::

<MazDropdown
  color="primary"
  fab
  pastel
  icon="bars-3"
  size="xl"
  :items="[
    { label: 'Action', action: () => toast.success('CLICKED') },
    { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
    { label: 'Router Link', to: { name: 'index' } },
  ]"
  no-close-on-click
/>

```html
<MazDropdown
  color="primary"
  fab
  pastel
  icon="bars-3"
  size="xl"
  :items="[
    { label: 'Action', action: () => toast.success('CLICKED') },
    { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
    { label: 'Router Link', to: { name: 'index' } },
  ]"
  no-close-on-click
/>
```

## Custom slots

<MazDropdown
  :items="[
    { label: 'Action', action: () => toast.success('CLICKED'), additionnalData: 'https://placekitten.com/240/200' },
    { label: 'Link (href)', href: 'https://www.google.com', target: '_blank', additionnalData: 'https://placekitten.com/340/300' },
    { label: 'Router Link', to: { name: 'index' }, additionnalData: 'https://placekitten.com/440/400' },
  ]"
>
  <template #default>
    Customized labels
  </template>

  <template #menuitem-label="{ item }">
    <div class="maz-flex maz-items-center maz-gap-3">
      <MazAvatar :src="item.additionnalData" size="0.8rem" />
      <span>
        {{ item.label }}
      </span>
    </div>
  </template>
</MazDropdown>

```html
<MazDropdown
  :items="[
    { label: 'Action', action: () => toast.success('CLICKED'), additionnalData: 'https://placekitten.com/240/200' },
    { label: 'Link (href)', href: 'https://www.google.com', target: '_blank', additionnalData: 'https://placekitten.com/340/300' },
    { label: 'Router Link', to: { name: 'index' }, additionnalData: 'https://placekitten.com/440/400' },
  ]"
>
  <template #default>
    Customized labels
  </template>

  <template #menuitem-label="{ item }">
    <div class="maz-flex maz-items-center maz-gap-2">
      <MazAvatar :src="item.additionnalData" />
      <span>
        {{ item.label }}
      </span>
    </div>
  </template>
</MazDropdown>
```

## Open programmatically

isOpen: {{ isOpen }}

<MazDropdown
  v-model:open="isOpen"
  :items="[
    { label: 'Action', action: () => toast.success('CLICKED') },
    { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
    { label: 'Router Link', to: { name: 'index' } },
  ]"
>
  Open
</MazDropdown>

<br />
<br />

<MazBtn @click="isOpen = !isOpen">
  Open Dropdown
</MazBtn>

```vue
<template>
  <MazDropdown
    v-model:open="isOpen"
    :items="[
      { label: 'Action', action: () => toast.success('CLICKED') },
      { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
      { label: 'Router Link', to: { name: 'index' } },
    ]"
  >
    Open
  </MazDropdown>

  <MazBtn @click="isOpen = !isOpen">
    Open Dropdown
  </MazBtn>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  const isOpen = ref(false)
</script>
```

## Position

<div class="maz-flex maz-gap-3 maz-flex-wrap">
  <MazDropdown
    color="theme"
    :items="[
      { label: 'Action', action: () => toast.success('CLICKED') },
      { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
      { label: 'Router Link', to: { name: 'index' } },
      { label: 'Long Label To Show Large Menu', to: { name: 'index' } },
    ]"
    position="top right"
  >
    top right
  </MazDropdown>
  <MazDropdown
    color="theme"
    :items="[
      { label: 'Action', action: () => toast.success('CLICKED') },
      { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
      { label: 'Router Link', to: { name: 'index' } },
      { label: 'Long Label To Show Large Menu', to: { name: 'index' } },
    ]"
    position="top left"
  >
    top left
  </MazDropdown>
  <MazDropdown
    color="theme"
    :items="[
      { label: 'Action', action: () => toast.success('CLICKED') },
      { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
      { label: 'Router Link', to: { name: 'index' } },
      { label: 'Long Label To Show Large Menu', to: { name: 'index' } },
    ]"
    position="bottom left"
  >
    bottom left
  </MazDropdown>
  <MazDropdown
    color="theme"
    :items="[
      { label: 'Action', action: () => toast.success('CLICKED') },
      { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
      { label: 'Router Link', to: { name: 'index' } },
      { label: 'Long Label To Show Large Menu', to: { name: 'index' } },
    ]"
    position="bottom right"
  >
    bottom right
  </MazDropdown>
  <MazDropdown
    color="theme"
    :items="[
      { label: 'Action', action: () => toast.success('CLICKED') },
      { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
      { label: 'Router Link', to: { name: 'index' } },
      { label: 'Long Label To Show Large Menu', to: { name: 'index' } },
    ]"
    position="right"
  >
    right
  </MazDropdown>
  <MazDropdown
    color="theme"
    :items="[
      { label: 'Action', action: () => toast.success('CLICKED') },
      { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
      { label: 'Router Link', to: { name: 'index' } },
      { label: 'Long Label To Show Large Menu', to: { name: 'index' } },
    ]"
    position="left"
  >
    left
  </MazDropdown>
  <MazDropdown
    color="theme"
    :items="[
      { label: 'Action', action: () => toast.success('CLICKED') },
      { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
      { label: 'Router Link', to: { name: 'index' } },
      { label: 'Long Label To Show Large Menu', to: { name: 'index' } },
    ]"
    position="top"
  >
    top
  </MazDropdown>
  <MazDropdown
    color="theme"
    :items="[
      { label: 'Action', action: () => toast.success('CLICKED') },
      { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
      { label: 'Router Link', to: { name: 'index' } },
      { label: 'Long Label To Show Large Menu', to: { name: 'index' } },
    ]"
    position="bottom"
  >
    bottom
  </MazDropdown>
</div>

## Types

### MenuItem

```ts
type MenuItem = {
  label: string
  action?: () => unknown
  target?: string
  href?: string
  to?: RouteLocationRaw
  class?: string
} & Record<string, unknown>
```

<!--@include: ./../.vitepress/generated-docs/maz-dropdown.doc.md-->

<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import { useToast } from 'maz-ui'

  const toast = useToast()

  const menuItems = [
    { label: 'Menu Item 1', action: () => toast.success('Clicked') },
  ]

  const isOpen = ref(false)
</script>
