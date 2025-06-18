---
title: formatCurrency
description: The module formatCurrency is a function that formats numbers to currency with the native api [Intl.NumberFormat](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) from browsers and Node.js
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: tip
This module uses the native api [Intl.NumberFormat](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) from browsers
:::

Enter only numbers

<MazInput v-model="numberValue" type="number" />

<div
  style="padding: 16px; margin-top: 16px; background-color: hsl(var(--maz-background-300));"
  class="flex flex-center rounded gap-05"
>
  formatted value: <strong>{{ priceFormatted }}</strong>
</div>

```vue
<script lang="ts" setup>
import { formatCurrency } from 'maz-ui'
import { computed, ref } from 'vue'

const numberValue = ref(69)

const priceFormatted = computed(() =>
  formatCurrency(numberValue.value, 'fr-FR', { currency: 'EUR' }),
)
</script>

<template>
  <MazInput v-model="numberValue" type="number" />

  <div
    style="padding: 16px; margin-top: 16px; background-color: hsl(var(--maz-background-300));"
  >
    {{ priceFormatted }}
  </div>
</template>
```

<script lang="ts" setup>
  import { formatCurrency } from 'maz-ui'
  import { ref, computed } from 'vue'

  const numberValue = ref(69)

  const priceFormatted = computed(() =>
    formatCurrency(numberValue.value, 'fr-FR', { currency: 'EUR' }),
  )
</script>

## Options

> All options from [Intl.NumberFormat](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) are availables

```ts
export interface FilterCurrencyOptions extends Intl.NumberFormatOptions {
  round?: boolean
}
```
