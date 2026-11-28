---
title: MazDropdown
description: MazDropdown is a standalone dropdown menu component and versatile designed for various use cases.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

<!--@include: ./../../.vitepress/mixins/translated-component.md-->

::: tip
The button has a main action of its own and the menu lists its variants ("Save", then "Save as draft")? Use [MazBtnDropdown](./maz-btn-dropdown.md), a split button.
:::

## Basic usage

<ComponentDemo>
  <MazDropdown
    :items="[
      { label: 'Louis Mazel', textColor: 'muted' },
      { label: 'Action', onClick: () => toast.success('CLICKED') },
      { label: 'Link (href)', href: 'https://www.google.com', target: '_blank', color: 'secondary' },
      { label: 'Router Link', to: { name: 'index' }, color: 'destructive' },
    ]"
    items-size="sm"
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

## Tooltip on an entry

An item accepts a `tooltip` that is shown on hover, to the right of the entry. Use it to explain an entry that is short or disabled.

<ComponentDemo>
  <MazDropdown
    :items="[
      { label: 'Archive', onClick: () => {}, tooltip: 'Move to the archive, you can restore it later' },
      { label: 'Delete', onClick: () => {}, color: 'destructive', tooltip: 'Delete it for good' },
      { label: 'No tooltip', onClick: () => {} },
    ]"
  >
    Actions
  </MazDropdown>

<template #code>

```html
<MazDropdown
  :items="[
    { label: 'Archive', onClick: archive, tooltip: 'Move to the archive, you can restore it later' },
    { label: 'Delete', onClick: remove, color: 'destructive', tooltip: 'Delete it for good' },
  ]"
>
  Actions
</MazDropdown>
```

  </template>
</ComponentDemo>

## Open dropdown with adaptive trigger

The `adaptive` trigger mode automatically adapts to the user's device:
- **Desktop**: Uses hover behavior (mouseenter/mouseleave)
- **Mobile/Touch devices**: Uses click behavior

This provides the best user experience across all devices without requiring manual configuration.

<div class="vp-raw">
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
</div>

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

<div class="vp-raw">
<MazDropdown
  :model-value="true"
  :items="[
    { label: 'Action', onClick: () => toast.success('CLICKED') },
    { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
    { label: 'Router Link', to: { name: 'index' } },
  ]"
  trigger="click"
>
  Click me
</MazDropdown>
</div>

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

<div class="vp-raw">
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
</div>

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

<div class="vp-raw">
<MazDropdown
  :items="[
    { label: 'Action', onClick: () => toast.success('CLICKED') },
    { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
    { label: 'Router Link', to: { name: 'index' } },
  ]"
  trigger="hover"
  dropdown-icon="chevron-up-down"
>
  Custom icon
</MazDropdown>
</div>

<div class="vp-raw">
<MazDropdown
  :items="[
    { label: 'Action', onClick: () => toast.success('CLICKED') },
    { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
    { label: 'Router Link', to: { name: 'index' } },
  ]"
  trigger="hover"
  dropdown-icon="chevron-up-down"
  :dropdown-icon-animation="false"
>
  No icon animation
</MazDropdown>
</div>

```vue{9,21}
<template>
  <MazDropdown
    :items="[
      { label: 'Action', onClick: () => toast.success('CLICKED') },
      { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
      { label: 'Router Link', to: { name: 'index' } },
    ]"
    trigger="hover"
    dropdown-icon="chevron-up-down"
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
    dropdown-icon="chevron-up-down"
    :dropdown-icon-animation="false"
  >
    No icon animation
  </MazDropdown>
</template>
```

`dropdownIcon` also accepts a full `MazIconProps` object — pass the same shape `<MazIcon>` accepts when you need to set a `<title>` for screen readers, override the size, or attach `svgAttributes`.

```vue
<MazDropdown
  :items="items"
  :dropdown-icon="{
    icon: MazChevronUpDown,
    size: 'lg',
    title: 'Open menu',
  }"
>
  Custom icon
</MazDropdown>
```

## Colors

The `color` prop is applied to the trigger button and accepts `neutral` and the neutral colors `surface` and `container` (`MazNeutralColor`). The dropdown panel uses the `container` color.

<div class="vp-raw maz:flex maz:gap-4 maz:flex-wrap">
  <MazDropdown color="surface" label="Surface" :items="[{ label: 'Action' }]" />
  <MazDropdown color="container" label="Container" :items="[{ label: 'Action' }]" />
