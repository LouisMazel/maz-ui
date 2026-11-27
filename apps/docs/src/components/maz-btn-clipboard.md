---
title: MazBtnClipboard
description: MazBtnClipboard is a button that copies a value in one click, for IDs, commands, tokens and URLs. It shows the value and turns into a check once copied.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Give the text to copy in `value`. A click copies it and shows a check for 1.5 second.

<ComponentDemo expanded>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-3">
    <MazBtnClipboard value="usr_2x8Kf93LmQ" />
    <MazBtnClipboard value="npm install maz-ui" prompt="$" />
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import MazBtnClipboard from 'maz-ui/components/MazBtnClipboard'
</script>

<template>
  <MazBtnClipboard value="usr_2x8Kf93LmQ" />
  <MazBtnClipboard value="npm install maz-ui" prompt="$" />
</template>
```

  </template>
</ComponentDemo>

`prompt` adds a prefix that is displayed but not copied: `$` for a command, `#` for an ID.

## Variants

Four styles: `soft` (default), `solid`, `outlined` and `ghost`.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-4">
    <div v-for="variant in variants" :key="variant" class="maz:flex maz:flex-wrap maz:items-center maz:gap-3">
      <span class="maz:w-20 maz:text-sm maz:text-muted">{{ variant }}</span>
      <MazBtnClipboard :variant="variant" value="pnpm add maz-ui" prompt="$" />
      <MazBtnClipboard :variant="variant" color="primary" value="ord_7731" prompt="#" />
      <MazBtnClipboard :variant="variant" color="success" value="demo_live_51Hb" />
    </div>
  </div>

  <template #code>

```vue
<template>
  <MazBtnClipboard variant="soft" value="pnpm add maz-ui" prompt="$" />
  <MazBtnClipboard variant="solid" color="primary" value="ord_7731" prompt="#" />
  <MazBtnClipboard variant="outlined" color="success" value="demo_live_51Hb" />
  <MazBtnClipboard variant="ghost" value="pnpm add maz-ui" prompt="$" />
</template>
```

  </template>
</ComponentDemo>

## Colors

`container` (default) and `surface` are the neutral colors of the theme. The theme colors are `primary`, `secondary`, `accent`, `info`, `success`, `warning`, `destructive` and `contrast`. `neutral` is the soft grey of the theme, with a divider border (`soft` and `solid` look the same).

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-3">
    <MazBtnClipboard v-for="color in colors" :key="color" :color="color" :value="color" />
  </div>

  <template #code>

```vue
<template>
  <MazBtnClipboard color="container" value="container" />
  <MazBtnClipboard color="primary" value="primary" />
  <MazBtnClipboard color="destructive" value="destructive" />
</template>
```

  </template>
</ComponentDemo>

## Sizes and radius

`size` goes from `mini` to `xl` (`md` by default), `rounded-size` from `none` to `full` (`md` by default).

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-3">
    <MazBtnClipboard v-for="size in sizes" :key="size" :size="size" :value="size" />
  </div>
  <div class="maz:mt-4 maz:flex maz:flex-wrap maz:items-center maz:gap-3">
    <MazBtnClipboard v-for="rounded in roundedSizes" :key="rounded" :rounded-size="rounded" :value="rounded" color="accent" />
  </div>

  <template #code>

```vue
<template>
  <MazBtnClipboard size="xs" value="xs" />
  <MazBtnClipboard size="lg" value="lg" />
  <MazBtnClipboard rounded-size="full" color="accent" value="full" />
</template>
```

  </template>
</ComponentDemo>

## Label, slot and long values

