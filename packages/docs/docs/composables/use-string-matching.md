---
title: useStringMatching
description: Efficient composable for string matching tasks, utilizing Levenshtein distance calculation. Simplify comparison operations with minimal setup. Enhance text similarity checks effortlessly.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

<div class="maz-bg-color-lighter dark:maz-bg-color dark:maz-border dark:maz-border-color-light maz-rounded maz-overflow-hidden maz-p-4">
  <div class="maz-flex maz-gap-4 maz-items-start maz-flex-wrap">
    <MazInput v-model="string1" label="Entrer first string" />
    <MazInput v-model="string2" label="Entrer second string" />
  </div>

  <p class="!maz-mb-1">
    <b>isMatching:</b> {{ isMatching }}
  </p>
  <p class="!maz-my-0">
    <b>score:</b> {{ score }}
  </p>
</div>

```vue
<template>
  <MazInput v-model="string1" label="Entrer first string" />
  <MazInput v-model="string2" label="Entrer second string" />

  <p>
    <b>isMatching:</b> {{ isMatching }}
  </p>
  <p>
    <b>score:</b> {{ score }}
  </p>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useStringMatching } from 'maz-ui'

  const string1 = ref<string>('maz-ui')
  const string2 = ref<string>('màéz-uiok')

  const { score, isMatching } = useStringMatching(string1, string2)
</script>
```

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useStringMatching } from 'maz-ui'

  const string1 = ref<string>('maz-ui')
  const string2 = ref<string>('méz-ui')

  const { score, isMatching } = useStringMatching(string1, string2, 0.75)
</script>
