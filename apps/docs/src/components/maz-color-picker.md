---
title: MazColorPicker
description: MazColorPicker is a color field with a swatch button that opens a picker panel (saturation, hue, opacity, eye dropper, swatches). It reads any CSS color and emits hex, rgb, hsl or oklch. It can also be rendered inline.
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

<!--@include: ./../../.vitepress/mixins/getting-started.md-->

## Basic usage

Bind the color with `v-model`. The field is a [MazInput](./maz-input.md): the user can type a color or open the panel with the swatch button.

<ComponentDemo expanded>
  <MazColorPicker v-model="color" label="Brand color" />
  <p class="maz:mt-3 maz:text-sm maz:text-muted">Selected: {{ color }}</p>

  <template #code>

```vue
<script lang="ts" setup>
import MazColorPicker from 'maz-ui/components/MazColorPicker'
import { ref } from 'vue'

const color = ref('#3b82f6')
</script>

<template>
  <MazColorPicker v-model="color" label="Brand color" />
</template>
```

  </template>
</ComponentDemo>

`v-model` accepts any CSS color: hex, `rgb()`, `hsl()`, `oklch()`, `oklab()` or a named color. When the user clears the field, the model is `undefined`. Every other attribute (`label`, `top-label`, `size`, `hint`, `error`, `assistive-text`, `block`, `rounded-size`...) is forwarded to the [MazInput](./maz-input.md).

## Formats

The `format` prop sets the format of the emitted color: `hex` (default), `rgb`, `hsl` or `oklch`. The incoming value can be in any format, it is converted on the next change.

<ComponentDemo>
  <div class="maz:grid maz:gap-4 maz:sm:grid-cols-2">
    <MazColorPicker v-model="formatHex" format="hex" label="hex" />
    <MazColorPicker v-model="formatRgb" format="rgb" label="rgb" />
    <MazColorPicker v-model="formatHsl" format="hsl" label="hsl" />
    <MazColorPicker v-model="formatOklch" format="oklch" label="oklch" />
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import MazColorPicker from 'maz-ui/components/MazColorPicker'
import { ref } from 'vue'

const formatHex = ref('#8b5cf6')
const formatRgb = ref('#8b5cf6')
const formatHsl = ref('#8b5cf6')
const formatOklch = ref('#8b5cf6')
</script>

<template>
  <MazColorPicker v-model="formatHex" format="hex" label="hex" />
  <MazColorPicker v-model="formatRgb" format="rgb" label="rgb" />
  <MazColorPicker v-model="formatHsl" format="hsl" label="hsl" />
  <MazColorPicker v-model="formatOklch" format="oklch" label="oklch" />
</template>
```

  </template>
</ComponentDemo>

## Opacity

The opacity slider is shown by default (`alpha`). The alpha channel is kept in the emitted value: `#rrggbbaa` in hex, `rgb(r g b / a)`, `hsl(h s l / a)`... Set `:alpha="false"` to hide the slider and always emit an opaque color.

<ComponentDemo>
  <div class="maz:grid maz:gap-4 maz:sm:grid-cols-2">
    <MazColorPicker v-model="alphaOn" label="With opacity" />
    <MazColorPicker v-model="alphaOff" :alpha="false" label="Without opacity" />
  </div>

  <template #code>

```vue
<script lang="ts" setup>
import MazColorPicker from 'maz-ui/components/MazColorPicker'
import { ref } from 'vue'

const alphaOn = ref('#3b82f680')
const alphaOff = ref('#3b82f6')
</script>

<template>
  <MazColorPicker v-model="alphaOn" label="With opacity" />
  <MazColorPicker v-model="alphaOff" :alpha="false" label="Without opacity" />
</template>
```

  </template>
</ComponentDemo>

## Swatches

Pass preset colors with `swatches`, in any CSS format. They are shown under the sliders and selecting one emits it in the `format` of the component.

<ComponentDemo>
  <MazColorPicker v-model="swatchColor" :swatches="brandSwatches" label="Brand palette" />

  <template #code>

