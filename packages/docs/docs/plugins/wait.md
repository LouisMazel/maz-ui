---
description: Plugins to manage your loading states
---

# wait

> Loading state handling

## Basic usage

<br />


<MazBtn @click="submitData" :loading="wait.isLoading('DATA_SUBMITTING')">
  Submit Data
</MazBtn>
<br />
<br />
<div v-if="submitted" style="padding: 20px; background-color: var(--maz-color-bg-light); border-radius: 10px;">
  Data Submitted
</div>

```vue
<template>
  <MazBtn @click="submitData" :loading="wait.isLoading('DATA_SUBMITTING')">
    Submit Data
  </MazBtn>

  <div v-if="submitted" style="padding: 20px; background-color: var(--maz-color-bg-light); border-radius: 10px;">
    Data Submitted
  </div>
</template>

<script lang="ts" setup>
  import { inject, ref } from 'vue'
  import { WaitHandler } from 'maz-ui'

  const wait = inject<WaitHandler>('wait')

  const submitted = ref(false)

  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const submitData = async () => {
    try {
      submitted.value = false
      wait.start('DATA_SUBMITTING')
      await sleep(2000)
      submitted.value = true
    } finally {
      wait.stop('DATA_SUBMITTING')
    }
  }
</script>
```

<script lang="ts" setup>
  import { inject, ref } from 'vue'
  import { WaitHandler } from 'maz-ui'

  const wait = inject<WaitHandler>('wait')

  const submitted = ref(false)

  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const submitData = async () => {
    try {
      submitted.value = false
      wait.start('DATA_SUBMITTING')
      await sleep(2000)
      submitted.value = true
    } finally {
      wait.stop('DATA_SUBMITTING')
    }
  }
</script>

## Install

`main.ts` or `main.js`

```ts
import { createApp } from 'vue'
import { installWait } from 'maz-ui'

const app = createApp(App)

app.use(installWait)

app.mount('#app')
```