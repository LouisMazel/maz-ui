---
title: useWait
description: Vue composable for handling wait plugins
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: warning
You must install the [wait plugin](./../plugins/wait.md#install) before using it
:::

::: tip
More info about the [wait plugin](./../plugins/wait.md) in its documentation
:::

## Usage

<MazFullscreenLoader v-if="wait.isLoading('MAIN_LOADER')">
  Loading
</MazFullscreenLoader>
<p v-else> Loaded </p>

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
  import { sleep } from 'maz-ui/src/index'
  import { useWait } from 'maz-ui/src/composables/useWait'

  const wait = useWait()

  onMounted(async () => {
    wait.start('MAIN_LOADER')
    await sleep(2000)
    wait.stop('MAIN_LOADER')
  })
</script>
