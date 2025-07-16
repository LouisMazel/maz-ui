<script lang="ts" setup>
import type { Dayjs } from 'dayjs'
import type { PropType } from 'vue'
import type { MazColor } from '../../types'
import type { MazDatePickerValue } from '../types'
import dayjs from 'dayjs'
import { computed } from 'vue'

import MazDatePickerCalendarDays from './MazPickerCalendarDays.vue'
import MazDatePickerCalendarGrid from './MazPickerCalendarGrid.vue'

const props = defineProps({
  modelValue: {
    type: [String, Object] as PropType<MazDatePickerValue>,
    default: undefined,
  },
  color: { type: String as PropType<MazColor>, required: true },
  locale: { type: String, required: true },
  hasTime: { type: Boolean, required: true },
  firstDayOfWeek: { type: Number, required: true },
  calendarDate: { type: String, required: true },
  offsetMonth: { type: Number, default: 0 },
  minDate: { type: String, default: undefined },
  maxDate: { type: String, default: undefined },
  disabledWeekly: { type: Array as PropType<number[]>, required: true },
  disabledDates: { type: Array as PropType<string[]>, required: true },
  hoverredDay: { type: Object as PropType<Dayjs>, default: undefined },
  disabled: { type: Boolean, required: true },
  range: { type: Boolean, required: true },
})

const emits = defineEmits(['update:model-value', 'update:calendar-date', 'update:hoverred-day'])

const modelValue = computed({
  get: () => props.modelValue,
  set: value => emits('update:model-value', value),
})

const hoverredDay = computed({
  get: () => props.hoverredDay,
  set: value => emits('update:hoverred-day', value),
})

function getCalendarDateWithOffset(offset: number) {
  return dayjs(props.calendarDate).add(offset, 'month').format()
}

const calendarDateWithOffset = computed({
  get: () => getCalendarDateWithOffset(props.offsetMonth),
  set: calendarDate => emits('update:calendar-date', calendarDate),
})
</script>

<template>
  <div class="maz-picker-calendar-month" :class="{ '--has-padding': !range }">
    <MazDatePickerCalendarDays
      :locale="locale"
      :first-day-of-week="firstDayOfWeek"
      class="maz-picker-calendar-month__days"
    />

    <MazDatePickerCalendarGrid
      v-model="modelValue"
      v-model:hoverred-day="hoverredDay"
      :locale="locale"
      :color="color"
      :has-time="hasTime"
      :calendar-date="calendarDateWithOffset"
      :first-day-of-week="firstDayOfWeek"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled-weekly="disabledWeekly"
      :disabled-dates="disabledDates"
      :disabled="disabled"
      :range
    />
  </div>
</template>

<style lang="postcss" scoped>
  .maz-picker-calendar-month {
  @apply maz-w-full maz-overflow-hidden maz-py-2;

  &.--has-padding {
    @apply maz-px-2;
  }

  &__days {
    @apply maz-pb-2;
  }
}
</style>
