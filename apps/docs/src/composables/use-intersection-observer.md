---
title: useIntersectionObserver
description: Know when one or several elements enter or leave the viewport, or a scrollable box - lazy content, animations, a sticky bar, the sentinel of an infinite list.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

Scroll the box: the badge tells if the card is visible.

<ComponentDemo expanded>
  <div class="maz:flex maz:flex-col maz:gap-3">
    <div>
      The card is
      <MazBadge :color="isIntersecting ? 'success' : 'destructive'">{{ isIntersecting ? 'visible' : 'hidden' }}</MazBadge>
    </div>
    <div ref="box" class="maz:h-48 maz:overflow-auto maz:rounded-md maz:border maz:border-divider maz:bg-container">
      <div class="maz:flex maz:h-80 maz:items-end maz:justify-center maz:p-4 maz:text-sm maz:text-muted">
        Scroll down
      </div>
      <div ref="card" class="maz:mx-4 maz:rounded-md maz:bg-primary maz:p-6 maz:text-center maz:text-primary-foreground">
        I am the card
      </div>
      <div class="maz:h-80" />
    </div>
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import { useIntersectionObserver } from 'maz-ui/composables/useIntersectionObserver'
import { useTemplateRef } from 'vue'

const box = useTemplateRef('box')
const card = useTemplateRef('card')

const { isIntersecting } = useIntersectionObserver(card, undefined, { root: box })
</script>

<template>
  <p>The card is {{ isIntersecting ? 'visible' : 'hidden' }}</p>

  <div ref="box" class="h-48 overflow-auto">
    <div class="h-80" />
    <div ref="card">
      I am the card
    </div>
    <div class="h-80" />
  </div>
</template>
```

  </template>
</ComponentDemo>

Without `root`, the viewport of the browser is used.

## Callback

The callback receives the entries of the observer (ratio, bounding boxes, time).

```ts
import { useIntersectionObserver } from 'maz-ui/composables/useIntersectionObserver'

useIntersectionObserver(section, ([entry]) => {
  if (entry.isIntersecting)
    track('section-seen')
}, { threshold: 0.5, once: true })
```

## Options

- `root`: the scrollable box that acts as the viewport. The browser viewport by default.
- `rootMargin`: a margin around the root, to trigger earlier. `'200px'` starts 200px before. `'0px'` by default.
- `threshold`: the visible ratio (from 0 to 1) that triggers, or a list of ratios. `0` by default.
- `once`: stops after the first time the element is visible.
- `immediate`: `false` to start later with `resume()`.

## Several elements

Pass an array: `isIntersecting` is `true` when one of them is visible.

```ts
const { isIntersecting } = useIntersectionObserver([header, footer])
```

## Pause and stop

```ts
const { pause, resume, stop, isActive } = useIntersectionObserver(target)

pause() // stops observing, resume() starts again
stop() // stops for good
```

## Behavior

- The targets are refs, getters, elements or components. The observer follows their changes.
- `isSupported` is `false` on the server or without `IntersectionObserver`: nothing is observed.
- The observer is disconnected when the component is unmounted.

::: tip
- In a template, the [v-intersect](./../directives/intersect.md) directive is shorter.
- To load the next page of a list, use [useInfiniteScroll](./use-infinite-scroll.md).
- For images, use [v-lazy-img](./../directives/lazy-img.md). For animations, [MazAnimatedElement](./../components/maz-animated-element.md).
:::

## Types

```ts
type IntersectionTarget = HTMLElement | SVGElement | ComponentPublicInstance | undefined | null

interface UseIntersectionObserverOptions {
  /** Element whose box is the viewport of the observation: the browser viewport by default */
  root?: MaybeRefOrGetter<IntersectionTarget | Document>
  /**
   * Margin around the root, to trigger before the element is visible
   * @default '0px'
   */
  rootMargin?: string
  /**
   * Visible ratio (between 0 and 1) that triggers the callback, or a list of ratios
   * @default 0
   */
  threshold?: number | number[]
  /**
   * Stops observing after the first time the element is visible
   * @default false
   */
  once?: boolean
  /**
   * Starts observing right away, else call `resume()`
   * @default true
   */
  immediate?: boolean
}

function useIntersectionObserver(
  target: MaybeRefOrGetter<IntersectionTarget> | MaybeRefOrGetter<IntersectionTarget>[],
  callback?: (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void,
  options?: UseIntersectionObserverOptions,
): {
  isSupported: boolean
  isIntersecting: Readonly<Ref<boolean>>
  entry: Readonly<Ref<IntersectionObserverEntry | undefined>>
  isActive: Readonly<Ref<boolean>>
  pause: () => void
  resume: () => void
  stop: () => void
}
```

<script lang="ts" setup>
import { useIntersectionObserver } from 'maz-ui/composables/useIntersectionObserver'
import { useTemplateRef } from 'vue'

const box = useTemplateRef('box')
const card = useTemplateRef('card')

const { isIntersecting } = useIntersectionObserver(card, undefined, { root: box })
</script>
