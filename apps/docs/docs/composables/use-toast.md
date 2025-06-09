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
<script lang="ts" setup>
import { useToast } from 'maz-ui/composables'

const toast = useToast()

toast.info('info message', {
  button: {
    onClick: () => toast.success('clicked'),
    text: 'Click me',
    closeToast: true
  }
})
toast.success('success message', {
  button: {
    href: '/composables/use-toast',
    text: 'Follow me',
    closeToast: true,
  }
})
toast.warning('warning message')
toast.error('error message')
</script>
```

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { useToast } from 'maz-ui/src/composables/useToast'

  const toast = useToast()

  onMounted(() => {
    toast.info('info message', {
      button: {
        onClick: () => toast.success('clicked'),
        text: 'Click me',
        closeToast: true
      }
    })
    toast.success('success message', {
      button: {
        href: '/composables/use-toast',
        text: 'Follow me',
        closeToast: true,
      }
    })
    toast.warning('warning message')
    toast.error('error message')
    toast.message('message')
  })

</script>
