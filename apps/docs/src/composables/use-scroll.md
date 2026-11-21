---
title: useScroll
description: Scroll position, direction and edges of the page or of a scrollable element - show a button after some pixels, hide a header while scrolling down, know when the end of a list is reached.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

Scroll the box below: the values follow.

<ComponentDemo expanded>
  <div class="maz:grid maz:gap-4 maz:tab-m:grid-cols-2">
    <div ref="box" class="maz:h-64 maz:overflow-auto maz:rounded-md maz:border maz:border-divider maz:bg-container">
      <div class="maz:flex maz:flex-col maz:gap-2 maz:p-4">
        <div v-for="item in 30" :key="item" class="maz:rounded-sm maz:bg-surface maz:px-3 maz:py-2">
          Row {{ item }}
        </div>
      </div>
    </div>
    <div class="maz:flex maz:flex-col maz:gap-2 maz:text-sm">
      <div>y: <strong>{{ Math.round(y) }}px</strong></div>
      <div>isScrolling: <MazBadge :color="isScrolling ? 'success' : 'container'" size="sm">{{ isScrolling }}</MazBadge></div>
      <div>direction: <MazBadge color="info" size="sm">{{ directions.bottom ? 'down' : directions.top ? 'up' : 'none' }}</MazBadge></div>
      <div>arrivedState.top: <MazBadge :color="arrivedState.top ? 'primary' : 'container'" size="sm">{{ arrivedState.top }}</MazBadge></div>
      <div>arrivedState.bottom: <MazBadge :color="arrivedState.bottom ? 'primary' : 'container'" size="sm">{{ arrivedState.bottom }}</MazBadge></div>
      <div class="maz:flex maz:gap-2 maz:pt-2">
        <MazBtn size="sm" color="contrast" @click="scrollToTop()">Top</MazBtn>
        <MazBtn size="sm" color="contrast" @click="scrollToBottom()">Bottom</MazBtn>
      </div>
    </div>
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import { useScroll } from 'maz-ui/composables/useScroll'
import { useTemplateRef } from 'vue'

const box = useTemplateRef('box')

const { y, isScrolling, directions, arrivedState, scrollToTop, scrollToBottom } = useScroll(box)
</script>

<template>
  <div ref="box" class="h-64 overflow-auto">
    <!-- long content -->
  </div>

  <p>y: {{ y }}px</p>
  <p>Scrolling down: {{ directions.bottom }}</p>
  <p>At the bottom: {{ arrivedState.bottom }}</p>

  <MazBtn @click="scrollToTop()">
    Top
  </MazBtn>
  <MazBtn @click="scrollToBottom()">
    Bottom
  </MazBtn>
</template>
```

  </template>
</ComponentDemo>

## Scroll of the page

Without a target, `useScroll` follows the page.

```ts
import { useScroll } from 'maz-ui/composables/useScroll'
import { computed } from 'vue'

const { y, directions } = useScroll()

// Hide the header while scrolling down
const isHeaderHidden = computed(() => y.value > 80 && directions.bottom)
```

::: tip Back to top
For a "back to top" or "scroll to bottom" button, use [MazBtnScroll](./../components/maz-btn-scroll.md): it is built on `useScroll`.
:::

## Reach an edge

`offset` makes `arrivedState` true a bit before the edge. Give one number for every edge, or one per edge.

```ts
const { arrivedState } = useScroll(list, { offset: { bottom: 100 } })

watch(() => arrivedState.bottom, (isAtBottom) => {
  if (isAtBottom)
    loadMore()
})
```

To load the next page of a list, [useInfiniteScroll](./use-infinite-scroll.md) does it for you.

## Callbacks

```ts
useScroll(undefined, {
  onScroll: event => console.log('scroll', event),
  onStop: () => console.log('the scroll stopped'),
  idle: 300,
})
```

## Behavior

- The target is a ref, a getter, an element, a component, `window` or `document`. The page is the default.
- The values update at most once per frame (`requestAnimationFrame`), with a passive listener.
- `isScrolling` and `directions` go back to `false` after `idle` ms (200 by default) without scroll. `onStop` is called then.
- `scrollTo`, `scrollToTop` and `scrollToBottom` are smooth by default. Pass `'instant'` to jump.
- `measure()` reads the position again, after a change of the content.
- The listener is removed when the component is unmounted, or with `stop()`. On the server, nothing is listened.

## Types

```ts
type ScrollTarget = HTMLElement | Window | Document | ComponentPublicInstance | undefined | null

interface ScrollEdges {
  top: boolean
  bottom: boolean
  left: boolean
  right: boolean
}

interface UseScrollOptions {
  /**
   * Distance in pixels from an edge at which `arrivedState` is already `true`
   * @default 0
   */
  offset?: number | Partial<Record<keyof ScrollEdges, number>>
  /**
   * Time in milliseconds without scroll after which `isScrolling` goes back to `false`
   * @default 200
   */
  idle?: number
  /** Called on each scroll, at most once per frame */
  onScroll?: (event: Event) => void
  /** Called when the scroll stops, after `idle` */
  onStop?: () => void
}

function useScroll(target?: MaybeRefOrGetter<ScrollTarget>, options?: UseScrollOptions): {
  x: Readonly<Ref<number>>
  y: Readonly<Ref<number>>
  isScrolling: Readonly<Ref<boolean>>
  arrivedState: Readonly<ScrollEdges>
  directions: Readonly<ScrollEdges>
  measure: () => void
  scrollTo: (options: { top?: number, left?: number, behavior?: ScrollBehavior }) => void
  scrollToTop: (behavior?: ScrollBehavior) => void
  scrollToBottom: (behavior?: ScrollBehavior) => void
  stop: () => void
}
```

<script lang="ts" setup>
import { useScroll } from 'maz-ui/composables/useScroll'
import { useTemplateRef } from 'vue'

const box = useTemplateRef('box')

const { y, isScrolling, directions, arrivedState, scrollToTop, scrollToBottom } = useScroll(box)
</script>
