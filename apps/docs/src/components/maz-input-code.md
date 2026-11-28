---
title: MazInputCode
description: This component creates a customizable input code field with features like dynamic code length, alpha character support, and styling based on states (error, success, warning). The code handles input events, keydown actions, and pasting. Overall, it offers a responsive and visually appealing solution for entering verification codes.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

<div class="vp-raw">
<MazInputCode v-model="code" />
</div>

`v-model="{{code}}"`

```vue
<script lang="ts" setup>
import MazInputCode from 'maz-ui/components/MazInputCode'

const code = ref()
</script>

<template>
  <MazInputCode v-model="code" />
</template>
```

## Size

<div class="vp-raw maz:flex maz:flex-col maz:gap-2">
  <MazInputCode v-model="code" size="mini" />
  <MazInputCode v-model="code" size="xs" />
  <MazInputCode v-model="code" size="sm" />
  <MazInputCode v-model="code" size="lg" />
  <MazInputCode v-model="code" size="xl" />
</div>

```html
<MazInputCode v-model="code" size="mini" />
<MazInputCode v-model="code" size="xs" />
<MazInputCode v-model="code" size="sm" />
<MazInputCode v-model="code" size="lg" />
<MazInputCode v-model="code" size="xl" />
```

## Disabled

<div class="vp-raw">
<MazInputCode v-model="code" disabled />
</div>

```html
<MazInputCode v-model="code" disabled />
```

<script lang="ts" setup>
  import { ref } from 'vue'
  const code = ref('123')
  const shakeCode = ref('')
  const shakeError = ref(false)
</script>

## Motion

- Each character rises into place when it is typed, pasted or autofilled.
- When the code is complete, the cells fill one after the other.
- When `error` becomes `true`, the cells shake.

Set `:animated="false"` to turn them off. Reduced motion is respected.

<ComponentDemo>
  <MazInputCode v-model="shakeCode" :error="shakeError" hint="Type 4 digits" @completed="shakeError = shakeCode !== '1234'" />

<template #code>

```html
<MazInputCode v-model="code" :error="hasError" @completed="hasError = code !== '1234'" />
```

  </template>
</ComponentDemo>

<!--@include: ./../../.vitepress/generated-docs/maz-input-code.doc.md-->
