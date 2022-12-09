---
title: MazInputTags
description: MazInputTags is a standalone component like free inputs to help user select many values and return an Array of strings, color option available.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../mixins/getting-started.md-->

<!--@include: ./../mixins/maz-input-props.md-->

## Basic usage

<MazInputTags
  v-model="tags"
  label="Enter tags"
  color="info"
/>

<br />

<MazInputTags
  v-model="tags"
  placeholder="Enter tags"
  color="secondary"
  size="sm"
/>

**Value returned**

<code>
  tags: {{ tags }}
</code>

<br />
<br />

<script lang="ts" setup>
  import { ref } from 'vue'

  const tags = ref(['tags 1', 'tags 2'])
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
  import MazInputTags from 'maz-ui/components/MazInputTags'

  const tags = ref(['tags 1', 'tags 2'])
</script>
```

## Props, Events emitted

<ComponentPropDoc component="MazInputTags" />
