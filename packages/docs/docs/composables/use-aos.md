---
title: useAos
description: Vue composable to handling aos plugin in your components
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: warning
You must install [aos plugin](./../plugins/aos.md#install) before use it
:::

::: tip
More info about [aos plugin](./../plugins/aos.md) in its documentation
:::

## Usage

```vue
<template>
  <img data-maz-aos="scale-in" />
</template>

<script lang="ts" setup>
  import { useAos } from 'vue'

  const { aos } = useAos()

  onMounted(() => {
    aos.runAnimations()
  })
</script>
```

## Documentation
