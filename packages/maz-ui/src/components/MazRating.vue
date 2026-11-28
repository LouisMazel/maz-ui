<script lang="ts" setup generic="_T">
import type { MazIconValue } from './MazIcon.vue'
import type { MazColor, MazSize } from './types.ts'
import { MazStarSolid } from '@maz-ui/icons/static/MazStarSolid'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, ref, watch } from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId.ts'
import { useReducedMotion } from '../composables/useReducedMotion.ts'
import MazIcon from './MazIcon.vue'
import MazRollingText from './MazRollingText.vue'

export interface MazRatingProps {
  /**
   * The rating. A decimal value (`4.3`) is only drawn when `readonly` is set
   * @model
   * @type {number | null}
   */
  modelValue?: number | null
  /**
   * Highest value: the number of icons, or the last box of the `scale` variant
   * @default 5
   */
  max?: number
  /**
   * Lowest value of the `scale` variant (`0` for a score out of 10, `1` for a score out of 5)
   * @default 1
   */
  min?: number
  /**
   * `icon`: a row of icons that light up one by one, `scale`: boxes from `min` to `max` (a score like the NPS)
   * @values icon, scale
   * @default 'icon'
   */
  variant?: 'icon' | 'scale'
  /**
   * Icon of the `icon` variant: a Vue component, an icon name or a raw SVG
   * @default MazStarSolid
   */
  icon?: MazIconValue
  /**
   * Texts shown next to the icons, one per value: the first one for 1 icon, the last one for `max` icons
   * @example ['Bad', 'Poor', 'Fair', 'Good', 'Perfect']
   */
  labels?: string[]
  /**
   * Text on the side of `min` (the `scale` variant)
   */
  minLabel?: string
  /**
   * Text on the side of `max` (the `scale` variant)
   */
  maxLabel?: string
  /**
   * Shows the value without changing it: the fill can be a decimal (`4.3`)
   * @default false
   */
  readonly?: boolean
  /**
   * Disables the rating
   * @default false
   */
  disabled?: boolean
  /**
   * Clicking the current value again clears it: the value becomes `null`
   * @default false
   */
  clearable?: boolean
  /**
   * Size of the icons and of the boxes
   * @values mini, xs, sm, md, lg, xl
   * @default 'md'
   */
  size?: MazSize
  /**
   * Color of the lit icons and of the chosen box
   * @values primary, secondary, accent, info, success, warning, destructive, contrast, neutral
   * @default 'warning'
   */
  color?: MazColor
  /**
   * Accessible name of the group
   * @default Translated `Rating`
   */
  label?: string
  /**
   * Name of the radio inputs, for a native form
   */
  name?: string
}

export interface MazRatingEmits {
  /**
   * Emitted when the user picks a value, or clears it (`null`)
   */
  (event: 'update:model-value', value: number | null): void
}

const {
  modelValue,
  max = 5,
  min = 1,
  variant = 'icon',
  icon = MazStarSolid,
  labels,
  minLabel,
  maxLabel,
  readonly = false,
  disabled = false,
  clearable = false,
  size = 'md',
  color = 'warning',
  label,
  name,
} = defineProps<MazRatingProps>()

const emit = defineEmits<MazRatingEmits>()

const { t } = useTranslations()
const { shouldReduceMotion } = useReducedMotion()
const instanceId = useInstanceUniqId({ componentName: 'MazRating' })

const SIZE_CLASS: Record<MazSize, string> = {
  mini: 'maz:text-base',
  xs: 'maz:text-xl',
  sm: 'maz:text-2xl',
  md: 'maz:text-3xl',
  lg: 'maz:text-4xl',
  xl: 'maz:text-5xl',
}

const isScale = computed(() => variant === 'scale')
const lowest = computed(() => (isScale.value ? min : 1))
const hovered = ref<number>()
const sweepFrom = ref(0)
const interactive = computed(() => !readonly && !disabled)

const values = computed(() => Array.from({ length: Math.max(0, max - lowest.value + 1) }, (_, index) => lowest.value + index))

const current = computed(() => (typeof modelValue === 'number' && !Number.isNaN(modelValue) ? modelValue : undefined))

