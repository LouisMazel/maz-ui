---
title: useReveal
description: Reveal the elements that match a selector when they enter the screen - for the HTML you do not control (markdown, CMS) or static HTML with data-maz-reveal. Scans on mount and after each navigation.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

For your own templates, use [vReveal](../directives/reveal.md) or [MazReveal](../components/maz-reveal.md).

## Usage

Give a selector and the default options. The elements found are revealed, with the effects of [vReveal](../directives/reveal.md#effects).

<ComponentDemo expanded>
  <div class="maz:flex maz:flex-col maz:items-start maz:gap-3">
    <MazBtn size="sm" @click="replay">Replay</MazBtn>
    <div :key="key" ref="content" class="maz:grid maz:w-full maz:gap-3 maz:sm:grid-cols-3">
      <div class="reveal-demo-item maz:rounded-md maz:bg-container maz:p-4 maz:text-sm">First paragraph</div>
      <div class="reveal-demo-item maz:rounded-md maz:bg-container maz:p-4 maz:text-sm">Second paragraph</div>
      <div class="reveal-demo-item maz:rounded-md maz:bg-container maz:p-4 maz:text-sm">Third paragraph</div>
    </div>
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import { useReveal } from 'maz-ui/composables/useReveal'
import { useTemplateRef } from 'vue'

const content = useTemplateRef('content')

useReveal({ selector: '.item', root: content, effect: 'slide-up', stagger: 100 })
</script>

<template>
  <div ref="content" v-html="htmlFromMarkdown" />
</template>
```

  </template>
</ComponentDemo>

Without `root`, the whole document is scanned.

## Static HTML

An element with `data-maz-reveal` is revealed without any option. Its `data-maz-reveal-*` attributes override the options of the composable.

```html
<p data-maz-reveal>Slides up by default</p>
<p data-maz-reveal="blur">With another effect</p>
```

```ts
useReveal()
```

## Scan again

`scan()` reveals the new elements, for a content added after the mount. With `vue-router`, it is called after each navigation. `stop()` shows the elements again and stops the observation.

```ts
const { scan, stop } = useReveal({ selector: '.prose > *' })

watch(html, () => nextTick(scan))
```

## Options

It takes the options of [vReveal](../directives/reveal.md#options) (`effect`, `delay`, `duration`, `once`, `stagger`, `mode`, `threshold`, `blur`), and:

- `selector`: the elements to reveal. Default `'[data-maz-reveal]'`.
- `root`: the element that holds them (a ref or a getter). Default `document`.
- `router`: the router to follow. Found by default when `vue-router` is installed.

## Behavior

- The elements are scanned on mount, then after each navigation. Nothing is done on the server.
- Reduced motion is respected, like the directive.
- The observation stops when the component (or the effect scope) is destroyed.

## Types

```ts
interface UseRevealOptions extends RevealOptions {
  /** @default '[data-maz-reveal]' */
  selector?: string
  /** @default document */
  root?: MaybeRefOrGetter<Element | Document | null | undefined>
  router?: Router
}

function useReveal(options?: UseRevealOptions): {
  /** Reveals the new elements that match the selector */
  scan: () => void
  /** Stops revealing the elements and shows them */
  stop: () => void
}
```

<script lang="ts" setup>
import { useReveal } from 'maz-ui/composables/useReveal'
import { nextTick, ref, useTemplateRef } from 'vue'

const key = ref(0)
const content = useTemplateRef<HTMLElement>('content')

const { scan } = useReveal({ selector: '.reveal-demo-item', root: content, effect: 'slide-up', stagger: 100 })

async function replay() {
  key.value++
  await nextTick()
  scan()
}
</script>
