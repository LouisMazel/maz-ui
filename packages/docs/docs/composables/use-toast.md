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
  import { useToast } from 'maz-ui'

  const toast = useToast()

  toast.info('info message', {
    action: {
      func: () => toast.success('clicked'),
      text: 'Click me',
      closeToast: true
    }
  })
  toast.success('success message', {
    link: {
      href: '/maz-ui-3/composables/use-toast',
      text: 'Follow me',
      closeToast: true,
    }
  })
  toast.warning('warning message')
  toast.error('error message')
</script>
```

<script lang="ts" setup>
  import { useToast } from 'maz-ui'

  const toast = useToast()

  toast.info('info message', {
    action: {
      func: () => toast.success('clicked'),
      text: 'Click me',
      closeToast: true
    }
  })
  toast.success('success message', {
    link: {
      href: '/maz-ui-3/composables/use-toast',
      text: 'Follow me',
      closeToast: true,
    }
  })
  toast.warning('warning message')
  toast.error('error message')
</script>