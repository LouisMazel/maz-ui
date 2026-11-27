---
title: useWindowFocus
description: Reactive focus of the window, true while the user is on the page, false when the window loses the focus.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

```ts
import { useWindowFocus } from 'maz-ui/composables/useWindowFocus'
import { watch } from 'vue'

const { isFocused } = useWindowFocus()

watch(isFocused, (focused) => {
  if (focused)
    refresh()
})
```

## API

```ts
function useWindowFocus(options?: { initialValue?: boolean, internalWindow?: Window }): { isFocused: Ref<boolean> }
```

`initialValue` (default `false`) is the value on the server and, inside a component, until it is mounted (the first render matches the server markup, so hydration does not mismatch). To follow the visibility of the tab (hidden, visible), use [useUserVisibility](./use-user-visibility).
