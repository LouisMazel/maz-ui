---
title: vTooltip
description: vTooltip is a Vue 3 directive to display a text when the user hovers an element
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}


## Basic usage

<ComponentDemo>
  <p class="maz-mb-4">
    Hover the buttons
  </p>
  <div
    class="maz-flex maz-gap-3 maz-flex-wrap"
  >
    <MazBtn v-tooltip="'This is a top tooltip'">
      Top
    </MazBtn>
    <MazBtn v-tooltip.right="'This is a top tooltip'">
      Right
    </MazBtn>
    <MazBtn v-tooltip.left="'This is a top tooltip'">
      Left
    </MazBtn>
    <MazBtn v-tooltip.bottom="'This is a top tooltip'">
      Bottom
    </MazBtn>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import { vTooltip } from 'maz-ui/directives'
</script>

<template>
  <MazBtn v-tooltip="'This is a top tooltip'">
    Top
  </MazBtn>
  <MazBtn v-tooltip.right="'This is a top tooltip'">
    Right
  </MazBtn>
  <MazBtn v-tooltip.left="'This is a top tooltip'">
    Left
  </MazBtn>
  <MazBtn v-tooltip.bottom="'This is a top tooltip'">
    Bottom
  </MazBtn>
</template>
```

  </template>
</ComponentDemo>

## Colors

<ComponentDemo>
  <p class="maz-mb-4">
    Hover the buttons
  </p>
  <div
    class="maz-flex maz-gap-3 maz-flex-wrap"
  >
    <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'primary' }">
      Primary
    </MazBtn>
    <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'secondary' }" color="secondary">
      Secondary
    </MazBtn>
    <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'accent' }" color="accent">
      Accent
    </MazBtn>
    <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'success' }" color="success">
      Success
    </MazBtn>
    <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'warning' }" color="warning">
      Warning
    </MazBtn>
    <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'destructive' }" color="destructive">
      Destructive
    </MazBtn>
    <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'info' }" color="info">
      Info
    </MazBtn>
    <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'contrast' }" color="contrast">
      Contrast
    </MazBtn>
    <MazBtn v-tooltip="{ text: 'Tooltip text', color: 'background' }" color="background">
      Background
    </MazBtn>
  </div>

<template #code>

```html
<MazBtn v-tooltip="{ text: 'Tooltip text', color: 'primary' }">
  Primary
</MazBtn>

<MazBtn v-tooltip="{ text: 'Tooltip text', color: 'secondary' }" color="secondary">
  Secondary
</MazBtn>

<MazBtn v-tooltip="{ text: 'Tooltip text', color: 'success' }" color="success">
  Success
</MazBtn>

<MazBtn v-tooltip="{ text: 'Tooltip text', color: 'warning' }" color="warning">
  Warning
</MazBtn>

<MazBtn v-tooltip="{ text: 'Tooltip text', color: 'destructive' }" color="destructive">
  destructive
</MazBtn>

<MazBtn v-tooltip="{ text: 'Tooltip text', color: 'info' }" color="info">
  Info
</MazBtn>

<MazBtn v-tooltip="{ text: 'Tooltip text', color: 'accent' }" color="accent">
  Accent
</MazBtn>

<MazBtn v-tooltip="{ text: 'Tooltip text', color: 'contrast' }" color="contrast">
  Contrast
</MazBtn>

<MazBtn v-tooltip="{ text: 'Tooltip text', color: 'default' }" color="background">
  Background
