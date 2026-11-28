---
title: MazSwitch
description: MazSwitch is a standalone component that replaces the standard html input checkbox. Color options are available.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

<div class="vp-raw maz:flex maz:flex-col maz:gap-3">
  <MazSwitch
    v-for="color in colors"
    v-model="switchValue"
    :color="color"
    :name="color"
    :key="color"
  >
    {{ color }}
  </MazSwitch>

  <p>Disabled</p>

  <MazSwitch
    v-model="switchValueDisabled"
    name="disabled"
    disabled
  >
    Disabled
  </MazSwitch>
</div>

```vue
<template>
  <MazSwitch
    v-for="color in colors"
    v-model="switchValue"
    :color="color"
    :name="color"
    :key="color"
  />

  <p>Disabled</p>

  <MazSwitch
    v-model="switchValue"
    name="disabled"
    disabled
  >
    {{ color }}
  </MazSwitch>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import MazSwitch from 'maz-ui/components/MazSwitch'

  const switchValue = ref(false)
  const switchValueDisabled = ref(false)

  const colors = [
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'destructive',
    'accent',
    'contrast',
    'neutral',
  ]
</script>
```

## Sizes

`size` uses the same scale as [MazCheckbox](./maz-checkbox.md): `mini`, `xs`, `sm`, `md` (default), `lg` and `xl`. The track is twice as wide as high, so a switch and a checkbox of the same size share their height in a form. It can be set once for every switch through the [global defaults](./../guide/global-defaults.md) (`MazSwitch`).

<div class="vp-raw maz:flex maz:flex-col maz:gap-3">
  <MazSwitch v-for="size in sizes" :key="size" v-model="sizeValue" :size="size" :name="`size-${size}`">
    {{ size }}
  </MazSwitch>
</div>

```vue
<template>
  <MazSwitch v-model="value" size="mini">mini</MazSwitch>
  <MazSwitch v-model="value" size="xs">xs</MazSwitch>
  <MazSwitch v-model="value" size="sm">sm</MazSwitch>
  <MazSwitch v-model="value" size="md">md</MazSwitch>
  <MazSwitch v-model="value" size="lg">lg</MazSwitch>
  <MazSwitch v-model="value" size="xl">xl</MazSwitch>
</template>
```

## Motion

- The thumb is a capsule (wider than tall) in a pill track, like the iOS and macOS switches. It glides to the other side with the `--maz-easing-spring` token, with no overshoot, and stretches a little while pressed.
- The keyboard focus shows a 2 px ring around the track.
- The speed follows the `--maz-motion-*` tokens and reduced motion removes the stretch and the spring. It works the same in RTL.

<!--@include: ./../../.vitepress/generated-docs/maz-switch.doc.md-->

<script lang="ts" setup>
  import { ref } from 'vue'
  const switchValue = ref(false)
  const switchValueDisabled = ref(false)
  const sizeValue = ref(true)
  const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl']

  const colors = [
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'destructive',
    'accent',
    'contrast',
    'neutral',
  ]
</script>
