---
title: MazBtnGroup
description: MazBtnGroup is a component to group multiple MazBtn buttons together with seamless styling. Supports props-based or slot-based rendering with customizable orientation, size, and color.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage with items

Use the `items` prop to quickly create a button group from an array of button configurations.

<ComponentDemo>
  <MazBtnGroup :items="basicItems" />

  <template #code>

```vue
<template>
  <MazBtnGroup :items="items" />
</template>

<script lang="ts" setup>
import MazBtnGroup from 'maz-ui/components/MazBtnGroup'
import type { MazButtonGroupOption } from 'maz-ui/components/MazBtnGroup'

const items: MazButtonGroupOption[] = [
  { text: 'Day' },
  { text: 'Week', active: true },
  { text: 'Month' },
]
</script>
```

  </template>
</ComponentDemo>

## Slot-based usage

Use the default slot to pass `MazBtn` components directly for full control over each button.

<ComponentDemo>
  <MazBtnGroup>
    <MazBtn>Edit</MazBtn>
    <MazBtn :active="true">Save</MazBtn>
    <MazBtn>Delete</MazBtn>
  </MazBtnGroup>

  <template #code>

```vue
<template>
  <MazBtnGroup>
    <MazBtn>Edit</MazBtn>
    <MazBtn :active="true">Save</MazBtn>
    <MazBtn>Delete</MazBtn>
  </MazBtnGroup>
</template>

<script lang="ts" setup>
import MazBtnGroup from 'maz-ui/components/MazBtnGroup'
import MazBtn from 'maz-ui/components/MazBtn'
</script>
```

  </template>
</ComponentDemo>

## Orientation

Use the `orientation` prop to arrange buttons horizontally (`row`) or vertically (`col`).

<ComponentDemo>
  <div class="maz:flex maz:gap-8 maz:flex-wrap">
    <div>
      <p class="maz:mb-2 maz:text-muted">Row (default)</p>
      <MazBtnGroup :items="basicItems" orientation="row" />
    </div>
    <div>
      <p class="maz:mb-2 maz:text-muted">Column</p>
      <MazBtnGroup :items="basicItems" orientation="col" />
    </div>
  </div>

  <template #code>

```vue
<template>
  <MazBtnGroup :items="items" orientation="row" />
  <MazBtnGroup :items="items" orientation="col" />
</template>
```

  </template>
</ComponentDemo>

## Sizes

Use the `size` prop to apply a size to all buttons in the group.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-4 maz:items-start">
    <MazBtnGroup v-for="size in sizes" :key="size" :items="basicItems" :size="size" />
  </div>

  <template #code>

```vue
<template>
  <MazBtnGroup :items="items" size="mini" />
  <MazBtnGroup :items="items" size="xs" />
  <MazBtnGroup :items="items" size="sm" />
  <MazBtnGroup :items="items" size="md" />
  <MazBtnGroup :items="items" size="lg" />
  <MazBtnGroup :items="items" size="xl" />
</template>
```

  </template>
</ComponentDemo>

## Colors

