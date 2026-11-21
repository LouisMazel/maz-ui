---
title: useResizeObserver
description: Know when the size of one or several elements changes - a chart that fits its box, a sliding indicator, a text that truncates.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

Drag the bottom right corner of the box: its size updates.

<ComponentDemo expanded>
  <div
    ref="box"
    class="maz:flex maz:h-32 maz:w-64 maz:max-w-full maz:min-w-32 maz:min-h-16 maz:resize maz:items-center maz:justify-center maz:overflow-auto maz:rounded-md maz:border maz:border-divider maz:bg-container maz:text-sm"
  >
    {{ Math.round(width) }} x {{ Math.round(height) }}
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import { useResizeObserver } from 'maz-ui/composables/useResizeObserver'
import { useTemplateRef } from 'vue'

const box = useTemplateRef('box')

const { width, height } = useResizeObserver(box)
</script>

<template>
  <div ref="box" class="resize overflow-auto">
    {{ Math.round(width) }} x {{ Math.round(height) }}
  </div>
</template>
```

  </template>
</ComponentDemo>

`width` and `height` are the size of the first target, in pixels.

## Callback

The callback runs on each change, with the entries of the observer.

```ts
import { useResizeObserver } from 'maz-ui/composables/useResizeObserver'

useResizeObserver(container, () => {
  chart.resize()
})
```

## Options

- `box`: the box that is measured. `'content-box'` (default, without padding nor border), `'border-box'` or `'device-pixel-content-box'`.
- `immediate`: `false` to start later with `resume()`.

```ts
const { width } = useResizeObserver(card, undefined, { box: 'border-box' })
```

## Several elements

Pass an array: the callback runs for each of them, `width` and `height` follow the first one.

```ts
useResizeObserver([header, footer], entries => updateLayout(entries))
```

## Pause and stop

```ts
const { pause, resume, stop, isActive } = useResizeObserver(target)

pause() // stops observing, resume() starts again
stop() // stops for good
```

## Behavior

- The targets are refs, getters, elements or components. The observer follows their changes.
- `isSupported` is `false` on the server or without `ResizeObserver`: nothing is observed and the size stays `0`.
- The observer is disconnected when the component is unmounted.

::: tip
For the size of the window or the breakpoint, use [useWindowSize](./use-window-size.md) or [useBreakpoints](./use-breakpoints.md).
:::

## Types

```ts
type ResizeTarget = Element | ComponentPublicInstance | undefined | null

interface UseResizeObserverOptions {
  /**
   * Box measured by the observer and by `width` and `height`
   * @default 'content-box'
   */
  box?: ResizeObserverBoxOptions
  /**
   * Starts observing right away, else call `resume()`
   * @default true
   */
  immediate?: boolean
}

function useResizeObserver(
  target: MaybeRefOrGetter<ResizeTarget> | MaybeRefOrGetter<ResizeTarget>[],
  callback?: (entries: ResizeObserverEntry[], observer: ResizeObserver) => void,
  options?: UseResizeObserverOptions,
): {
  isSupported: boolean
  width: Readonly<Ref<number>>
  height: Readonly<Ref<number>>
  entry: Readonly<Ref<ResizeObserverEntry | undefined>>
  isActive: Readonly<Ref<boolean>>
  pause: () => void
  resume: () => void
  stop: () => void
}
```

<script lang="ts" setup>
import { useResizeObserver } from 'maz-ui/composables/useResizeObserver'
import { useTemplateRef } from 'vue'

const box = useTemplateRef('box')

const { width, height } = useResizeObserver(box)
</script>
