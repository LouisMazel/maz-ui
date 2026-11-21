---
title: useWait
description: Vue composable to manage loading states (start, stop, check) anywhere in your app (components, stores, modules) without plugin, with the MazFullscreenLoader
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: tip
No plugin to install: every call of `useWait()` shares the same loaders, even outside of a component. More info in the [wait documentation](./../plugins/wait.md)
:::

## Usage

<div class="vp-raw">
<MazFullscreenLoader v-if="wait.isLoading('MAIN_LOADER')">
  Loading
</MazFullscreenLoader>
<p v-else> Loaded </p>
</div>

```vue
<script lang="ts" setup>
import { sleep } from '@maz-ui/utils'
import { useWait } from 'maz-ui/composables'
import { onMounted } from 'vue'

const wait = useWait()

onMounted(async () => {
  wait.start('MAIN_LOADER')
  await sleep(2000)
  wait.stop('MAIN_LOADER')
})
</script>

<template>
  <MazFullscreenLoader v-if="wait.isLoading('MAIN_LOADER')">
    Loading
  </MazFullscreenLoader>
  <p v-else>
    Loaded
  </p>
</template>
```

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { sleep } from '@maz-ui/utils'
  import { useWait } from 'maz-ui/composables/useWait'

  const wait = useWait()

  onMounted(async () => {
    wait.start('MAIN_LOADER')
    await sleep(2000)
    wait.stop('MAIN_LOADER')
  })
</script>
