---
title: MazBeforeAfter
description: MazBeforeAfter superposes two images and a handle to drag, to compare a before and an after. It works with the mouse, the touch and the keyboard, and follows the reading direction.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Give the `before` and `after` images. Drag the handle, click anywhere on the image, or use the arrow keys when the handle has the focus.

<ComponentDemo expanded>
  <MazBeforeAfter
    before="https://picsum.photos/id/1018/1000/600?grayscale&blur=3"
    after="https://picsum.photos/id/1018/1000/600"
    after-alt="Mountains at sunrise"
    class="maz:max-w-xl"
  />

<template #code>

```vue
<script lang="ts" setup>
import MazBeforeAfter from 'maz-ui/components/MazBeforeAfter'
</script>

<template>
  <MazBeforeAfter
    before="/mountains-before.jpg"
    after="/mountains-after.jpg"
    after-alt="Mountains at sunrise"
    class="max-w-xl"
  />
</template>
```

  </template>
</ComponentDemo>

## Position

Use `v-model` for the position of the handle, in percent from the start (`50` by default). `0` shows only the "after", `100` only the "before".

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-3 maz:max-w-xl">
    <MazBeforeAfter
      v-model="position"
      before="https://picsum.photos/id/1039/1000/600?grayscale&blur=3"
      after="https://picsum.photos/id/1039/1000/600"
    />
    <MazBtn size="sm" @click="position = 50">Reset ({{ Math.round(position) }}%)</MazBtn>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import MazBeforeAfter from 'maz-ui/components/MazBeforeAfter'
import { ref } from 'vue'

const position = ref(50)
</script>

<template>
  <MazBeforeAfter v-model="position" before="/before.jpg" after="/after.jpg" />
</template>
```

  </template>
</ComponentDemo>

<script lang="ts" setup>
import { ref } from 'vue'

const position = ref(50)
</script>

## Orientation and labels

`orientation="vertical"` moves a horizontal handle up and down. The labels default to "Before" and "After": change them with `before-label` and `after-label`, or hide them with `:before-label="false"`.

<ComponentDemo>
  <MazBeforeAfter
    orientation="vertical"
    before="https://picsum.photos/id/1043/1000/600?grayscale&blur=3"
    after="https://picsum.photos/id/1043/1000/600"
    before-label="Draft"
    after-label="Final"
    class="maz:max-w-xl"
  />

<template #code>

```vue
<template>
  <MazBeforeAfter
    orientation="vertical"
    before="/before.jpg"
    after="/after.jpg"
    before-label="Draft"
    after-label="Final"
  />
</template>
```

  </template>
</ComponentDemo>

## Slots

Use the `before` and `after` slots for anything that is not an image. Without images, the size comes from `aspect-ratio`.

```vue
<template>
  <MazBeforeAfter aspect-ratio="16 / 9">
    <template #before>
      <pre class="size-full bg-surface-600 p-4">old code</pre>
    </template>
    <template #after>
      <pre class="size-full bg-primary p-4">new code</pre>
    </template>
  </MazBeforeAfter>
</template>
```

## Accessibility and motion

- The handle is a `slider` (focusable) with `aria-valuenow` and an `aria-valuetext` like "Before 70%, After 30%".
- Arrows move by `step` (2 by default), `PageUp` and `PageDown` by ten times more, `Home` and `End` to the limits. In a right-to-left context, the horizontal arrows are mirrored.
- Give a useful `before-alt` and `after-alt`, or leave them empty for decorative images.
- The handle swings once when the component first becomes visible, to show that it moves. Set `:hint="false"` to remove it. It is off when the user reduces motion.

<!--@include: ./../../.vitepress/generated-docs/maz-before-after.doc.md-->
