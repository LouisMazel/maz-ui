---
title: MazDropdown
description: MazDropdown is a standalone dropdown menu component and versatile designed for various use cases.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

<!--@include: ./../.vitepress/mixins/translated-component.md-->

## Basic usage

<ComponentDemo>
  <MazDropdown
    :items="[
      { label: 'Action', onClick: () => toast.success('CLICKED') },
      { label: 'Link (href)', href: 'https://www.google.com', target: '_blank', color: 'secondary' },
      { label: 'Router Link', to: { name: 'index' }, color: 'destructive' },
    ]"
  >
    Dropdown Menu
  </MazDropdown>

  <template #code>

```vue
<template>
  <MazDropdown
    :items="[
      { label: 'Action', onClick: () => toast.success('CLICKED') },
      { label: 'Link (href)', href: 'https://www.google.com', target: '_blank', color: 'secondary' },
      { label: 'Router Link', to: { name: 'index' }, color: 'destructive' },
    ]"
  >
    Dropdown Menu
  </MazDropdown>
</template>

<script lang="ts" setup>
  import MazDropdown from 'maz-ui/components/MazDropdown'
</script>
```

  </template>
</ComponentDemo>

## Open dropdown with adaptive trigger

The `adaptive` trigger mode automatically adapts to the user's device:
- **Desktop**: Uses hover behavior (mouseenter/mouseleave)
- **Mobile/Touch devices**: Uses click behavior

This provides the best user experience across all devices without requiring manual configuration.

<MazDropdown
  :items="[
    { label: 'Action', onClick: () => toast.success('CLICKED') },
    { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
    { label: 'Router Link', to: { name: 'index' } },
  ]"
  trigger="adaptive"
>
  Adaptive trigger
</MazDropdown>

```html{7}
<MazDropdown
  :items="[
    { label: 'Action', onClick: () => toast.success('CLICKED') },
    { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
    { label: 'Router Link', to: { name: 'index' } },
  ]"
  trigger="adaptive"
>
  Adaptive trigger
</MazDropdown>
```

## Open dropdown only on click

<MazDropdown
  :items="[
    { label: 'Action', onClick: () => toast.success('CLICKED') },
    { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
    { label: 'Router Link', to: { name: 'index' } },
  ]"
  trigger="click"
>
  Click me
</MazDropdown>

```html{7}
<MazDropdown
  :items="[
    { label: 'Action', onClick: () => toast.success('CLICKED') },
    { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
    { label: 'Router Link', to: { name: 'index' } },
  ]"
  trigger="click"
>
  Click me
</MazDropdown>
```

## Open dropdown only on hover

<MazDropdown
  :items="[
    { label: 'Action', onClick: () => toast.success('CLICKED') },
    { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
    { label: 'Router Link', to: { name: 'index' } },
  ]"
  trigger="hover"
>
  Hover me
</MazDropdown>

```html{7}
<MazDropdown
  :items="[
    { label: 'Action', onClick: () => toast.success('CLICKED') },
    { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
    { label: 'Router Link', to: { name: 'index' } },
  ]"
  trigger="hover"
>
  Hover me
</MazDropdown>
```

## Custom dropdown icon

You can provide an icon to replace the default chevron icon and disable the animation

<MazDropdown
  :items="[
    { label: 'Action', onClick: () => toast.success('CLICKED') },
    { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
    { label: 'Router Link', to: { name: 'index' } },
  ]"
  trigger="hover"
  :dropdown-icon="MazChevronUpDown"
>
  Custom icon
</MazDropdown>

<MazDropdown
  :items="[
    { label: 'Action', onClick: () => toast.success('CLICKED') },
    { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
    { label: 'Router Link', to: { name: 'index' } },
  ]"
  trigger="hover"
  :dropdown-icon="MazChevronUpDown"
  :dropdown-icon-animation="false"
>
  No icon animation
</MazDropdown>

