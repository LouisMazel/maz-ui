---
title: useClipboard
description: Copy a text to the clipboard, with a reactive copied state that goes back to false after a delay - for a "Copy" button that shows "Copied!".
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: tip
For a button that copies an ID or a command, use the [MazBtnClipboard](./../components/maz-btn-clipboard.md) component: it is built on this composable.
:::

## Usage

<div class="vp-raw maz:flex maz:items-center maz:gap-2">
  <MazBtn :start-icon="copied ? 'check' : 'document-duplicate'" @click="copy('npm install maz-ui')">
    {{ copied ? 'Copied!' : 'Copy the install command' }}
  </MazBtn>
</div>

<script lang="ts" setup>
  import { useClipboard } from 'maz-ui/composables/useClipboard'

  const { copy, copied } = useClipboard()
</script>

```vue
<script lang="ts" setup>
import MazBtn from 'maz-ui/components/MazBtn'
import { useClipboard } from 'maz-ui/composables/useClipboard'

const { copy, copied } = useClipboard()
</script>

<template>
  <MazBtn :start-icon="copied ? 'check' : 'document-duplicate'" @click="copy('npm install maz-ui')">
    {{ copied ? 'Copied!' : 'Copy the install command' }}
  </MazBtn>
</template>
```

## Handle a failure

`copy` returns `true` when the text is in the clipboard, `false` otherwise. The reason is in `error`.

```ts
import { useClipboard } from 'maz-ui/composables/useClipboard'
import { useToast } from 'maz-ui/composables/useToast'

const toast = useToast()
const { copy } = useClipboard()

async function copyLink(url: string) {
  if (!await copy(url)) {
    toast.error('The link could not be copied')
  }
}
```

## Behavior

- `copied` is `true` for `copiedDuring` ms (1500 by default) after a copy. A new copy starts the delay again.
- `reset()` sets `copied` back to `false` at once.
- The timer is cleared when the component is unmounted (or the `effectScope` stopped).
- The Clipboard API needs a secure context (https or localhost). `isSupported` is `false` without it, or on the server: `copy` then returns `false`.

## Types

```ts
interface UseClipboardOptions {
  /**
   * Time in milliseconds during which `copied` stays `true` after a copy
   * @default 1500
   */
  copiedDuring?: number
}

function useClipboard(options?: UseClipboardOptions): {
  copy: (text: string) => Promise<boolean>
  copied: Readonly<Ref<boolean>>
  error: Readonly<Ref<unknown>>
  isSupported: boolean
  reset: () => void
}
```
