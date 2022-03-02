<template>
  <div class="maz-picker-calendar flex">
    <MazPickerShortcuts
      v-if="!noShortcuts && isRangeMode"
      v-model="modelValue"
      :current-date="currentDate"
      :color="color"
      :shortcuts="shortcuts"
      :shortcut="shortcut"
      :double="double"
    />
    <div class="maz-picker-calendar__main" :class="{ '--has-double': double }">
      <MazPickerCalendarSwitcher
        v-model:current-date="currentDate"
        :locale="locale"
        :double="double"
        @open-month-switcher="monthSwitcherOpen = true"
        @open-year-switcher="yearSwitcherOpen = true"
      />
      <Transition name="maz-picker-slide">
        <MazPickerMonthSwitcher
          v-if="monthSwitcherOpen"
          v-model:current-date="currentDate"
          :color="color"
          :double="double"
          :locale="locale"
          @close="monthSwitcherOpen = false"
        />
      </Transition>
      <Transition name="maz-picker-slide">
        <MazPickerYearSwitcher
          v-if="yearSwitcherOpen"
          v-model:current-date="currentDate"
          :color="color"
          :locale="locale"
          @close="yearSwitcherOpen = false"
        />
      </Transition>
      <div class="maz-picker-calendar__months">
        <MazPickerCalendarMonth
          v-for="month in months"
          :key="month"
          v-model="modelValue"
          :locale="locale"
          :time="time"
          :color="color"
          :offset-month="month"
          :current-date="currentDate"
          :first-day-of-week="firstDayOfWeek"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled-weekly="disabledWeekly"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, PropType, ref } from 'vue'
  import MazPickerCalendarSwitcher from './MazPickerCalendarSwitcher.vue'
  import { Color } from '../types'
  import MazPickerMonthSwitcher from './MazPickerMonthSwitcher.vue'
  import MazPickerYearSwitcher from './MazPickerYearSwitcher.vue'
  import MazPickerCalendarMonth from './MazPickerCalendarMonth/MazPickerCalendarMonth.vue'
  import { PickerShortcut, PickerValue } from './types'
  import MazPickerShortcuts from './MazPickerShortcuts.vue'

  const props = defineProps({
    modelValue: {
      type: [String, Object] as PropType<PickerValue>,
      default: undefined,
    },
    color: { type: String as PropType<Color>, required: true },
    locale: { type: String, required: true },
    firstDayOfWeek: { type: Number, required: true },
    currentDate: { type: Date, required: true },
    double: { type: Boolean, required: true },
    minDate: { type: String, default: undefined },
    maxDate: { type: String, default: undefined },
    disabledWeekly: { type: Array as PropType<number[]>, default: undefined },
    shortcuts: {
      type: Array as PropType<PickerShortcut[]>,
      required: true,
    },
    noShortcuts: { type: Boolean, required: true },
    time: { type: Boolean, required: true },
    shortcut: { type: String, default: undefined },
  })

  const emits = defineEmits(['update:model-value', 'update:current-date'])

  const isRangeMode = computed(() => typeof props.modelValue === 'object')

  const monthSwitcherOpen = ref(false)
  const yearSwitcherOpen = ref(false)

  const modelValue = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:model-value', value),
  })

  const currentDate = computed({
    get: () => props.currentDate,
    set: (currentDate) => emits('update:current-date', currentDate),
  })

  const months = computed(() =>
    Array.from({ length: props.double ? 2 : 1 }, (_v, i) => i),
  )
</script>

<style lang="postcss" scoped>
  /* stylelint-disable no-descending-specificity */
  .maz-picker-calendar {
    @apply maz-relative maz-flex maz-w-full;

    &__main {
      @apply maz-flex-1;

      width: 16rem;

      &.--has-double {
        width: 32rem;

        & .maz-picker-calendar__months > *:first-child {
          @apply maz-border-r maz-border-color-lighter;
        }
      }
    }

    &__months {
      @apply maz-flex maz-w-full;
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
