---
title: MazAccordion
description: MazAccordion is a standalone component that allows you to create an accordion with a title and content.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

<MazAccordion class="maz-w-full">
  <template #title-1>
    Title 1
  </template>
  <template #content-1>
    Content 1
  </template>
  <template #title-2>
    Title 2
  </template>
  <template #content-2>
    Content 2
  </template>
  <template #title-3>
    Title 3
  </template>
  <template #content-3>
    Content 3
  </template>
  <template #title-4>
    Title 4
  </template>
  <template #content-4>
    Content 4
  </template>
</MazAccordion>

```vue
<script lang="ts" setup>
import { MazAccordion } from 'maz-ui/components'
</script>

<template>
  <MazAccordion>
    <template #title-1>
      Title 1
    </template>
    <template #content-1>
      Content 1
    </template>

    <template #title-2>
      Title 2
    </template>
    <template #content-2>
      Content 2
    </template>

    <template #title-3>
      Title 3
    </template>
    <template #content-3>
      Content 3
    </template>

    <template #title-4>
      Title 4
    </template>
    <template #content-4>
      Content 4
    </template>
    <MazAccordion />
  </mazaccordion>
</template>
```

<!--@include: ./../../.vitepress/generated-docs/maz-accordion.doc.md-->
