---
title: MazPagination
description: MazPagination lets users navigate between the pages of a list or a table, with first, previous, next and last buttons and the current page in v-model
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

<!--@include: ./../../.vitepress/mixins/translated-component.md-->

## Basic usage

<div class="vp-raw">
<MazPagination v-bind="props" v-model="currentPage" size="md" />
</div>

`v-model="{{currentPage}}"`

```vue
<script lang="ts" setup>
import { MazPagination, type MazPaginationProps } from 'maz-ui/components'

import { ref } from 'vue'

const currentPage = ref(1)

const props: MazPaginationProps = {
  totalPages: 10,
  activeColor: 'contrast',
}
</script>

<template>
  <MazPagination v-bind="props" v-model="currentPage" size="md" />
</template>
```

## Sizes

<div class="vp-raw maz:flex maz:flex-col maz:gap-4">
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

The page buttons use the neutral `container` color by default (see `color`) and the active page uses `activeColor` (`contrast` by default, `neutral` is also available).

<div class="vp-raw maz:flex maz:flex-col maz:gap-4">
  <MazPagination :total-pages="10" v-model="currentPage" active-color="primary" />
  <MazPagination :total-pages="10" v-model="currentPage" active-color="secondary" />
  <MazPagination :total-pages="10" v-model="currentPage" active-color="success" />
  <MazPagination :total-pages="10" v-model="currentPage" active-color="warning" />
  <MazPagination :total-pages="10" v-model="currentPage" active-color="destructive" />
</div>

## Motion

- A pill slides from a page to the current one, and the numbers that change roll.
- `fixed-slots` always renders the same number of buttons (the first and the last page, two ellipses and the pages around the current one): the pagination keeps its width on every page. Try it from the first page to the last one.
- `:animated="false"` removes the pill and the rolling numbers. Reduced motion does too.
- The pill replaces the background of the current page when the buttons are solid. The `soft`, `ghost` and `pastel` buttons keep their own background.
- Only one button is in the tab sequence. <kbd>←</kbd> / <kbd>→</kbd> (reversed in RTL), <kbd>Home</kbd> and <kbd>End</kbd> move between the enabled buttons, the focus ring shows on keyboard focus only.

<div class="vp-raw maz:flex maz:flex-col maz:gap-4">
  <MazPagination :total-pages="40" v-model="fixedPage" fixed-slots :page-range="1" />
</div>

```html
<MazPagination v-model="page" :total-pages="40" fixed-slots />
```

<script lang="ts" setup>
  import type { MazPaginationProps } from 'maz-ui/components'
  import { ref } from 'vue'

  const currentPage = ref(1)
  const fixedPage = ref(1)

  const props: Props = {
    totalPages: 10,
    activeColor: 'contrast',
  }
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-pagination.doc.md-->
