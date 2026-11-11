<script lang="ts" setup>
import type { Hsva, Rgba } from './color'
import { MazCheck } from '@maz-ui/icons/lazy/MazCheck'
import { MazEyeDropper } from '@maz-ui/icons/lazy/MazEyeDropper'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { formatColor, getLuminance, hsvToRgb, resolveCssColor } from './color'

export interface MazColorPickerPanelLabels {
  area: string
  areaValue: (saturation: number, brightness: number) => string
  hue: string
  alpha: string
  eyeDropper: string
  swatches: string
  selectSwatch: (color: string) => string
}

const { alpha = true, swatches, eyeDropper = true, disabled = false, labels, id } = defineProps<{
  alpha?: boolean
  swatches?: string[]
  eyeDropper?: boolean
  disabled?: boolean
  labels: MazColorPickerPanelLabels
  id: string
}>()

const emits = defineEmits<{
  /** Emitted when the user picks a color with the screen eye dropper */
  pick: [value: Rgba]
}>()

const MazBtn = defineAsyncComponent(() => import('../MazBtn.vue'))
const MazIcon = defineAsyncComponent(() => import('../MazIcon.vue'))

const hsva = defineModel<Hsva>({ required: true })

const KEY_STEP = 0.01
const KEY_STEP_LARGE = 0.1

const areaRef = ref<HTMLDivElement>()

const rgb = computed(() => hsvToRgb(hsva.value))
const opaque = computed(() => formatColor({ ...rgb.value, a: 1 }, 'rgb'))
const current = computed(() => formatColor(rgb.value, 'rgb'))
const hueColor = computed(() => `hsl(${hsva.value.h} 100% 50%)`)
/** The thumb of the area switches to a dark ring on light colors */
const isLight = computed(() => getLuminance(rgb.value) > 0.45)

const areaValue = computed(() => labels.areaValue(Math.round(hsva.value.s * 100), Math.round(hsva.value.v * 100)))

const resolvedSwatches = computed(() => (swatches ?? []).map(value => ({
  value,
  rgba: resolveCssColor(value),
})))

const hasEyeDropper = ref(false)

onMounted(() => {
  hasEyeDropper.value = eyeDropper && typeof window !== 'undefined' && 'EyeDropper' in globalThis
})

function update(partial: Partial<Hsva>) {
  if (disabled)
    return
  hsva.value = {
    ...hsva.value,
    ...partial,
  }
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value))
}

function updateFromPointer(event: PointerEvent) {
  const rect = areaRef.value?.getBoundingClientRect()
  if (!rect?.width || !rect.height)
    return
  update({
    s: clamp((event.clientX - rect.left) / rect.width),
    v: clamp(1 - (event.clientY - rect.top) / rect.height),
  })
}

function onPointerDown(event: PointerEvent) {
  if (disabled || event.button !== 0)
    return
  event.preventDefault()
  areaRef.value?.focus()
  areaRef.value?.setPointerCapture?.(event.pointerId)
  updateFromPointer(event)
}

function onPointerMove(event: PointerEvent) {
  if (areaRef.value?.hasPointerCapture?.(event.pointerId))
    updateFromPointer(event)
}

const AREA_KEYS: Record<string, [keyof Pick<Hsva, 's' | 'v'>, 1 | -1]> = {
  ArrowRight: ['s', 1],
  ArrowLeft: ['s', -1],
  ArrowUp: ['v', 1],
  ArrowDown: ['v', -1],
}

function onAreaKeydown(event: KeyboardEvent) {
  const action = AREA_KEYS[event.key]
  if (!action)
    return
  event.preventDefault()
  const [channel, direction] = action
  update({
    [channel]: clamp(hsva.value[channel] + direction * (event.shiftKey ? KEY_STEP_LARGE : KEY_STEP)),
  })
}

function onHueInput(event: Event) {
  update({
    h: Number((event.target as HTMLInputElement).value),
  })
}

function onAlphaInput(event: Event) {
  update({ a: Number((event.target as HTMLInputElement).value) / 100 })
}

