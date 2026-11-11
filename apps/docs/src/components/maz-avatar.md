---
title: MazAvatar
description: MazAvatar is a standalone component that displays an image or an icon with a caption. It can be used to display a user's profile picture, a placeholder image, or an icon.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

::: tip
This component uses [vLazyImg](./../directives/lazy-img.md) directive
:::

## Basic usage

<div class="vp-raw">
<MazAvatar src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80" />
</div>

```vue
<script lang="ts" setup>
import MazAvatar from 'maz-ui/components/MazAvatar'
</script>

<template>
  <MazAvatar src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80" />
</template>
```

## Options

::: tip
See all the options props [here](#props-event-slots)
:::

<div class="vp-raw flex space-between gap-05 items-center flex-wrap">
  <MazAvatar
    caption="Louis Mazel"
    size="1.5rem"
  />
  <MazAvatar
    src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=maz-ui"
    size="2rem"
    href="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=maz-ui"
    target="_blank"
    rounded-size="none"
    clickable
  >
    <template #icon>
      <MazIcon icon="/eye.svg" style="color: white;" size="2rem" />
    </template>
  </MazAvatar>

<MazAvatar
src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=200"
size="2.5rem"
clickable
rounded-size="xl"
button-color="destructive"
@click="clicked"
/>

<MazAvatar
  src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=600"
  size="3rem"
  bordered
  noElevation
/>

</div>

```vue
<script lang="ts" setup>
import MazAvatar from 'maz-ui/components/MazAvatar'
function clicked() { console.log('clicked') }
</script>

<template>
  <MazAvatar
    caption="Louis Mazel"
    size="1.5rem"
  />
  <MazAvatar
    src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=maz-ui"
    size="2rem"
    href="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=maz-ui"
    target="_blank"
    rounded-size="none"
    clickable
  >
    <template #icon>
      <MazIcon icon="/eye.svg" />
    </template>
  </MazAvatar>
  <MazAvatar
    src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=200"
    size="2.5rem"
    clickable
    rounded-size="xl"
    @click="clicked"
  />
  <MazAvatar
    src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=600"
    size="3rem"
    bordered
  />
</template>
```

## Initials from caption

When no `src` is provided, `MazAvatar` displays initials generated from the `caption`. The `letter-count` prop (default `2`) controls how many letters are displayed:

- **Single word**: the first `letter-count` characters of the word are used.
- **Multiple words**: the first letter of each of the first `letter-count` words is used.

Initials are always uppercased.

<div class="vp-raw flex gap-05 items-center flex-wrap">
  <MazAvatar caption="admin" size="3rem" />
  <MazAvatar caption="admin" :letter-count="3" size="3rem" />
  <MazAvatar caption="Louis Mazel" size="3rem" />
  <MazAvatar caption="Jean Claude Dus" :letter-count="3" size="3rem" />
</div>

```vue
<template>
  <!-- "AD" -->
  <MazAvatar caption="admin" />
  <!-- "ADM" -->
  <MazAvatar caption="admin" :letter-count="3" />
  <!-- "LM" -->
  <MazAvatar caption="Louis Mazel" />
  <!-- "JCD" -->
  <MazAvatar caption="Jean Claude Dus" :letter-count="3" />
</template>
```

## On Error

When no `src` (and no `caption`) is provided, or when the image fails to load, `MazAvatar` displays the default `no-image` placeholder.

<div class="vp-raw">
<MazAvatar @error="error" src="https://broken-link-image-src.example" />
</div>

```html
<MazAvatar @error="error" src="https://broken-link-image-src.example" />
```

## Fallback image loaded on error

<div class="vp-raw">
<MazAvatar
  class="vp-raw"
  src="https://broken-link-image-src.com"
  fallback-src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=100"
/>
</div>

```html
<MazAvatar
  src="https://broken-link-image-src.com"
  fallback-src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=100"
/>
```

## Loading

The props `loading` has 3 possible values: `intersecting`, `lazy`, or `eager`.

By default, the value is `intersecting` which means the image will be loaded when it's intersecting with the `IntersectionObserver` browser API. This mode uses the [`MazLazyImg`](./maz-lazy-img.md) component with [`vLazyImg`](./../directives/lazy-img.md) directive to handle the lazy loading.

Native modes:

- `lazy`: The image will be loaded only when it's in the viewport
- `eager`: The image will be loaded immediately

These modes are native use an `HTMLImageElement` with the `loading` attribute. (see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-loading)). **Useful for SSR (Server Side Rendering) or when you want to load the image immediately.**

