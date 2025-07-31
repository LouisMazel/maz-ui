---
title: MazSpinner
description: MazSpinner is a standalone component that replaces the standard html input checkbox. Color options are available.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

## Basic usage

<MazSpinner />

```vue
<script>
import { MazSpinner } from 'maz-ui/components'
</script>

<template>
  <MazSpinner />
</template>
```

## Options

### Colors

Choose the color of the spinner

By default the color is `theme`

<div class="maz-flex maz-gap-2 maz-flex-wrap">
  <MazSpinner color="primary" />
  <MazSpinner color="secondary" />
  <MazSpinner color="destructive" />
  <MazSpinner color="warning" />
  <MazSpinner color="success" />
  <MazSpinner color="info" />
  <MazSpinner color="accent" />
  <MazSpinner color="contrast" />
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

<!--@include: ./../../.vitepress/generated-docs/maz-spinner.doc.md-->