```vue{7}
<script lang="ts" setup>
  // Use vite-svg-loader to import SVG as Vue component
  import MazChevronUpDown from '@maz-ui/icons/chevron-up-down.svg?component'
</script>

<template>
  <MazDropdown
    :items="[
      { label: 'Action', onClick: () => toast.success('CLICKED') },
      { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
      { label: 'Router Link', to: { name: 'index' } },
    ]"
    trigger="hover"
    :dropdown-icon="MazChevronUpDown"
  >
    Hover me
  </MazDropdown>

  <MazDropdown
    :items="[
      { label: 'Action', onClick: () => toast.success('CLICKED') },
      { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
      { label: 'Router Link', to: { name: 'index' } },
    ]"
    trigger="hover"
    :dropdown-icon="MazChevronUpDown"
    :dropdown-icon-animation="false"
  >
    No icon animation
  </MazDropdown>
</template>
```

## Custom dropdown main button without chevron icon

::: tip
  This component uses [MazBtn](./maz-btn.md) has a menu button, so it inherits all its props
:::

<MazDropdown
  color="primary"
  fab
  pastel
  :chevron="false"
  icon="bars-3"
  size="xl"
  :items="[
    { label: 'Action', onClick: () => toast.success('CLICKED') },
    { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
    { label: 'Router Link', to: { name: 'index' } },
  ]"
  :close-on-click="false"
/>

```html{2-7}
<MazDropdown
  color="primary"
  fab
  pastel
  :chevron="false"
  icon="bars-3"
  size="xl"
  :items="[
    { label: 'Action', onClick: () => toast.success('CLICKED') },
    { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
    { label: 'Router Link', to: { name: 'index' } },
  ]"
  :close-on-click="false"
/>
```

## Custom slots

### Custom dropdown panel

You can provide a template to replace the default dropdown panel

<MazDropdown>
  Customized dropdown

  <template #dropdown>
    <div class="maz-grid maz-grid-cols-3 maz-gap-2">
      <MazBtn color="transparent"> Item </MazBtn>
      <MazBtn color="transparent"> Item </MazBtn>
      <MazBtn color="transparent"> Item </MazBtn>
      <MazBtn color="transparent"> Item </MazBtn>
      <MazBtn color="transparent"> Item </MazBtn>
      <MazBtn color="transparent"> Item </MazBtn>
      <MazBtn color="transparent"> Item </MazBtn>
      <MazBtn color="transparent"> Item </MazBtn>
      <MazBtn color="transparent"> Item </MazBtn>
      <MazBtn color="transparent"> Item </MazBtn>
      <MazBtn color="transparent"> Item </MazBtn>
      <MazBtn color="transparent"> Item </MazBtn>
    </div>
  </template>
</MazDropdown>

::: details View code

```html
<MazDropdown>
  Customized dropdown panel

  <template #dropdown>
    <div class="maz-grid maz-grid-cols-3 maz-gap-2">
      <MazBtn color="transparent"> Item </MazBtn>
      <MazBtn color="transparent"> Item </MazBtn>
      <MazBtn color="transparent"> Item </MazBtn>
      <MazBtn color="transparent"> Item </MazBtn>
      <MazBtn color="transparent"> Item </MazBtn>
      <MazBtn color="transparent"> Item </MazBtn>
      <MazBtn color="transparent"> Item </MazBtn>
      <MazBtn color="transparent"> Item </MazBtn>
      <MazBtn color="transparent"> Item </MazBtn>
      <MazBtn color="transparent"> Item </MazBtn>
      <MazBtn color="transparent"> Item </MazBtn>
      <MazBtn color="transparent"> Item </MazBtn>
    </div>
  </template>
</MazDropdown>
```

:::

### Custom menuitem labels

You can provide a template to replace menuitem labels to add more elements in each menuitem

<MazDropdown
  :items="[
    { label: 'Action', onClick: () => toast.success('CLICKED'), additionnalData: 'https://placedog.net/240/200' },
    { label: 'Link (href)', href: 'https://www.google.com', target: '_blank', additionnalData: 'https://placedog.net/340/300' },
    { label: 'Router Link', to: { name: 'index' }, additionnalData: 'https://placedog.net/440/400' },
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

