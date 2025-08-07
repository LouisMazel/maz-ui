---
title: MazPullToRefresh
description: MazPullToRefresh is a standalone component to add pull to refresh feature
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Demo

![MazPullToRefresh](/img/maz-pull-to-refresh.gif)

## Basic usage

Wrap your app inside this component

```vue
<script lang="ts" setup>
import MazPullToRefresh from 'maz-ui/components/MazPullToRefresh'

async function pullToRefreshAction() {
  // do promise or just `window.location.reload()`
}
</script>

<template>
  <MazPullToRefresh
    header-class="maz-bg-bg-dark maz-text-foreground-light"
    class="maz-flex maz-min-h-screen maz-w-full maz-flex-col"
    :action="pullToRefreshAction"
    spinner-color="white"
    standalone-mode
    :disabled="false"
  >
    <div>
      App Content
    </div>
  </MazPullToRefresh>
</template>
```

::: warning
More documentation to come
:::

<!--@include: ./../../.vitepress/generated-docs/maz-pull-to-refresh.doc.md-->
