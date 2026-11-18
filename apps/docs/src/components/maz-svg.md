---
title: MazSvg
description: MazSvg renders an SVG (illustration, logo, flag) at its own size and with its own colors, from a name, a Vue component, a URL or a raw SVG string.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## MazSvg or MazIcon

Both accept the same formats: a name, a Vue component, a URL, a `data:` URI or a raw SVG string.

| | [MazIcon](./maz-icon.md) | MazSvg |
| --- | --- | --- |
| **Size** | `1em` (the size of the text), or `size` | The size of the SVG, or `width` / `height` |
| **Use it for** | Interface icons | Illustrations, logos, flags |

## Usage

<ComponentDemo>

  <div class="maz:flex maz:items-end maz:gap-4">
    <MazSvg icon="flag-fr" width="64" />
    <MazSvg icon="logo-vue" height="48" />
  </div>

  <template #code>

```vue
<template>
  <MazSvg icon="flag-fr" width="64" />
  <MazSvg icon="logo-vue" height="48" />
</template>
```

  </template>
</ComponentDemo>

Names need [`MazUi()`](../ecosystem/vite-plugin.md#icons-by-name) of `@maz-ui/vite-plugin` (included in `@maz-ui/nuxt`), like [MazIcon](./maz-icon.md). The SVG files of your project are available by name too: `src/icons/hero.svg` is `<MazSvg icon="hero" />`.

## Size

- Without `width` nor `height`: the size of the SVG, never wider than its container.
- With `width` only: the height follows the ratio of the SVG.
- With `height`, or both: the given size.

`width` and `height` take a number of pixels (`64`) or a CSS length (`'12rem'`).

## Other formats

```vue
<script setup lang="ts">
import Hero from './hero.svg?component'
</script>

<template>
  <MazSvg :icon="Hero" />
  <MazSvg icon="/illustrations/empty.svg" width="200" />
</template>
```

`?component` imports an SVG file as a Vue component, with [@maz-ui/vite-svg-loader](../ecosystem/vite-svg-loader.md). A URL is fetched and cached, like in [MazIcon](./maz-icon.md#url-fetched-at-runtime).

## Fallback

When `icon` is an unknown name or a URL that fails, an `error` event is emitted and `fallback` (same formats as `icon`) is rendered.

```vue
<MazSvg :icon="user.avatarUrl" fallback="no-image" @error="onError" />
```

## Accessibility

MazSvg is decorative by default (`aria-hidden="true"`). Set a `title` (or an `aria-label`) to describe it: `role="img"` is set and `aria-hidden` is dropped.

```vue
<MazSvg icon="app:hero" title="A team working together" />
```

<!--@include: ./../../.vitepress/generated-docs/maz-svg.doc.md-->
