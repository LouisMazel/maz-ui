---
title: MazAnimatedCounter
description: MazAnimatedCounter is a standalone component that allows you to animate a number from 0 to a specific value. Fully animated with CSS.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

<ComponentDemo expanded>
  <MazAnimatedCounter :count="count" />

<template #code>

```vue
<script lang="ts" setup>
import { MazAnimatedCounter } from 'maz-ui/components'

const count = ref(Math.floor(Math.random() * 99999))

onMounted(() => {
  setInterval(() => {
    count.value = Math.floor(Math.random() * 99999)
  }, 3000)
})
</script>

<template>
  <MazAnimatedCounter :count="4000" />
</template>
```

  </template>
</ComponentDemo>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  const count = ref(Math.floor(Math.random() * 99999))

  onMounted(() => {
    setInterval(() => {
      count.value = Math.floor(Math.random() * 99999)
    }, 3000)
  })
</script>

## duration

You can set the duration of the animation with the `duration` prop. The default value is `1000` ms.

<ComponentDemo>
  <MazAnimatedCounter :count="4000" :duration="5000" />

<template #code>

```vue
<MazAnimatedCounter :count="4000" :duration="5000" />
```

  </template>
</ComponentDemo>

## prefix and suffix

You can add a prefix and a suffix to the number with props or slots.

Be careful, you can't use both at the same time.

<ComponentDemo>
  <p class="maz-font-semibold">
    Prefixed
  </p>

  <br />

  <MazAnimatedCounter :count="20" prefix="$" />
  <br />
  <MazAnimatedCounter :count="20">
    <template #prefix>$</template>
  </MazAnimatedCounter>

  <br />
  <br />

  <p class="maz-font-semibold">
    Suffixed
  </p>

  <br />
  <MazAnimatedCounter :count="100" suffix="%" />
  <br />

  <MazAnimatedCounter :count="100">
    <template #suffix>%</template>
  </MazAnimatedCounter>

<template #code>

```html
<p class="maz-font-semibold">Prefixed</p>

<MazAnimatedCounter :count="20" prefix="$" />

<MazAnimatedCounter :count="20">
  <template #prefix>$</template>
</MazAnimatedCounter>

<p class="maz-font-semibold">Suffixed</p>

<MazAnimatedCounter :count="100" suffix="%" />

<MazAnimatedCounter :count="100">
  <template #suffix>%</template>
</MazAnimatedCounter>
```

  </template>
</ComponentDemo>

<!--@include: ./../.vitepress/generated-docs/maz-animated-counter.doc.md-->