</div>

```vue
<MazDropdown color="surface" label="Surface" :items="items" />
<MazDropdown color="container" label="Container" :items="items" />
```

## Custom dropdown main button without chevron icon

::: tip
  This component uses [MazBtn](./maz-btn.md) has a menu button, so it inherits all its props
:::

<div class="vp-raw">
<MazDropdown
  color="primary"
  fab
  variant="soft"
  :chevron="false"
  :icon="MazBars3"
  size="xl"
  items-size="sm"
  :items="[
    { label: 'Action', onClick: () => toast.success('CLICKED') },
    { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
    { label: 'Router Link', to: { name: 'index' } },
  ]"
  :close-on-click="false"
/>
</div>

::: details View code

```vue{7-13}
<script lang="ts" setup>
  import { MazBars3 } from '@maz-ui/icons/raw/MazBars3'
</script>

<template>
  <MazDropdown
    color="primary"
    fab
    variant="soft"
    :chevron="false"
    :icon="MazBars3"
    items-size="sm"
    size="xl"
    :items="[
      { label: 'Action', onClick: () => toast.success('CLICKED') },
      { label: 'Link (href)', href: 'https://www.google.com', target: '_blank' },
      { label: 'Router Link', to: { name: 'index' } },
    ]"
    :close-on-click="false"
  />
</template>
```

:::

## Custom slots

### Custom dropdown panel

You can provide a template to replace the default dropdown panel

<div class="vp-raw">
<MazDropdown>
  Customized dropdown

  <template #dropdown>
    <div class="maz:grid maz:grid-cols-3 maz:gap-2">
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
</div>

::: details View code

```html
<MazDropdown>
  Customized dropdown panel

  <template #dropdown>
    <div class="grid grid-cols-3 gap-2">
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

<div class="vp-raw">
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
    <div class="maz:flex maz:items-center maz:gap-3">
      <MazAvatar :src="item.additionnalData" size="0.8rem" />
      <span>
        {{ item.label }}
      </span>
    </div>
  </template>
</MazDropdown>
</div>

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
    <div class="flex items-center gap-2">
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

<div class="vp-raw maz:flex maz:gap-4">
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
      <button class="maz:border maz:border-solid maz:border-divider-400 maz:p-2 maz:hover:bg-surface-600 maz:dark:bg-surface-400" tabindex="-1">
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
    <button class="border border-solid border-divider-400 p-2 hover:bg-surface-400" tabindex="-1">
      HTMLButtonElement: isOpen {{ isOpen }}
    </button>
  </template>
</MazDropdown>
```

:::

## Open programmatically

isOpen: {{ isOpen }}

<div class="vp-raw">
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
</div>

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

<div class="vp-raw maz:flex maz:gap-3 maz:flex-wrap">
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
  tooltip?: string
  target?: string
  href?: string
  to?: RouteLocationRaw
  class?: string
} & Record<string, unknown>
```

## Motion

- A highlight slides from an item to the next one under the pointer. With the keyboard there is no slide: the focused item shows its own style at once.
- `:animated="false"` shows the highlight without the slide. Reduced motion does the same.
- Rows follow the density of the theme (see `compact` in the [themes guide](./../ecosystem/themes.md)). Use `items-size="sm"` for tighter rows.
- The chevron turns when the menu opens (`dropdown-icon-animation`).

## Accessibility

The trigger button exposes the menu state (`aria-haspopup="menu"`, `aria-expanded`, `aria-controls`), the panel is a `menu` and each item a `menuitem`.

- <kbd>↓</kbd> / <kbd>↑</kbd> move between the items and loop. From the trigger, <kbd>↓</kbd> goes to the first item.
- <kbd>Home</kbd> / <kbd>End</kbd> go to the first and the last item.
- Typing letters jumps to the item that starts with them.
- <kbd>Enter</kbd> runs the focused item and <kbd>Esc</kbd> closes the menu.
- Disabled items are skipped. Elsewhere in the page the keys keep their usual behavior.

<!--@include: ./../../.vitepress/generated-docs/maz-dropdown.doc.md-->

<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import { useToast } from 'maz-ui/composables/useToast'
  import { MazChevronUpDown } from '@maz-ui/icons/raw/MazChevronUpDown'
  import { MazBars3 } from '@maz-ui/icons/raw/MazBars3'

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