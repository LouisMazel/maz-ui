---
title: capitalize
description: The module capitalize is a function that adds a capital letter to a string
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<MazInput v-model="stringValue" />

<div
  class="maz:flex maz:flex-center maz:rounded-md maz:gap-0.5 maz:p-4 maz:mt-16 maz:bg-surface-300"
>
  formatted value: <strong>{{ stringFormatted }}</strong>
</div>

```vue
<script lang="ts" setup>
import { capitalize } from '@maz-ui/utils'
import { computed, ref } from 'vue'

const stringValue = ref('string value')

const stringFormatted = computed(() =>
  capitalize(stringValue.value),
)
</script>

<template>
  <MazInput v-model="stringValue" />

  <div
    class="flex flex-center rounded-md gap-0.5 p-4 mt-16 bg-surface-300"
  >
    {{ stringFormatted }}
  </div>
</template>
```

<script lang="ts" setup>
  import { capitalize } from '@maz-ui/utils'
  import { ref, computed } from 'vue'

  const stringValue = ref('string value')

  const stringFormatted = computed(() =>
    capitalize(stringValue.value),
  )
</script>
