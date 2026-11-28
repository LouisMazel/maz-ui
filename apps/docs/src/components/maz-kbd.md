---
title: MazKbd
description: MazKbd shows keyboard keys with a slight relief, alone or as a shortcut like Cmd K. It knows the platform, and with live the keys press down when the user types the shortcut.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Write the shortcut in `keys`. `mod` is the key of the shortcuts of the platform: Cmd on Apple, Ctrl elsewhere.

<ComponentDemo expanded>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-6">
    <MazKbd keys="mod+k" />
    <MazKbd keys="Ctrl + Shift + P" platform="other" />
    <MazKbd keys="alt+enter" platform="apple" />
  </div>

<template #code>

```vue
<MazKbd keys="mod+k" />
<MazKbd keys="Ctrl + Shift + P" platform="other" />
<MazKbd keys="alt+enter" platform="apple" />
```

  </template>
</ComponentDemo>

`keys` also takes an array: `['mod', 'k']`.

## A single key

Without `keys`, the default slot is one key.

<ComponentDemo>
  <span>Close with <MazKbd>Esc</MazKbd></span>

<template #code>

```vue
<span>Close with <MazKbd>Esc</MazKbd></span>
```

  </template>
</ComponentDemo>

## size

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-6">
    <MazKbd keys="mod+k" size="sm" />
    <MazKbd keys="mod+k" size="md" />
    <MazKbd keys="mod+k" size="lg" />
  </div>

<template #code>

```vue
<MazKbd keys="mod+k" size="sm" />
<MazKbd keys="mod+k" size="md" />
<MazKbd keys="mod+k" size="lg" />
```

  </template>
</ComponentDemo>

## live

With `live`, the keys press down while the user types the shortcut. It listens to the keyboard only while the component is mounted. It does not run the action: use `useShortcut` for that.

<ComponentDemo>
  <MazKbd keys="mod+j" live />

<template #code>

```vue
<MazKbd keys="mod+j" live />
```

  </template>
</ComponentDemo>

## Platform

The server and the first render use the Ctrl form, then the component switches to the symbols on Apple once mounted: there is no hydration mismatch. Set `platform="apple"` or `platform="other"` to skip the detection.

## Accessibility

- Each key is a `<kbd>` element. The symbol keys (Cmd, Shift, Option, Control) get a text name for screen readers.
- Only `transform` and the shadow change when a key is pressed, and nothing moves with reduced motion.

<!--@include: ./../../.vitepress/generated-docs/maz-kbd.doc.md-->
