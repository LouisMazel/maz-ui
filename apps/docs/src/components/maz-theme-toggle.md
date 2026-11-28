---
title: MazThemeToggle
description: MazThemeToggle is a button that switches between the light and the dark mode. The sun morphs into a moon, and an option adds the system mode as a third state.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

The button needs the theme of `@maz-ui/themes` (the `MazUi` plugin or the Nuxt module). It starts from the setting of the system and keeps the choice of the user.

<ComponentDemo expanded>
  <MazThemeToggle />

<template #code>

```vue
<script lang="ts" setup>
import MazThemeToggle from 'maz-ui/components/MazThemeToggle'
</script>

<template>
  <MazThemeToggle />
</template>
```

  </template>
</ComponentDemo>

## Three states

Add `tri-state` to cycle light, dark and system. The system mode follows the setting of the operating system.

<ComponentDemo>
  <MazThemeToggle tri-state />

<template #code>

```vue
<MazThemeToggle tri-state />
```

  </template>
</ComponentDemo>

## Size and color

The button is a `MazBtn` with `fab`: it accepts `size` and `color`. The color is `transparent` by default.

<ComponentDemo>
  <div class="maz:flex maz:items-center maz:gap-4">
    <MazThemeToggle size="sm" />
    <MazThemeToggle size="lg" color="primary" />
    <MazThemeToggle color="surface" />
  </div>

<template #code>

```vue
<MazThemeToggle size="sm" />
<MazThemeToggle size="lg" color="primary" />
<MazThemeToggle color="surface" />
```

  </template>
</ComponentDemo>

## Custom icon

The `icon` slot replaces the icon. It receives `isDark` and `mode`.

```vue
<MazThemeToggle>
  <template #icon="{ isDark }">
    <span>{{ isDark ? 'Night' : 'Day' }}</span>
  </template>
</MazThemeToggle>
```

## Options

`animated` (default `true`): set `:animated="false"` to swap the icons without motion.

## Server rendering

The theme is read from the cookie or the storage in the browser. The first render, on the server and on the client, is the light state: the real state comes after the mount without motion, so there is no hydration mismatch.

## Accessibility and motion

- It is a real `button`. Its name always tells the next state: "Switch to dark mode", "Use the system theme", "Switch to light mode". The texts come from `@maz-ui/translations`.
- The icons are decorative and hidden from screen readers.
- With reduced motion, the icon changes at once.
- Only `transform` and `opacity` are animated, with the motion tokens of the theme.

## Events

`change` is emitted with the new mode (`light`, `dark` or `auto`) after the button changed it.

<!--@include: ./../../.vitepress/generated-docs/maz-theme-toggle.doc.md-->