</MazBtn>
```

  </template>
</ComponentDemo>

## Position

You can change the position of the tooltip by passing a `position` option or using the directive modifier (e.g. `v-tooltip.top`).

<ComponentDemo>
  <div
    class="maz-flex maz-gap-3 maz-flex-wrap"
  >
    <MazBtn v-tooltip.bottom="{ text: 'Tooltip text' }">
      Bottom
    </MazBtn>
    <MazBtn v-tooltip.left="{ text: 'Tooltip text' }">
      Left
    </MazBtn>
    <MazBtn v-tooltip.right="{ text: 'Tooltip text' }">
      Right
    </MazBtn>
    <MazBtn v-tooltip.top="{ text: 'Tooltip text' }">
      Top
    </MazBtn>
    <MazBtn v-tooltip.top-start="{ text: 'Tooltip text' }">
      Top start
    </MazBtn>
    <MazBtn v-tooltip.top-end="{ text: 'Tooltip text' }">
      Top end
    </MazBtn>
    <MazBtn v-tooltip.bottom-start="{ text: 'Tooltip text' }">
      Bottom start
    </MazBtn>
    <MazBtn v-tooltip.bottom-end="{ text: 'Tooltip text' }">
      Bottom end
    </MazBtn>
    <MazBtn v-tooltip.left-start="{ text: 'Tooltip text' }">
      Left start
    </MazBtn>
    <MazBtn v-tooltip.left-end="{ text: 'Tooltip text' }">
      Left end
    </MazBtn>
    <MazBtn v-tooltip.right-start="{ text: 'Tooltip text' }">
      Right start
    </MazBtn>
    <MazBtn v-tooltip.right-end="{ text: 'Tooltip text' }">
      Right end
    </MazBtn>
  </div>

<template #code>

```html
<MazBtn v-tooltip.bottom="{ text: 'Tooltip text' }">
  Bottom
</MazBtn>

<MazBtn v-tooltip.left="{ text: 'Tooltip text' }">
  Left
</MazBtn>

<MazBtn v-tooltip.right="{ text: 'Tooltip text' }">
  Right
</MazBtn>

<MazBtn v-tooltip.top="{ text: 'Tooltip text' }">
  Top
</MazBtn>

<MazBtn v-tooltip.top-start="{ text: 'Tooltip text' }">
  Top start
</MazBtn>

<MazBtn v-tooltip.top-end="{ text: 'Tooltip text' }">
  Top end
</MazBtn>

<MazBtn v-tooltip.bottom-start="{ text: 'Tooltip text' }">
  Bottom start
</MazBtn>

<MazBtn v-tooltip.bottom-end="{ text: 'Tooltip text' }">
  Bottom end
</MazBtn>
```

  </template>
</ComponentDemo>


## HTML content

You can also use HTML content in the tooltip by passing a string to the `html` option.

<ComponentDemo>
  <div
    class="maz-flex maz-gap-3 maz-flex-wrap"
  >
    <MazBtn v-tooltip="{ html: '<strong>Tooltip</strong> text <br> with <br> line breaks' }">
      HTML
    </MazBtn>
  </div>

<template #code>

```html
<MazBtn v-tooltip="{ html: '<strong>Tooltip</strong> text <br> with <br> line breaks' }">
  HTML
</MazBtn>
```

  </template>
</ComponentDemo>

## Customization

You can customize the tooltip by passing a `panelClass` or `panelStyle` option.

<ComponentDemo>
  <div
    class="maz-flex maz-gap-3 maz-flex-wrap"
  >
    <MazBtn v-tooltip="{ text: 'Custom panel class', panelClass: '!maz-text-red-500' }">
      panelClass
    </MazBtn>
    <MazBtn v-tooltip="{ text: 'Custom panel style', panelStyle: 'background-color: red; color: white;' }">
      panelStyle
    </MazBtn>
  </div>

<template #code>

```html
<MazBtn v-tooltip="{ text: 'Custom panel class', panelClass: '!maz-text-red-500' }">
  panelClass
</MazBtn>
<MazBtn v-tooltip="{ text: 'Custom panel style', panelStyle: 'background-color: red; color: white;' }">
  panelStyle
</MazBtn>
```

  </template>
</ComponentDemo>

## Trigger

You can change the trigger mode of the tooltip by passing a `trigger` option.

The default trigger is `hover`.

The `adaptive` trigger will use the `click` trigger on touch devices (mobile and tablet) and the `hover` trigger on non-touch devices (desktop).

<ComponentDemo>
  <div
    class="maz-flex maz-gap-3 maz-flex-wrap"
  >
    <MazBtn v-tooltip="{ text: 'Tooltip text', trigger: 'click' }">
      Click
    </MazBtn>
    <MazBtn v-tooltip="{ text: 'Tooltip text', trigger: 'hover' }">
      Hover
    </MazBtn>
    <MazBtn v-tooltip="{ text: 'Tooltip text', trigger: 'adaptive' }">
      Adaptive
    </MazBtn>
  </div>

<template #code>

```html
<MazBtn v-tooltip="{ text: 'Tooltip text', trigger: 'click' }">
  Click
