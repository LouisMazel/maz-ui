---
title: MazIcon
description: A flexible icon component that accepts Vue components, raw SVG strings, URLs and data URIs.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

::: tip
Download the bundled icons pack [here](#get-icons-pack), or use [`@maz-ui/icons`](../guide/icons.md) for the full set.
:::

## How it works

Pass an `icon` prop in any of the supported formats — the component detects what it received and renders accordingly:

| Input | Example | Use it for |
| --- | --- | --- |
| **Vue component** | `import { MazStar } from '@maz-ui/icons/static/MazStar'` | Always-rendered icons that you also want available as a standalone component (`<MazStar />`). |
| **Raw SVG string** | `import { MazStar } from '@maz-ui/icons/raw/MazStar'` | Always-rendered icons — the lightest format, no Vue component overhead. |
| **URL or `data:` URI** | `'/icons/star.svg'`, `'data:image/svg+xml,…'` | SVGs hosted in your `public/` folder or external CDN. Fetched and cached on demand. |

```vue
<script setup>
import MazIcon from 'maz-ui/components/MazIcon'
import { MazStar } from '@maz-ui/icons/raw/MazStar'
</script>

<template>
  <MazIcon :icon="MazStar" />
  <MazIcon icon="/icons/star.svg" />
  <MazIcon icon="<svg viewBox='0 0 24 24'><path d='M0 0h24v24H0z'/></svg>" />
</template>
```

## Examples

### Raw SVG (recommended)

<ComponentDemo>

  <MazIcon :icon="icons.MazStar" />

  <template #code>

```vue
<script lang="ts" setup>
  import { MazStar } from '@maz-ui/icons/raw/MazStar'
</script>

<template>
  <MazIcon :icon="MazStar" />
</template>
```

  </template>
</ComponentDemo>

### URL (fetched at runtime)

Place your SVG file in your `public/` folder, then point `icon` to its path. The component caches the fetched payload and shares it across instances.

<ComponentDemo>

  <MazIcon icon="/academic-cap.svg" />

  <template #code>

```vue
<MazIcon icon="/academic-cap.svg" />
```

  </template>
</ComponentDemo>

### Vue component

<ComponentDemo>

  <MazIcon :icon="icons.MazStar" />

  <template #code>

```vue
<script lang="ts" setup>
  import { MazStar } from '@maz-ui/icons/static/MazStar'
</script>

<template>
  <MazIcon :icon="MazStar" />
</template>
```

  </template>
</ComponentDemo>

## Fallback

When the URL fetch fails, an `error` event is emitted and `MazIcon` switches to the `fallback` prop (same shape as `icon`). If neither resolves, the bundled `MazQuestionMarkCircle` is rendered.

```vue
<MazIcon icon="/missing.svg" :fallback="MazStar" @error="onIconError" />
```

## Sizing

### Predefined sizes (`'xs' | 'sm' | 'md' | 'lg' | 'xl'`)

<ComponentDemo>
  <div class="maz:flex maz:gap-2 maz:flex-wrap maz:items-center">
    <MazIcon v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size" :size="size" :icon="icons.MazStar" />
  </div>

  <template #code>

```vue
<script lang="ts" setup>
  import { MazStar } from '@maz-ui/icons/raw/MazStar'
</script>

<template>
  <MazIcon v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size" :size="size" :icon="MazStar" />
</template>
```

  </template>
</ComponentDemo>

### Custom size (any CSS length)

Allowed units: `px`, `em`, `rem`, `%`, `vw`, `vh`, `cm`, `mm`, `in`, `pt`, `pc`, `ex`.

<ComponentDemo>
  <div class="maz:flex maz:gap-2 maz:flex-wrap maz:items-center">
    <MazIcon size="0.5em" :icon="icons.MazStar" />
    <MazIcon size="1em" :icon="icons.MazStar" />
    <MazIcon size="24px" :icon="icons.MazStar" />
    <MazIcon size="4rem" :icon="icons.MazStar" />
    <MazIcon size="8rem" :icon="icons.MazStar" />
  </div>

  <template #code>

```vue
<MazIcon size="0.5em" :icon="MazStar" />
<MazIcon size="1em" :icon="MazStar" />
<MazIcon size="24px" :icon="MazStar" />
<MazIcon size="4rem" :icon="MazStar" />
<MazIcon size="8rem" :icon="MazStar" />
```

  </template>
</ComponentDemo>

## Accessibility

By default `MazIcon` is rendered as decorative (`aria-hidden="true"`, no `role`). Provide an `aria-label` (either on `<MazIcon>` or in `svgAttributes`) to expose it to assistive tech — `role="img"` is set automatically and `aria-hidden` is dropped.

```vue
<MazIcon :icon="MazStar" aria-label="Favorite" />
```

## RTL flipping

Set `flip-icon-for-rtl` on directional icons (chevrons, arrows). The icon is mirrored horizontally when the document direction is `rtl` and rendered unchanged otherwise.

```vue
<MazIcon :icon="MazChevronRight" flip-icon-for-rtl />
```

## Custom SVG attributes

Inject extra attributes onto the rendered `<svg>` (or onto the inlined raw SVG) via `svg-attributes`:

```vue
<MazIcon :icon="MazStar" :svg-attributes="{ 'data-testid': 'star', fill: 'currentColor' }" />
```

## SSR — base URL for relative URLs

When you render `MazIcon icon="/icons/star.svg"` on the server, `fetch('/icons/star.svg')` cannot resolve without a host. Provide a base URL via Vue's `provide` to fix this:

```ts
import { createApp } from 'vue'

const app = createApp(App)
app.provide('mazIconPath', 'https://your-app.com')
```

In Nuxt, set `mazUi.general.defaultMazIconPath` in `nuxt.config` and `@maz-ui/nuxt` wires the provide for you.

## Forwarding `MazIconProps` from a consumer

Most icon-aware components in maz-ui (`MazBtn`, `MazInput`, `MazLink`, `MazContainer`, `MazDropdown`) accept a flexible icon prop on their `startIcon`, `endIcon`, `icon` or `dropdownIcon` slots. You can pass either a bare value (the same shape as `MazIcon`'s `icon` prop) or a full `MazIconProps` object when you need fine-grained control:

```html
<!-- bare value — common case -->
<MazBtn :start-icon="MazStar" />
<MazBtn start-icon="/icons/star.svg" />

<!-- full props object — override size, set a title, flip for RTL, etc. -->
<MazBtn
  :start-icon="{
    icon: MazStar,
    size: 'xl',
    title: 'Favorite',
    flipIconForRtl: true,
  }"
/>
```

The consuming component still derives sensible defaults (e.g. icon size from the button's `size` prop), and the values you set in the props object override those defaults.

## All bundled icons

This pack is the Heroicons set plus a few additions specific to maz-ui.

<MazBtn download href="/icons/_icons.zip" end-icon="/arrow-down-tray.svg">
  Download pack
</MazBtn>

Source: [Heroicons](https://heroicons.com/) — see also the [icon set page](./../guide/icon-set.md).

<div class="flex items-start flex-wrap gap-05">
  <div v-for="({ component, name }, i) in iconsList" :key="i" class="flex flex-col flex-center maz:p-2 maz:rounded-md maz:border">
    <MazIcon :icon="component" size="lg" />
    <span style="font-size: 11px;">
      {{ name }}
    </span>
  </div>
</div>

<script setup lang="ts">
  import * as icons from '@maz-ui/icons'

  const iconsList = Object.entries(icons).map(([key, value]) => ({
    name: key,
    component: value,
  }))
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-icon.doc.md-->
