---
title: MazBtnGroup
description: MazBtnGroup is a component to group multiple MazBtn buttons together with seamless styling. Supports props-based or slot-based rendering with customizable orientation, size, and color.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

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
  <div class="maz-flex maz-gap-8 maz-flex-wrap">
    <div>
      <p class="maz-mb-2 maz-text-muted">Row (default)</p>
      <MazBtnGroup :items="basicItems" orientation="row" />
    </div>
    <div>
      <p class="maz-mb-2 maz-text-muted">Column</p>
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
  <div class="maz-flex maz-flex-col maz-gap-4 maz-items-start">
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

Use the `color` prop to apply a color to all buttons in the group.

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-4 maz-items-start">
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
</template>
```

  </template>
</ComponentDemo>

## Button variants

Use the `outlined` or `pastel` properties on individual buttons or apply different variants to buttons in the group.

### Outlined

<br />

<ComponentDemo>
  <MazBtnGroup :items="outlinedItems" />

  <template #code>

```vue
<template>
  <MazBtnGroup :items="items" />
</template>

<script lang="ts" setup>
import MazBtnGroup from 'maz-ui/components/MazBtnGroup'
import type { MazButtonGroupOption } from 'maz-ui/components/MazBtnGroup'

const items: MazButtonGroupOption[] = [
  { text: 'Day', outlined: true },
  { text: 'Week', outlined: true },
  { text: 'Month', outlined: true },
]
</script>
```

  </template>
</ComponentDemo>

### Pastel

<br />

<ComponentDemo>
  <MazBtnGroup :items="pastelItems" />

  <template #code>

```vue
<template>
  <MazBtnGroup :items="items" />
</template>

<script lang="ts" setup>
import MazBtnGroup from 'maz-ui/components/MazBtnGroup'
import type { MazButtonGroupOption } from 'maz-ui/components/MazBtnGroup'

const items: MazButtonGroupOption[] = [
  { text: 'Day', pastel: true },
  { text: 'Week', pastel: true },
  { text: 'Month', pastel: true },
]
</script>
```

  </template>
</ComponentDemo>

### Slot-based variants

<br />

<ComponentDemo>
  <div class="maz-flex maz-flex-col maz-gap-4 maz-items-start">
    <MazBtnGroup>
      <MazBtn outlined>Edit</MazBtn>
      <MazBtn outlined>Save</MazBtn>
      <MazBtn outlined>Delete</MazBtn>
    </MazBtnGroup>
    <MazBtnGroup>
      <MazBtn pastel>Edit</MazBtn>
      <MazBtn pastel>Save</MazBtn>
      <MazBtn pastel>Delete</MazBtn>
    </MazBtnGroup>
  </div>

  <template #code>

```vue
<template>
  <MazBtnGroup>
    <MazBtn outlined>Edit</MazBtn>
    <MazBtn outlined>Save</MazBtn>
    <MazBtn outlined>Delete</MazBtn>
  </MazBtnGroup>

  <MazBtnGroup>
    <MazBtn pastel>Edit</MazBtn>
    <MazBtn pastel>Save</MazBtn>
    <MazBtn pastel>Delete</MazBtn>
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

const items: MazButtonGroupOption[] = [
  { text: 'Alert', onClick: () => alert('Clicked Alert!') },
  { text: 'Console', onClick: () => console.log('Clicked Console!') },
]
</script>
```

  </template>
</ComponentDemo>

## With icons

Use the `leftIcon` or `rightIcon` properties to add icons to buttons.

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
import { MazArrowLeft, MazArrowRight } from '@maz-ui/icons'

const items: MazButtonGroupOption[] = [
  { text: 'Previous', leftIcon: MazArrowLeft, active: true },
  { text: 'Next', rightIcon: MazArrowRight },
]

const iconOnlyItems: MazButtonGroupOption[] = [
  { icon: MazBars3, color: 'transparent', outlined: true, active: true },
  { icon: MazSquares2x2, color: 'transparent', outlined: true },
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
  { text: 'Warning', color: 'warning', outlined: true },
  { text: 'Danger', color: 'destructive', pastel: true },
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
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'destructive' | 'transparent' | 'contrast' | 'accent'
}
```

<!--@include: ./../../.vitepress/generated-docs/maz-btn-group.doc.md-->

<script lang="ts" setup>
import type { MazButtonGroupOption } from 'maz-ui/components/MazBtnGroup'
import { MazArrowLeft, MazArrowRight, MazBars3, MazSquares2x2 } from '@maz-ui/icons'

const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl'] as const
const colors = ['primary', 'secondary', 'info', 'success', 'warning', 'destructive'] as const

const basicItems: MazButtonGroupOption[] = [
  { text: 'Day' },
  { text: 'Week', active: true },
  { text: 'Month' },
]

const outlinedItems: MazButtonGroupOption[] = [
  { text: 'Day', outlined: true },
  { text: 'Week', outlined: true, active: true },
  { text: 'Month', outlined: true },
]

const pastelItems: MazButtonGroupOption[] = [
  { text: 'Day', pastel: true },
  { text: 'Week', pastel: true },
  { text: 'Month', pastel: true },
]

const clickableItems: MazButtonGroupOption[] = [
  { text: 'Alert', onClick: () => alert('Clicked Alert!') },
  { text: 'Console', onClick: () => console.log('Clicked Console!') },
]

const iconItems: MazButtonGroupOption[] = [
  { text: 'Previous', leftIcon: MazArrowLeft },
  { text: 'Next', rightIcon: MazArrowRight },
]
const iconOnlyItems: MazButtonGroupOption[] = [
  { icon: MazBars3, color: 'primary', active: true },
  { icon: MazSquares2x2, color: 'transparent', outlined: true },
]

const linkItems: MazButtonGroupOption[] = [
  { text: 'External Link', href: 'https://maz-ui.com' },
  { text: 'Router Link', to: { path: '/components/maz-btn' } },
]

const mixedItems: MazButtonGroupOption[] = [
  { text: 'Primary', color: 'primary' },
  { text: 'Success', color: 'success' },
  { text: 'Warning', color: 'warning', outlined: true },
  { text: 'Danger', color: 'destructive', pastel: true },
]
</script>