`label` (or the default slot) replaces the displayed text: the full `value` is still copied. Long values can be cut with `truncate`, and `block` takes the full width.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-3">
    <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-3">
      <MazBtnClipboard value="3f2a9c1e-7b4d-4e8a-9f6c-2d1b0a8e7c55" label="3f2a9c1e" prompt="#" />
      <MazBtnClipboard value="https://maz-ui.com/components/maz-btn-clipboard" :mono="false">
        Copy the link
      </MazBtnClipboard>
    </div>
    <MazBtnClipboard class="maz:max-w-64" truncate value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0" />
    <MazBtnClipboard block value="curl -fsSL https://example.com/install.sh | sh" prompt="$" />
  </div>

  <template #code>

```vue
<template>
  <!-- Displays a short ID, copies the full one -->
  <MazBtnClipboard value="3f2a9c1e-7b4d-4e8a-9f6c-2d1b0a8e7c55" label="3f2a9c1e" prompt="#" />

  <!-- Any content, in the font of the page -->
  <MazBtnClipboard value="https://maz-ui.com/components/maz-btn-clipboard" :mono="false">
    Copy the link
  </MazBtnClipboard>

  <!-- Cut with an ellipsis -->
  <MazBtnClipboard class="max-w-64" truncate value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." />

  <!-- Full width, the icon at the end -->
  <MazBtnClipboard block value="curl -fsSL https://example.com/install.sh | sh" prompt="$" />
</template>
```

  </template>
</ComponentDemo>

## Icon only

`icon-only` keeps only the copy icon: next to a value displayed elsewhere, in a table cell or a field.

<ComponentDemo>
  <div class="maz:flex maz:flex-wrap maz:items-center maz:gap-2">
    <code class="maz:text-sm">API_KEY=demo_key_8f2a91c4e7b3</code>
    <MazBtnClipboard icon-only variant="ghost" size="sm" value="demo_key_8f2a91c4e7b3" copy-label="Copy the API key" />
  </div>

  <template #code>

```vue
<template>
  <code>API_KEY=demo_key_8f2a91c4e7b3</code>
  <MazBtnClipboard
    icon-only
    variant="ghost"
    size="sm"
    value="demo_key_8f2a91c4e7b3"
    copy-label="Copy the API key"
  />
</template>
```

  </template>
</ComponentDemo>

## Events

`copy` is emitted with the value once it is in the clipboard, `error` when the copy fails (no Clipboard API outside of https, permission refused).

```vue
<script lang="ts" setup>
import MazBtnClipboard from 'maz-ui/components/MazBtnClipboard'
import { useToast } from 'maz-ui/composables/useToast'

const toast = useToast()
</script>

<template>
  <MazBtnClipboard
    value="usr_2x8Kf93LmQ"
    @copy="toast.success('ID copied')"
    @error="toast.error('The ID could not be copied')"
  />
</template>
```

## Defaults for the whole app

`size` and `rounded-size` can be set once for every MazBtnClipboard, with the `defaults` option of the plugin (or of the Nuxt module).

```ts
app.use(MazUi, {
  defaults: {
    MazBtnClipboard: { size: 'sm', roundedSize: 'full' },
  },
})
```

## Accessibility

- It is a native `button`: it works with the keyboard and shows a focus ring.
- The state ("Copy", then "Copied") is announced by a hidden live region and given as a tooltip (`title`). Change the texts with `copy-label` and `copied-label`; they are translated by default.
- With `icon-only`, set a `copy-label` that says what is copied ("Copy the API key").
- The `prompt` is hidden from assistive technologies.

## Without the component

For a copy action of your own (a menu item, a shortcut), use the [useClipboard](./../composables/use-clipboard.md) composable.

<script lang="ts" setup>
const variants = ['soft', 'solid', 'outlined', 'ghost'] as const
const colors = ['container', 'surface', 'primary', 'secondary', 'accent', 'info', 'success', 'warning', 'destructive', 'contrast', 'neutral'] as const
const sizes = ['mini', 'xs', 'sm', 'md', 'lg', 'xl'] as const
const roundedSizes = ['none', 'sm', 'md', 'lg', 'xl', 'full'] as const
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-btn-clipboard.doc.md-->
