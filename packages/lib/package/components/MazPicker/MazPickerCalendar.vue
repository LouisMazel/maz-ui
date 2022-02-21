<template>
  <div class="maz-picker-calendar">
    <MazPickerCalendarSwitcher
      v-model:current-date="currentDate"
      :locale="locale"
      :double="double"
      @open-month-switcher="monthSwitcherOpen = true"
      @open-year-switcher="yearSwitcherOpen = true"
    />
    <MazPickerMonthSwitcher
      v-if="monthSwitcherOpen"
      v-model:current-date="currentDate"
      :color="color"
      :double="double"
      :locale="locale"
      @close="monthSwitcherOpen = false"
    />
    <MazPickerYearSwitcher
      v-if="yearSwitcherOpen"
      v-model:current-date="currentDate"
      :color="color"
      :locale="locale"
      @close="yearSwitcherOpen = false"
    />
    <div
      class="maz-picker-calendar__months"
      :class="{ '--has-double': double }"
    >
      <MazPickerCalendarMonth
        v-model="modelValue"
        :locale="locale"
        :color="color"
        :current-date="currentDate"
        :first-day-of-week="firstDayOfWeek"
      />
      <MazPickerCalendarMonth
        v-if="double"
        v-model="modelValue"
        :locale="locale"
        :color="color"
        :offset-month="1"
        :current-date="currentDate"
        :first-day-of-week="firstDayOfWeek"
      />
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

  const props = defineProps({
    modelValue: { type: String, default: undefined },
    color: { type: String as PropType<Color>, required: true },
    locale: { type: String, required: true },
    firstDayOfWeek: { type: Number, required: true },
    currentDate: { type: Date, required: true },
    double: { type: Boolean, default: true },
  })

  const emits = defineEmits(['update:model-value', 'update:current-date'])

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
</script>

<style lang="postcss" scoped>
  .maz-picker-calendar {
    @apply maz-relative maz-bg-color;

    &__months {
      @apply maz-flex;

      &.--has-double {
        & *:first-child {
          @apply maz-border-r maz-border-color-lighter;
        }
      }
    }
  }

  html.dark {
    & .maz-picker-calendar {
      @apply maz-bg-color-light;

      & :deep(button):not(.--is-selected) {
        @apply hover:maz-bg-color-lighter !important;
      }
    }
  }
</style>