</MazBtn>

<MazBtn v-tooltip="{ text: 'Tooltip text', trigger: 'hover' }">
  Hover
</MazBtn>

<MazBtn v-tooltip="{ text: 'Tooltip text', trigger: 'adaptive' }">
  Adaptive
</MazBtn>
```

  </template>
</ComponentDemo>

## Offset

The `offset` (in px) option allows you to adjust the position of the tooltip relative to the original element.

<ComponentDemo>
  <div
    class="maz-flex maz-gap-3 maz-flex-wrap"
  >
    <MazBtn v-tooltip="{ text: 'Tooltip text', offset: 0 }">
      0
    </MazBtn>
    <MazBtn v-tooltip="{ text: 'Tooltip text', offset: 10 }">
      10
    </MazBtn>
    <MazBtn v-tooltip="{ text: 'Tooltip text', offset: 20 }">
      20
    </MazBtn>
    <MazBtn v-tooltip="{ text: 'Tooltip text', offset: 40 }">
      40
    </MazBtn>
  </div>

<template #code>

```html
<MazBtn v-tooltip="{ text: 'Tooltip text', offset: 0 }">
  0
</MazBtn>

<MazBtn v-tooltip="{ text: 'Tooltip text', offset: 10 }">
  10
</MazBtn>

<MazBtn v-tooltip="{ text: 'Tooltip text', offset: 20 }">
  20
</MazBtn>

<MazBtn v-tooltip="{ text: 'Tooltip text', offset: 40 }">
  40
</MazBtn>
```

  </template>
</ComponentDemo>

## Open programmatically

<ComponentDemo>
  <div class="maz-flex maz-gap-3 maz-flex-wrap">
    <MazBtn v-tooltip.top="{ text: 'Tooltip text', open: open, trigger: 'click' }">
      Primary
    </MazBtn>
    <MazBtn @click="open = !open" color="secondary">
      Toggle tooltip
    </MazBtn>
  </div>

<template #code>

```vue
<script lang="ts" setup>
  import { vTooltip } from 'maz-ui/directives'
  import { ref } from 'vue'

  const open = ref(true)
</script>

<template>
  <MazBtn v-tooltip.top="{ text: 'Tooltip text', open }">
    Primary
  </MazBtn>
  <MazBtn color="secondary" @click="open = !open">
    Toggle tooltip
  </MazBtn>
</template>
```

  </template>
</ComponentDemo>

## Global install

### Vue

```typescript
import { vTooltipInstall } from 'maz-ui/directives'
import { createApp } from 'vue'

const app = createApp(App)

// Options are optional
app.use(vTooltipInstall, {
  position: 'top',
  color: 'primary',
})

app.mount('#app')
```

### Nuxt

Please refer to the [Nuxt module documentation](./../guide/nuxt.md) for more information.

## Types

```ts
interface VTooltipOptions extends Partial<Omit<MazPopoverProps, 'modelValue'>> {
  /**
   * Text to display in the tooltip
   */
  text?: string
  /**
   * HTML content (alternative to text)
   */
  html?: string
  /**
   * Color variant of the tooltip
   * @default default
   */
  color?: MazPopoverProps['color']
  /**
   * Position of the tooltip
   * @default top
   */
  position?: PopoverPosition
  /**
   * Trigger of the tooltip
   * @default hover
   */
  trigger?: MazPopoverTrigger
  /**
   * Close on click outside
   * @default false
   */
  closeOnClickOutside?: boolean
  /**
   * Close on escape
   * @default false
   */
  closeOnEscape?: boolean

  /**
   * Open the tooltip
   * @default false
   */
  open?: boolean
}

type VTooltipBindingValue
  = | string
    | VTooltipOptions
```

<script lang="ts" setup>
  import { ref } from 'vue'
  import { vTooltip } from 'maz-ui/src/directives/vTooltip'
  const open = ref(true)
</script>
