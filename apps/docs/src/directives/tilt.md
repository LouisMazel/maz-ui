---
title: vTilt
description: vTilt is a Vue directive that tilts an element in 3D toward the pointer, with an optional glare, a mode that follows the pointer on the whole page and a slight floating in depth. Off with reduced motion.
head:
  - - meta
    - name: keywords
      content: tilt, 3d tilt, parallax, perspective, glare, floating, hero scene, v-tilt, micro interaction
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Basic usage

Move the pointer over the cards: they lean toward it and settle back when it leaves.

<ComponentDemo expanded>
  <div class="maz:grid maz:gap-4 maz:sm:grid-cols-3">
    <div v-tilt class="maz:rounded-2xl maz:border maz:border-divider maz:bg-container maz:p-6 maz:shadow-elevation">Default</div>
    <div v-tilt="{ max: 16, perspective: 600 }" class="maz:rounded-2xl maz:border maz:border-divider maz:bg-container maz:p-6 maz:shadow-elevation">More tilt</div>
    <div v-tilt="{ glare: true }" class="maz:rounded-2xl maz:border maz:border-divider maz:bg-container maz:p-6 maz:shadow-elevation">With glare</div>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import { vTilt } from 'maz-ui/directives/vTilt'
</script>

<template>
  <div v-tilt>Default</div>
  <div v-tilt="{ max: 16, perspective: 600 }">More tilt</div>
  <div v-tilt="{ glare: true }">With glare</div>
</template>
```

</template>
</ComponentDemo>

The directive sets the `transform` of the element: do not use it on an element that already has its own `transform`, wrap it instead.

## Follow the whole page

With `global: true`, the element follows the pointer anywhere on the page, with damping, like the 3D scene of a hero. With `float: true`, it also floats slightly in depth (a CSS animation, paused off screen). Children can sit at different depths with `translateZ`.

<ComponentDemo>
  <div class="maz:flex maz:min-h-56 maz:items-center maz:justify-center">
    <div v-tilt="{ global: true, float: true, max: 14 }" class="maz:relative maz:h-44 maz:w-72">
      <div class="maz:absolute maz:inset-0 maz:rounded-2xl maz:border maz:border-divider maz:bg-container maz:shadow-elevation" />
      <div class="maz:absolute maz:start-4 maz:top-4 maz:rounded-xl maz:bg-primary maz:px-4 maz:py-3 maz:text-primary-foreground" style="transform: translateZ(2.5rem)">3D scene</div>
      <div class="maz:absolute maz:end-4 maz:bottom-4 maz:rounded-xl maz:bg-secondary maz:px-4 maz:py-3 maz:text-secondary-foreground" style="transform: translateZ(4.5rem)">Follows the page</div>
    </div>
  </div>

<template #code>

```vue
<template>
  <div v-tilt="{ global: true, float: true, max: 14 }" class="relative h-44 w-72">
    <div class="absolute inset-0 rounded-2xl bg-container" />
    <div class="absolute top-4 start-4" style="transform: translateZ(2.5rem)">3D scene</div>
  </div>
</template>
```

</template>
</ComponentDemo>

## Options

| Option | Description | Default |
| --- | --- | --- |
| `max` | Maximum angle in degrees | `8` |
| `perspective` | Perspective in pixels | `800` |
| `glare` | Add a light reflection that follows the pointer (`--maz-tilt-glare-color` changes its color) | `false` |
| `global` | Follow the pointer on the whole page instead of the element only | `false` |
| `float` | Slight floating in depth: `true` or the distance in pixels | `false` |
| `damping` | Damping of the movement (0 never moves, 1 follows at once) | `0.1` |

## Performance

- One `requestAnimationFrame` loop, only while the element moves.
- With `global`, the pointer is only listened to while the element is on screen.
- The floating animation is paused off screen.

## Accessibility and motion

- The tilt is decorative: text stays readable and clickable, keep the angle small.
- Off with a touch pointer, and with `prefers-reduced-motion: reduce` (or the `motion` option of `MazUi`): no tilt, no floating, no glare.

## Types

```ts
interface VTiltOptions {
  max?: number
  perspective?: number
  glare?: boolean
  global?: boolean
  float?: boolean | number
  damping?: number
}

type VTiltBindingValue = VTiltOptions | boolean | undefined
```

## Global installation

```ts
import { vTiltInstall } from 'maz-ui/directives/vTilt'

app.use(vTiltInstall)
```

With Nuxt, add it to the `directives` option of the module: `directives: { vTilt: true }`.

<script lang="ts" setup>
import { vTilt } from 'maz-ui/directives/vTilt'
</script>