::: details View code

```html
<MazDropdown
  :items="[
    { label: 'Action', onClick: () => toast.success('CLICKED'), additionnalData: 'https://placedog.net/240/200' },
    { label: 'Link (href)', href: 'https://www.google.com', target: '_blank', additionnalData: 'https://placedog.net/340/300' },
    { label: 'Router Link', to: { name: 'index' }, additionnalData: 'https://placedog.net/440/400' },
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

:::

### Custom control triggered element

You can provide an HTML element or a component to replace the default button

::: warning
Add `tabindex="-1"` attribute to your element to avoid a double focus with Tab key
:::

<div class="maz-flex maz-gap-4">
  <MazDropdown
    :items="[
      {
        label: 'Action',
        onClick: () => toast.success('CLICKED'),
        additionnalData: 'https://placedog.net/240/200',
      },
      {
        label: 'Link (href)',
        href: 'https://www.google.com',
        target: '_blank',
        additionnalData: 'https://placedog.net/340/300',
      },
      {
        label: 'Router Link',
        to: { name: 'index' },
        additionnalData: 'https://placedog.net/440/400',
      },
    ]"
  >
    <template #trigger>
      <MazAvatar
        clickable
        hide-clickable-icon
        src="https://placedog.net/200/200"
        tabindex="-1"
      />
    </template>
  </MazDropdown>

  <MazDropdown
    position="top"
    :items="[
      {
        label: 'Action',
        onClick: () => toast.success('CLICKED'),
        additionnalData: 'https://placedog.net/240/200',
      },
      {
        label: 'Link (href)',
        href: 'https://www.google.com',
        target: '_blank',
        additionnalData: 'https://placedog.net/340/300',
      },
      {
        label: 'Router Link',
        to: { name: 'index' },
        additionnalData: 'https://placedog.net/440/400',
      },
    ]"
  >
    <template #element="{ isOpen }">
      <button class="maz-border maz-border-solid maz-border-divider-400 maz-p-2 hover:maz-bg-surface-600 dark:maz-bg-surface-400" tabindex="-1">
        HTMLButtonElement: isOpen {{ isOpen }}
      </button>
    </template>
  </MazDropdown>
</div>

::: details View code

```html
<MazDropdown
  :items="[
    {
      label: 'Action',
      onClick: () => toast.success('CLICKED'),
      additionnalData: 'https://placedog.net/240/200',
    },
    {
      label: 'Link (href)',
      href: 'https://www.google.com',
      target: '_blank',
      additionnalData: 'https://placedog.net/340/300',
    },
    {
      label: 'Router Link',
      to: { name: 'index' },
      additionnalData: 'https://placedog.net/440/400',
    },
  ]"
>
  <template #element>
    <MazAvatar
      clickable
      hide-clickable-icon
      src="https://cdn.artphotolimited.com/images/5ff5a529bd40b83c5a537440/1000x1000/gerard-depardieu-1983.jpg"
      tabindex="-1"
    />
  </template>
</MazDropdown>

<MazDropdown
  position="top"
  :items="[
    {
      label: 'Action',
      onClick: () => toast.success('CLICKED'),
      additionnalData: 'https://placedog.net/240/200',
    },
    {
      label: 'Link (href)',
      href: 'https://www.google.com',
      target: '_blank',
      additionnalData: 'https://placedog.net/340/300',
    },
    {
      label: 'Router Link',
      to: { name: 'index' },
      additionnalData: 'https://placedog.net/440/400',
    },
  ]"
>
  <template #element="{ isOpen }">
    <button class="maz-border maz-border-solid maz-border-divider-400 maz-p-2 hover:maz-bg-surface-400" tabindex="-1">
      HTMLButtonElement: isOpen {{ isOpen }}
    </button>
  </template>
