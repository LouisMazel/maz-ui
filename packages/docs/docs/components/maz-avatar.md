---
title: MazAvatar
description: MazAvatar is a standalone component that displays an image or an icon with a caption. It can be used to display a user's profile picture, a placeholder image, or an icon.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

::: tip
This component uses [vLazyImg](./../directives/lazy-img.md) directive
:::

## Basic usage

<MazAvatar :lazy="false" src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80" />

```vue
<template>
  <MazAvatar src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80" />
</template>

<script lang="ts" setup>
  import { MazAvatar } from 'maz-ui/components'
</script>
```

## Options

::: tip
See all the options props [here](#props-event-slots)
:::

<div class="flex space-between gap-05 items-center flex-wrap">
  <MazAvatar
    caption="Louis Mazel"
    size="1.5rem"
  />
  <MazAvatar
    src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=maz-ui"
    size="2rem"
    href="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=maz-ui"
    target="_blank"
    rounded-size="none"
    clickable
  >
    <template #icon>
      <MazIcon name="eye" style="color: white;" size="2rem" />
    </template>
  </MazAvatar>

  <MazAvatar
    src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=200"
    size="2.5rem"
    clickable
    rounded-size="xl"
    button-color="danger"
    @click="clicked"
  />

  <MazAvatar
    src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=600"
    size="3rem"
    bordered
    noElevation
  />
</div>

```vue
<template>
  <MazAvatar
    caption="Louis Mazel"
    size="1.5rem"
  />
  <MazAvatar
    src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=maz-ui"
    size="2rem"
    href="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=maz-ui"
    target="_blank"
    rounded-size="none"
    clickable
    no-size
  >
    <template #icon>
      <MazIcon name="eye" />
    </template>
  </MazAvatar>
  <MazAvatar
    src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=200"
    size="2.5rem"
    clickable
    rounded-size="xl"
    @click="clicked"
  />
  <MazAvatar
    src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=600"
    size="3rem"
    bordered
  />
</template>

<script lang="ts" setup>
  import { MazAvatar } from 'maz-ui/components'
  const clicked = () => { console.log('clicked') }
</script>
```

## On Error

<MazAvatar @error="error" />

```html
<MazAvatar @error="error" />
```

## Fallback image loaded on error

<MazAvatar
  class="vp-raw"
  src="https://broken-link-image-src.com"
  fallback-src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=100"
/>

```html
<MazAvatar
  src="https://broken-link-image-src.com"
  fallback-src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=100"
/>
```

## Loading

The props `loading` has 3 possible values: `intersecting`, `lazy`, or `eager`.

By default, the value is `intersecting` which means the image will be loaded when it's intersecting with the `IntersectionObserver` browser API. This mode uses the [`MazLazyImg`](./maz-lazy-img.md) component with [`vLazyImg`](./../directives/lazy-img.md) directive to handle the lazy loading.

Native modes:
- `lazy`: The image will be loaded only when it's in the viewport
- `eager`: The image will be loaded immediately

These modes are native use an `HTMLImageElement` with the `loading` attribute. (see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-loading)). **Useful for SSR (Server Side Rendering) or when you want to load the image immediately.**

<div class="flex gap-05 items-center flex-wrap">
  <MazAvatar
    class="vp-raw"
    loading="intersecting"
    src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=123"
  />
  <MazAvatar
    class="vp-raw"
    loading="lazy"
    src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=123"
  />
  <MazAvatar
    class="vp-raw"
    loading="eager"
    src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=123"
  />
</div>

```html
<MazAvatar
  loading="intersecting"
  src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=123"
/>
<MazAvatar
  loading="lazy"
  src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=123"
/>
<MazAvatar
  loading="eager"
  src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=123"
/>
```

<script lang="ts" setup>
  const clicked = () => { console.log('clicked') }
  const error = (el) => { console.error('error', el) }
</script>

<!--@include: ./../.vitepress/generated-docs/maz-avatar.doc.md-->