---
description: MazInputTags is a stand-alone component like free inputs to help user select many values and return an Array of strings, color option available.
---

# MazInputTags

> Before you have to import the global css files in your project, follow instructions in [Getting Started](/maz-ui-3/guide/getting-started.html)

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

tags: {{ tags }}

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

  <br />

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
