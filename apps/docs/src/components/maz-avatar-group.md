---
title: MazAvatarGroup
description: MazAvatarGroup displays overlapping MazAvatar, with a "+N" counter beyond a maximum. The avatars slide apart on hover to show themselves fully.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Pass the `avatars`, each with the props of [MazAvatar](./maz-avatar.md). Hover the group: the avatars slide apart.

<ComponentDemo expanded>
  <MazAvatarGroup :avatars="people" />

<template #code>

```vue
<script lang="ts" setup>
import MazAvatarGroup from 'maz-ui/components/MazAvatarGroup'

const people = [
  { caption: 'Camille Durand', color: 'auto' },
  { caption: 'Louis Mazel', color: 'auto' },
  { src: '/hugo.jpg', alt: 'Hugo Petit' },
]
</script>

<template>
  <MazAvatarGroup :avatars="people" />
</template>
```

  </template>
</ComponentDemo>

<script lang="ts" setup>
import { ref } from 'vue'

const people = [
  { caption: 'Camille Durand', color: 'auto' },
  { caption: 'Louis Mazel', color: 'auto' },
  { caption: 'Ines Martin', color: 'auto' },
  { caption: 'Hugo Petit', color: 'auto' },
  { caption: 'Jade Moreau', color: 'auto' },
  { caption: 'Nina Roux', color: 'auto' },
]
const open = ref(false)
</script>

## Maximum

`max` limits the displayed avatars: the others are counted in a "+N" avatar.

<ComponentDemo>
  <MazAvatarGroup :avatars="people" :max="3" />

<template #code>

```vue
<template>
  <MazAvatarGroup :avatars="people" :max="3" />
</template>
```

  </template>
</ComponentDemo>

## Clickable counter

With `more-clickable`, the counter is a button that emits `more-click`: open a list, a popover or a dialog. The `more` slot replaces the counter and gets `count` and the `hidden` avatars.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-2">
    <MazAvatarGroup :avatars="people" :max="3" more-clickable @more-click="open = !open" />
    <p v-if="open">{{ people.slice(3).map(person => person.caption).join(', ') }}</p>
  </div>

<template #code>

```vue
<template>
  <MazAvatarGroup :avatars="people" :max="3" more-clickable @more-click="open = !open" />
</template>
```

  </template>
</ComponentDemo>

## Size, overlap and shape

`size` takes the sizes of MazAvatar, `overlap` is the share of an avatar hidden by the next one (`0.2` by default) and `rounded-size` the shape (`full` by default). Set `:spread="false"` to disable the slide.

<ComponentDemo>
  <MazAvatarGroup :avatars="people" size="lg" :overlap="0.35" rounded-size="lg" />

<template #code>

```vue
<template>
  <MazAvatarGroup :avatars="people" size="lg" :overlap="0.35" rounded-size="lg" />
</template>
```

  </template>
</ComponentDemo>

## Accessibility and motion

- The group is a list. Each avatar keeps its name (its `caption` or `alt`) for screen readers and as a `title` tooltip, and the "+N" counter is read "N more".
- The slide uses only `transform`, and the group grows over its neighbors while it is open. It also opens when an element of the group has the focus, and it is off when the user reduces motion.

<!--@include: ./../../.vitepress/generated-docs/maz-avatar-group.doc.md-->
