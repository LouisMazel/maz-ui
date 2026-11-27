---
title: useToast
description: Vue composable to display toast notifications (info, success, warning, error, with actions and buttons) from your components, without plugin to install
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: tip
No plugin to install. Global options, actions, buttons and all the options: [toast documentation](./../plugins/toast.md)
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
toast.accent('accent message')
toast.neutral('neutral message')
toast.message('3 new messages', { icon: 'bell' })
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
    toast.accent('accent message')
    toast.neutral('neutral message')
    toast.message('3 new messages', { icon: 'bell' })
  })

</script>
