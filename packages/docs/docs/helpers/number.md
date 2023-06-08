---
title: number
description: The module number is a function that formats numbers
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

> This module uses the native api [Intl.NumberFormat](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) from browsers

<MazInput v-model="numberValue" type="number" />

<div
  style="padding: 16px; margin-top: 16px; background-color: var(--maz-color-bg-lighter);"
  class="flex flex-center rounded gap-05"
>
  formatted value: <strong>{{ numberFormatted }}</strong>
</div>

```vue
<template>
  <MazInput v-model="numberValue" type="number" />

  <div
    style="padding: 16px; margin-top: 16px; background-color: var(--maz-color-bg-lighter);"
  >
    {{ numberFormatted }}
  </div>
</template>

<script lang="ts" setup>
  import { number } from 'maz-ui'
  import { ref, computed } from 'vue'

  const numberValue = ref(69)

  const numberFormatted = computed(() =>
    number(numberValue.value, 'en-US'),
  )
</script>
```

## Options

> All options from [Intl.NumberFormat](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) are available

## Default options

```ts
const DEFAULT_OPTIONS: Intl.NumberFormatOptions = {
  minimumFractionDigits: 2,
}
```

<script lang="ts" setup>
  import { number } from 'maz-ui'
  import { ref, computed } from 'vue'

  const numberValue = ref(69)

  const numberFormatted = computed(() =>
    number(numberValue.value, 'en-US'),
  )
</script>