<div class="vp-raw flex gap-05 items-center flex-wrap">
  <MazAvatar
    class="vp-raw"
    loading="intersecting"
    src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=123"
  />
  <MazAvatar
    class="vp-raw"
    loading="lazy"
    src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=123"
  />
  <MazAvatar
    class="vp-raw"
    loading="eager"
    src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=123"
  />
</div>

```html
<MazAvatar
  loading="intersecting"
  src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=123"
/>
<MazAvatar loading="lazy" src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=123" />
<MazAvatar loading="eager" src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=123" />
```

## Image height full

By default the image fills the avatar **width** (`width: 100%`). Enable `image-height-full` to make the image fill the **height** instead: it keeps its aspect ratio, fills 100% of the height and overflows/crops horizontally. This is ideal for wide images or SVGs (like flags) that must cover the whole avatar.

<div class="vp-raw flex gap-05 items-center flex-wrap">
  <MazAvatar class="vp-raw" size="4rem" src="https://placedog.net/300/200?id=7" />
  <MazAvatar class="vp-raw" size="4rem" image-height-full src="https://placedog.net/300/200?id=7" />
</div>

```vue
<template>
  <!-- default: width 100% -->
  <MazAvatar src="https://placedog.net/300/200" />
  <!-- height 100%, cropped on the sides -->
  <MazAvatar image-height-full src="https://placedog.net/300/200" />
</template>
```

## Automatic color

With `color="auto"`, an avatar showing initials gets a stable hue derived from its `caption`: the same name always gives the same color, different names give distinct ones. It is ideal for lists of people without a photo, where a single brand color would make everyone look alike.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-3">
    <MazAvatar v-for="name in autoNames" :key="name" :caption="name" color="auto" />
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import MazAvatar from 'maz-ui/components/MazAvatar'

const names = ['Camille Durand', 'Sam Okafor', 'Nina Rossi', 'Louis Mazel', 'Aya Tanaka', 'Omar Haddad']
</script>

<template>
  <MazAvatar v-for="name in names" :key="name" :caption="name" color="auto" />
</template>
```

  </template>
</ComponentDemo>

The color is computed from the caption only (no storage, no server): it is the same on every page, device and session. White initials sit on a medium-lightness tone, so they stay readable in light and dark modes. With an `src` image, `color` has no effect.

## Indicator

The `indicator` prop adds a [MazIndicator](./maz-indicator.md) on a corner of the avatar:

- `true` (or the attribute alone) shows a **dot** at the bottom end, to signal a status (online, away, recording);
- a **number** or a **short text** shows a counter at the top end (unread messages, notifications);
- an **object** gives the props of [MazIndicator](./maz-indicator.md) (`color`, `position`, `max`, `label`, `pulse`...), which override those defaults.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-6">
    <MazAvatar caption="Camille Durand" color="auto" :indicator="{ color: 'success', label: 'Online' }" />
    <MazAvatar caption="Sam Okafor" color="auto" :indicator="{ color: 'warning', label: 'Away' }" />
    <MazAvatar caption="Nina Rossi" color="auto" :indicator="{ content: 3, color: 'destructive', label: '3 unread messages' }" />
    <MazAvatar caption="Aya Tanaka" color="auto" :indicator="{ content: 128, color: 'destructive', label: 'More than 99 unread messages' }" />
    <MazAvatar caption="Omar Haddad" color="auto" :indicator="{ content: 'New', color: 'info', position: 'top-start' }" />
    <MazAvatar caption="Louis Mazel" color="auto" rounded-size="full" :indicator="{ color: 'destructive', pulse: true, label: 'Recording' }" />
  </div>

  <template #code>

```vue
<template>
  <!-- A dot: a status (bottom end) -->
  <MazAvatar caption="Camille Durand" color="auto" :indicator="{ color: 'success', label: 'Online' }" />

  <!-- A counter (top end) -->
  <MazAvatar caption="Nina Rossi" color="auto" :indicator="3" />

  <!-- Props of MazIndicator override the defaults -->
  <MazAvatar
    caption="Nina Rossi"
    color="auto"
    :indicator="{ content: 3, color: 'destructive', label: '3 unread messages' }"
  />

  <!-- Above `max` (99 by default), the counter shows `99+` -->
  <MazAvatar caption="Aya Tanaka" color="auto" :indicator="{ content: 128, color: 'destructive' }" />

  <!-- A short text, on another corner -->
  <MazAvatar caption="Omar Haddad" color="auto" :indicator="{ content: 'New', color: 'info', position: 'top-start' }" />

  <!-- A live status -->
  <MazAvatar caption="Louis Mazel" color="auto" rounded-size="full" :indicator="{ color: 'destructive', pulse: true }" />
