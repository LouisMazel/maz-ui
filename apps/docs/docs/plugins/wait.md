---
title: wait
description: Plugins to manage your loading states
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: tip
This plugin has a composable for easier use, after installing it you can use [useWait](./../composables/use-wait.md)
:::

## Basic usage

<MazBtn @click="submitData" :loading="wait.isLoading('DATA_SUBMITTING')">
Submit Data
</MazBtn>
<br />

<div v-if="submitted" style="padding: 20px; background-color: hsl(var(--maz-background-300)); border-radius: 10px; margin-top: 1rem;">
  Data Submitted
</div>

```vue
<script lang="ts" setup>
import { useWait } from 'maz-ui/composables'
import { ref } from 'vue'

const wait = useWait()

const submitted = ref(false)

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function submitData() {
  submitted.value = false
  wait.start('DATA_SUBMITTING')

  await sleep(2000)

  submitted.value = true
  wait.stop('DATA_SUBMITTING')
}
</script>

<template>
  <MazBtn :loading="wait.isLoading('DATA_SUBMITTING')" @click="submitData">
    Submit Data
  </MazBtn>

  <div v-if="submitted">
    Data Submitted
  </div>
</template>
```

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useWait } from 'maz-ui/composables/useWait'

  const wait = useWait()

  const submitted = ref(false)

  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const submitData = async () => {
    submitted.value = false
    wait.start('DATA_SUBMITTING')

    await sleep(2000)

    submitted.value = true
    wait.stop('DATA_SUBMITTING')
  }
</script>

## Install

`main.ts` or `main.js`

```ts
import { installWait } from 'maz-ui/plugins'
import { createApp } from 'vue'

const app = createApp(App)

app.use(installWait)

app.mount('#app')
```
