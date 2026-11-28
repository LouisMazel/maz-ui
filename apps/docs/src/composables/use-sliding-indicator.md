---
title: useSlidingIndicator
description: Slide a pill or a line under the active element of a group - tabs, segmented controls, pagination, menus.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

Give the container and the active element. The composable returns the style of the indicator.

<ComponentDemo expanded>
  <div class="maz:flex maz:flex-col maz:items-start maz:gap-3">
    <div ref="container" class="maz:relative maz:flex maz:rounded-lg maz:bg-container maz:p-1">
      <span class="maz:absolute maz:start-0 maz:top-0 maz:rounded-md maz:bg-primary" :style="style" />
      <button
        v-for="(label, index) in tabs"
        ref="buttons"
        :key="label"
        type="button"
        class="maz:relative maz:cursor-pointer maz:rounded-md maz:px-4 maz:py-2 maz:text-sm maz:font-medium maz:transition-colors"
        :class="activeIndex === index ? 'maz:text-primary-foreground' : 'maz:text-foreground'"
        @click="activeIndex = index"
      >
        {{ label }}
      </button>
    </div>
    <div class="maz:text-sm">isReady: <MazBadge :color="isReady ? 'success' : 'container'" size="sm">{{ isReady }}</MazBadge></div>
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import { useSlidingIndicator } from 'maz-ui/composables/useSlidingIndicator'
import { computed, ref, useTemplateRef } from 'vue'

const container = useTemplateRef('container')
const buttons = useTemplateRef('buttons')
const activeIndex = ref(0)

const active = computed(() => buttons.value?.[activeIndex.value])

const { style } = useSlidingIndicator({ container, active })
</script>

<template>
  <div ref="container" class="relative flex rounded-lg bg-container p-1">
    <span class="absolute start-0 top-0 rounded-md bg-primary" :style="style" />

    <button
      v-for="(label, index) in ['One', 'Two', 'Three']"
      ref="buttons"
      :key="label"
      class="relative px-4 py-2"
      :class="activeIndex === index ? 'text-primary-foreground' : 'text-foreground'"
      @click="activeIndex = index"
    >
      {{ label }}
    </button>
  </div>
</template>
```

  </template>
</ComponentDemo>

The indicator must be absolutely positioned at the start of the container (`top: 0` and `inset-inline-start: 0`), and the container must be positioned.

## Options

- `container`: the element that contains the items and the indicator.
- `active`: the active element (a ref, a getter or an element).
- `orientation`: `'horizontal'` (default) or `'vertical'`.
- `stretch`: the indicator stretches toward the new element, then shrinks, like a drop of ink. Default `false`.
- `animated`: `false` to move the indicator without transition. Default `true`.

```ts
const { style } = useSlidingIndicator({ container, active, orientation: 'vertical', stretch: true })
```

## Returned values

- `style`: `width`, `height`, `transform` and, when animated, the transition (the `--maz-motion-normal` duration and the `--maz-easing-spring` easing). Before the first placement it is `{ opacity: 0 }`.
- `isReady`: `false` until the first placement.
- `shouldAnimate`: `true` when the moves are animated (not under reduced motion, not on the first placement).
- `update()`: measures the active element again, for example after a font loads.

## Behavior

- The first placement is never animated.
- The indicator follows the size of the container and of the active element.
- It works in RTL: the offset is computed from the inline start.
- Under reduced motion (see `useReducedMotion`), the indicator jumps without transition.
- It does nothing on the server.

::: tip
Use it with [useRovingFocus](./use-roving-focus.md) for the keyboard navigation of the same group.
:::

## Types

```ts
interface UseSlidingIndicatorOptions {
  container: MaybeRefOrGetter<HTMLElement | ComponentPublicInstance | null | undefined>
  active: MaybeRefOrGetter<HTMLElement | ComponentPublicInstance | null | undefined>
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical'
  /** @default false */
  stretch?: boolean
  /** @default true */
  animated?: boolean
}

function useSlidingIndicator(options: UseSlidingIndicatorOptions): {
  style: ComputedRef<CSSProperties>
  isReady: Ref<boolean>
  shouldAnimate: ComputedRef<boolean>
  update: () => void
}
```

<script lang="ts" setup>
import { useSlidingIndicator } from 'maz-ui/composables/useSlidingIndicator'
import { computed, ref, useTemplateRef } from 'vue'

const container = useTemplateRef('container')
const buttons = useTemplateRef<HTMLElement[]>('buttons')
const activeIndex = ref(0)
const tabs = ['Overview', 'Details', 'Activity']

const active = computed(() => buttons.value?.[activeIndex.value])

const { style, isReady } = useSlidingIndicator({ container, active })
</script>
