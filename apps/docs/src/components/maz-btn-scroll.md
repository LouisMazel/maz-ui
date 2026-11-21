---
title: MazBtnScroll
description: MazBtnScroll is a floating button that brings the page (or a scrollable element) back to the top, or down to the bottom. It appears after some scroll and can show the reading progress around it.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Put it once in your layout. It appears after 400px of scroll, at the bottom end of the screen.

::: tip
Scroll down this page: the button of this page is at the bottom right.
:::

<MazBtnScroll />

```vue
<script lang="ts" setup>
import MazBtnScroll from 'maz-ui/components/MazBtnScroll'
</script>

<template>
  <MazBtnScroll />
</template>
```

## Threshold and position

- `threshold`: the scrolled distance in pixels after which the button appears (`400` by default). With `to="bottom"`, the distance from the end.
- `position`: `bottom-end` (default, the right in LTR), `bottom-start` or `bottom-center`.
- `offset`: the distance from the edges of the screen (or of the parent, with a `target` element), any CSS length (`1.5rem` by default).

```vue
<template>
  <MazBtnScroll :threshold="800" position="bottom-center" offset="2rem" />
</template>
```

## Progress

A ring around the button shows the scroll progress. `progress-color` sets its color: `primary` (default), `secondary`, `accent`, `info`, `success`, `warning`, `destructive` or `contrast`. `:progress="false"` removes it.

```vue
<template>
  <MazBtnScroll progress-color="success" />

  <!-- Without the ring -->
  <MazBtnScroll :progress="false" />
</template>
```

## In a scrollable element

Pass the element to watch with `target`. The button is then placed in its nearest positioned parent, not on the screen: wrap the element in a `relative` container and put the button next to it.

<ComponentDemo>
  <div class="maz:relative">
    <div ref="box" class="maz:h-64 maz:overflow-auto maz:rounded-md maz:border maz:border-divider maz:p-4">
      <p v-for="n in 30" :key="n" class="maz:py-1 maz:text-sm">Line {{ n }}</p>
    </div>
    <MazBtnScroll v-if="box" :target="box" :threshold="100" offset="1rem" color="primary" size="sm" />
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import MazBtnScroll from 'maz-ui/components/MazBtnScroll'
import { useTemplateRef } from 'vue'

const box = useTemplateRef('box')
</script>

<template>
  <div class="relative">
    <div ref="box" class="h-64 overflow-auto">
      <p v-for="n in 30" :key="n">
        Line {{ n }}
      </p>
    </div>

    <MazBtnScroll v-if="box" :target="box" :threshold="100" offset="1rem" color="primary" size="sm" />
  </div>
</template>
```

  </template>
</ComponentDemo>

## Scroll to the bottom

`to="bottom"` turns the button into a "scroll to bottom", for a chat, logs or a terminal output. It appears when the element is more than `threshold` pixels from its end, with an arrow down and a translated "Scroll to bottom" label.

<ComponentDemo>
  <div class="maz:relative">
    <div ref="chat" class="maz:h-64 maz:overflow-auto maz:rounded-md maz:border maz:border-divider maz:p-4">
      <p v-for="n in 30" :key="n" class="maz:py-1 maz:text-sm">Message {{ n }}</p>
    </div>
    <MazBtnScroll v-if="chat" :target="chat" to="bottom" :threshold="100" offset="1rem" size="sm" color="surface" />
  </div>

  <template #code>

```vue
<template>
  <div class="relative">
    <div ref="chat" class="h-64 overflow-auto">
      <p v-for="n in 30" :key="n">
        Message {{ n }}
      </p>
    </div>

    <MazBtnScroll v-if="chat" :target="chat" to="bottom" :threshold="100" offset="1rem" size="sm" color="surface" />
  </div>
</template>
```

  </template>
</ComponentDemo>

## Show it yourself

`visible` shows or hides the button yourself, instead of the `threshold`. To scroll yourself too, call `event.preventDefault()` in the `click` handler. MazCodeHighlight does both, to show its "scroll to bottom" button only once the user scrolled up.

```vue
<script lang="ts" setup>
import MazBtnScroll from 'maz-ui/components/MazBtnScroll'
import { ref, useTemplateRef } from 'vue'

const list = useTemplateRef('list')
const hasUnread = ref(false)

function readLast(event: MouseEvent) {
  event.preventDefault()
  list.value?.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
  hasUnread.value = false
}
</script>

<template>
  <div class="relative">
    <ul ref="list" class="h-64 overflow-auto">
      <!-- ... -->
    </ul>

    <MazBtnScroll v-if="list" :target="list" to="bottom" :visible="hasUnread" @click="readLast" />
  </div>
</template>
```

## Style

The button is a fab [MazBtn](./maz-btn.md): `color` (`contrast` by default), `size` (`md`), `rounded-size` (`full`) and `icon` (`arrow-up`, `arrow-down` with `to="bottom"`) follow its values.

```vue
<template>
  <MazBtnScroll color="primary" size="lg" rounded-size="lg" icon="chevron-up" />
</template>
```

`bordered` adds a border of the divider color, for a button on a background of its own color (a `surface` button on the page).

`behavior` sets the scroll: `smooth` (default), `instant` or `auto`.

## Defaults for the whole app

```ts
app.use(MazUi, {
  defaults: {
    MazBtnScroll: { size: 'sm', roundedSize: 'full' },
  },
})
```

## Accessibility

- The button has a translated label ("Back to top", or "Scroll to bottom" with `to="bottom"`). Change it with `label`, and add the `v-tooltip` directive for a tooltip.
- It is a native `button`: it works with the keyboard.

## Build your own

For another element that reacts to the scroll (a header that hides while scrolling down, a "scroll to the end" button), use the [useScroll](./../composables/use-scroll.md) composable.

<script lang="ts" setup>
import { ref } from 'vue'

const box = ref<HTMLElement>()
const chat = ref<HTMLElement>()
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-btn-scroll.doc.md-->
