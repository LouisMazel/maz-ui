---
title: wait
description: A loading state management for Vue.js, without plugin to install, that provides easy-to-use utilities for handling async operations, loading indicators, and user feedback during data processing or any other async operation
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Use the [useWait](./../composables/use-wait.md) composable: no plugin to install, nothing to configure. It works anywhere, in a component, a store or any module, even without Vue app: every call shares the same loaders.

```ts
import { useWait } from 'maz-ui/composables/useWait'

const wait = useWait()

wait.start('DATA_SUBMITTING')
wait.isLoading('DATA_SUBMITTING') // true
wait.stop('DATA_SUBMITTING')
```

With Nuxt, `useWait` is auto-imported. On the server, the loaders are never started (a state shared by every request would leak between them).

## Basic usage

<div class="vp-raw">
<MazBtn @click="submitData" :loading="wait.isLoading('DATA_SUBMITTING')">
  Submit Data
</MazBtn>
</div>

<br />

<div v-if="submitted" style="padding: 20px; background-color: var(--maz-surface-300); border-radius: 10px; margin-top: 1rem;">
  Data Submitted
</div>

```vue
<script lang="ts" setup>
import { sleep } from '@maz-ui/utils/helpers/sleep'
import { useWait } from 'maz-ui/composables'
import { ref } from 'vue'

const wait = useWait()

const submitted = ref(false)

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
  import { sleep } from '@maz-ui/utils/helpers/sleep'
  import { ref } from 'vue'
  import { useWait } from 'maz-ui/composables/useWait'

  const wait = useWait()

  const submitted = ref(false)

  const submitData = async () => {
    submitted.value = false
    wait.start('DATA_SUBMITTING')

    await sleep(2000)

    submitted.value = true
    wait.stop('DATA_SUBMITTING')
  }
</script>