Use the `color` prop to apply a color to all buttons in the group. Neutral colors (`neutral`, `surface`, `container`) are supported, see the [surface vs container tip](./maz-btn.md#colors).

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-4 maz:items-start">
    <MazBtnGroup v-for="color in colors" :key="color" :items="basicItems" :color="color" />
  </div>

  <template #code>

```vue
<template>
  <MazBtnGroup :items="items" color="primary" />
  <MazBtnGroup :items="items" color="secondary" />
  <MazBtnGroup :items="items" color="info" />
  <MazBtnGroup :items="items" color="success" />
  <MazBtnGroup :items="items" color="warning" />
  <MazBtnGroup :items="items" color="destructive" />
  <MazBtnGroup :items="items" color="surface" />
  <MazBtnGroup :items="items" color="container" />
</template>
```

  </template>
</ComponentDemo>

## Button variants

Set `variant` on the group to style every button: `solid` (default), `soft`, `outline` or `ghost`. A `variant` set on an item wins.

### Soft

A tinted background.

<ComponentDemo>
  <MazBtnGroup :items="basicItems" variant="soft" />

  <template #code>

```vue
<template>
  <MazBtnGroup :items="items" variant="soft" />
</template>

<script lang="ts" setup>
import MazBtnGroup from 'maz-ui/components/MazBtnGroup'
import type { MazButtonGroupOption } from 'maz-ui/components/MazBtnGroup'

const items: MazButtonGroupOption[] = [
  { text: 'Day' },
  { text: 'Week', active: true },
  { text: 'Month' },
]
</script>
```

  </template>
</ComponentDemo>

### Outline

A border and a transparent background.

<ComponentDemo>
  <MazBtnGroup :items="basicItems" variant="outline" />

  <template #code>

```vue
<template>
  <MazBtnGroup :items="items" variant="outline" />
</template>

<script lang="ts" setup>
import MazBtnGroup from 'maz-ui/components/MazBtnGroup'
import type { MazButtonGroupOption } from 'maz-ui/components/MazBtnGroup'

const items: MazButtonGroupOption[] = [
  { text: 'Day' },
  { text: 'Week', active: true },
  { text: 'Month' },
]
</script>
```

  </template>
</ComponentDemo>

### Ghost

No background until a button is hovered.

<ComponentDemo>
  <MazBtnGroup :items="basicItems" variant="ghost" />

  <template #code>

```vue
<template>
  <MazBtnGroup :items="items" variant="ghost" />
</template>

<script lang="ts" setup>
import MazBtnGroup from 'maz-ui/components/MazBtnGroup'
import type { MazButtonGroupOption } from 'maz-ui/components/MazBtnGroup'

const items: MazButtonGroupOption[] = [
  { text: 'Day' },
  { text: 'Week', active: true },
  { text: 'Month' },
]
</script>
```

  </template>
</ComponentDemo>

### Slot-based variants

<br />

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-4 maz:items-start">
    <MazBtnGroup>
      <MazBtn variant="outline">Edit</MazBtn>
      <MazBtn variant="outline">Save</MazBtn>
      <MazBtn variant="outline">Delete</MazBtn>
    </MazBtnGroup>
    <MazBtnGroup>
      <MazBtn variant="soft">Edit</MazBtn>
      <MazBtn variant="soft">Save</MazBtn>
      <MazBtn variant="soft">Delete</MazBtn>
    </MazBtnGroup>
  </div>

  <template #code>

```vue
<template>
  <MazBtnGroup>
    <MazBtn variant="outline">Edit</MazBtn>
    <MazBtn variant="outline">Save</MazBtn>
    <MazBtn variant="outline">Delete</MazBtn>
  </MazBtnGroup>

  <MazBtnGroup>
    <MazBtn variant="soft">Edit</MazBtn>
    <MazBtn variant="soft">Save</MazBtn>
    <MazBtn variant="soft">Delete</MazBtn>
  </MazBtnGroup>
</template>
```

  </template>
</ComponentDemo>

## Click handlers

Add click handlers to buttons using the `onClick` property in items.

<ComponentDemo>
  <MazBtnGroup :items="clickableItems" />

  <template #code>

```vue
<template>
  <MazBtnGroup :items="items" />
</template>

<script lang="ts" setup>
import MazBtnGroup from 'maz-ui/components/MazBtnGroup'
import type { MazButtonGroupOption } from 'maz-ui/components/MazBtnGroup'
import { useToast } from 'maz-ui/composables/useToast'

const toast = useToast()

const items: MazButtonGroupOption[] = [
  { text: 'Toast', onClick: () => toast.info('Clicked Toast!') },
  { text: 'Console', onClick: () => console.log('Clicked Console!') },
]
</script>
```

  </template>
</ComponentDemo>

## With icons

Use the `startIcon` or `endIcon` properties to add icons to buttons.

<ComponentDemo>
  <MazBtnGroup :items="iconItems" />
  <br />
  <br />
  <MazBtnGroup :items="iconOnlyItems" />

  <template #code>

```vue
<template>
  <MazBtnGroup :items="items" />
  <MazBtnGroup :items="iconOnlyItems" />
</template>

<script lang="ts" setup>
import MazBtnGroup from 'maz-ui/components/MazBtnGroup'
import type { MazButtonGroupOption } from 'maz-ui/components/MazBtnGroup'
import { MazArrowLeft } from '@maz-ui/icons/raw/MazArrowLeft'
import { MazArrowRight } from '@maz-ui/icons/raw/MazArrowRight'

const items: MazButtonGroupOption[] = [
  { text: 'Previous', startIcon: MazArrowLeft, active: true },
  { text: 'Next', endIcon: MazArrowRight },
]

const iconOnlyItems: MazButtonGroupOption[] = [
  { icon: MazBars3, color: 'transparent', variant: 'outline', active: true },
  { icon: MazSquares2x2, color: 'transparent', variant: 'outline' },
]
</script>
```

  </template>
</ComponentDemo>

## With links

Use the `href` or `to` properties to create link buttons.

<ComponentDemo>
  <MazBtnGroup :items="linkItems" />

  <template #code>

```vue
<template>
  <MazBtnGroup :items="items" />
</template>

<script lang="ts" setup>
import MazBtnGroup from 'maz-ui/components/MazBtnGroup'
import type { MazButtonGroupOption } from 'maz-ui/components/MazBtnGroup'

const items: MazButtonGroupOption[] = [
  { text: 'External Link', href: 'https://maz-ui.com', target: '_blank' },
  { text: 'Router Link', to: { path: '/components/maz-btn' } },
]
</script>
```

  </template>
</ComponentDemo>

## Mixed button styles

Combine different button styles within the same group.

<ComponentDemo>
  <MazBtnGroup :items="mixedItems" />

  <template #code>

```vue
<template>
  <MazBtnGroup :items="items" />
</template>

<script lang="ts" setup>
import MazBtnGroup from 'maz-ui/components/MazBtnGroup'
import type { MazButtonGroupOption } from 'maz-ui/components/MazBtnGroup'

const items: MazButtonGroupOption[] = [
  { text: 'Primary', color: 'primary' },
  { text: 'Success', color: 'success' },
  { text: 'Warning', color: 'warning', variant: 'outline' },
  { text: 'Destructive', color: 'destructive', variant: 'soft' },
]
</script>
```

  </template>
</ComponentDemo>

## Types

### MazButtonGroupOption

```ts
import type { MazBtnProps } from 'maz-ui/components/MazBtn'
import type { RouteLocationRaw } from 'vue-router'

interface MazButtonGroupOption extends Omit<MazBtnProps, 'block'> {
  /** The text of the button */
  text: string
  /** Click handler for the button */
  onClick?: () => void
  /** The href for anchor links */
  href?: string
  /** The route for router-link */
  to?: RouteLocationRaw
}
```

### MazButtonGroupProps

```ts
interface MazButtonGroupProps {
  /**
   * The items for the button group (optional when using slot-based approach)
   * @default undefined
   */
  items?: MazButtonGroupOption[]
  /**
   * The orientation of the button group
   * @values 'row' | 'col'
   * @default 'row'
   */
  orientation?: 'row' | 'col'
  /**
   * The size of all buttons (only applies to props-based buttons)
   * @default 'md'
   */
  size?: 'mini' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /**
   * The color of all buttons (only applies to props-based buttons)
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'destructive' | 'transparent' | 'contrast' | 'neutral' | 'accent' | 'surface' | 'container'
}
```

<!--@include: ./../../.vitepress/generated-docs/maz-btn-group.doc.md-->

<script lang="ts" setup>
import type { MazButtonGroupOption } from 'maz-ui/components/MazBtnGroup'
import { MazArrowLeft } from '@maz-ui/icons/raw/MazArrowLeft'
import { MazArrowRight } from '@maz-ui/icons/raw/MazArrowRight'
import { MazBars3 } from '@maz-ui/icons/raw/MazBars3'
import { MazSquares2x2 } from '@maz-ui/icons/raw/MazSquares2x2'
import { useToast } from 'maz-ui/composables/useToast'

const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl'] as const
const colors = ['primary', 'secondary', 'info', 'success', 'warning', 'destructive', 'neutral', 'surface', 'container'] as const

const basicItems: MazButtonGroupOption[] = [
  { text: 'Day' },
  { text: 'Week', active: true },
  { text: 'Month' },
]

const outlineItems: MazButtonGroupOption[] = [
  { text: 'Day', variant: 'outline' },
  { text: 'Week', variant: 'outline', active: true },
  { text: 'Month', variant: 'outline' },
]

const softItems: MazButtonGroupOption[] = [
  { text: 'Day', variant: 'soft' },
  { text: 'Week', variant: 'soft' },
  { text: 'Month', variant: 'soft' },
]

const toast = useToast()

const clickableItems: MazButtonGroupOption[] = [
  { text: 'Toast', onClick: () => toast.info('Clicked Toast!') },
  { text: 'Console', onClick: () => console.log('Clicked Console!') },
]

const iconItems: MazButtonGroupOption[] = [
  { text: 'Previous', startIcon: MazArrowLeft },
  { text: 'Next', endIcon: MazArrowRight },
]
const iconOnlyItems: MazButtonGroupOption[] = [
  { icon: MazBars3, color: 'primary', active: true },
  { icon: MazSquares2x2, color: 'transparent', variant: 'outline' },
]

const linkItems: MazButtonGroupOption[] = [
  { text: 'External Link', href: 'https://maz-ui.com' },
  { text: 'Router Link', to: { path: '/components/maz-btn' } },
]

const mixedItems: MazButtonGroupOption[] = [
  { text: 'Primary', color: 'primary' },
  { text: 'Success', color: 'success' },
  { text: 'Warning', color: 'warning', variant: 'outline' },
  { text: 'Destructive', color: 'destructive', variant: 'soft' },
]
</script>
