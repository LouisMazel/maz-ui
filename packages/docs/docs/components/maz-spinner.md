---
title: MazSpinner
description: MazSpinner is a standalone component that replaces the standard html input checkbox. Color options are available.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Basic usage

<MazSpinner />

```vue
<template>
  <MazSpinner />
</template>

<script>
  import { MazSpinner } from 'maz-ui/components'
</script>
```

## Options

### Colors

Choose the color of the spinner

By default the color is `theme`

<div class="maz-flex maz-gap-2 maz-flex-wrap">
  <MazSpinner color="primary" />
  <MazSpinner color="secondary" />
  <MazSpinner color="danger" />
  <MazSpinner color="warning" />
  <MazSpinner color="success" />
  <MazSpinner color="info" />
  <MazSpinner color="theme" />
  <MazSpinner color="white" />
  <MazSpinner color="black" />
</div>

```vue
<MazSpinner color="primary" />
<MazSpinner color="secondary" />
<MazSpinner color="danger" />
<MazSpinner color="warning" />
<MazSpinner color="success" />
<MazSpinner color="info" />
<MazSpinner color="theme" />
<MazSpinner color="white" />
<MazSpinner color="black" />
```

### Sizes

Choose the size of the spinner

The default size is `2em`

<div class="maz-flex maz-gap-2 maz-flex-wrap maz-items-center">
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

<!--@include: ./../.vitepress/generated-docs/maz-spinner.doc.md-->
