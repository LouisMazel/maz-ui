---
title: MazSpinner
description: MazSpinner is an animated loading indicator with the colors and sizes of the theme, to show that a content or an action is loading
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Basic usage

<div class="vp-raw">
<MazSpinner />
</div>

```vue
<script>
import MazSpinner from 'maz-ui/components/MazSpinner'
</script>

<template>
  <MazSpinner />
</template>
```

## Options

### Colors

Choose the color of the spinner

By default the color is `theme`

<div class="vp-raw maz:flex maz:gap-2 maz:flex-wrap">
  <MazSpinner color="primary" />
  <MazSpinner color="secondary" />
  <MazSpinner color="destructive" />
  <MazSpinner color="warning" />
  <MazSpinner color="success" />
  <MazSpinner color="info" />
  <MazSpinner color="accent" />
  <MazSpinner color="contrast" />
  <MazSpinner color="neutral" />
</div>

```vue
<MazSpinner color="primary" />

<MazSpinner color="secondary" />

<MazSpinner color="destructive" />

<MazSpinner color="warning" />

<MazSpinner color="success" />

<MazSpinner color="info" />

<MazSpinner color="accent" />

<MazSpinner color="contrast" />

<MazSpinner color="neutral" />
```

### Sizes

Choose the size of the spinner

The default size is `2em`

<div class="vp-raw maz:flex maz:gap-2 maz:flex-wrap maz:items-center">
  <MazSpinner size="1em" />
  <MazSpinner />
  <MazSpinner size="3em" />
  <MazSpinner size="4em" />
  <MazSpinner size="5em" />
  <MazSpinner size="6em" />
  <MazSpinner size="7em" />
</div>

```vue
<MazSpinner size="1em" />

<MazSpinner size="2em" />

<MazSpinner size="3em" />

<MazSpinner size="4em" />

<MazSpinner size="5em" />

<MazSpinner size="6em" />

<MazSpinner size="7em" />
```

## Variants

`variant` changes the look: `ring` (default), `dots`, `bars` or `pulse`.

<div class="vp-raw maz:flex maz:gap-4 maz:flex-wrap maz:items-center">
  <MazSpinner variant="ring" />
  <MazSpinner variant="dots" />
  <MazSpinner variant="bars" />
  <MazSpinner variant="pulse" />
</div>

```html
<MazSpinner variant="ring" />
<MazSpinner variant="dots" />
<MazSpinner variant="bars" />
<MazSpinner variant="pulse" />
```

## Done

Set `done` when the task ends: a check circle draws itself in place of the spinner.

<ComponentDemo>
  <div class="maz:flex maz:items-center maz:gap-4">
    <MazSpinner color="success" :done="spinnerDone" size="3em" />
    <MazBtn size="sm" @click="spinnerDone = !spinnerDone">{{ spinnerDone ? 'Restart' : 'Finish' }}</MazBtn>
  </div>

<template #code>

```html
<MazSpinner color="success" :done="done" />
```

  </template>
</ComponentDemo>

## Motion

The spinner turns, bounces or breathes in a loop. With reduced motion, it stays still.

<script setup lang="ts">
  import { ref } from 'vue'

  const spinnerDone = ref(false)
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-spinner.doc.md-->
