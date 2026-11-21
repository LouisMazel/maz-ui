---
title: vIntersect
description: vIntersect is a Vue directive that calls a function when an element enters or leaves the viewport - reveal content, track a view, start a video.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Basic usage

The handler receives `true` when the element enters the viewport, `false` when it leaves, and the entry.

<ComponentDemo expanded>
  <div class="maz:flex maz:flex-col maz:gap-3">
    <div>
      The card is
      <MazBadge :color="isVisible ? 'success' : 'destructive'">{{ isVisible ? 'visible' : 'hidden' }}</MazBadge>
    </div>
    <div class="maz:h-48 maz:overflow-auto maz:rounded-md maz:border maz:border-divider maz:bg-container">
      <div class="maz:flex maz:h-64 maz:items-end maz:justify-center maz:p-4 maz:text-sm maz:text-muted">
        Scroll down
      </div>
      <div v-intersect="onIntersect" class="maz:mx-4 maz:rounded-md maz:bg-primary maz:p-6 maz:text-center maz:text-primary-foreground">
        I am the card
      </div>
      <div class="maz:h-64" />
    </div>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import { vIntersect } from 'maz-ui/directives/vIntersect'
import { ref } from 'vue'

const isVisible = ref(false)

function onIntersect(isIntersecting: boolean) {
  isVisible.value = isIntersecting
}
</script>

<template>
  <p>The card is {{ isVisible ? 'visible' : 'hidden' }}</p>

  <div v-intersect="onIntersect">
    I am the card
  </div>
</template>
```

</template>
</ComponentDemo>

## Once

With the `.once` modifier, the handler is called the first time the element is visible, then the element is no longer observed.

<ComponentDemo>
  <div class="maz:h-40 maz:overflow-auto maz:rounded-md maz:border maz:border-divider maz:bg-container">
    <div class="maz:flex maz:h-48 maz:items-end maz:justify-center maz:p-4 maz:text-sm maz:text-muted">
      Scroll down
    </div>
    <div
      v-intersect.once="() => (revealed = true)"
      class="maz:mx-4 maz:mb-4 maz:rounded-md maz:p-6 maz:text-center maz:transition-all maz:duration-700"
      :class="revealed ? 'maz:bg-success maz:text-success-foreground maz:opacity-100 maz:scale-100' : 'maz:opacity-0 maz:scale-90'"
    >
      Revealed once
    </div>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import { vIntersect } from 'maz-ui/directives/vIntersect'
import { ref } from 'vue'

const revealed = ref(false)
</script>

<template>
  <div
    v-intersect.once="() => (revealed = true)"
    class="transition-all duration-700"
    :class="revealed ? 'opacity-100 scale-100' : 'opacity-0 scale-90'"
  >
    Revealed once
  </div>
</template>
```

</template>
</ComponentDemo>

## Options

Pass an object with a `handler` to set the options.

```vue
<template>
  <video
    v-intersect="{
      handler: (isIntersecting) => isIntersecting ? video.play() : video.pause(),
      threshold: 0.5,
      rootMargin: '0px',
    }"
  />
</template>
```

- `handler`: the function, required.
- `threshold`: the visible ratio (from 0 to 1) that triggers, or a list of ratios. `0` by default.
- `rootMargin`: a margin around the root, to trigger earlier (`'200px'`). `'0px'` by default.
- `root`: the scrollable element that acts as the viewport. The browser viewport by default.
- `once`: same as the `.once` modifier.

## Global installation

```ts
import { vIntersectInstall } from 'maz-ui/directives/vIntersect'

app.use(vIntersectInstall)
```

With Nuxt: `mazUi: { directives: { vIntersect: true } }`.

## Behavior

- An inline handler can change at each render: the observer is kept, only the handler is replaced.
- A change of the options or of the root creates a new observer.
- The observer is disconnected when the element is unmounted.
- A value without a handler function throws a `TypeError`.

::: tip
In a script, use [useIntersectionObserver](./../composables/use-intersection-observer.md). To load the next page of a list, [useInfiniteScroll](./../composables/use-infinite-scroll.md).
:::

## Types

```ts
type VIntersectHandler = (isIntersecting: boolean, entry: IntersectionObserverEntry) => void

interface VIntersectOptions {
  handler: VIntersectHandler
  /** Element whose box is the viewport of the observation: the browser viewport by default */
  root?: Element | Document | null
  /** @default '0px' */
  rootMargin?: string
  /** @default 0 */
  threshold?: number | number[]
  /** @default false */
  once?: boolean
}

type VIntersectBindingValue = VIntersectHandler | VIntersectOptions
```

<script lang="ts" setup>
import { vIntersect } from 'maz-ui/directives/vIntersect'
import { ref } from 'vue'

const isVisible = ref(false)
const revealed = ref(false)

function onIntersect(isIntersecting: boolean) {
  isVisible.value = isIntersecting
}
</script>
