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

<MazAvatar src="https://placekitten.com/740/600" />

```vue
<template>
  <MazAvatar src="https://placekitten.com/740/600" />
</template>

<script lang="ts" setup>
  import MazAvatar from 'maz-ui/components/MazAvatar'
</script>
```

## Options

::: tip
See all the options props [here](#props-events-emitted)
:::

<div class="flex space-between gap-05 items-center flex-wrap">
  <MazAvatar
    caption="Louis Mazel"
    size="1.5rem"
  />
  <MazAvatar
    src="https://placekitten.com/640/600"
    size="2rem"
    href="https://placekitten.com/640/600"
    target="_blank"
    rounded-size="none"
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
    rounded-size="xl"
    button-color="danger"
    @click="clicked"
  />

  <MazAvatar
    src="https://placekitten.com/740/600"
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
    src="https://placekitten.com/640/600"
    size="2rem"
    href="https://placekitten.com/640/600"
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
    src="https://placekitten.com/200/200"
    size="2.5rem"
    clickable
    rounded-size="xl"
    @click="clicked"
  />
  <MazAvatar
    src="https://placekitten.com/740/600"
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

<!--@include: ./../.vitepress/generated-docs/maz-avatar.doc.md-->