---
title: formatNumber
description: The module formatNumber is a function that formats numbers with the native api [Intl.NumberFormat](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) from browsers and Node.js
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

> This module uses the native api [Intl.NumberFormat](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) from browsers

<MazInput v-model="numberValue" type="number" />

<div
  style="padding: 16px; margin-top: 16px; background-color: hsl(var(--maz-background-300));"
  class="maz-flex maz-flex-center maz-rounded maz-gap-0.5"
>
  formatted value: <strong>{{ numberFormatted }}</strong>
</div>

```vue
<script lang="ts" setup>
import { formatNumber } from 'maz-ui'
import { computed, ref } from 'vue'

const numberValue = ref(69)

const numberFormatted = computed(() =>
  formatNumber(numberValue.value, 'en-US'),
)
</script>

<template>
  <MazInput v-model="numberValue" type="number" />

  <div
    style="padding: 16px; margin-top: 16px; background-color: hsl(var(--maz-background-300));"
  >
    {{ numberFormatted }}
  </div>
</template>
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
  import { formatNumber } from 'maz-ui'
  import { ref, computed } from 'vue'

  const numberValue = ref(69)

  const numberFormatted = computed(() =>
    formatNumber(numberValue.value, 'en-US'),
  )
</script>