const shown = computed(() => (interactive.value && hovered.value !== undefined ? hovered.value : (current.value ?? 0)))

watch(shown, (_, previous) => {
  sweepFrom.value = previous
})

const groupName = computed(() => name ?? `${instanceId.value}-rating`)

const groupLabel = computed(() => label || t('rating.label'))

function valueText(value: number) {
  return t('rating.value', { value: Number(value.toFixed(1)), max })
}

function itemLabel(value: number) {
  const text = valueText(value)
  const extra = labels?.[value - 1]

  return extra ? `${text}, ${extra}` : text
}

const readonlyLabel = computed(() => {
  const base = `${groupLabel.value}: ${valueText(current.value ?? 0)}`
  const extra = labels?.[Math.round(current.value ?? 0) - 1]

  return extra ? `${base}, ${extra}` : base
})

const visibleLabel = computed(() => labels?.[Math.round(shown.value) - 1] ?? '')

const labelMinWidth = computed(() => `${Math.max(0, ...(labels ?? []).map(item => item.length))}ch`)

function fraction(value: number) {
  return Math.min(1, Math.max(0, shown.value - (value - 1)))
}

function fillStyle(value: number) {
  const part = fraction(value)
  const delay = shouldReduceMotion.value || !interactive.value || value <= sweepFrom.value
    ? 0
    : Math.min((value - sweepFrom.value - 1) * 30, 240)

  return {
    inlineSize: part > 0 && part < 1 ? `${part * 100}%` : '100%',
    opacity: part > 0 ? 1 : 0,
    transitionDelay: `${delay}ms`,
  }
}

function pick(value: number) {
  if (!interactive.value)
    return
  if (clearable && current.value === value)
    emit('update:model-value', null)
  else if (current.value !== value)
    emit('update:model-value', value)
}

function onClick(value: number) {
  if (clearable && current.value === value)
    pick(value)
}

function onChange(value: number) {
  if (!(clearable && current.value === value))
    pick(value)
}

function hover(value: number) {
  if (interactive.value)
    hovered.value = value
}

const style = computed(() => ({ '--m-rating-color': `var(--maz-${color})`, '--m-rating-foreground': `var(--maz-${color}-foreground)` }))
</script>

<template>
  <!-- eslint-disable vuejs-accessibility/mouse-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
  <div
    class="m-rating m-reset-css maz:inline-flex maz:w-fit maz:max-w-full maz:flex-col maz:gap-1"
    :class="{
      '--scale': isScale,
      '--reduced': shouldReduceMotion,
      '--disabled': disabled,
      '--readonly': readonly,
    }"
    :style="style"
    :role="readonly ? 'img' : 'radiogroup'"
    :aria-label="readonly ? readonlyLabel : groupLabel"
    :aria-disabled="disabled || undefined"
    @mouseleave="hovered = undefined"
  >
    <div class="m-rating__row maz:inline-flex maz:items-center maz:gap-3">
      <div
        class="m-rating__items maz:inline-flex maz:items-center"
        :class="[isScale ? 'maz:gap-1' : '', SIZE_CLASS[size]]"
      >
        <component
          :is="readonly ? 'span' : 'label'"
          v-for="value in values"
          :key="value"
          class="m-rating__item"
          :class="{ '--on': isScale ? value === shown : value <= shown, '--partial': !isScale && fraction(value) > 0 && fraction(value) < 1, '--selected': value === current }"
          @mouseenter="hover(value)"
        >
          <input
            v-if="!readonly"
            type="radio"
            class="maz:sr-only"
            :name="groupName"
            :value
            :checked="current === value"
            :disabled
            :aria-label="itemLabel(value)"
            @change="onChange(value)"
            @click="onClick(value)"
          >

          <span v-if="isScale" class="m-rating__box" :class="{ 'maz:text-base': size === 'lg' || size === 'xl' }" aria-hidden="true">
            <span class="m-rating__box-fill" />
            <span class="m-rating__box-text">{{ value }}</span>
          </span>

          <span v-else class="m-rating__icon" aria-hidden="true">
            <MazIcon :icon class="m-rating__base" />
            <span class="m-rating__fill" :style="fillStyle(value)">
              <MazIcon :icon class="m-rating__lit" />
            </span>
          </span>
        </component>
      </div>

      <span
        v-if="labels?.length && !isScale"
        class="m-rating__label maz:text-sm maz:text-muted"
        :style="{ minInlineSize: labelMinWidth }"
        aria-hidden="true"
      >
        <MazRollingText :value="visibleLabel" />
      </span>
    </div>

    <div
      v-if="isScale && (minLabel || maxLabel)"
      class="m-rating__ends maz:flex maz:justify-between maz:gap-4 maz:text-xs maz:text-muted"
      aria-hidden="true"
    >
      <span>{{ minLabel }}</span>
      <span>{{ maxLabel }}</span>
    </div>
  </div>
  <!-- eslint-enable vuejs-accessibility/mouse-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
