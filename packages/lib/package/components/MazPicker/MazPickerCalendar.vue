<template>
  <div class="maz-picker-calendar">
    <MazPickerCalendarSwitcher
      v-model:current-date="currentDate"
      :locale="locale"
      class="maz-picker-calendar__days"
    />
    <MazPickerCalendarDays
      :locale="locale"
      :first-day-of-week="firstDayOfWeek"
      class="maz-picker-calendar__days"
    />
    <MazPickerCalendarGrid
      v-model="modelValue"
      :locale="locale"
      :current-date="currentDate"
      :first-day-of-week="firstDayOfWeek"
    />
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import MazPickerCalendarSwitcher from './MazPickerCalendarSwitcher.vue'
  import MazPickerCalendarDays from './MazPickerCalendarDays.vue'
  import MazPickerCalendarGrid from './MazPickerCalendarGrid.vue'

  const props = defineProps({
    modelValue: { type: String, default: undefined },
    color: { type: String, required: true },
    locale: { type: String, required: true },
    firstDayOfWeek: { type: Number, required: true },
    currentDate: { type: Date, required: true },
  })

  const emits = defineEmits(['update:model-value', 'update:current-date'])

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
    @apply maz-py-2 maz-px-2;

    &__days {
      @apply maz-pb-2;
    }
  }
</style>
