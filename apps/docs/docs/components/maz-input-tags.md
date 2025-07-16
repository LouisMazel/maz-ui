---
title: MazInputTags
description: MazInputTags is a standalone component like free inputs to help user select many values and return an Array of strings. Color options are also available.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

<MazInputTags
  v-model="tags"
  placeholder="Enter tags"
  color="info"
/>

**Returned value**

<code>
  tags: {{ tags }}
</code>

```vue
<script lang="ts" setup>
import { MazInputTags } from 'maz-ui/components'
import { ref } from 'vue'

const tags = ref(['tags 1', 'tags 2'])
const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <MazInputTags
    v-model="tags"
    label="Enter tags"
    color="info"
  />
</template>
```

## Sizing

<div class="maz-flex maz-flex-col maz-gap-2">
  <MazInputTags
    v-for="size in sizes"
    :key="size"
    :size="size"
    v-model="tags"
    placeholder="Enter tags"
    color="secondary"
    size="sm"
  />
</div>

```vue
<script lang="ts" setup>
import { MazInputTags } from 'maz-ui/components'
import { ref } from 'vue'

const tags = ref(['tags 1', 'tags 2'])
const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <div class="maz-flex maz-flex-col maz-gap-2">
    <MazInputTags
      v-for="size in sizes"
      :key="size"
      v-model="tags"
      :size="size"
      placeholder="Enter tags"
      color="secondary"
    />
  </div>
</template>
```

<script lang="ts" setup>
  import { ref } from 'vue'

  const tags = ref(['tags 1', 'tags 2'])
  const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
</script>

```vue
<script lang="ts" setup>
import { MazInputTags } from 'maz-ui/components'
import { ref } from 'vue'

const tags = ref(['tags 1', 'tags 2'])
const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
</script>

<template>
  <MazInputTags
    v-model="tags"
    label="Enter tags"
    color="info"
  />

  <MazInputTags
    v-model="tags"
    placeholder="Enter tags"
    color="secondary"
    size="sm"
  />
</template>
```

<!--@include: ./../.vitepress/mixins/maz-input-props.md-->
<!--@include: ./../.vitepress/generated-docs/maz-input-tags.doc.md-->
