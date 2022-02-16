---
title: capitalize
description: The module capitalize is a function to add a capital letter to a string
---

# capitalize

> The module `capitalize` is a function to add a capital letter to a string

<MazInput v-model="stringValue" />

<div
  style="padding: 16px; margin-top: 16px; background-color: var(--maz-color-bg-lighter);"
  class="flex flex-center rounded gap-05"
>
  formatted value: <strong>{{ stringFormatted }}</strong>
</div>

<script lang="ts" setup>
  import { capitalize } from 'maz-ui'
  import { ref, computed } from 'vue'

  const stringValue = ref('string value')

  const stringFormatted = computed(() =>
    capitalize(stringValue.value),
  )
</script>

```vue
<template>
  <MazInput v-model="stringValue" />

  <div
    style="padding: 16px; margin-top: 16px; background-color: var(--maz-color-bg-lighter);"
  >
    {{ stringFormatted }}
  </div>
</template>

<script lang="ts" setup>
  import { capitalize } from 'maz-ui'
  import { ref, computed } from 'vue'

  const stringValue = ref('string value')

  const stringFormatted = computed(() =>
    capitalize(stringValue.value),
  )
</script>
```