</template>
```

  </template>
</ComponentDemo>

| `indicator` | Result |
| --- | --- |
| `true` or the attribute alone | A dot at the bottom end |
| `number` or `string` | A counter at the top end. `0`, `false` and `undefined` hide it (pass `'0'` to show a zero) |
| `MazIndicatorProps` | The props of [MazIndicator](./maz-indicator.md), over the defaults above (`position` defaults to `bottom-end` without `content`, `top-end` with one) |

The indicator is `circular` automatically when `rounded-size="full"`, so it stays on the edge of the circle. Other shapes keep the `rectangular` overlap, which you can still change in the object.

### Sizes and positions

The indicator scales with the avatar (it is sized in `em`), so it follows `size`.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-end maz:gap-6">
    <MazAvatar caption="Louis Mazel" color="auto" size="1.5rem" :indicator="{ color: 'success', label: 'Online' }" />
    <MazAvatar caption="Louis Mazel" color="auto" size="2rem" :indicator="{ color: 'success', label: 'Online' }" />
    <MazAvatar caption="Louis Mazel" color="auto" size="3rem" :indicator="{ content: 7, label: '7 notifications' }" />
    <MazAvatar v-for="position in indicatorPositions" :key="position" caption="Louis Mazel" color="auto" size="2.5rem" :indicator="{ position, color: 'accent' }" />
  </div>

  <template #code>

```vue
<template>
  <MazAvatar caption="Louis Mazel" size="1.5rem" :indicator="{ color: 'success' }" />
  <MazAvatar caption="Louis Mazel" size="3rem" :indicator="{ content: 7, label: '7 notifications' }" />

  <MazAvatar caption="Louis Mazel" :indicator="{ position: 'top-start' }" />
  <MazAvatar caption="Louis Mazel" :indicator="{ position: 'top-end' }" />
  <MazAvatar caption="Louis Mazel" :indicator="{ position: 'bottom-start' }" />
  <MazAvatar caption="Louis Mazel" :indicator="{ position: 'bottom-end' }" />
</template>
```

  </template>
</ComponentDemo>

### Custom indicator content

The `indicator` slot replaces the text of a counter. It receives `{ text }`, the text computed from `indicator` and its `max` (`99+` for instance). The indicator is read through its `label`, not through the slot content.

<ComponentDemo>
  <MazAvatar caption="Nina Rossi" color="auto" size="3rem" :indicator="{ content: 250, color: 'destructive', label: '250 unread messages' }">
    <template #indicator="{ text }">
      {{ text }} new
    </template>
  </MazAvatar>

  <template #code>

```vue
<template>
  <MazAvatar
    caption="Nina Rossi"
    size="3rem"
    :indicator="{ content: 250, color: 'destructive', label: '250 unread messages' }"
  >
    <template #indicator="{ text }">
      {{ text }} new
    </template>
  </MazAvatar>
</template>
```

  </template>
</ComponentDemo>

### Ring color

A thin ring separates the indicator from the avatar. It takes the color of the surface behind the avatar (the container background, or the page surface). On another background, such as a colored header, override the `--m-indicator-ring` CSS variable so the ring blends in:

```html
<header class="bg-primary p-4 [--m-indicator-ring:var(--maz-primary)]">
  <MazAvatar caption="Louis Mazel" :indicator="{ color: 'success', label: 'Online' }" />
</header>
```

### Accessibility

- Without a `label`, the indicator is **decorative** (hidden from assistive technologies). A status shown only by a colored dot is invisible to screen readers and ambiguous for color-blind users: set `label` in the object ("Online", "3 unread messages") whenever the indicator carries information.
- Give the label in the language of the page, and update it with the state (`:indicator="{ color: 'success', label: online ? 'Online' : 'Offline' }"`).
- Do not rely on color alone for a status that matters: pair the dot with a text next to the avatar when you can.

<script lang="ts" setup>
  const autoNames = ['Camille Durand', 'Sam Okafor', 'Nina Rossi', 'Louis Mazel', 'Aya Tanaka', 'Omar Haddad']
  const indicatorPositions = ['top-start', 'top-end', 'bottom-start', 'bottom-end']
  const clicked = () => { console.log('clicked') }
  const error = (el) => { console.error('error', el) }
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-avatar.doc.md-->