</template>

<style scoped>
.m-rating__item {
  position: relative;
  display: inline-flex;
  cursor: pointer;
}

.m-rating.--disabled .m-rating__item,
.m-rating.--readonly .m-rating__item {
  cursor: default;
}

.m-rating.--disabled {
  opacity: 0.5;
}

.m-rating__icon {
  position: relative;
  display: inline-flex;
  inline-size: 1em;
  block-size: 1em;
  border-radius: 0.2em;
  color: color-mix(in oklab, var(--maz-foreground) 18%, transparent);
  transition: transform calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
}

.m-rating__fill {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  overflow: hidden;
  color: var(--m-rating-color);
  transform: scale(0.6);
  transition:
    opacity calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    transform calc(var(--maz-motion-normal, 250ms) * var(--maz-motion-scale, 1)) var(--maz-easing-spring, ease-out);
}

.m-rating__fill :deep(svg) {
  fill: currentcolor;
}

.m-rating__fill :deep(svg),
.m-rating__fill > * {
  flex: none;
  inline-size: 1em;
  block-size: 1em;
}

.m-rating__base {
  transition: opacity calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
}

.m-rating__item.--on:not(.--partial) .m-rating__base {
  opacity: 0;
}

.m-rating__item.--on .m-rating__fill {
  transform: scale(1);
}

.m-rating:not(.--readonly) .m-rating__item:hover .m-rating__icon {
  transform: scale(1.12);
}

.m-rating.--reduced .m-rating__fill,
.m-rating.--reduced .m-rating__icon {
  transition: opacity calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) linear;
}

.m-rating.--reduced .m-rating__fill,
.m-rating.--reduced .m-rating__item.--on .m-rating__fill,
.m-rating.--reduced .m-rating__item:hover .m-rating__icon {
  transform: none;
}

.m-rating__item:has(input:focus-visible) .m-rating__icon,
.m-rating__item:has(input:focus-visible) .m-rating__box {
  outline: var(--maz-focus-ring-width, 2px) solid var(--maz-focus-ring-color, var(--maz-primary));
  outline-offset: var(--maz-focus-ring-offset, 2px);
}

.m-rating__box {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-sizing: border-box;
  inline-size: 1.4em;
  block-size: 1.4em;
  border: 1px solid color-mix(in oklab, var(--maz-foreground) 25%, transparent);
  border-radius: 0.3em;
  font-size: 0.5em;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: var(--maz-foreground);
  transition:
    border-color calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    color calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
}

.m-rating__box-fill {
  position: absolute;
  inset: 0;
  background-color: var(--m-rating-color);
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform calc(var(--maz-motion-normal, 250ms) * var(--maz-motion-scale, 1))
    var(--maz-easing-out, ease-out);
}

.m-rating__box-text {
  position: relative;
}

.m-rating__item.--on .m-rating__box-fill {
  transform: scaleY(1);
}

.m-rating__item.--on .m-rating__box {
  border-color: var(--m-rating-color);
  color: var(--m-rating-foreground);
}

.m-rating:not(.--readonly, .--disabled) .m-rating__item:hover .m-rating__box {
  border-color: var(--m-rating-color);
}

.m-rating.--reduced .m-rating__box-fill {
  transform: none;
  opacity: 0;
  transition: opacity calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) linear;
}

.m-rating.--reduced .m-rating__item.--on .m-rating__box-fill {
  opacity: 1;
}

.m-rating__label {
  white-space: nowrap;
}
</style>
