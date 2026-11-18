<script lang="ts" setup>
import type { MazUiTranslationsNestedSchema } from '@maz-ui/translations'
import type { DeepPartial } from '@maz-ui/utils/ts-helpers/DeepPartial'
import type { Hsva, MazColorPickerFormat, Rgba } from './MazColorPicker/color'
import type { MazColorPickerPanelLabels } from './MazColorPicker/MazColorPickerPanel.vue'
import type { MazPopoverPosition } from './MazPopover.vue'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, onBeforeUnmount, ref, useAttrs, watch } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import { formatColor, hsvToRgb, resolveCssColor, rgbToHsv } from './MazColorPicker/color'
import MazColorPickerPanel from './MazColorPicker/MazColorPickerPanel.vue'
import MazInput from './MazInput.vue'
import MazPopover from './MazPopover.vue'

export type { MazColorPickerFormat }

export interface MazColorPickerProps {
  /**
   * The color, in any CSS format: hex, `rgb()`, `hsl()`, `oklch()`, `oklab()` or a named color.
   * The component emits it in the `format` you choose.
   * @model
   */
  modelValue?: string
  /**
   * Format of the emitted color
   * @values `'hex' | 'rgb' | 'hsl' | 'oklch'`
   * @default 'hex'
   */
  format?: MazColorPickerFormat
  /**
   * Show the opacity slider and keep the alpha channel (`#rrggbbaa`, `rgb(r g b / a)`...)
   * @default true
   */
  alpha?: boolean
  /**
   * Preset colors shown under the sliders, in any CSS format
   */
  swatches?: string[]
  /**
   * Show the button that picks a color on the screen, in the browsers that support the EyeDropper API
   * @default true
   */
  eyeDropper?: boolean
  /**
   * Render the picker in the page instead of a popover
   * @default false
   */
  inline?: boolean
  /**
   * Disable the component
   * @default false
   */
  disabled?: boolean
  /**
   * Position of the popover
   * @default 'bottom-start'
   */
  position?: MazPopoverPosition
  /**
   * Id of the text field (auto-generated if not provided)
   */
  id?: string
  /**
   * Translations of the component
   */
  translations?: DeepPartial<MazUiTranslationsNestedSchema['colorPicker']>
}

defineOptions({
  inheritAttrs: false,
})

const {
  format = 'hex',
  alpha = true,
  swatches,
  eyeDropper = true,
  inline = false,
  disabled = false,
  position = 'bottom-start',
  id,
  translations,
} = defineProps<MazColorPickerProps>()

const emits = defineEmits<{
  /**
   * Emitted when the color changes, in the `format` of the component
   * @property {string | undefined} value the new color
   */
  'update:model-value': [value: string | undefined]
  /**
   * Emitted when the popover opens
   */
  'open': []
  /**
   * Emitted when the popover closes
   */
  'close': []
}>()

const model = defineModel<string>()

const attrs = useAttrs()
const { t } = useTranslations()

const instanceId = useInstanceUniqId({ componentName: 'MazColorPicker', providedId: id })

const DEFAULT_HSVA: Hsva = { h: 0, s: 0, v: 0, a: 1 }

const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))
const inputAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style')))

const labels = computed<MazColorPickerPanelLabels>(() => ({
  area: translations?.area ?? t('colorPicker.area'),
  areaValue: (saturation, brightness) => translations?.areaValue
    ? translations.areaValue.replaceAll('{saturation}', String(saturation)).replaceAll('{brightness}', String(brightness))
    : t('colorPicker.areaValue', { saturation, brightness }),
  hue: translations?.hue ?? t('colorPicker.hue'),
  alpha: translations?.alpha ?? t('colorPicker.alpha'),
  eyeDropper: translations?.eyeDropper ?? t('colorPicker.eyeDropper'),
  swatches: translations?.swatches ?? t('colorPicker.swatches'),
  selectSwatch: color => translations?.selectSwatch
    ? translations.selectSwatch.replaceAll('{color}', color)
    : t('colorPicker.selectSwatch', { color }),
}))

const openPickerLabel = computed(() => translations?.openPicker ?? t('colorPicker.openPicker'))

function toHsva(value: string | undefined, previous?: Hsva): Hsva | undefined {
  const rgba = resolveCssColor(value)
  if (!rgba)
    return undefined

  return rgbToHsv(alpha
    ? rgba
    : { ...rgba, a: 1 }, previous?.h)
}

const hsva = ref<Hsva>(toHsva(model.value) ?? DEFAULT_HSVA)
const text = ref(model.value ?? '')
const isOpen = ref(false)
const isFocused = ref(false)

/** Last value emitted by the component: the model watcher skips it to keep the hue of the grays */
let lastEmitted: string | undefined | null = null

const currentColor = computed(() => formatColor(hsvToRgb(hsva.value), 'rgb'))
const hasColor = computed(() => !!model.value && !!resolveCssColor(model.value))

