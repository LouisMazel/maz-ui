---
title: useShortcut
description: Platform aware keyboard shortcut, mod is Cmd on macOS and Ctrl elsewhere, with its label (⌘K or Ctrl+K) and an automatic cleanup.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Use it instead of a `keydown` handler that tests `event.metaKey || event.ctrlKey`.

## Usage

<ComponentDemo expanded>
  <div class="maz:flex maz:flex-col maz:items-start maz:gap-3 maz:text-sm">
    <MazBtn size="sm" color="contrast" @click="toggle">
      Open the palette
      <MazBadge size="sm" color="container">{{ label }}</MazBadge>
    </MazBtn>
    <div class="maz:rounded-md maz:border maz:border-divider maz:bg-container maz:px-4 maz:py-3">
      Palette: <MazBadge :color="isOpen ? 'success' : 'container'" size="sm">{{ isOpen ? 'open' : 'closed' }}</MazBadge>
    </div>
    <div class="maz:text-muted">Press the shortcut, or Escape to close.</div>
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import { useShortcut } from 'maz-ui/composables/useShortcut'
import { ref } from 'vue'

const isOpen = ref(false)

const toggle = () => isOpen.value = !isOpen.value

const { label } = useShortcut('mod+k', toggle)
useShortcut('escape', () => isOpen.value = false, { enabled: isOpen })
</script>

<template>
  <MazBtn @click="toggle">
    Open the palette <kbd>{{ label }}</kbd>
  </MazBtn>

  <p v-if="isOpen">
    Palette open
  </p>
</template>
```

  </template>
</ComponentDemo>

`label` is `⌘K` on macOS and `Ctrl+K` elsewhere. The listener is removed on unmount.

## Shortcut syntax

Keys are joined with `+`: `mod+k`, `mod+shift+s`, `alt+1`, `escape`, `enter`. `mod` is `Cmd` on macOS and iOS, `Ctrl` elsewhere. Modifiers are matched exactly (`ctrl+k` does not match `ctrl+shift+k`), except Shift for a symbol typed with it: `?` and `shift+/` both match `?`. The shortcut can be a ref or a getter. See [the helpers](../ecosystem/utils/shortcut) for the full syntax.

## API

```ts
function useShortcut(
  shortcut: MaybeRefOrGetter<string>,
  handler: (event: KeyboardEvent) => void,
  options?: UseShortcutOptions,
): { label: ComputedRef<string>, stop: () => void }
```

| Option           | Type                                  | Default                  | Description                                                                         |
| ---------------- | ------------------------------------- | ------------------------ | ----------------------------------------------------------------------------------- |
| `target`         | `Window \| Document \| HTMLElement`   | `window`                 | Where the keyboard is listened (can be a ref)                                       |
| `event`          | `'keydown' \| 'keyup'`                | `'keydown'`              | Event used                                                                          |
| `preventDefault` | `boolean`                             | `true`                   | Prevent the default action of the browser when the shortcut matches                 |
| `allowInInputs`  | `boolean`                             | see below                | Trigger while the focus is in an input, a textarea, a select or an editable element |
| `allowRepeat`    | `boolean`                             | `false`                  | Trigger again while the keys stay pressed                                           |
| `enabled`        | `MaybeRefOrGetter<boolean>`           | `true`                   | Disable the shortcut without removing it                                            |
| `apple`          | `boolean`                             | platform of the browser  | Force the platform                                                                  |

`allowInInputs` defaults to `true` for the shortcuts with `mod`, `ctrl` or `meta`, and to `false` for a plain key, `shift` + key or `alt` + key (typing a `k` in a field must not trigger `k`, and `Option` types characters on macOS).

<script lang="ts" setup>
import { useShortcut } from 'maz-ui/composables/useShortcut'
import { ref } from 'vue'

const isOpen = ref(false)

function toggle() {
  isOpen.value = !isOpen.value
}

const { label } = useShortcut('mod+k', toggle)
useShortcut('escape', () => {
  isOpen.value = false
}, { enabled: isOpen })
</script>
