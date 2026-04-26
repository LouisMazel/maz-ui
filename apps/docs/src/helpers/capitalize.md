---
title: capitalize
description: The module capitalize is a function that adds a capital letter to a string
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<MazInput v-model="stringValue" />

<div
  style="padding: 16px; margin-top: 16px; background-color: var(--maz-background-300);"
  class="flex flex-center rounded gap-05"
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
    style="padding: 16px; margin-top: 16px; background-color: var(--maz-background-300);"
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
