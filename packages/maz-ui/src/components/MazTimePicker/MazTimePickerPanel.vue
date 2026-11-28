<script lang="ts" setup>
import type { MazColor } from '../types.ts'
import type { MazTimePickerWheelItem } from './MazTimePickerWheel.vue'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed } from 'vue'
import { useInstanceUniqId } from '../../composables/useInstanceUniqId.ts'
import MazTimePickerWheel from './MazTimePickerWheel.vue'
import { buildSlots, formatTime, getPeriodLabels, normalizeTime, pad, parseTime, toMinutes, toTime } from './utils.ts'

const {
  modelValue,
  variant,
  hour12,
  locale,
  step,
  slots,
  min = '00:00',
  max = '23:59',
  disabledTimes = [],
  color = 'primary',
  disabled = false,
  name,
} = defineProps<{
  modelValue?: string | null
  variant: 'wheel' | 'slots'
  hour12: boolean
  locale?: string
  step: number
  slots?: string[]
  min?: string
  max?: string
  disabledTimes?: string[]
  color?: MazColor
  disabled?: boolean
  name?: string
}>()

const emit = defineEmits<{
  'update:model-value': [value: string]
  'select': [value: string]
}>()

const { t } = useTranslations()
const instanceId = useInstanceUniqId({ componentName: 'MazTimePickerPanel' })

const current = computed(() => parseTime(modelValue))
const disabledSet = computed(() => new Set(disabledTimes.map(item => normalizeTime(item)).filter(Boolean)))

function isAllowed(hours: number, minutes: number) {
  const total = hours * 60 + minutes
  const lower = toMinutes(min)
  const upper = toMinutes(max)

  return !disabledSet.value.has(toTime(hours, minutes))
    && (Number.isNaN(lower) || total >= lower)
    && (Number.isNaN(upper) || total <= upper)
}

const minuteValues = computed(() => {
  const safeStep = Math.max(1, Math.floor(step) || 1)

  return Array.from({ length: Math.ceil(60 / safeStep) }, (_, index) => index * safeStep)
})

function nearestMinute(minutes: number) {
  return minuteValues.value.reduce((best, item) => (Math.abs(item - minutes) < Math.abs(best - minutes) ? item : best), 0)
}

const isPm = computed(() => (current.value ? current.value.hours >= 12 : false))
const periodLabels = computed(() => getPeriodLabels(locale))

function toHours24(hourKey: number, pm: boolean) {
  return hour12 ? (hourKey % 12) + (pm ? 12 : 0) : hourKey
}

const hourItems = computed<MazTimePickerWheelItem[]>(() => {
  const keys = hour12
    ? [12, ...Array.from({ length: 11 }, (_, index) => index + 1)]
    : Array.from({ length: 24 }, (_, index) => index)

  return keys.map(key => ({
    key,
    label: hour12 ? String(key) : pad(key),
    disabled: !minuteValues.value.some(minutes => isAllowed(toHours24(key, isPm.value), minutes)),
  }))
})

const minuteItems = computed<MazTimePickerWheelItem[]>(() => minuteValues.value.map(minutes => ({
  key: minutes,
  label: pad(minutes),
  disabled: current.value ? !isAllowed(current.value.hours, minutes) : false,
})))

const periodItems = computed<MazTimePickerWheelItem[]>(() => [
  { key: 'am', label: periodLabels.value[0] },
  { key: 'pm', label: periodLabels.value[1] },
])

const hourKey = computed(() => {
  if (!current.value)
    return undefined

  return hour12 ? (current.value.hours % 12 || 12) : current.value.hours
})

const minuteKey = computed(() => (current.value ? nearestMinute(current.value.minutes) : undefined))

function update(hours: number, minutes: number) {
  emit('update:model-value', toTime(hours, minutes))
}

function onHour(key: string | number) {
  const hours = toHours24(Number(key), isPm.value)
  const minutes = minuteKey.value ?? 0

  update(hours, isAllowed(hours, minutes) ? minutes : (minuteValues.value.find(item => isAllowed(hours, item)) ?? minutes))
}

function onMinute(key: string | number) {
  update(current.value?.hours ?? toHours24(hourKey.value ?? (hour12 ? 12 : 0), isPm.value), Number(key))
}

function onPeriod(key: string | number) {
  const pm = key === 'pm'
  const base = current.value?.hours ?? 0

  update((base % 12) + (pm ? 12 : 0), minuteKey.value ?? 0)
}

function commit() {
  if (current.value)
    emit('select', toTime(current.value.hours, current.value.minutes))
}

