---
title: useToast
description: Vue composable to display toast notifications (info, success, warning, error, with actions and buttons) from your components, through the toast plugin
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: warning
You must install [toast plugin](./../plugins/toast.md#install) before use it
:::

::: tip
More info about [toast plugin](./../plugins/toast.md) in its documentation
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
  import { useToast } from 'maz-ui/composables/useToast'

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
