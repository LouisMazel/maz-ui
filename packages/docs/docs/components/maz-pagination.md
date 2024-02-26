---
title: MazPagination
description: MazPagination is a standalone component
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

<MazPagination v-bind="props" v-model="currentPage" size="md" />

```v-model="{{currentPage}}"```

```vue
<template>
  <MazPagination v-bind="props" v-model="currentPage" size="md" />
</template>

<script lang="ts" setup>
  import MazPagination, { type Props } from 'maz-ui/components/MazPagination'

  import { ref } from 'vue'

  const currentPage = ref(1)

  const props: Props = {
    resultsSize: 100,
    totalPages: 10,
    activeColor: 'primary',
  }
</script>
```

## Sizes

<div class="maz-flex maz-flex-col maz-gap-4">
  <MazPagination v-bind="props" v-model="currentPage" size="xs" />
  <MazPagination v-bind="props" v-model="currentPage" size="sm" />
  <MazPagination v-bind="props" v-model="currentPage" size="md" />
  <MazPagination v-bind="props" v-model="currentPage" size="lg" />
  <MazPagination v-bind="props" v-model="currentPage" size="xl" />
</div>

```html
<MazPagination v-bind="props" v-model="currentPage" size="xs" />
<MazPagination v-bind="props" v-model="currentPage" size="sm" />
<MazPagination v-bind="props" v-model="currentPage" size="md" />
<MazPagination v-bind="props" v-model="currentPage" size="lg" />
<MazPagination v-bind="props" v-model="currentPage" size="xl" />
```

## Colors

<div class="maz-flex maz-flex-col maz-gap-4">
  <MazPagination :total-pages="10" v-model="currentPage" active-color="primary" />
  <MazPagination :total-pages="10" v-model="currentPage" active-color="secondary" />
  <MazPagination :total-pages="10" v-model="currentPage" active-color="success" />
  <MazPagination :total-pages="10" v-model="currentPage" active-color="warning" />
  <MazPagination :total-pages="10" v-model="currentPage" active-color="danger" />
</div>

<script lang="ts" setup>
  import type { Props } from 'maz-ui/components/MazPagination'
  import { ref } from 'vue'

  const currentPage = ref(1)

  const props: Props = {
    resultsSize: 100,
    totalPages: 10,
    activeColor: 'primary',
  }
</script>

<!--@include: ./../.vitepress/generated-docs/maz-pagination.doc.md-->
