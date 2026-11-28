---
title: useWindowSize
description: Reactive width and height of the browser window, updated on resize (and optionally on orientation change), SSR safe with initial values.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Built on [useWindow](./use-window): the resize listener is added on the window and removed when the component is unmounted.

## Basic usage

```ts
const { height, width } = useWindowSize()
```

::: warning
More documentation to come
:::
