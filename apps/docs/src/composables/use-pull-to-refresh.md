---
title: usePullToRefresh
description: usePullToRefresh is a headless Vue composable for the pull to refresh gesture on the window or any scroll container.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Introduction

`usePullToRefresh` tracks the pull to refresh gesture and gives you its state (distance, progress, ready, refreshing) to build your own indicator. It powers [MazPullToRefresh](./../components/maz-pull-to-refresh.md): use the component for a ready-made indicator, the composable when you need full control over the rendering.

The pull only starts when the target is scrolled to the top, follows a rubber band beyond the threshold, ignores horizontal and multi-touch gestures, and prevents the native bounce while pulling.

## Basic usage

```vue
<script lang="ts" setup>
import { usePullToRefresh } from 'maz-ui/composables'
import { useTemplateRef } from 'vue'

const scroller = useTemplateRef<HTMLElement>('scroller')

const { distance, progress, isReady, isRefreshing } = usePullToRefresh({
  target: scroller,
  onRefresh: () => fetchData(),
})
</script>

<template>
  <div ref="scroller" class="maz:h-screen maz:overflow-y-auto">
    <div class="maz:flex maz:items-end maz:justify-center maz:overflow-hidden" :style="{ height: `${distance}px` }">
      <span v-if="isRefreshing">Refreshing…</span>
      <span v-else-if="isReady">Release to refresh</span>
      <span v-else :style="{ opacity: progress }">Pull to refresh</span>
    </div>

    <p>Content</p>
  </div>
</template>
```

Without `target`, the gesture is tracked on the window.

## Options

| Option        | Type                                         | Default           | Description                                                                          |
| ------------- | -------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------ |
| `onRefresh`   | `() => unknown`                              | -                 | Called on release past the threshold, or by `refresh()`                              |
| `target`      | `MaybeRefOrGetter<HTMLElement \| Window \| null>` | `window`          | Scroll container receiving the gesture                                               |
| `threshold`   | `MaybeRefOrGetter<number>`                   | `80`              | Pull distance (px, after resistance) needed to trigger a refresh                     |
| `maxDistance` | `MaybeRefOrGetter<number>`                   | `threshold * 1.6` | Upper bound of the rubber band                                                       |
| `resistance`  | `MaybeRefOrGetter<number>`                   | `0.5`             | Ratio between the finger movement and the pull distance                              |
| `minDuration` | `MaybeRefOrGetter<number>`                   | `400`             | Minimum duration (ms) of the refreshing state                                        |
| `haptic`      | `MaybeRefOrGetter<boolean>`                  | `true`            | Vibrate briefly when the threshold is reached                                        |
| `disabled`    | `MaybeRefOrGetter<boolean>`                  | `false`           | Disable the gesture                                                                  |
| `onError`     | `(error: unknown) => void`                   | -                 | Called when `onRefresh` throws or rejects (the error is also exposed in `error`)     |

## Return

| Property       | Type                        | Description                                                  |
| -------------- | --------------------------- | ------------------------------------------------------------ |
| `distance`     | `Readonly<Ref<number>>`     | Current pull distance in px                                  |
| `progress`     | `ComputedRef<number>`       | Progress towards the threshold, from 0 to 1                  |
| `isPulling`    | `Readonly<Ref<boolean>>`    | The user is pulling                                          |
| `isReady`      | `ComputedRef<boolean>`      | Releasing now triggers a refresh                             |
| `isRefreshing` | `Readonly<Ref<boolean>>`    | `onRefresh` is running                                       |
| `error`        | `Readonly<Ref<unknown>>`    | Error of the last refresh, reset on each refresh             |
| `refresh`      | `() => Promise<void>`       | Run the refresh programmatically (for a keyboard-usable button) |
| `start`        | `() => void`                | Attach the listeners (done automatically on mount)           |
| `stop`         | `() => void`                | Detach the listeners (done automatically on unmount)         |

## Notes

- Inside a component, listeners are attached on mount and removed when the scope is disposed. Outside of a component, they are attached right away.
- When `target` changes (for example a ref resolved later), the listeners move to the new element.
- `refresh()` never throws: errors go to `error` and `onError`. Calling it while a refresh is running does nothing.
- SSR safe: nothing touches the DOM before mount.
