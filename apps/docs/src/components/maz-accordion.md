---
title: MazAccordion
description: MazAccordion is a standalone component that allows you to create an accordion with a title and content.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

<div class="vp-raw">
<MazAccordion class="maz:w-full">
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
</div>

```vue
<script lang="ts" setup>
import MazAccordion from 'maz-ui/components/MazAccordion'
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

## Lazy content

The content of every panel is rendered even closed. Add `lazy` to render a panel at its first opening only: it is then kept mounted. The default stays unchanged.

```vue
<template>
  <MazAccordion lazy>
    <template #title-1>
      Title 1
    </template>
    <template #content-1>
      <HeavyContent />
    </template>
  </MazAccordion>
</template>
```

<!--@include: ./../../.vitepress/generated-docs/maz-accordion.doc.md-->
