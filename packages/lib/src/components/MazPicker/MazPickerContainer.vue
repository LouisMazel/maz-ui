<script lang="ts" setup>
import type { MazColor } from '../types'
import type { MazPickerShortcut, MazPickerValue } from './types'
import type { DateTimeFormatOptions } from './utils'

import dayjs from 'dayjs'
import { computed, defineAsyncComponent, ref } from 'vue'

const {
  modelValue,
  calendarDate,
  color,
  locale,
  hideHeader,
  firstDayOfWeek,
  double,
  hasDate,
  minDate,
  maxDate,
  inline,
  shortcuts,
  shortcut,
  hasTime,
  isOpen,
  format,
  isHour12,
  formatterOptions,
  minuteInterval,
  disabled,
  disabledWeekly,
  disabledHours,
  disabledDates,
  range,
} = defineProps<{
  modelValue: MazPickerValue | undefined
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
  shortcuts: MazPickerShortcut[] | false
  shortcut: string | undefined
  hasTime: boolean
  isOpen: boolean
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

const MazPickerCalendar = defineAsyncComponent(() => import('../MazPicker/MazPickerCalendar.vue'))
const MazPickerHeader = defineAsyncComponent(() => import('../MazPicker/MazPickerHeader.vue'))
const MazPickerTime = defineAsyncComponent(() => import('../MazPicker/MazPickerTime.vue'))

const lastTimeValue = ref<string>(typeof modelValue === 'string' && hasTime ? dayjs(modelValue).format('HH:mm') : '00:00')

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

const currentDate = computed({
  get: () => modelValue,
  set: (value) => {
    emits('update:model-value', value)
  },
})

const currentCalendarDate = computed({
  get: () => calendarDate,
  set: calendarDate => emits('update:calendar-date', calendarDate),
})
</script>

<template>
  <div
    class="m-picker-container"
    :class="{
      '--has-double': double,
      '--is-inline': inline,
      '--has-date': hasDate,
    }"
  >
    <MazPickerHeader
      v-if="!hideHeader"
      :color="color"
      :has-time="hasTime"
      :model-value="modelValue"
      :locale="locale"
      :calendar-date="calendarDate"
      :has-date="hasDate"
      :formatter-options="formatterOptions"
      :double="double"
      :hide-shortcuts="!shortcuts"
      class="m-picker-container__header"
    />

    <div class="m-picker-container__wrapper">
      <MazPickerCalendar
        v-if="hasDate"
        v-model:calendar-date="currentCalendarDate"
        :model-value="currentDate"
        :color="color"
        :locale="locale"
        :has-time="hasTime"
        :double="double"
        :min-date="minDate"
        :max-date="maxDate"
        :first-day-of-week="firstDayOfWeek"
        :disabled="disabled"
        :disabled-weekly="disabledWeekly"
        :disabled-dates="disabledDates"
        :shortcuts="shortcuts"
        :shortcut="shortcut"
        :range
        class="m-picker-container__calendar"
        @update:model-value="emitDateValue"
      />

      <MazPickerTime
        v-if="hasTime"
        v-model:calendar-date="currentCalendarDate"
        :model-value="currentDate"
        :is-open="isOpen"
        :color="color"
        :locale="locale"
        :min-date="minDate"
        :max-date="maxDate"
        :has-date="hasDate"
        :format="format"
        :disabled="disabled"
        :disabled-hours="disabledHours"
        :minute-interval="minuteInterval"
        :formatter-options="formatterOptions"
        :is-hour12="isHour12"
        class="m-picker-container__time"
        @update:model-value="saveLastTimeValue"
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  .m-picker-container {
  @apply maz-overflow-hidden maz-rounded maz-bg-color dark:maz-border dark:maz-border-color-light;

  &:not(.--is-inline) {
    @apply maz-absolute maz-z-default-backdrop maz-elevation;
  }

  &.--is-inline {
    @apply maz-border maz-border-color-lighter;
  }

  &.--has-date {
    min-width: 16.875rem;
  }

  &.--has-double {
    min-width: 28.125rem;
  }

  &__wrapper {
    @apply maz-flex;
  }

  & :deep(button):is(:disabled) {
    @apply maz-bg-transparent !maz-text-gray-300 !important;
  }

  &:not(.--has-date) {
    .m-picker-container__time {
      @apply maz-w-full;

      &:deep(.m-picker-time__column__hour) {
        @apply maz-w-1/2;
      }

      &:deep(.m-picker-time__column__minute) {
        @apply maz-w-1/2;
      }
    }
  }
}

html.dark {
  & .m-picker-container {
    & :deep(button):is(:disabled) {
      @apply maz-text-gray-700 !important;
    }
  }
}
</style>
