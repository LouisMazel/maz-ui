---
title: Toast
description: A powerful toast notification system for Vue.js that displays user-friendly messages with customizable positioning, styling, and behavior options
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Use the [useToast](./../composables/use-toast.md) composable in your components: no plugin to install.

## Global options

The options of every toast, a toast can override them. All options are listed in the [Type](#type) section.

::: code-group

```ts [Vue]
import { MazUi } from 'maz-ui/plugins/maz-ui'

app.use(MazUi, {
  theme: { preset: mazUi },
  toast: {
    position: 'bottom-right',
    timeout: 10_000,
    persistent: false,
  },
})
```

```ts [Nuxt]
export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt'],
  mazUi: {
    toast: {
      position: 'bottom-right',
      timeout: 10_000,
      persistent: false,
    },
  },
})
```

:::

::: tip Outside of a component
`useToast()` works in the `setup` of a component. In a store, a router guard or `app.runWithContext()`, install the [MazUi plugin](./../guide/vue.md#install-plugin): it gives the app to the toasts.
:::

## Basic usage

<ComponentDemo expanded>
  <div class="maz:flex maz:flex-wrap maz:gap-2">
    <MazBtn color="contrast" @click="toast.message('Message text')">
      Message
    </MazBtn>
    <MazBtn color="info" @click="toast.info('Info message', { position: 'top', button: { href: 'https://www.loicmazuel.com' } })">
    Info toast on top
    </MazBtn>
    <MazBtn color="destructive" @click="toast.error('Error message', { position: 'bottom', timeout: 1000 })">
    Error toast on bottom with 1s timeout
    </MazBtn>
    <MazBtn color="warning" @click="toast.warning('Warning message', { position: 'top-right' })">
    Warning toast on top right
    </MazBtn>
    <MazBtn color="contrast" @click="toast.message(`<ul><li>Item <b>1</b></li><li>Item <b>2</b></li><li>Item <b>3</b></li></ul>`, { position: 'bottom-left', html: true })">
    Toast with html content
    </MazBtn>
    <MazBtn color="contrast" @click="toast.message('No timeout toast', { timeout: false })">
    Persistent with no timeout
    </MazBtn>

  </div>

  <template #code>

  ```vue
  <script lang="ts" setup>
    import { useToast } from 'maz-ui/composables/useToast'

    const toast = useToast()
  </script>

  <template>
    <MazBtn color="contrast" @click="toast.message('Message text')">
      Message
    </MazBtn>
    <MazBtn color="info" @click="toast.info('Info message', { position: 'top', button: { href: 'https://www.loicmazuel.com' } })">
      Info toast on top
    </MazBtn>
    <MazBtn color="destructive" @click="toast.error('Error message', { position: 'bottom', timeout: 1000 })">
      Error toast on bottom with 1s timeout
    </MazBtn>
    <MazBtn color="warning" @click="toast.warning('Warning message', { position: 'top-right' })">
      Warning toast on top right
    </MazBtn>
    <MazBtn color="contrast" @click="toast.message(`<ul><li>Item <b>1</b></li><li>Item <b>2</b></li><li>Item <b>3</b></li></ul>`, { position: 'bottom-left', html: true })">
      Toast with html content
    </MazBtn>
    <MazBtn color="contrast" @click="toast.message('No timeout toast', { timeout: false })">
      Persistent with no timeout
    </MazBtn>
  </template>
  ```

  </template>

</ComponentDemo>

### Action and link

Toast can have a link or an action

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:gap-2">
    <MazBtn color="info" @click="showInfoWithLink">
      Toast with  link
    </MazBtn>
    <MazBtn color="warning" @click="showInfoWithExternalLink">
      Toast with blank link
    </MazBtn>
    <MazBtn color="destructive" @click="showInfoWithAction">
      Toast with action
    </MazBtn>
  </div>

  <template #code>

  ```vue
  <script lang="ts" setup>
    import { useToast } from 'maz-ui/composables/useToast'

    const toast = useToast()

    function showInfoWithLink() {
      toast.info('Toast with link, click -->', {
        button: {
          href: 'https://www.loicmazuel.com',
        }
      })
    }

    function showInfoWithExternalLink() {
      toast.warning('Toast with link', {
        button: {
          href: 'https://www.loicmazuel.com',
          target: '_blank',
          closeToast: true,
          text: 'Follow link'
        }
      })
    }

    function showInfoWithAction() {
      toast.error('Toast with action', {
        button: {
          onClick: () => new Promise((resolve) => {
            sleep(3000)
            resolve()
            toast.success('Promise executed')
          }),
          text: 'Exec promise',
          closeToast: true,
        },
      })
    }
  </script>

  <template>
    <MazBtn color="info" @click="showInfoWithLink">
      Toast with  link
    </MazBtn>
    <MazBtn color="warning" @click="showInfoWithExternalLink">
      Toast with blank link
    </MazBtn>
    <MazBtn color="destructive" @click="showInfoWithAction">
      Toast with action
    </MazBtn>
  </template>
  ```

  </template>
</ComponentDemo>

### Icon

The `icon` option replaces the icon of the type, in the formats of [MazIcon](../components/maz-icon.md): a name (with [`MazUi()`](../ecosystem/vite-plugin.md) or [`@maz-ui/nuxt`](../ecosystem/nuxt.md)), a component, a URL or a raw SVG. `false` hides it.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:gap-2">
    <MazBtn color="success" @click="toast.success('Profile saved', { icon: 'cloud-arrow-up' })">
      Success with a name
    </MazBtn>
    <MazBtn color="contrast" @click="toast.message('3 new messages', { icon: MazBellAlert })">
      Message with a component
    </MazBtn>
    <MazBtn color="info" @click="toast.info('Info without icon', { icon: false })">
      Info without icon
    </MazBtn>
  </div>

  <template #code>

  ```vue
  <script lang="ts" setup>
    import { MazBellAlert } from '@maz-ui/icons/raw/MazBellAlert'
    import { useToast } from 'maz-ui/composables/useToast'

    const toast = useToast()
  </script>

  <template>
    <MazBtn color="success" @click="toast.success('Profile saved', { icon: 'cloud-arrow-up' })">
      Success with a name
    </MazBtn>
    <MazBtn color="contrast" @click="toast.message('3 new messages', { icon: MazBellAlert })">
      Message with a component
    </MazBtn>
    <MazBtn color="info" @click="toast.info('Info without icon', { icon: false })">
      Info without icon
    </MazBtn>
  </template>
  ```

  </template>
</ComponentDemo>

## Close toast programmatically

You can close a toast programmatically by using the `close` method returned by the `toast` function

<div class="vp-raw maz:flex maz:flex-wrap maz:gap-2">
  <MazBtn color="primary" @click="showToastAutoCLose">
    Show toast
  </MazBtn>
</div>

```typescript
function showToast() {
  const toastMessage = toast.message('Toast message closed by code')

  setTimeout(() => {
    toastMessage.close()
  }, 2000)
}
```

### Type

```ts
interface ToastOptions {
  /**
   * The position of the toast on the screen
   * @default 'bottom-right'
   */
  position?: ToastPosition
  /**
   * The timeout is in ms, it's the time before the toast is automatically closed
   * if set to `false`, the toast will not be closed automatically
   * @default 10000
   */
  timeout?: number | boolean
  /**
   * If the toast is persistent, it can't be closed by user interaction (only on timeout or programmatically)
   * @default false
   */
  persistent?: boolean
  /**
   * Icon of the toast, in the formats of MazIcon: a name, a component, a URL or a raw SVG.
   * `true` displays the icon of the type (none for `contrast` and `accent`), `false` hides it
   * @default true
   */
  icon?: boolean | MazIconValue
  /**
   * The action will be displayed as a button in the toast
   * @default undefined
   */
  button?: MazBtnProps & {
    text: string
    onClick: () => unknown
    href?: string
    text?: string
    /** @default _self */
    target?: string
    /** @default false */
    closeToast?: boolean
  }
  buttons?: (MazBtnProps & {
    text: string
    onClick: () => unknown
    href?: string
    text?: string
    /** @default _self */
    target?: string
    /** @default false */
    closeToast?: boolean
  })[]
  /**
   * If the toast is queued, it will be displayed in the order of the toasts
   * @default false
   */
  queue?: boolean
  /**
   * The maximum number of toasts to display
   * @default false
   */
  maxToasts?: number | boolean
  /**
   * If the toast is paused on hover, it will be paused when the mouse is over the toast
   * @default true
   */
  pauseOnHover?: boolean
  /**
   * If the message is HTML
   * @default false
   */
  html?: boolean
}
```

<script lang="ts" setup>
  import { MazBellAlert } from '@maz-ui/icons/raw/MazBellAlert'
  import { useToast } from 'maz-ui/composables/useToast'
  import { sleep } from '@maz-ui/utils'

  const toast = useToast()

  function showToastAutoCLose () {
    const toastMessage = toast.message('Toast message closed by code')

    setTimeout(() => {
      toastMessage.close()
    }, 3000)
  }

  function showMessage () {
    const t = toast.message('Message text')
  }

  function showInfo () {
    toast.info('Info message', {
      position: 'top',
    })
  }

  function showError () {
    toast.error('Error message', {
      position: 'bottom',
      timeout: 1000,
    })
  }

  function showWarning () {
    toast.warning('Warning message', {
      position: 'top-right',
    })
  }

  function showSuccess () {
    toast.success('Success message', {
      position: 'bottom-left',
      persistent: true,
    })
  }

  function showInfoWithLink () {
    toast.info('Toast with link, click -->', {
      button: {
        href: 'https://www.loicmazuel.com',
      }
    })
  }

  function showInfoWithExternalLink () {
    toast.warning('Toast with link', {
      button: {
        href: 'https://www.loicmazuel.com',
        target: '_blank',
        closeToast: true,
        text: 'Follow link'
      }
    })
  }

  function showInfoWithAction () {
    toast.error('Toast with action', {
      button: {
        onClick: () => new Promise(async (resolve) => {
          await sleep(3000)
          resolve()
        }),
        text: 'Exec promise',
        closeToast: true
      }
    })
  }
</script>
