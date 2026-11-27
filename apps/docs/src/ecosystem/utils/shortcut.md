---
title: shortcut
description: Parse, match and display keyboard shortcuts that follow the platform (Cmd on macOS, Ctrl elsewhere) with `parseShortcut`, `matchesShortcut`, `formatShortcut` and `isApple`.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

In a Vue component, use the [useShortcut](../../composables/use-shortcut) composable: it listens to the keyboard for you.

## Usage

```ts
import { formatShortcut, matchesShortcut } from '@maz-ui/utils/helpers/shortcut'

formatShortcut('mod+1') // '⌘1' on macOS, 'Ctrl+1' elsewhere
formatShortcut('mod+shift+s') // '⇧⌘S' or 'Ctrl+Shift+S'

document.addEventListener('keydown', (event) => {
  if (matchesShortcut(event, 'mod+k'))
    openPalette()
})
```

## Syntax

Keys are joined with `+`, case does not matter: `mod+k`, `ctrl+shift+s`, `alt+1`, `escape`, `enter`, `arrowup`, `space`.

| Modifier                      | Meaning                                         |
| ----------------------------- | ----------------------------------------------- |
| `mod`                         | `Cmd` on macOS and iOS, `Ctrl` elsewhere        |
| `ctrl`, `meta` (`cmd`, `win`) | The exact key                                   |
| `alt` (`option`), `shift`     | The exact key                                   |

Modifiers are matched exactly: `ctrl+k` does not match `ctrl+shift+k`. Except Shift for a symbol typed with it: `?` and `shift+/` both match `?` (QWERTY), `mod+shift+[` matches `{`.

## API

```ts
function parseShortcut(shortcut: string): ParsedShortcut
function matchesShortcut(event: KeyboardEvent, shortcut: string | ParsedShortcut, options?: { apple?: boolean }): boolean
function formatShortcut(shortcut: string | ParsedShortcut, options?: { apple?: boolean }): string
function isApple(): boolean
```

`isApple()` is `true` on macOS, iOS and iPadOS, and `false` on the server. The `apple` option forces the platform (tests, previews).