```vue
<script lang="ts" setup>
import MazColorPicker from 'maz-ui/components/MazColorPicker'
import { ref } from 'vue'

const swatchColor = ref('#3b82f6')

const brandSwatches = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', 'oklch(0.3 0.02 260)', 'white']
</script>

<template>
  <MazColorPicker v-model="swatchColor" :swatches="brandSwatches" label="Brand palette" />
</template>
```

  </template>
</ComponentDemo>

## Eye dropper

In the browsers that support the [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API), a button lets the user pick a color anywhere on the screen. It is hidden in the other browsers. Set `:eye-dropper="false"` to remove it.

## Inline panel

With `inline`, the panel is rendered in the page instead of a popover. The text field sits under the sliders and the swatches.

<ComponentDemo>
  <MazColorPicker v-model="inlineColor" inline :swatches="brandSwatches" />

  <template #code>

```vue
<script lang="ts" setup>
import MazColorPicker from 'maz-ui/components/MazColorPicker'
import { ref } from 'vue'

const inlineColor = ref('#ec4899')
</script>

<template>
  <MazColorPicker v-model="inlineColor" inline :swatches="['#3b82f6', '#ec4899', '#10b981']" />
</template>
```

  </template>
</ComponentDemo>

## States and sizes

`disabled` blocks the field and the panel. `error`, `hint` and `assistive-text` come from the [MazInput](./maz-input.md), like `size`.

<ComponentDemo>
  <div class="maz:flex maz:flex-col maz:gap-4">
    <MazColorPicker v-model="stateColor" disabled label="Disabled" />
    <MazColorPicker v-model="stateColor" error assistive-text="This color is not allowed" label="Error" />
    <MazColorPicker v-for="size in sizes" :key="size" v-model="stateColor" :size="size" :label="`Size ${size}`" />
  </div>

  <template #code>

```vue
<template>
  <MazColorPicker v-model="color" disabled label="Disabled" />
  <MazColorPicker v-model="color" error assistive-text="This color is not allowed" label="Error" />
  <MazColorPicker v-model="color" size="sm" label="Small" />
  <MazColorPicker v-model="color" size="lg" label="Large" />
</template>
```

  </template>
</ComponentDemo>

## Events

- `update:model-value`: the new color in the `format` of the component, or `undefined` when the field is cleared.
- `open` and `close`: the popover opens or closes.

Use `position` to place the popover (`bottom-start` by default).

## Keyboard and accessibility

- The swatch button has an accessible name, `aria-haspopup="dialog"` and `aria-expanded`. The panel is a dialog.
- The saturation and brightness area is focusable: `ArrowLeft` and `ArrowRight` change the saturation, `ArrowDown` and `ArrowUp` the brightness. Hold `Shift` for steps of 10%.
- The hue and opacity sliders are native range inputs, with a text value (`aria-valuetext`) and their own labels.
- Every swatch is a button named with its color. The typed value is only applied when it is a valid CSS color, and the field is restored to the current color on blur.

## Translations

The texts of the panel come from the `colorPicker` keys of [@maz-ui/translations](./../ecosystem/translations.md). Override some of them for one instance with the `translations` prop. `{saturation}`, `{brightness}` and `{color}` are replaced in `areaValue` and `selectSwatch`.

```vue
<template>
  <MazColorPicker
    v-model="color"
    :translations="{
      openPicker: 'Choisir une couleur',
      hue: 'Teinte',
      alpha: 'Opacité',
    }"
  />
</template>
```

## Theming

Pick a color for your theme, then apply it as a preset. The [Theme Editor](./../theme-editor.md) of this documentation uses MazColorPicker to edit every color of a preset, with the format of your choice.

<script lang="ts" setup>
import { ref } from 'vue'

const color = ref('#3b82f6')
const formatHex = ref('#8b5cf6')
const formatRgb = ref('#8b5cf6')
const formatHsl = ref('#8b5cf6')
const formatOklch = ref('#8b5cf6')
const alphaOn = ref('#3b82f680')
const alphaOff = ref('#3b82f6')
const swatchColor = ref('#3b82f6')
const inlineColor = ref('#ec4899')
const stateColor = ref('#10b981')

const brandSwatches = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', 'oklch(0.3 0.02 260)', 'white']
const sizes = ['sm', 'lg']
</script>

<!--@include: ./../../.vitepress/generated-docs/maz-color-picker.doc.md-->
