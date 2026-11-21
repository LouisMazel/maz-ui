---
title: useAos
description: Vue composable to access the AOS plugin instance (animations on scroll) in your components, to refresh or trigger the animations
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: warning
Enable aos with the `aos` option of the MazUi plugin (or of the Nuxt module) before using it: [installation](./../plugins/aos.md#installation)
:::

::: tip
More info about the [aos plugin](./../plugins/aos.md) can be found in its documentation
:::

## Usage

```vue
<script lang="ts" setup>
import { useAos } from 'maz-ui/composables'

const aos = useAos()

onMounted(() => {
  aos.runAnimations()
})
</script>

<template>
  <img data-maz-aos="scale-in">
</template>
```
