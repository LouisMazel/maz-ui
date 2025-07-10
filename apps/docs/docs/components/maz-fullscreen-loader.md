---
title: MazFullscreenLoader
description: MazFullscreenLoader is a standalone component
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../.vitepress/mixins/getting-started.md-->

## Basic usage

<MazFullscreenLoader v-if="showLoader" @click="showLoader = false">
  <p class="maz-text-lg maz-text-surface">
    Loading...
  </p>
  <p class="maz-text-lg maz-text-surface">
    (click to hide loader)
  </p>
</MazFullscreenLoader>

<MazBtn @click="showLoader = true">
  Show loader
</MazBtn>

```vue
<script lang="ts" setup>
import { MazBtn, MazFullscreenLoader } from 'maz-ui/components'

import { ref } from 'vue'

const showLoader = ref(false)
</script>

<template>
  <MazFullscreenLoader v-if="showLoader" @click="showLoader = false">
    <p>
      Loading...
    </p>
    <p>
      (click to hide loader)
    </p>
  </MazFullscreenLoader>

  <MazBtn @click="showLoader = true">
    Show loader
  </MazBtn>
</template>
```

<script lang="ts" setup>
  import { ref } from 'vue'

  const showLoader = ref(false)
</script>

<!--@include: ./../.vitepress/generated-docs/maz-fullscreen-loader.doc.md-->
