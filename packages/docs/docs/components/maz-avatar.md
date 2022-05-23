---
title: MazAvatar
description: MazAvatar is a stand-alone component replaces the standard html button with a beautiful design system. Many options like colors, sizes, disabled state, loading state, includes icons. Support of router-link and nuxt-link
head:
  - - meta
    - name: twitter:title
      content: MazAvatar | Maz-UI
    - name: twitter:description
      content: MazAvatar is a stand-alone component replaces the standard html button with a beautiful design system. Many options like colors, sizes, disabled state, loading state, includes icons. Support of router-link and nuxt-link
    - property: og:title
      content: MazAvatar | Maz-UI
    - property: og:description
      content: MazAvatar is a stand-alone component replaces the standard html button with a beautiful design system. Many options like colors, sizes, disabled state, loading state, includes icons. Support of router-link and nuxt-link
---

# MazAvatar

> Before you have to import the global css files in your project, follow instructions in [Getting Started](./../guide/getting-started.md)

> This component uses [vLazyImg](/maz-ui-3/directives/lazy-img.html) directive

## Basic usage

<br />

<MazAvatar src="https://pbs.twimg.com/profile_images/598181608198381570/-cFG43y2_400x400.jpg" />

```vue
<template>
  <MazAvatar src="https://pbs.twimg.com/profile_images/598181608198381570/-cFG43y2_400x400.jpg" />
</template>

<script lang="ts" setup>
  import MazAvatar from 'maz-ui/components/MazAvatar'
</script>
```

## Options

> See all options props [here](#props-events-emitted)

<div class="flex space-between gap-05 items-center flex-wrap">
  <MazAvatar
    caption="LM"
    size="1.5rem"
  />
  <MazAvatar
    src="https://placekitten.com/640/600"
    size="2rem"
    href="https://placekitten.com/640/600"
    target="_blank"
    square
    clickable
  >
    <template #icon>
      <MazIcon name="eye" style="color: white;" size="2rem" />
    </template>
  </MazAvatar>
  <MazAvatar
    src="https://placekitten.com/200/200"
    size="2.5rem"
    clickable
    button-color="danger"
    @click="clicked"
  />
  <MazAvatar
    src="https://pbs.twimg.com/profile_images/598181608198381570/-cFG43y2_400x400.jpg"
    size="3rem"
    bordered
  />
</div>

```vue
<template>
  <MazAvatar
    caption="LM"
    size="1.5rem"
  />
  <MazAvatar
    src="https://placekitten.com/640/600"
    size="2rem"
    href="https://placekitten.com/640/600"
    target="_blank"
    square
    clickable
    no-size
  >
    <template #icon>
      <MazIcon name="eye" />
    </template>
  </MazAvatar>
  <MazAvatar
    src="https://placekitten.com/200/200"
    size="2.5rem"
    clickable
    @click="clicked"
  />
  <MazAvatar
    src="https://pbs.twimg.com/profile_images/598181608198381570/-cFG43y2_400x400.jpg"
    size="3rem"
    bordered
  />
</template>

<script lang="ts" setup>
  import MazAvatar from 'maz-ui/components/MazAvatar'
  const clicked = () => { console.log('clicked') }
</script>
```

<script lang="ts" setup>
  const clicked = () => { console.log('clicked') }
</script>

## Props & Events emitted

<ComponentPropDoc component="MazAvatar" />