---
title: MazMorphIcon
description: MazMorphIcon is an icon whose strokes move into another icon. Use it for two-state buttons - menu and close, play and pause, show and hide a password.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Pick a pair with `name` and switch the state with `active`: `false` is the first icon, `true` is the second one.

The button carries the state: use `aria-pressed` for a toggle, or `aria-expanded` for a menu. The icon is decorative (`aria-hidden`).

<ComponentDemo expanded>
  <MazBtn
    aria-label="Menu"
    :aria-expanded="open"
    color="transparent"
    @click="open = !open"
  >
    <MazMorphIcon name="menu-close" size="lg" :active="open" />
  </MazBtn>

<template #code>

```vue
<script lang="ts" setup>
import MazBtn from 'maz-ui/components/MazBtn'
import MazMorphIcon from 'maz-ui/components/MazMorphIcon'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <MazBtn aria-label="Menu" :aria-expanded="open" color="transparent" @click="open = !open">
    <MazMorphIcon name="menu-close" size="lg" :active="open" />
  </MazBtn>
</template>
```

  </template>
</ComponentDemo>

<script setup lang="ts">
  import { reactive, ref } from 'vue'

  const open = ref(false)

  const pairs = [
    { name: 'menu-close', label: 'Menu and close' },
    { name: 'plus-close', label: 'Plus and close' },
    { name: 'plus-minus', label: 'Plus and minus' },
    { name: 'play-pause', label: 'Play and pause' },
    { name: 'eye-eye-slash', label: 'Show and hide' },
    { name: 'copy-check', label: 'Copy and copied' },
    { name: 'sun-moon', label: 'Light and dark' },
    { name: 'chevron-down-up', label: 'Chevron down and up' },
    { name: 'sound-mute', label: 'Sound and mute' },
  ] as const

  const state = reactive<Record<string, boolean>>({})
</script>

## Pairs

Click each button to switch the state.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:gap-4">
    <div v-for="pair in pairs" :key="pair.name" class="maz:flex maz:flex-col maz:items-center maz:gap-2">
      <MazBtn
        :aria-label="pair.label"
        :aria-pressed="!!state[pair.name]"
        color="transparent"
        @click="state[pair.name] = !state[pair.name]"
      >
        <MazMorphIcon :name="pair.name" size="lg" :active="!!state[pair.name]" />
      </MazBtn>
      <span class="maz:text-xs maz:text-muted">{{ pair.name }}</span>
    </div>
  </div>

<template #code>

```vue
<template>
  <MazBtn aria-label="Menu" :aria-expanded="on" @click="on = !on">
    <MazMorphIcon name="menu-close" :active="on" />
  </MazBtn>

  <MazBtn aria-label="Play" :aria-pressed="on" @click="on = !on">
    <MazMorphIcon name="play-pause" :active="on" />
  </MazBtn>
</template>
```

  </template>
</ComponentDemo>

| name | `active` false | `active` true |
| --- | --- | --- |
| `menu-close` | three lines | cross |
| `plus-close` | plus | cross |
| `plus-minus` | plus | minus |
| `play-pause` | play | pause |
| `eye-eye-slash` | eye | crossed eye |
| `copy-check` | copy | check |
| `sun-moon` | sun | moon |
| `chevron-down-up` | chevron down | chevron up |
| `sound-mute` | speaker with sound | muted speaker |

## size and stroke width

`size` takes `xs`, `sm`, `md`, `lg`, `xl` or any CSS length, like [MazIcon](./maz-icon.md). `strokeWidth` is in the units of the 24x24 viewBox (default `2`). The icon uses `currentColor`.

<ComponentDemo>
  <div class="maz:flex maz:items-center maz:gap-4">
    <MazMorphIcon name="plus-close" size="xs" :active="open" />
    <MazMorphIcon name="plus-close" size="xl" :stroke-width="1.5" :active="open" />
    <MazMorphIcon name="plus-close" size="3rem" :stroke-width="3" :active="open" />
  </div>

<template #code>

```vue
<template>
  <MazMorphIcon name="plus-close" size="xs" :active="open" />
  <MazMorphIcon name="plus-close" size="xl" :stroke-width="1.5" :active="open" />
  <MazMorphIcon name="plus-close" size="3rem" :stroke-width="3" :active="open" />
</template>
```

  </template>
</ComponentDemo>

## Right to left

`play-pause` and `sound-mute` point in a direction: they are mirrored when the page is `dir="rtl"`.

## Reduced motion

With reduced motion (system preference or the `motion` option of `MazUi`), the icon swaps instantly.

<!--@include: ./../../.vitepress/generated-docs/maz-morph-icon.doc.md-->
