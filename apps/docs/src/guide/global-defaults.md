---
title: Global component defaults
description: Set default prop values once for every Maz-UI component through the MazUi plugin or the Nuxt module
head:
  - - meta
    - name: keywords
      content: maz-ui defaults, global props, default props, rounded size, component configuration, vue, nuxt
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

Instead of repeating the same prop on every instance (`<MazBtn rounded-size="lg" />` everywhere), you can set a default once and let every component pick it up.

## Priority

A resolved prop always follows this order, from highest to lowest priority:

1. The prop set on the component instance
2. `defaults.<ComponentName>` (per-component default)
3. `defaults.global` (cross-cutting default)
4. The library's built-in default

A global default **never** overrides a prop set on the instance. Without any `defaults` config, every component keeps its built-in default, so this feature is fully opt-in and backward compatible.

## Vue

Pass `defaults` to the `MazUi` plugin:

```ts
import { MazUi } from 'maz-ui/plugins/maz-ui'
import { mazUi as mazUiPreset } from '@maz-ui/themes/presets/mazUi'
import 'maz-ui/style.css'

app.use(MazUi, {
  theme: { preset: mazUiPreset },
  defaults: {
    global: { roundedSize: 'lg' },
    MazBtn: { roundedSize: 'full' }, // wins over global for MazBtn
    MazCard: { bordered: false, elevation: true },
    MazContainer: { bordered: false },
  },
})
```

## Nuxt

Set it in `nuxt.config` under the `mazUi` key:

```ts
export default defineNuxtConfig({
  modules: ['@maz-ui/nuxt'],
  mazUi: {
    defaults: {
      global: { roundedSize: 'lg' },
      MazBtn: { roundedSize: 'full' },
      MazCard: { bordered: false, elevation: true },
    },
  },
})
```

## `global` vs per-component

- `defaults.global` holds **cross-cutting** props shared by many components: `roundedSize` and `size`. Set them once and every component that exposes them picks the value up.
- `defaults.<ComponentName>` holds **per-component** props (including booleans such as `bordered`, `elevation`, `padding`). A per-component entry always wins over `global`.

```ts
defaults: {
  global: { roundedSize: 'lg', size: 'sm' },
  MazBtn: { roundedSize: 'full' }, // MazBtn is 'full', everything else 'lg'
}
```

## Type safety

`defaults` is fully typed. Each component entry is typed as `Partial<ComponentNameProps>`, so you get autocompletion and a TypeScript error on an unknown or mistyped prop:

```ts
defaults: {
  MazBtn: { roundedSiz: 'lg' }, // ❌ TS error: 'roundedSiz' does not exist
}
```

## Globalizable props

| Prop | Type | Components |
| --- | --- | --- |
| `roundedSize` | `MazRoundedSize` (`'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'`) | `MazBtn`, `MazBtnGroup`, `MazContainer`, `MazInput`, `MazTextarea`, `MazTable`, `MazBadge`, `MazAlert`, `MazAvatar`, `MazSkeleton`, `MazTimeline` |
| `size` | `MazSize` (`'mini' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`) | `MazBtn`, `MazBtnGroup`, `MazBadge`, `MazInput`, `MazSelect`, `MazSelectCountry`, `MazInputNumber`, `MazInputTags`, `MazInputPhoneNumber`, `MazCheckbox`, `MazRadio`, `MazRadioButtons`, `MazDropdown`, `MazPagination`, `MazTable`, `MazTimeline` |
| `bordered`, `elevation`, `padding`, `transparent`, `overflowHidden` | `boolean` | `MazContainer` |
| `bordered`, `elevation`, `padding`, `radius`, `scale`, `overflowHidden` | `boolean` | `MazCard` |

::: tip Note
Components whose `size` is a free CSS length (`MazSizeUnit`, e.g. `MazSpinner`, `MazAvatar`, `MazDrawer`, `MazSlider`, `MazCircularProgressBar`, `MazFullscreenLoader`) do not take the global `size` token - the value would not be valid for them. `MazAlert` and `MazTimeline` keep their own wider `roundedSize` scale; a `defaults.global.roundedSize` value still applies to them, and their extra steps (`2xl`, `3xl`) are reachable through their per-component entry.
:::

## Relation to the theme system

This is **not** a duplicate of [`@maz-ui/themes`](/ecosystem/themes). The theme system controls *what a token looks like* (the CSS value of `rounded-md`, `shadow-elevation`, colors…). Global defaults control *which prop value a component selects by default* (whether `MazBtn` defaults to `roundedSize="lg"`). Both work together: the theme defines what `lg` renders as, the defaults decide which step a component uses.
