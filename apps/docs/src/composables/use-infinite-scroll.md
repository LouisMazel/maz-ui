---
title: useInfiniteScroll
description: Load the next page of a list when its end gets close - put a sentinel element after the last item, and the next page loads before the user reaches it.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

Scroll the list: 20 more items load before the end, up to 100.

<ComponentDemo expanded>
  <div ref="list" class="maz:h-72 maz:overflow-auto maz:rounded-md maz:border maz:border-divider maz:bg-container">
    <div class="maz:flex maz:flex-col maz:gap-2 maz:p-4">
      <div v-for="item in items" :key="item" class="maz:rounded-sm maz:bg-surface maz:px-3 maz:py-2">
        Item {{ item }}
      </div>
      <div ref="sentinel" class="maz:flex maz:flex-center maz:gap-2 maz:py-3 maz:text-sm maz:text-muted">
        <template v-if="isLoading">
          <MazSpinner size="1.25em" /> Loading...
        </template>
        <template v-else-if="isFinished">
          All {{ items.length }} items are loaded
        </template>
      </div>
    </div>
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import { sleep } from '@maz-ui/utils/helpers/sleep'
import MazSpinner from 'maz-ui/components/MazSpinner'
import { useInfiniteScroll } from 'maz-ui/composables/useInfiniteScroll'
import { ref, useTemplateRef } from 'vue'

const list = useTemplateRef('list')
const sentinel = useTemplateRef('sentinel')
const items = ref(Array.from({ length: 20 }, (_, index) => index + 1))

async function loadMore() {
  await sleep(800) // an API call
  const start = items.value.length
  items.value.push(...Array.from({ length: 20 }, (_, index) => start + index + 1))
}

const { isLoading, isFinished } = useInfiniteScroll(sentinel, loadMore, {
  root: list,
  canLoadMore: () => items.value.length < 100,
})
</script>

<template>
  <div ref="list" class="h-72 overflow-auto">
    <div v-for="item in items" :key="item">
      Item {{ item }}
    </div>

    <div ref="sentinel">
      <template v-if="isLoading">
        <MazSpinner /> Loading...
      </template>
      <template v-else-if="isFinished">
        All the items are loaded
      </template>
    </div>
  </div>
</template>
```

  </template>
</ComponentDemo>

## A list in the page

When the page scrolls (not a box), omit `root`.

```ts
const sentinel = useTemplateRef('sentinel')

const { isLoading, isFinished } = useInfiniteScroll(sentinel, fetchNextPage, {
  canLoadMore: () => hasNextPage.value,
})
```

## Options

- `distance`: pixels before the end at which the next page loads. 200 by default.
- `direction`: `'horizontal'` for a carousel or a row of cards. `'vertical'` by default.
- `canLoadMore`: returns `false` when every page is loaded. Nothing loads anymore and `isFinished` is `true`.
- `root`: the scrollable element of the list, when it is not the page.

## Errors

A failed `loadMore` stores its error in `error` and stops loading: the list does not retry in a loop.

```vue
<template>
  <div ref="sentinel">
    <MazBtn v-if="error" size="sm" @click="load()">
      Retry
    </MazBtn>
  </div>
</template>
```

## New search

After a new search or a new filter, empty the list and call `reset()`: `isFinished` and `error` are cleared, and the first page loads if the sentinel is visible.

```ts
watch(query, () => {
  items.value = []
  reset()
})
```

## Behavior

- `loadMore` is never called twice at once.
- After a load, the next page loads again while the sentinel stays visible: a first page shorter than the screen fills it.
- `load()` loads the next page now, `stop()` stops observing. The observer stops when the component is unmounted.
- It is built on [useIntersectionObserver](./use-intersection-observer.md).

## Types

```ts
interface UseInfiniteScrollOptions {
  /**
   * Distance in pixels before the end of the list at which the next page is loaded
   * @default 200
   */
  distance?: number
  /**
   * Direction of the list
   * @default 'vertical'
   */
  direction?: 'vertical' | 'horizontal'
  /** Returns `false` when every page is loaded */
  canLoadMore?: () => boolean
  /** Scrollable element of the list, when the list scrolls inside it instead of the page */
  root?: MaybeRefOrGetter<IntersectionTarget | Document>
}

function useInfiniteScroll(
  sentinel: MaybeRefOrGetter<IntersectionTarget>,
  loadMore: () => unknown,
  options?: UseInfiniteScrollOptions,
): {
  isLoading: Readonly<Ref<boolean>>
  isFinished: Readonly<Ref<boolean>>
  error: Readonly<Ref<unknown>>
  load: () => Promise<void>
  reset: () => void
  stop: () => void
}
```

<script lang="ts" setup>
import { sleep } from '@maz-ui/utils/helpers/sleep'
import { useInfiniteScroll } from 'maz-ui/composables/useInfiniteScroll'
import { ref, useTemplateRef } from 'vue'

const list = useTemplateRef('list')
const sentinel = useTemplateRef('sentinel')
const items = ref(Array.from({ length: 20 }, (_, index) => index + 1))

async function loadMore() {
  await sleep(800)
  const start = items.value.length
  items.value.push(...Array.from({ length: 20 }, (_, index) => start + index + 1))
}

const { isLoading, isFinished } = useInfiniteScroll(sentinel, loadMore, {
  root: list,
  canLoadMore: () => items.value.length < 100,
})
</script>
