---
title: date
description: The module date is a function that formats date
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

> This module use the native api [Intl.DateTimeFormat](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) from browsers

<MazInput v-model="dateValue" type="date" />

<div
  style="padding: 16px; margin-top: 16px; background-color: hsl(var(--maz-background-300));"
  class="flex flex-center rounded gap-05"
>
  formatted value: <strong>{{ dateFormatted }}</strong>
</div>

```vue
<template>
  <MazInput v-model="dateValue" type="date" />

  <div
    style="padding: 16px; margin-top: 16px; background-color: hsl(var(--maz-background-300));"
  >
    {{ dateFormatted }}
  </div>
</template>

<script lang="ts" setup>
  import { date } from 'maz-ui'
  import { ref, computed } from 'vue'

  const dateValue = ref('2022-02-01')

  const dateFormatted = computed(() =>
    dateValue.value ? date(dateValue.value, 'en-US') : undefined,
  )
</script>
```

## Options

> All options from [Intl.DateTimeFormat](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) are available

## Default options

```ts
const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
}
```

<script lang="ts" setup>
  import { date } from 'maz-ui'
  import { ref, computed } from 'vue'

  const dateValue = ref('2022-02-01')

  const dateFormatted = computed(() =>
    dateValue.value ? date(dateValue.value, 'en-US') : undefined,
  )
</script>
