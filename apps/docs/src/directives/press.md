---
title: vPress
description: vPress is a Vue directive that gives a press feedback to any clickable element - it sinks a little under the finger or the pointer and springs back, with Enter and Space handled and reduced motion respected.
head:
  - - meta
    - name: keywords
      content: press, pressed, active state, tap feedback, scale, button feedback, v-press, micro interaction
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Basic usage

Add the directive to any element. While you press it (pointer, finger, Enter or Space), it sinks slightly, then springs back.

<ComponentDemo expanded>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-4">
    <button v-press type="button" class="maz:rounded-lg maz:bg-primary maz:px-4 maz:py-2 maz:text-primary-foreground">Native button</button>
    <MazBtn v-press color="secondary">MazBtn</MazBtn>
    <div v-press tabindex="0" role="button" class="maz:cursor-pointer maz:rounded-xl maz:border maz:border-divider maz:px-5 maz:py-3">Clickable card</div>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import { vPress } from 'maz-ui/directives/vPress'
</script>

<template>
  <button v-press type="button">Native button</button>
  <MazBtn v-press>MazBtn</MazBtn>
  <div v-press tabindex="0" role="button">Clickable card</div>
</template>
```

</template>
</ComponentDemo>

::: tip
No CSS to import: the directive loads its styles the first time it is used. If you only need the effect on elements you style yourself, the `press` utility of the Tailwind integration does the same in pure CSS.
:::

## Options

<ComponentDemo>
  <MazBtn v-press="{ scale: 0.9 }" color="accent">Strong press</MazBtn>

<template #code>

```vue
<template>
  <MazBtn v-press="{ scale: 0.9 }">Strong press</MazBtn>
  <MazBtn v-press="false">No feedback</MazBtn>
</template>
```

</template>
</ComponentDemo>

| Option | Description | Default |
| --- | --- | --- |
| `scale` | Scale of the element while it is pressed (between 0 and 1) | `0.97` |

The value can be `true` (the defaults), an object, or `false` to turn the feedback off.

## Accessibility and motion

- The directive only changes the scale: it does not change the role, the focus nor the events of the element. Give a role and a `tabindex` to a non-interactive element yourself.
- A disabled element (`disabled` or `aria-disabled="true"`) does not move.
- With `prefers-reduced-motion: reduce` (or the `motion` option of `MazUi`), nothing moves.
- The transition uses the motion tokens (`--maz-motion-fast`, `--maz-easing-bounce`).

## Types

```ts
interface VPressOptions {
  scale?: number
}

type VPressBindingValue = VPressOptions | boolean | undefined
```

## Global installation

```ts
import { vPressInstall } from 'maz-ui/directives/vPress'

app.use(vPressInstall)
```

With Nuxt, add it to the `directives` option of the module: `directives: { vPress: true }`.

<script lang="ts" setup>
import { vPress } from 'maz-ui/directives/vPress'
</script>
