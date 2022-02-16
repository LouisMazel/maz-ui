---
title: date
description: The module date is a function to format date
---

# date

> The module `date` is a function to format date

> This module use the native api [Intl.DateTimeFormat](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) from browsers

<MazInput v-model="dateValue" type="date" />

<div
  style="padding: 16px; margin-top: 16px; background-color: var(--maz-color-bg-lighter);"
  class="flex flex-center rounded gap-05"
>
  formatted value: <strong>{{ priceFormatted }}</strong>
</div>

<script lang="ts" setup>
  import { date } from 'maz-ui'
  import { ref, computed } from 'vue'

  const dateValue = ref('2022-02-01')

  const priceFormatted = computed(() =>
    date(dateValue.value, 'en-US'),
  )
</script>

```vue
<template>
  <MazInput v-model="dateValue" type="date" />

  <div
    style="padding: 16px; margin-top: 16px; background-color: var(--maz-color-bg-lighter);"
  >
    {{ priceFormatted }}
  </div>
</template>

<script lang="ts" setup>
  import { date } from 'maz-ui'
  import { ref, computed } from 'vue'

  const dateValue = ref('2022-02-01')

  const priceFormatted = computed(() =>
    date(dateValue.value, 'en-US'),
  )
</script>
```

## Options

> All options from [Intl.DateTimeFormat](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) are availables

## Default options

```ts
const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
}
```