async function pickFromScreen() {
  try {
    const dropper = new (globalThis as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper()
    const { sRGBHex } = await dropper.open()
    const picked = resolveCssColor(sRGBHex)
    if (picked)
      emits('pick', { ...picked, a: hsva.value.a })
  }
  catch {}
}

function isSelected(swatch?: Rgba) {
  if (!swatch)
    return false
  const { r, g, b, a } = rgb.value

  return Math.round(swatch.r) === Math.round(r) && Math.round(swatch.g) === Math.round(g) && Math.round(swatch.b) === Math.round(b) && Math.abs(swatch.a - a) < 0.01
}

function selectSwatch(swatch?: Rgba) {
  if (swatch && !disabled)
    emits('pick', swatch)
}
</script>

<template>
  <div class="m-color-picker-panel m-reset-css maz:flex maz:flex-col maz:gap-3" :class="{ '--disabled': disabled }">
    <div
      :id="`${id}-area`"
      ref="areaRef"
      class="m-color-picker-panel__area maz:relative maz:h-40 maz:w-full maz:touch-none maz:rounded-md maz:outline-none"
      :style="{ backgroundColor: hueColor }"
      role="slider"
      tabindex="0"
      :aria-label="labels.area"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="Math.round(hsva.s * 100)"
      :aria-valuetext="areaValue"
      :aria-disabled="disabled || undefined"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @keydown="onAreaKeydown"
    >
      <span
        class="m-color-picker-panel__area-thumb maz:pointer-events-none maz:absolute maz:size-4 maz:-translate-1/2 maz:rounded-full maz:border-2"
        :class="isLight ? 'maz:border-foreground' : 'maz:border-white'"
        :style="{ left: `${hsva.s * 100}%`, top: `${(1 - hsva.v) * 100}%`, backgroundColor: opaque }"
        aria-hidden="true"
      />
    </div>

    <div class="maz:flex maz:items-center maz:gap-3">
      <MazBtn
        v-if="hasEyeDropper"
        size="sm"
        color="transparent"
        outlined
        :icon="MazEyeDropper"
        :aria-label="labels.eyeDropper"
        :title="labels.eyeDropper"
        :disabled
        @click="pickFromScreen"
      />

      <div class="maz:flex maz:min-w-0 maz:flex-1 maz:flex-col maz:gap-2.5">
        <input
          :id="`${id}-hue`"
          type="range"
          class="m-color-picker-panel__slider --hue"
          min="0"
          max="360"
          step="1"
          :value="Math.round(hsva.h)"
          :aria-label="labels.hue"
          :aria-valuetext="`${Math.round(hsva.h)}°`"
          :disabled
          @input="onHueInput"
        >
        <input
          v-if="alpha"
          :id="`${id}-alpha`"
          type="range"
          class="m-color-picker-panel__slider --alpha"
          min="0"
          max="100"
          step="1"
          :value="Math.round(hsva.a * 100)"
          :aria-label="labels.alpha"
          :aria-valuetext="`${Math.round(hsva.a * 100)}%`"
          :style="{ '--m-color-picker-opaque': opaque }"
          :disabled
          @input="onAlphaInput"
        >
      </div>

      <span class="m-color-picker-panel__preview m-color-picker-checkerboard maz:relative maz:size-9 maz:shrink-0 maz:overflow-hidden maz:rounded-md maz:border maz:border-foreground/20" aria-hidden="true">
        <span class="maz:absolute maz:inset-0" :style="{ backgroundColor: current }" />
      </span>
    </div>

    <div v-if="resolvedSwatches.length > 0" class="m-color-picker-panel__swatches maz:flex maz:flex-wrap maz:gap-1.5" role="group" :aria-label="labels.swatches">
      <button
        v-for="swatch in resolvedSwatches"
        :key="swatch.value"
        type="button"
        class="m-color-picker-panel__swatch m-color-picker-checkerboard maz:relative maz:flex maz:size-6 maz:cursor-interactive maz:flex-center maz:overflow-hidden maz:rounded-sm maz:border maz:border-foreground/20 maz:p-0 maz:transition-transform maz:duration-(--maz-motion-fast) maz:hover:scale-110 maz:disabled:disabled-state"
        :aria-label="labels.selectSwatch(swatch.value)"
        :aria-pressed="isSelected(swatch.rgba)"
        :title="swatch.value"
        :disabled="disabled || !swatch.rgba"
        @click="selectSwatch(swatch.rgba)"
      >
        <span class="maz:absolute maz:inset-0" :style="{ backgroundColor: swatch.value }" />
        <MazIcon
          v-if="isSelected(swatch.rgba)"
          :icon="MazCheck"
          class="maz:relative maz:size-3.5"
          :class="swatch.rgba && getLuminance(swatch.rgba) > 0.45 ? 'maz:text-black' : 'maz:text-white'"
        />
      </button>
    </div>

    <slot />
  </div>
</template>

<style scoped>
@reference "../../tailwindcss/tailwind.css";

.m-color-picker-panel {
  &.--disabled {
    @apply maz:disabled-opacity;
  }

  /* The white and black layers draw the saturation and brightness of the HSV model */
  .m-color-picker-panel__area {
    background-image: linear-gradient(to top, black, transparent), linear-gradient(to right, white, transparent);
    cursor: crosshair;

    &:focus-visible {
      @apply maz:ring-2 maz:ring-primary maz:ring-offset-2 maz:ring-offset-surface;
    }

    &[aria-disabled='true'] {
      @apply maz:disabled-cursor;
    }
  }

  .m-color-picker-panel__slider {
    @apply maz:h-3 maz:w-full maz:cursor-interactive maz:rounded-full maz:disabled:disabled-cursor;

    appearance: none;
    margin: 0;
    background-color: transparent;

    &:focus-visible {
      @apply maz:outline-none;

      &::-webkit-slider-thumb {
        @apply maz:ring-2 maz:ring-primary maz:ring-offset-1 maz:ring-offset-surface;
      }

      &::-moz-range-thumb {
        @apply maz:ring-2 maz:ring-primary maz:ring-offset-1 maz:ring-offset-surface;
      }
    }

    &::-webkit-slider-thumb {
      @apply maz:size-4 maz:rounded-full maz:border-2 maz:border-white;

      appearance: none;
      background-color: transparent;
      box-shadow:
        0 0 0 1px rgb(0 0 0 / 25%),
        0 1px 3px rgb(0 0 0 / 30%);
    }

    &::-moz-range-thumb {
      @apply maz:size-3 maz:rounded-full maz:border-2 maz:border-white;

      background-color: transparent;
      box-shadow:
        0 0 0 1px rgb(0 0 0 / 25%),
        0 1px 3px rgb(0 0 0 / 30%);
    }

    &.--hue {
      background-image: linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red);
    }

    &.--alpha {
      background-image:
        linear-gradient(to right, transparent, var(--m-color-picker-opaque)),
        conic-gradient(var(--maz-divider) 25%, transparent 0 50%, var(--maz-divider) 0 75%, transparent 0);
      background-size:
        100% 100%,
        0.5rem 0.5rem;
    }
  }

  .m-color-picker-checkerboard {
    background-image: conic-gradient(
      var(--maz-divider) 25%,
      transparent 0 50%,
      var(--maz-divider) 0 75%,
      transparent 0
    );
    background-size: 0.5rem 0.5rem;
  }
}
</style>
