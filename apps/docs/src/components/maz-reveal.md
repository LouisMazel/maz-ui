---
title: MazReveal
description: MazReveal reveals its content when it enters the screen - fade, slide, blur, curtain, iris, lines and words. It is the component form of the vReveal directive.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

<ComponentDemo expanded>
  <div class="maz:flex maz:flex-col maz:items-start maz:gap-3">
    <MazBtn size="sm" @click="key++">Replay</MazBtn>
    <MazReveal :key="key" effect="curtain-up" :duration="900" class="maz:w-full maz:rounded-md maz:bg-primary maz:p-8 maz:text-center maz:text-primary-foreground">
      Revealed by a curtain
    </MazReveal>
  </div>

<template #code>

```vue
<script lang="ts" setup>
import MazReveal from 'maz-ui/components/MazReveal'
</script>

<template>
  <MazReveal effect="curtain-up" :duration="900">
    Revealed by a curtain
  </MazReveal>
</template>
```

</template>
</ComponentDemo>

All the effects, the options, the cascade (`stagger`), the reduced motion and the RTL behavior are described in [vReveal](./../directives/reveal.md).

<!--@include: ./../../.vitepress/generated-docs/maz-reveal.doc.md-->

<script lang="ts" setup>
import { ref } from 'vue'

const key = ref(0)
</script>
