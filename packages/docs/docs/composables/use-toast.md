---
title: useToast
description: Vue composable for handling toaster plugin in your components
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: warning
You must install [toaster plugin](./../plugins/toaster.md#install) before use it
:::

::: tip
More info about [toaster plugin](./../plugins/toaster.md) in its documentation
:::

## Usage

```vue
<template>
  <img data-maz-aos="scale-in" />
</template>

<script lang="ts" setup>
  import { useToast } from 'vue'

  const { toast } = useToast()

  toast.info('info message')
  toast.success('success message')
  toast.warning('warning message')
  toast.error('error message')
</script>
```

## Documentation
