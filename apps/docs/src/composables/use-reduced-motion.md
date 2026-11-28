---
title: useReducedMotion
description: Know when to turn the animations off or shorten them - the prefers-reduced-motion preference of the user, unless the motion option of MazUi forces it. SSR safe.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Use it for the animations you write by hand (Web Animations, JavaScript transitions). The maz-ui components already follow it.

## Usage

`shouldReduceMotion` is the value to read. Turn on "Reduce motion" in the settings of your system: it changes.

<ComponentDemo expanded>
  <div class="maz:flex maz:flex-col maz:items-start maz:gap-3 maz:text-sm">
    <div>shouldReduceMotion: <MazBadge :color="shouldReduceMotion ? 'warning' : 'success'" size="sm">{{ shouldReduceMotion }}</MazBadge></div>
    <div>prefersReducedMotion: <MazBadge :color="prefersReducedMotion ? 'warning' : 'container'" size="sm">{{ prefersReducedMotion }}</MazBadge></div>
    <div class="maz:rounded-md maz:border maz:border-divider maz:bg-container maz:p-3">
      <div ref="box" class="maz:size-10 maz:rounded-md maz:bg-primary" />
    </div>
    <MazBtn size="sm" color="contrast" @click="play">Play</MazBtn>
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import { useReducedMotion } from 'maz-ui/composables/useReducedMotion'
import { useTemplateRef } from 'vue'

const box = useTemplateRef('box')

const { shouldReduceMotion, prefersReducedMotion } = useReducedMotion()

function play() {
  box.value?.animate(
    [{ transform: 'translateX(0)' }, { transform: 'translateX(200px)' }, { transform: 'translateX(0)' }],
    { duration: shouldReduceMotion.value ? 0 : 600, easing: 'ease-in-out' },
  )
}
</script>

<template>
  <p>shouldReduceMotion: {{ shouldReduceMotion }}</p>
  <p>prefersReducedMotion: {{ prefersReducedMotion }}</p>

  <div ref="box" class="size-10 rounded-md bg-primary" />

  <MazBtn @click="play">
    Play
  </MazBtn>
</template>
```

  </template>
</ComponentDemo>

## Behavior

- `prefersReducedMotion` is the `prefers-reduced-motion: reduce` preference alone.
- `shouldReduceMotion` is the preference, unless the [`motion` option](./../guide/vue.md#motion) of MazUi forces it: `'reduced'` gives `true`, `'full'` gives `false`.
- It is built on [useMediaQuery](./use-media-query.md): `false` on the server and until the component is mounted, so hydration does not mismatch.
- The options are the ones of `useMediaQuery` (`initialValue`, `internalWindow`).

## Types

```ts
function useReducedMotion(options?: UseMediaQueryOptions): {
  shouldReduceMotion: ComputedRef<boolean>
  prefersReducedMotion: Ref<boolean>
  isSupported: boolean
}
```

<script lang="ts" setup>
import { useReducedMotion } from 'maz-ui/composables/useReducedMotion'
import { useTemplateRef } from 'vue'

const box = useTemplateRef<HTMLElement>('box')

const { shouldReduceMotion, prefersReducedMotion } = useReducedMotion()

function play() {
  box.value?.animate(
    [{ transform: 'translateX(0)' }, { transform: 'translateX(200px)' }, { transform: 'translateX(0)' }],
    { duration: shouldReduceMotion.value ? 0 : 600, easing: 'ease-in-out' },
  )
}
</script>
