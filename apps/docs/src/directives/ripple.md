---
title: vRipple
description: vRipple is a Vue directive that fills an element from the exact point where the pointer enters it and empties it toward the point where the pointer leaves, or sends a wave from the click point.
head:
  - - meta
    - name: keywords
      content: ripple, hover fill, click wave, material ripple, pointer origin, v-ripple, micro interaction
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Basic usage

By default, a fill starts from the point where the pointer enters and covers the element. When the pointer leaves, it empties toward the point where it leaves. Try to enter and leave by different sides.

<ComponentDemo expanded>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4">
    <button v-ripple type="button" class="maz:rounded-xl maz:border maz:border-divider maz:px-8 maz:py-5">Hover me</button>
    <MazBtn v-ripple color="secondary">MazBtn</MazBtn>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import { vRipple } from 'maz-ui/directives/vRipple'
</script>

<template>
  <button v-ripple type="button">Hover me</button>
  <MazBtn v-ripple>MazBtn</MazBtn>
</template>
```

</template>
</ComponentDemo>

The fill is clipped to the radius of the element and does not change its layout. It is drawn with a pseudo element (`::before`) of the element: do not use it on an element that already uses its own `::before`.

## Click mode

With `mode: 'click'`, a wave starts from the point of the click and fades out. With the keyboard, it starts from the center.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4">
    <button v-ripple="'click'" type="button" class="maz:rounded-xl maz:bg-primary maz:px-8 maz:py-5 maz:text-primary-foreground">Click me</button>
    <MazBtn v-ripple="{ mode: 'click', opacity: 0.3 }" color="secondary">MazBtn</MazBtn>
  </div>

<template #code>

```vue
<template>
  <button v-ripple="'click'">Click me</button>
  <MazBtn v-ripple="{ mode: 'click', opacity: 0.3 }">MazBtn</MazBtn>
</template>
```

</template>
</ComponentDemo>

## Color

The color is `currentColor` with a low opacity: it follows the text color, in light and dark. Use `color` for anything else, a theme token included.

```vue
<template>
  <button v-ripple="{ color: 'var(--maz-primary)', opacity: 0.2 }">Primary</button>
</template>
```

## Options

| Option | Description | Default |
| --- | --- | --- |
| `mode` | `hover` or `click` (the shorthand `v-ripple="'click'"` works) | `'hover'` |
| `color` | Any CSS color | `currentColor` |
| `opacity` | Opacity of the fill (0 to 1) | `0.12` |
| `duration` | Duration in milliseconds | `--maz-motion-slow` |

## Accessibility and motion

- The effect is decorative: it is not announced and does not take the focus nor the pointer events.
- The hover mode is off on touch screens (a finger does not hover). The click mode works on touch.
- With `prefers-reduced-motion: reduce` (or the `motion` option of `MazUi`), nothing is drawn.
- Keep a visible contrast for the text over the fill: the default opacity is low on purpose.

## Types

```ts
interface VRippleOptions {
  mode?: 'hover' | 'click'
  color?: string
  opacity?: number
  duration?: number
}

type VRippleBindingValue = 'hover' | 'click' | VRippleOptions | false | undefined
```

## Global installation

```ts
import { vRippleInstall } from 'maz-ui/directives/vRipple'

app.use(vRippleInstall)
```

With Nuxt, add it to the `directives` option of the module: `directives: { vRipple: true }`.

<script lang="ts" setup>
import { vRipple } from 'maz-ui/directives/vRipple'
</script>
