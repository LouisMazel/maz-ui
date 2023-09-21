---
title: useAos
description: Vue composable for handling aos plugin in your components
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: warning
You must install the [aos plugin](./../plugins/aos.md#install) before you start using it
:::

::: tip
More info about the [aos plugin](./../plugins/aos.md) can be found in its documentation
:::

## Usage

```vue
<template>
  <img data-maz-aos="scale-in" />
</template>

<script lang="ts" setup>
  import { useAos } from 'vue'

  const aos = useAos()

  onMounted(() => {
    aos.runAnimations()
  })
</script>
```

## Documentation
