<script lang="ts" setup>
import type { Dayjs } from 'dayjs'
import type { MazColor } from '../types'
import type { MazPickerShortcut, MazPickerValue } from './types'
import { computed, defineAsyncComponent, ref } from 'vue'

const props = defineProps<{
  modelValue: MazPickerValue | undefined
  calendarDate: string
  color: MazColor
  locale: string
  firstDayOfWeek: number
  double: boolean
  minDate: string | undefined
  maxDate: string | undefined
  disabledWeekly: number[]
  disabledDates: string[]
  shortcuts: MazPickerShortcut[] | false
  hasTime: boolean
  shortcut: MazPickerShortcut['identifier'] | undefined
  disabled: boolean
  range: boolean
}>()

const emits = defineEmits(['update:model-value', 'update:calendar-date'])
const MazPickerCalendarMonth = defineAsyncComponent(() => import('../MazPicker/MazPickerCalendarMonth/MazPickerCalendarMonth.vue'))
const MazPickerCalendarSwitcher = defineAsyncComponent(() => import('../MazPicker/MazPickerCalendarSwitcher.vue'))
const MazPickerMonthSwitcher = defineAsyncComponent(() => import('../MazPicker/MazPickerMonthSwitcher.vue'))
const MazPickerShortcuts = defineAsyncComponent(() => import('../MazPicker/MazPickerShortcuts.vue'))
const MazPickerYearSwitcher = defineAsyncComponent(() => import('../MazPicker/MazPickerYearSwitcher.vue'))

const hoverredDay = ref<Dayjs>()

const hasShortcuts = computed(
  () => props.shortcuts && props.shortcuts.length > 0 && props.range,
)

const monthSwitcherOpen = ref(false)
const yearSwitcherOpen = ref(false)

const currentValue = computed({
  get: () => props.modelValue,
  set: value => emits('update:model-value', value),
})

const months = computed(() => Array.from({ length: props.double ? 2 : 1 }, (_v, i) => i))

const calendarDate = computed({
  get: () => props.calendarDate,
  set: calendarDate => emits('update:calendar-date', calendarDate),
})
</script>

<template>
  <div class="maz-picker-calendar flex">
    <MazPickerShortcuts
      v-if="hasShortcuts"
      v-model="currentValue"
      :color="color"
      :shortcuts="shortcuts"
      :shortcut="shortcut"
      :double="double"
      :disabled="disabled"
    />

    <div class="maz-picker-calendar__main" :class="{ '--has-double': double }">
      <MazPickerCalendarSwitcher
        v-model:calendar-date="calendarDate"
        :locale="locale"
        :double="double"
        @open-month-switcher="monthSwitcherOpen = true"
        @open-year-switcher="yearSwitcherOpen = true"
      />
      <Transition name="maz-picker-slide">
        <MazPickerMonthSwitcher
          v-if="monthSwitcherOpen"
          v-model:calendar-date="calendarDate"
          :color="color"
          :double="double"
          :locale="locale"
          @close="monthSwitcherOpen = false"
        />
      </Transition>
      <Transition name="maz-picker-slide">
        <MazPickerYearSwitcher
          v-if="yearSwitcherOpen"
          v-model:calendar-date="calendarDate"
          :color="color"
          :locale="locale"
          @close="yearSwitcherOpen = false"
        />
      </Transition>
      <div class="maz-picker-calendar__months" :class="{ '--is-range': range }">
        <MazPickerCalendarMonth
          v-for="month in months"
          :key="month"
          v-model="currentValue"
          v-model:hoverred-day="hoverredDay"
          :calendar-date="calendarDate"
          :locale="locale"
          :has-time="hasTime"
          :color="color"
          :offset-month="month"
          :first-day-of-week="firstDayOfWeek"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          :disabled-weekly="disabledWeekly"
          :disabled-dates="disabledDates"
          :range
        />
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.maz-picker-calendar {
  @apply maz-relative maz-flex maz-w-full;

  &__main {
    @apply maz-flex maz-flex-1 maz-flex-col;

    width: 16rem;

    &.--has-double {
      width: 34rem;

      & .maz-picker-calendar__months > :first-child {
        @apply maz-border-r maz-border-color-lighter;
      }
    }
  }

  &__months {
    @apply maz-flex maz-w-full maz-flex-1;

    &.--is-range {
      @apply maz-px-2;
    }
  }
}

.maz-picker-slide-enter-active,
.maz-picker-slide-leave-active {
  transition: all 300ms ease-in-out;
  transform: translateY(0);
}

.maz-picker-slide-enter-from,
.maz-picker-slide-leave-to {
  transform: translateY(100%);
}
</style>
