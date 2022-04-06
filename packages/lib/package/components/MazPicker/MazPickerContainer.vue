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
      :time="time"
      :model-value="modelValue"
      :locale="locale"
      :has-date="hasDate"
      :formatter-options="formatterOptions"
      :double="double"
      :no-shortcuts="noShortcuts"
      class="m-picker-container__header"
    />

    <div class="m-picker-container__wrapper">
      <MazPickerCalendar
        v-if="hasDate"
        v-model="modelValue"
        :calendar-date="calendarDate"
        :color="color"
        :locale="locale"
        :time="time"
        :double="double"
        :min-date="minDate"
        :max-date="maxDate"
        :first-day-of-week="firstDayOfWeek"
        :disabled-weekly="disabledWeekly"
        :disabled-dates="disabledDates"
        :shortcuts="shortcuts"
        :shortcut="shortcut"
        :no-shortcuts="noShortcuts"
        class="m-picker-container__calendar"
      />

      <!--<MazPickerTime
        v-if="time"
        v-model="modelValue"
        v-model:current-date="currentDate"
        :is-open="isOpen"
        :color="color"
        :locale="locale"
        :min-date="minDate"
        :has-date="hasDate"
        :max-date="maxDate"
        :disabled-hours="disabledHours"
        :minute-interval="minuteInterval"
        :formatter-options="formatterOptions"
        class="m-picker-container__time"
      />-->
    </div>

    <!-- <MazPickerFooter v-if="hasFooter" :color="color" @close="$emit('close')" /> -->
  </div>
</template>

<script lang="ts" setup>
  import MazPickerHeader from './MazPickerHeader.vue'
  import MazPickerCalendar from './MazPickerCalendar.vue'
  import { computed, PropType } from 'vue'
  import { Color } from '../types'
  // import MazPickerFooter from './MazPickerFooter.vue'
  import { PickerShortcut, PickerValue } from './types'
  // import MazPickerTime from './MazPickerTime.vue'
  import { DateTimeFormatOptions } from './utils'

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
    hasFooter: { type: Boolean, required: true },
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
    time: { type: Boolean, required: true },
    isOpen: { type: Boolean, required: true },
    formatterOptions: {
      type: Object as PropType<DateTimeFormatOptions>,
      required: true,
    },
    minuteInterval: { type: Number, required: true },
    disabledWeekly: { type: Array as PropType<number[]>, required: true },
    disabledHours: { type: Array as PropType<number[]>, required: true },
    disabledDates: { type: Array as PropType<string[]>, required: true },
  })

  const emits = defineEmits([
    'update:model-value',
    'update:current-date',
    'close',
  ])

  const modelValue = computed({
    get: () => props.modelValue,
    set: (value) => {
      emits('update:model-value', value)
    },
  })

  // const currentDate = computed({
  //   get: () => props.currentDate,
  //   set: (currentDate) => {
  //     emits('update:current-date', currentDate)
  //   },
  // })
</script>

<style lang="postcss" scoped>
  .m-picker-container {
    @apply maz-overflow-hidden maz-rounded-lg maz-bg-color;

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
      @apply maz-flex maz-bg-color;
    }

    & :deep(button):is(:disabled) {
      @apply maz-bg-transparent maz-text-gray-300 !important;
    }
  }

  html.dark {
    & .m-picker-container__wrapper {
      @apply maz-bg-color-light;
    }

    & .m-picker-container {
      & :deep(button):not(.--is-selected):not(.--is-between):not(:disabled) {
        @apply hover:maz-bg-color-lighter !important;
      }

      & :deep(button):is(:disabled) {
        @apply maz-text-gray-700 !important;
      }
    }
  }
</style>
