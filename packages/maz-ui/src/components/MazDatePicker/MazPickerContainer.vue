<script lang="ts" setup>
import type { MazColor } from '../types.ts'
import type { MazDatePickerShortcut, MazDatePickerValue } from './types.ts'
import type { DateTimeFormatOptions } from './utils.ts'

import dayjs from 'dayjs/esm/index.js'
import { computed, defineAsyncComponent, ref } from 'vue'

const {
  modelValue,
  calendarDate,
  hideHeader,
  double,
  hasDate,
  inline,
  shortcuts,
  shortcut,
  hasTime,
  minDate,
  maxDate,
  format,
  range,
} = defineProps<{
  modelValue: MazDatePickerValue | undefined
  calendarDate: string
  color: MazColor
  locale: string
  hideHeader: boolean
  firstDayOfWeek: number
  double: boolean
  hasDate: boolean
  minDate: string | undefined
  maxDate: string | undefined
  inline: boolean
  shortcuts: MazDatePickerShortcut[] | false
  shortcut: string | undefined
  hasTime: boolean
  format: string
  isHour12: boolean
  formatterOptions: DateTimeFormatOptions
  minuteInterval: number
  disabled: boolean
  disabledWeekly: number[]
  disabledHours: number[]
  disabledDates: string[]
  range: boolean
}>()

const emits = defineEmits(['update:model-value', 'update:calendar-date', 'close'])

const MazPickerCalendar = defineAsyncComponent(() => import('./MazPickerCalendar.vue'))
const MazPickerHeader = defineAsyncComponent(() => import('./MazPickerHeader.vue'))
const MazTimePickerPanel = defineAsyncComponent(() => import('../MazTimePicker/MazTimePickerPanel.vue'))

const lastTimeValue = ref<string>(typeof modelValue === 'string' && hasTime
  ? dayjs(modelValue).format('HH:mm')
  : '00:00')

function saveLastTimeValue(value: string) {
  lastTimeValue.value = dayjs(value).format('HH:mm')
  emits('update:model-value', value)
}

function emitDateValue(value: string) {
  if (hasTime) {
    const date = dayjs(value).format('YYYY-MM-DD')
    const time = lastTimeValue.value || '00:00'
    const timeEmitted = dayjs(`${date} ${time}`).format(format)
    emits('update:model-value', timeEmitted)
  }
  else {
    emits('update:model-value', value)
  }
}

const selectedDate = computed(() => typeof modelValue === 'string' && modelValue ? dayjs(modelValue) : undefined)
const timeValue = computed(() => selectedDate.value?.format('HH:mm'))
const minTime = computed(() => selectedDate.value && minDate && dayjs(minDate).isSame(selectedDate.value, 'day')
  ? dayjs(minDate).format('HH:mm')
  : undefined)
const maxTime = computed(() => selectedDate.value && maxDate && dayjs(maxDate).isSame(selectedDate.value, 'day')
  ? dayjs(maxDate).format('HH:mm')
  : undefined)

function onTimeChange(time: string) {
  const [hours, minutes] = time.split(':').map(Number)

  saveLastTimeValue((selectedDate.value ?? dayjs()).hour(hours!).minute(minutes!).format())
}

const currentDate = computed({
  get: () => modelValue,
  set: value => emits('update:model-value', value),
})

const currentCalendarDate = computed({
  get: () => calendarDate,
  set: calendarDate => emits('update:calendar-date', calendarDate),
})
</script>

<template>
  <div
    class="m-date-picker-container maz:overflow-hidden maz:rounded-md maz:bg-container maz:dark:border maz:dark:border-divider"
    :class="{
      '--has-double': double,
      '--is-inline maz:border maz:border-divider': inline,
      '--has-date': hasDate,
    }"
  >
    <MazPickerHeader
      v-if="!hideHeader"
      :color
      :has-time
      :model-value
      :locale
      :has-date
      :formatter-options
      :double
      :hide-shortcuts="!shortcuts"
      class="m-date-picker-container__header"
    />

    <div class="m-date-picker-container__wrapper maz:flex">
      <MazPickerCalendar
        v-if="hasDate"
        v-model:calendar-date="currentCalendarDate"
        :model-value="currentDate"
        :color
        :locale
        :has-time
        :double
        :min-date
        :max-date
        :inline
        :first-day-of-week
        :disabled
        :disabled-weekly
        :disabled-dates
        :shortcuts
        :shortcut
        :range
        class="m-date-picker-container__calendar"
        @update:model-value="emitDateValue"
      />

      <div
        v-if="hasTime"
        class="m-date-picker-container__time maz:flex maz:flex-center"
        :class="hasDate ? 'maz:border-s maz:border-divider' : 'maz:w-full maz:min-w-48'"
      >
        <MazTimePickerPanel
          variant="wheel"
          :model-value="timeValue"
          :hour12="isHour12"
          :locale="locale || undefined"
          :step="minuteInterval"
          :min="minTime"
          :max="maxTime"
          :disabled-hours
          :color
          :disabled
          @update:model-value="onTimeChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../../tailwindcss/tailwind.css";

.m-date-picker-container {
  &.--has-double {
    min-inline-size: 28.125rem;
  }

  & :deep(button):is(:disabled) {
    @apply maz:bg-transparent! maz:text-gray-300! maz:dark:text-gray-700! maz:border-none maz:hover:bg-transparent!;
  }
}
</style>
