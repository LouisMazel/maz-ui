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
      <div class="maz-picker-calendar__months">
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
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, type PropType, ref, defineAsyncComponent } from 'vue'
  import type { Color } from '../types'
  import type { PickerShortcut, PickerValue } from './types'
  import type { Dayjs } from 'dayjs'

  import MazPickerCalendarSwitcher from './MazPickerCalendarSwitcher.vue'
  import MazPickerCalendarMonth from './MazPickerCalendarMonth/MazPickerCalendarMonth.vue'

  const MazPickerMonthSwitcher = defineAsyncComponent(() => import('./MazPickerMonthSwitcher.vue'))
  const MazPickerYearSwitcher = defineAsyncComponent(() => import('./MazPickerYearSwitcher.vue'))
  const MazPickerShortcuts = defineAsyncComponent(() => import('./MazPickerShortcuts.vue'))

  const props = defineProps({
    modelValue: {
      type: [String, Object] as PropType<PickerValue>,
      default: undefined,
    },
    calendarDate: { type: String, required: true },
    color: { type: String as PropType<Color>, required: true },
    locale: { type: String, required: true },
    firstDayOfWeek: { type: Number, required: true },
    double: { type: Boolean, required: true },
    minDate: { type: String, default: undefined },
    maxDate: { type: String, default: undefined },
    disabledWeekly: { type: Array as PropType<number[]>, required: true },
    disabledDates: { type: Array as PropType<string[]>, required: true },
    shortcuts: {
      type: Array as PropType<PickerShortcut[]>,
      required: true,
    },
    noShortcuts: { type: Boolean, required: true },
    hasTime: { type: Boolean, required: true },
    shortcut: { type: String, default: undefined },
    disabled: { type: Boolean, required: true },
  })

  const emits = defineEmits(['update:model-value', 'update:calendar-date'])

  const hoverredDay = ref<Dayjs>()

  const isRangeMode = computed(() => props.modelValue && typeof props.modelValue === 'object')

  const hasShortcuts = computed(
    () => !props.noShortcuts && props.shortcuts.length > 0 && isRangeMode.value,
  )

  const monthSwitcherOpen = ref(false)
  const yearSwitcherOpen = ref(false)

  const currentValue = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:model-value', value),
  })

  const months = computed(() => Array.from({ length: props.double ? 2 : 1 }, (_v, i) => i))

  const calendarDate = computed({
    get: () => props.calendarDate,
    set: (calendarDate) => emits('update:calendar-date', calendarDate),
  })
</script>

<style lang="postcss" scoped>
  .maz-picker-calendar {
    @apply maz-relative maz-flex maz-w-full;

    &__main {
      @apply maz-flex maz-flex-1 maz-flex-col;

      width: 16rem;

      &.--has-double {
        width: 30rem;

        & .maz-picker-calendar__months > *:first-child {
          @apply maz-border-r maz-border-color-lighter;
        }
      }
    }

    &__months {
      @apply maz-flex maz-w-full maz-flex-1;
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
