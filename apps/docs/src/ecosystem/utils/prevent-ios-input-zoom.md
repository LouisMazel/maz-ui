---
title: preventIosInputZoom
description: Stop iOS from zooming the page when a form field gets the focus, without changing the design of the fields.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Why

iOS zooms the page when a focused field has a font size below `16px`, and does not zoom out afterwards. With the maz-ui presets anchored on a `14px` `base-font-size`, most fields are below this threshold.

`preventIosInputZoom` adds `maximum-scale=1` to the `<meta name="viewport">`, **on iOS only**:

- iOS no longer zooms on focus, and still lets the user pinch to zoom (Safari ignores `maximum-scale` for the pinch zoom since iOS 10).
- Android is left untouched: it does not zoom on focus, but `maximum-scale` would block the pinch zoom there.
- The design of the fields is not changed.

## Usage

Call it once, when the app starts:

```ts
import { preventIosInputZoom } from '@maz-ui/utils'

preventIosInputZoom()
```

::: tip Nuxt
With [@maz-ui/nuxt](../nuxt.md), enable the `general.preventIosInputZoom` option instead.
:::

::: warning Head managers
If your viewport is managed by a head manager (`@unhead/vue`, `@vueuse/head`...), it can overwrite a direct change of the DOM on its next render. Set the viewport through it with `addViewportMaximumScale` instead:

```ts
import { addViewportMaximumScale, isIos } from '@maz-ui/utils'
import { useHead } from '@unhead/vue'

const viewport = 'width=device-width, initial-scale=1'

useHead({
  meta: [{ name: 'viewport', content: isIos() ? addViewportMaximumScale(viewport) : viewport }],
})
```
:::

## API

```ts
function preventIosInputZoom(): () => void

function addViewportMaximumScale(content: string): string
```

- `preventIosInputZoom` does nothing outside iOS, during SSR or when the page has no `<meta name="viewport">` (it does not create one). It returns a function that restores the original viewport.
- `addViewportMaximumScale` returns the viewport content with `maximum-scale=1`, replacing an existing `maximum-scale`.

```ts
addViewportMaximumScale('width=device-width, initial-scale=1')
// 'width=device-width, initial-scale=1, maximum-scale=1'

addViewportMaximumScale('width=device-width, maximum-scale=5')
// 'width=device-width, maximum-scale=1'
```
