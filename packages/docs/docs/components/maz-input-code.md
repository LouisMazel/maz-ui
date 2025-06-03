---
title: MazInputCode
description: This component creates a customizable input code field with features like dynamic code length, alpha character support, and styling based on states (error, success, warning). The code handles input events, keydown actions, and pasting. Overall, it offers a responsive and visually appealing solution for entering verification codes.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

<MazInputCode v-model="code" />

`v-model="{{code}}"`

```vue
<template>
  <MazInputCode v-model="code" />
</template>

<script lang="ts" setup>
  import { MazInputCode } from 'maz-ui/components'

  const code = ref()
</script>
```

## Size

<div class="maz-flex maz-flex-col maz-gap-2">
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

<MazInputCode v-model="code" disabled />

```html
<MazInputCode v-model="code" disabled />
```

<script lang="ts" setup>
  import { ref } from 'vue'
  const code = ref('123')
</script>

<!--@include: ./../.vitepress/generated-docs/maz-input-code.doc.md-->