</MazDropdown>
```

:::

## Open programmatically

isOpen: {{ isOpen }}

<MazDropdown
  v-model="isOpen"
  :items="[
    { label: 'Action', onClick: () => toast.success('CLICKED') },
    { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
    { label: 'Router Link', to: { name: 'index' } },
  ]"
>
  Open
</MazDropdown>

<br />
<br />

<MazBtn @click="openDropdown">
  Open Dropdown
</MazBtn>

```vue
<template>
  <MazDropdown
    v-model="isOpen"
    :items="[
      { label: 'Action', onClick: () => toast.success('CLICKED') },
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
    color="contrast"
    :items="[
      { label: 'Action', onClick: () => toast.success('CLICKED') },
      { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
      { label: 'Router Link', to: { name: 'index' } },
      { label: 'Long Label To Show Large Menu', to: { name: 'index' } },
    ]"
    position="top-end"
  >
    top-end
  </MazDropdown>
  <MazDropdown
    color="contrast"
    :items="[
      { label: 'Action', onClick: () => toast.success('CLICKED') },
      { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
      { label: 'Router Link', to: { name: 'index' } },
      { label: 'Long Label To Show Large Menu', to: { name: 'index' } },
    ]"
    position="top-start"
  >
    top-start
  </MazDropdown>
  <MazDropdown
    color="contrast"
    :items="[
      { label: 'Action', onClick: () => toast.success('CLICKED') },
      { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
      { label: 'Router Link', to: { name: 'index' } },
      { label: 'Long Label To Show Large Menu', to: { name: 'index' } },
    ]"
    position="bottom-start"
  >
    bottom-start
  </MazDropdown>
  <MazDropdown
    color="contrast"
    :items="[
      { label: 'Action', onClick: () => toast.success('CLICKED') },
      { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
      { label: 'Router Link', to: { name: 'index' } },
      { label: 'Long Label To Show Large Menu', to: { name: 'index' } },
    ]"
    position="bottom-end"
  >
    bottom-end
  </MazDropdown>
  <MazDropdown
    color="contrast"
    :items="[
      { label: 'Action', onClick: () => toast.success('CLICKED') },
      { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
      { label: 'Router Link', to: { name: 'index' } },
      { label: 'Long Label To Show Large Menu', to: { name: 'index' } },
    ]"
    position="right"
  >
    right
  </MazDropdown>
  <MazDropdown
    color="contrast"
    :items="[
      { label: 'Action', onClick: () => toast.success('CLICKED') },
      { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
      { label: 'Router Link', to: { name: 'index' } },
      { label: 'Long Label To Show Large Menu', to: { name: 'index' } },
    ]"
    position="left"
  >
    left
  </MazDropdown>
  <MazDropdown
    color="contrast"
    :items="[
      { label: 'Action', onClick: () => toast.success('CLICKED') },
      { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
      { label: 'Router Link', to: { name: 'index' } },
      { label: 'Long Label To Show Large Menu', to: { name: 'index' } },
    ]"
    position="top"
  >
    top
  </MazDropdown>
  <MazDropdown
    color="contrast"
    :items="[
      { label: 'Action', onClick: () => toast.success('CLICKED') },
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

### MazDropdownMenuItem

```ts
type MazDropdownMenuItem = {
  label: string
  onClick?: () => unknown
  target?: string
  href?: string
  to?: RouteLocationRaw
  class?: string
} & Record<string, unknown>
```

<!--@include: ./../../.vitepress/generated-docs/maz-dropdown.doc.md-->

<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import { useToast } from 'maz-ui/src/composables/useToast'
  import { MazChevronUpDown } from '@maz-ui/icons'

  const toast = useToast()

  function openDropdown() {
    setTimeout(() => {
      isOpen.value = !isOpen.value
    }, 100);
  }

  const menuItems = [
    { label: 'Menu Item 1', onClick: () => toast.success('Clicked') },
  ]

  const isOpen = ref(false)
</script>
