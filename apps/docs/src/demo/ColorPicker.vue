<script setup lang="ts">
/* eslint-disable style/max-statements-per-line */

import type { HSL } from '@maz-ui/themes'
import { computed, ref, watch } from 'vue'

interface Props {
  modelValue: HSL
  label?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: HSL]
}>()

const colorInput = ref<HTMLInputElement>()

function hslToHex(hsl: HSL): string {
  const match = hsl.match(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/)
  if (!match)
    return '#000000'

  const h = Number.parseFloat(match[1]) / 360
  const s = Number.parseFloat(match[2]) / 100
  const l = Number.parseFloat(match[3]) / 100

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0)
      t += 1
    if (t > 1)
      t -= 1
    if (t < 1 / 6)
      return p + (q - p) * 6 * t
    if (t < 1 / 2)
      return q
    if (t < 2 / 3)
      return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  let r: number
  let g: number
  let b: number

  if (s === 0) {
    r = g = b = l
  }
  else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16)
    return hex.length === 1 ? `0${hex}` : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function hexToHsl(hex: string): HSL {
  const r = Number.parseInt(hex.slice(1, 3), 16) / 255
  const g = Number.parseInt(hex.slice(3, 5), 16) / 255
  const b = Number.parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h: number
  let s: number
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0
  }
  else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
      default: h = 0
    }
    h /= 6
  }

  const hue = Math.round(h * 360)
  const saturation = Math.round(s * 100)
  const lightness = Math.round(l * 100)

  return `${hue} ${saturation}% ${lightness}%` as HSL
}

const hexValue = computed(() => hslToHex(props.modelValue))

function handleColorChange(event: Event) {
  const target = event.target as HTMLInputElement
  const hslValue = hexToHsl(target.value)
  emit('update:modelValue', hslValue)
}

watch(() => props.modelValue, () => {
  if (colorInput.value) {
    colorInput.value.value = hexValue.value
  }
}, { immediate: true })
</script>

<template>
  <div class="color-picker">
    <label v-if="label" for="input-color">
      {{ label }}
    </label>

    <input
      id="input-color"
      ref="colorInput"
      type="color"
      :value="hexValue"
      :disabled="disabled"
      @change="handleColorChange"
    >
  </div>
</template>

<style lang="postcss" scoped>
.color-picker {
  @apply maz-inline-flex maz-flex-col maz-gap-1;

  label {
    @apply maz-text-sm maz-font-medium maz-text-foreground maz-truncate;
  }

  input[type='color'] {
    -webkit-appearance: none;
    appearance: none;
    background: none;
    cursor: pointer;

    @apply maz-h-10 maz-w-full maz-cursor-pointer maz-overflow-hidden maz-rounded maz-border maz-border-solid maz-border-divider disabled:maz-cursor-not-allowed disabled:maz-opacity-50;

    &::-webkit-color-swatch-wrapper {
      padding: 0;
      @apply maz-rounded;
    }

    &::-webkit-color-swatch {
      border: none;
      @apply maz-rounded;
    }

    &::-moz-color-swatch {
      border: none;
      @apply maz-rounded;
    }
  }
}
</style>
