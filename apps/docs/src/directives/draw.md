---
title: vDraw
description: vDraw is a Vue directive that draws the strokes of an SVG one after the other when it enters the screen, or while you scroll - stroke-dasharray measured for you, stagger, duration and reduced motion handled.
head:
  - - meta
    - name: keywords
      content: svg draw, line drawing, stroke animation, stroke-dashoffset, scroll animation, v-draw, svg animation
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Basic usage

Put the directive on an SVG whose shapes have a stroke. Each stroke is measured and drawn one after the other when the SVG enters the screen.

<ComponentDemo expanded>
  <div class="maz:flex maz:flex-col maz:items-start maz:gap-3">
    <MazBtn size="sm" @click="key++">Replay</MazBtn>
    <div :key="key" class="maz:flex maz:flex-wrap maz:items-center maz:gap-10">
      <svg v-draw="{ duration: 700, stagger: 250 }" viewBox="0 0 120 100" class="maz:h-28 maz:w-36 maz:text-primary" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="House">
        <path d="M10 50 L60 10 L110 50" />
        <path d="M22 44 V92 H98 V44" />
        <path d="M50 92 V62 H70 V92" />
        <circle cx="60" cy="38" r="6" />
      </svg>
      <svg v-draw viewBox="0 0 48 48" class="maz:size-20 maz:text-success" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Done">
        <circle cx="24" cy="24" r="20" />
        <path d="M14 25 L21 32 L34 17" />
      </svg>
    </div>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import { vDraw } from 'maz-ui/directives/vDraw'
</script>

<template>
  <svg v-draw="{ duration: 700, stagger: 250 }" viewBox="0 0 120 100" fill="none" stroke="currentColor" stroke-width="3" role="img" aria-label="House">
    <path d="M10 50 L60 10 L110 50" />
    <path d="M22 44 V92 H98 V44" />
  </svg>
</template>
```

</template>
</ComponentDemo>

The SVG stays fully visible on the server and without JavaScript. The strokes are hidden once the page is hydrated, then drawn at the entry. Only the shapes with a stroke are drawn (`path`, `line`, `polyline`, `polygon`, `circle`, `ellipse`, `rect`): the fill of a shape is not animated.

## Linked to the scroll

With `mode: 'scroll'`, the drawing follows the scroll (`animation-timeline: view()`). Browsers without it draw at the entry.

<ComponentDemo>
  <svg v-draw="'scroll'" viewBox="0 0 160 60" class="maz:h-20 maz:w-48 maz:text-accent" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" role="img" aria-label="Zigzag">
    <path d="M5 30 H40 L55 8 L80 52 L100 30 H155" />
  </svg>

<template #code>

```vue
<template>
  <svg v-draw="'scroll'" viewBox="0 0 160 60" fill="none" stroke="currentColor" stroke-width="3" role="img" aria-label="Zigzag">
    <path d="M5 30 H40 L55 8 L80 52 L100 30 H155" />
  </svg>
</template>
```

</template>
</ComponentDemo>

## Options

| Option | Description | Default |
| --- | --- | --- |
| `mode` | `enter` or `scroll` (the shorthand `v-draw="'scroll'"` works) | `'enter'` |
| `duration` | Duration of each stroke in milliseconds | twice `--maz-motion-slower` |
| `stagger` | Delay between the start of each stroke in milliseconds | `120` |
| `delay` | Delay before the first stroke in milliseconds | `0` |
| `once` | Draw once. With `false`, the SVG is erased when it leaves the screen | `true` |

## Accessibility and motion

- Give the SVG a role and a label (`role="img" aria-label="..."`), or hide it with `aria-hidden="true"` when it is decorative.
- With `prefers-reduced-motion: reduce` (or the `motion` option of `MazUi`), the SVG is shown fully drawn at once.
- One observer is shared by all the elements of the page (the one of [vReveal](./reveal.md)).

## Types

```ts
interface VDrawOptions {
  mode?: 'enter' | 'scroll'
  duration?: number
  stagger?: number
  delay?: number
  once?: boolean
}

type VDrawBindingValue = 'enter' | 'scroll' | VDrawOptions | false | undefined
```

## Global installation

```ts
import { vDrawInstall } from 'maz-ui/directives/vDraw'

app.use(vDrawInstall)
```

With Nuxt, add it to the `directives` option of the module: `directives: { vDraw: true }`.

<script lang="ts" setup>
import { vDraw } from 'maz-ui/directives/vDraw'
import { ref } from 'vue'

const key = ref(0)
</script>