const slotList = computed(() => (slots
  ? slots.map(item => normalizeTime(item)).filter((item): item is string => !!item)
  : buildSlots(min, max, step)))

const slotOptions = computed(() => slotList.value.map(value => ({
  value,
  label: formatTime(value, locale, hour12),
  disabled: disabled || !isAllowed(Number(value.slice(0, 2)), Number(value.slice(3))),
})))

function chooseSlot(value: string) {
  emit('update:model-value', value)
  emit('select', value)
}

const labels = computed(() => ({
  hours: t('timePicker.hours'),
  minutes: t('timePicker.minutes'),
  period: t('timePicker.period'),
  slots: t('timePicker.slots'),
}))
</script>

<template>
  <div class="m-time-picker-panel" :class="[`--${variant}`, `--${color}`]" :style="{ '--m-time-color': `var(--maz-${color})`, '--m-time-foreground': `var(--maz-${color}-foreground)` }">
    <div v-if="variant === 'wheel'" class="m-time-picker-panel__wheels">
      <span class="m-time-picker-panel__band" aria-hidden="true" />
      <MazTimePickerWheel :items="hourItems" :model-value="hourKey" :label="labels.hours" :disabled @update:model-value="onHour" @commit="commit" />
      <span class="m-time-picker-panel__colon" aria-hidden="true">:</span>
      <MazTimePickerWheel :items="minuteItems" :model-value="minuteKey" :label="labels.minutes" :disabled @update:model-value="onMinute" @commit="commit" />
      <MazTimePickerWheel
        v-if="hour12"
        :items="periodItems"
        :model-value="current ? (isPm ? 'pm' : 'am') : undefined"
        :label="labels.period"
        :disabled
        @update:model-value="onPeriod"
        @commit="commit"
      />
    </div>

    <div v-else class="m-time-picker-panel__slots" role="radiogroup" :aria-label="labels.slots">
      <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
      <label
        v-for="option in slotOptions"
        :key="option.value"
        class="m-time-picker-panel__slot"
        :class="{ '--selected': option.value === modelValue, '--disabled': option.disabled }"
      >
        <input
          type="radio"
          class="maz:sr-only"
          :name="name ?? `${instanceId}-slots`"
          :value="option.value"
          :checked="option.value === modelValue"
          :disabled="option.disabled"
          @change="chooseSlot(option.value)"
        >
        <span class="m-time-picker-panel__slot-text">{{ option.label }}</span>
      </label>
    </div>
  </div>
</template>

<style scoped>
.m-time-picker-panel {
  padding: 0.5rem;
}

.m-time-picker-panel__wheels {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  direction: ltr;
}

.m-time-picker-panel__band {
  position: absolute;
  inset-inline: 0;
  inset-block-start: 50%;
  block-size: 2.25rem;
  translate: 0 -50%;
  border-radius: 0.5rem;
  background-color: color-mix(in oklab, var(--m-time-color) 14%, transparent);
  pointer-events: none;
}

.m-time-picker-panel__wheels > * {
  position: relative;
}

.m-time-picker-panel__wheels > .m-time-picker-panel__band {
  position: absolute;
}

.m-time-picker-panel__colon {
  font-weight: 600;
}

.m-time-picker-panel.--slots {
  min-inline-size: min(17rem, 80vw);
}

.m-time-picker-panel__slots {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(5.5rem, 1fr));
  gap: 0.375rem;
  max-block-size: 16rem;
  overflow-y: auto;
}

.m-time-picker-panel__slot {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-block-size: 2.25rem;
  padding-inline: 0.5rem;
  border: 1px solid var(--maz-divider, color-mix(in oklab, var(--maz-foreground) 18%, transparent));
  border-radius: 0.5rem;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition:
    background-color calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    border-color calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    color calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
}

.m-time-picker-panel__slot:hover:not(.--disabled, .--selected) {
  border-color: var(--m-time-color);
}

.m-time-picker-panel__slot.--selected {
  border-color: var(--m-time-color);
  background-color: var(--m-time-color);
  color: var(--m-time-foreground);
}

.m-time-picker-panel__slot.--disabled {
  cursor: default;
  opacity: 0.4;
  text-decoration: line-through;
}

.m-time-picker-panel__slot:has(input:focus-visible) {
  outline: var(--maz-focus-ring-width, 2px) solid var(--maz-focus-ring-color, var(--maz-primary));
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .m-time-picker-panel__slot {
    transition: none;
  }
}
</style>