watch(model, (value) => {
  if (value === lastEmitted) {
    lastEmitted = null
    return
  }
  const next = toHsva(value, hsva.value)
  if (next)
    hsva.value = next
  if (!isFocused.value)
    text.value = value ?? ''
})

function emitValue(value: string | undefined) {
  lastEmitted = value
  model.value = value
}

function emitHsva(next: Hsva) {
  hsva.value = next
  const value = formatColor(hsvToRgb(alpha
    ? next
    : { ...next, a: 1 }), format)
  text.value = value
  emitValue(value)
}

function onPick(rgba: Rgba) {
  emitHsva(rgbToHsv(alpha
    ? rgba
    : { ...rgba, a: 1 }, hsva.value.h))
}

function onTextInput(value: unknown) {
  const input = typeof value === 'string'
    ? value
    : ''
  text.value = input

  if (!input.trim()) {
    emitValue(undefined)
    return
  }

  const next = toHsva(input, hsva.value)
  if (!next)
    return
  hsva.value = next
  emitValue(formatColor(hsvToRgb(next), format))
}

function onBlur() {
  isFocused.value = false
  text.value = model.value ?? ''
}

function toggle() {
  if (!disabled)
    isOpen.value = !isOpen.value
}

const popoverId = computed(() => `${instanceId.value}-popover`)

/** The popover uses the manual trigger to keep the input editable, so the clicks outside are handled here */
function onDocumentPointerDown(event: PointerEvent) {
  const target = event.target as Node | null
  const trigger = document.getElementById(popoverId.value)
  const panel = document.getElementById(`${popoverId.value}-panel`)
  if (target && !trigger?.contains(target) && !panel?.contains(target))
    isOpen.value = false
}

function removeListener() {
  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
}

watch(isOpen, (open) => {
  if (open) {
    document.addEventListener('pointerdown', onDocumentPointerDown, true)
    emits('open')
  }
  else {
    removeListener()
    emits('close')
  }
})

onBeforeUnmount(removeListener)
</script>

<template>
  <div
    v-if="inline"
    v-bind="rootAttrs"
    class="m-color-picker --inline m-reset-css maz:flex maz:w-full maz:max-w-72 maz:flex-col"
  >
    <MazColorPickerPanel
      :id="instanceId"
      :model-value="hsva"
      :alpha
      :swatches
      :eye-dropper
      :disabled
      :labels
      @update:model-value="emitHsva"
      @pick="onPick"
    >
      <MazInput
        v-bind="inputAttrs"
        :id="instanceId"
        :model-value="text"
        :disabled
        size="sm"
        block
        autocomplete="off"
        spellcheck="false"
        class="m-color-picker__input"
        @update:model-value="onTextInput"
        @focus="isFocused = true"
        @blur="onBlur"
      />
    </MazColorPickerPanel>
  </div>

  <MazPopover
    v-else
    :id="popoverId"
    v-model="isOpen"
    v-bind="rootAttrs"
    trigger="manual"
    :position
    :disabled
    role="dialog"
    :aria-label="openPickerLabel"
    class="m-color-picker m-reset-css"
    panel-class="maz:w-72 maz:p-3"
  >
    <template #trigger>
      <MazInput
        v-bind="inputAttrs"
        :id="instanceId"
        :model-value="text"
        :disabled
        autocomplete="off"
        spellcheck="false"
        class="m-color-picker__input"
        @update:model-value="onTextInput"
        @focus="isFocused = true"
        @blur="onBlur"
      >
        <template #start-icon>
          <button
            type="button"
            class="m-color-picker__trigger m-color-picker-checkerboard maz:relative maz:flex maz:size-6 maz:shrink-0 maz:cursor-interactive maz:overflow-hidden maz:rounded-sm maz:border maz:border-foreground/20 maz:p-0 maz:disabled:disabled-cursor"
            :aria-label="openPickerLabel"
            :aria-expanded="isOpen"
            aria-haspopup="dialog"
            :disabled
            @click.stop="toggle"
          >
            <span v-if="hasColor" class="maz:absolute maz:inset-0" :style="{ backgroundColor: currentColor }" />
          </button>
        </template>
      </MazInput>
    </template>

    <MazColorPickerPanel
      :id="instanceId"
      :model-value="hsva"
      :alpha
      :swatches
      :eye-dropper
      :disabled
      :labels
      @update:model-value="emitHsva"
      @pick="onPick"
    />
  </MazPopover>
</template>

<style scoped>
.m-color-picker-checkerboard {
  background-image: conic-gradient(var(--maz-divider) 25%, transparent 0 50%, var(--maz-divider) 0 75%, transparent 0);
  background-size: 0.5rem 0.5rem;
}

.m-color-picker__input :deep(input) {
  font-family: var(--maz-font-mono-stack, ui-monospace, monospace);
}
</style>
