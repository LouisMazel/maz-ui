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

```vue
<template>
  <Loader v-if="wait.isLoading('MAIN_LOADER')" />
  <p v-else> Loaded </p>
</template>

<script lang="ts" setup>
  import { useWait, sleep } from 'vue'

  const { wait } = useWait()

  onMounted(() => {
    wait.start('MAIN_LOADER')
    await sleep(2000)
    wait.stop('MAIN_LOADER')
  })
</script>
```

## Documentation
