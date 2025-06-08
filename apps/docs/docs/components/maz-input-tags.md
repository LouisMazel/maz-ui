---
title: MazInputTags
description: MazInputTags is a standalone component like free inputs to help user select many values and return an Array of strings. Color options are also available.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

<!--@include: ./../.vitepress/mixins/maz-input-props.md-->

## Basic usage

<MazInputTags
  v-model="tags"
  placeholder="Enter tags"
  color="info"
/>

**Value returned**

<code>
  tags: {{ tags }}
</code>

```vue
<template>
  <MazInputTags
    v-model="tags"
    label="Enter tags"
    color="info"
  />
</template>


<script lang="ts" setup>
  import { ref } from 'vue'
  import { MazInputTags } from 'maz-ui/components'

  const tags = ref(['tags 1', 'tags 2'])
  const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
</script>
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
<template>
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
</template>


<script lang="ts" setup>
  import { ref } from 'vue'
  import { MazInputTags } from 'maz-ui/components'

  const tags = ref(['tags 1', 'tags 2'])
  const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
</script>
```

<script lang="ts" setup>
  import { ref } from 'vue'

  const tags = ref(['tags 1', 'tags 2'])
  const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
</script>

```vue
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


<script lang="ts" setup>
  import { ref } from 'vue'
  import { MazInputTags } from 'maz-ui/components'

  const tags = ref(['tags 1', 'tags 2'])
  const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']
</script>
```

<!--@include: ./../.vitepress/generated-docs/maz-input-tags.doc.md-->