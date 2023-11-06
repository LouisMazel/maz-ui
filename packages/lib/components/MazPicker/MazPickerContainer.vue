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
      v-if="!noHeader"
      :color="color"
      :has-time="hasTime"
      :model-value="modelValue"
      :locale="locale"
      :calendar-date="calendarDate"
      :has-date="hasDate"
      :formatter-options="formatterOptions"
      :double="double"
      :no-shortcuts="noShortcuts"
      class="m-picker-container__header"
    />

    <div class="m-picker-container__wrapper">
      <MazPickerCalendar
        v-if="hasDate"
        v-model="currentDate"
        v-model:calendar-date="calendarDate"
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
        :no-shortcuts="noShortcuts"
        class="m-picker-container__calendar"
      />

      <MazPickerTime
        v-if="hasTime"
        v-model="currentDate"
        v-model:calendar-date="calendarDate"
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
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, defineAsyncComponent, type PropType } from 'vue'
  import type { Color } from '../types'
  import type { PickerShortcut, PickerValue } from './types'
  import type { DateTimeFormatOptions } from './utils'

  const MazPickerTime = defineAsyncComponent(() => import('./MazPickerTime.vue'))
  const MazPickerHeader = defineAsyncComponent(() => import('./MazPickerHeader.vue'))
  const MazPickerCalendar = defineAsyncComponent(() => import('./MazPickerCalendar.vue'))

  const props = defineProps({
    modelValue: {
      type: [String, Object] as PropType<PickerValue>,
      default: undefined,
    },
    calendarDate: { type: String, required: true },
    color: { type: String as PropType<Color>, required: true },
    locale: { type: String, required: true },
    noHeader: { type: Boolean, default: false },
    firstDayOfWeek: { type: Number, required: true },
    double: { type: Boolean, required: true },
    hasDate: { type: Boolean, required: true },
    minDate: { type: String, default: undefined },
    maxDate: { type: String, default: undefined },
    inline: { type: Boolean, required: true },
    noShortcuts: { type: Boolean, required: true },
    shortcuts: {
      type: Array as PropType<PickerShortcut[]>,
      required: true,
    },
    shortcut: { type: String, default: undefined },
    hasTime: { type: Boolean, required: true },
    isOpen: { type: Boolean, required: true },
    format: { type: String, required: true },
    isHour12: { type: Boolean, required: true },
    formatterOptions: {
      type: Object as PropType<DateTimeFormatOptions>,
      required: true,
    },
    minuteInterval: { type: Number, required: true },
    disabled: { type: Boolean, required: true },
    disabledWeekly: { type: Array as PropType<number[]>, required: true },
    disabledHours: { type: Array as PropType<number[]>, required: true },
    disabledDates: { type: Array as PropType<string[]>, required: true },
  })

  const emits = defineEmits(['update:model-value', 'update:calendar-date', 'close'])

  const currentDate = computed({
    get: () => props.modelValue,
    set: (value) => {
      emits('update:model-value', value)
    },
  })

  const calendarDate = computed({
    get: () => props.calendarDate,
    set: (calendarDate) => emits('update:calendar-date', calendarDate),
  })
</script>

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
  }

  html.dark {
    & .m-picker-container {
      & :deep(button):is(:disabled) {
        @apply maz-text-gray-700 !important;
      }
    }
  }
</style>
