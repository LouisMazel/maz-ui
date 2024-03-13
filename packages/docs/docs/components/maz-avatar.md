---
title: MazAvatar
description: MazAvatar is a standalone component to display images or svgs in a wrapper
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

::: tip
This component uses [vLazyImg](./../directives/lazy-img.md) directive
:::

## Basic usage

<MazAvatar src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80" />

```vue
<template>
  <MazAvatar src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80" />
</template>

<script lang="ts" setup>
  import MazAvatar from 'maz-ui/components/MazAvatar'
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
  import MazAvatar from 'maz-ui/components/MazAvatar'
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
  fallback-src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=100"
/>

```html
<MazAvatar fallback-src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=100" />
```

<script lang="ts" setup>
  const clicked = () => { console.log('clicked') }
  const error = (el) => { console.error('error', el) }
</script>

<!--@include: ./../.vitepress/generated-docs/maz-avatar.doc.md-->