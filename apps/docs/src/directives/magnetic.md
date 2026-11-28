---
title: vMagnetic
description: vMagnetic is a Vue directive that makes an element lean toward the pointer when it approaches and spring back when it goes away - for large call to action buttons. Off on touch screens and with reduced motion.
head:
  - - meta
    - name: keywords
      content: magnetic, magnetic button, hover effect, attract, call to action, v-magnetic, micro interaction
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Basic usage

Bring the pointer close to the button, without touching it: the button follows you a little, then comes back when you leave.

<ComponentDemo expanded>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-12 maz:py-6">
    <MazBtn v-magnetic size="lg">Get started</MazBtn>
    <MazBtn v-magnetic="{ strength: 0.5, radius: 140 }" size="lg" color="secondary">Strongly attracted</MazBtn>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import { vMagnetic } from 'maz-ui/directives/vMagnetic'
</script>

<template>
  <MazBtn v-magnetic size="lg">Get started</MazBtn>
  <MazBtn v-magnetic="{ strength: 0.5, radius: 140 }" size="lg">Strongly attracted</MazBtn>
</template>
```

</template>
</ComponentDemo>

The element moves with the independent `translate` property, so it combines with any `transform` you already use.

## Options

| Option | Description | Default |
| --- | --- | --- |
| `strength` | How far the element follows the pointer, as a ratio of the distance to its center (0 to 1) | `0.3` |
| `radius` | Distance in pixels around the element where the pointer attracts it | `80` |

The value can be `true`, an object, or `false`.

## Performance

- The pointer is only listened to while the element is on screen.
- A single `requestAnimationFrame` loop runs, only while the element moves, and stops when it has settled.

## Accessibility and motion

- The click target moves a little: keep the effect for large elements, and a small `strength`.
- Off on touch screens, with a touch pointer and with `prefers-reduced-motion: reduce` (or the `motion` option of `MazUi`).
- The keyboard and focus are not affected.

## Types

```ts
interface VMagneticOptions {
  strength?: number
  radius?: number
}

type VMagneticBindingValue = VMagneticOptions | boolean | undefined
```

## Global installation

```ts
import { vMagneticInstall } from 'maz-ui/directives/vMagnetic'

app.use(vMagneticInstall)
```

With Nuxt, add it to the `directives` option of the module: `directives: { vMagnetic: true }`.

<script lang="ts" setup>
import { vMagnetic } from 'maz-ui/directives/vMagnetic'
</script>
