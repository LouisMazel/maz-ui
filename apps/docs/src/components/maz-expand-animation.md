---
title: MazExpandAnimation
description: MazExpandAnimation is a standalone component that allows you to animate the height of a block element
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

<ComponentDemo>
  <MazBtn @click="visible = !visible"> Exec animation </MazBtn>

  <br />

  <MazExpandAnimation v-model="visible">
    <div class="maz-pt-4">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </div>
  </MazExpandAnimation>

<template #code>

```vue
<script lang="ts" setup>
import MazExpandAnimation from 'maz-ui/components/MazExpandAnimation'
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <MazBtn @click="visible = !visible">
    Exec animation
  </MazBtn>

  <MazExpandAnimation v-model="visible">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </MazExpandAnimation>
</template>
```

  </template>
</ComponentDemo>

## Options

- **duration**: `String` - default: `300ms` - Duration of the animation in ms
- **timing-function**: `String` - default: `ease-in-out` - Timing function of the animation

<ComponentDemo>
  <MazBtn @click="visible2 = !visible2"> Exec animation </MazBtn>

  <br />

  <MazExpandAnimation v-model="visible2" duration="1000ms" timing-function="linear">
    <div class="maz-pt-4">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </div>
  </MazExpandAnimation>

<template #code>

```vue
<script lang="ts" setup>
import MazExpandAnimation from 'maz-ui/components/MazExpandAnimation'
import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <MazBtn @click="visible = !visible">
    Exec animation
  </MazBtn>

  <MazExpandAnimation v-model="visible" duration="1000ms" timing-function="linear">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </MazExpandAnimation>
</template>
```

  </template>
</ComponentDemo>

<script setup lang="ts">
  import { ref } from 'vue'
  const visible = ref(false)
  const visible2 = ref(false)
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-expand-animation.doc.md-->
