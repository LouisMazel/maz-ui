---
title: isApple
description: Check whether the page runs on macOS, iOS or iPadOS, where the shortcut key is Cmd instead of Ctrl.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Usage

```ts
import { isApple } from '@maz-ui/utils/helpers/isApple'

const modKey = isApple() ? 'Cmd' : 'Ctrl'
```

It returns `false` on the server. To display or match a shortcut, use [`formatShortcut` and `matchesShortcut`](./shortcut) (or the [useShortcut](../../composables/use-shortcut) composable) instead of testing the platform yourself. To detect iOS only, use [`isIos`](./is-ios).
