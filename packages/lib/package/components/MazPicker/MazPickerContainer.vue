<template>
  <div class="m-picker-container" :class="{ '--has-double': double }">
    <MazPickerHeader
      v-if="!noHeader"
      :color="color"
      :date="modelValue"
      :locale="locale"
      class="m-picker-container__header"
    />

    <MazPickerCalendar
      v-model="modelValue"
      v-model:current-date="currentDate"
      :color="color"
      :locale="locale"
      :double="double"
      :first-day-of-week="firstDayOfWeek"
      class="m-picker-container__calendar"
    />
  </div>
</template>

<script lang="ts" setup>
  import MazPickerHeader from './MazPickerHeader.vue'
  import MazPickerCalendar from './MazPickerCalendar.vue'
  import { computed, PropType } from 'vue'
  import { Color } from '../types'

  const props = defineProps({
    color: { type: String as PropType<Color>, required: true },
    modelValue: { type: String, default: undefined },
    locale: { type: String, required: true },
    noHeader: { type: Boolean, default: false },
    firstDayOfWeek: { type: Number, required: true },
    currentDate: { type: Date, required: true },
    double: { type: Boolean, required: true },
  })

  const emits = defineEmits(['update:model-value', 'update:current-date'])

  const modelValue = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:model-value', value),
  })

  const currentDate = computed({
    get: () => props.currentDate,
    set: (currentDate) => {
      emits('update:current-date', currentDate)
    },
  })
</script>

<style lang="postcss" scoped>
  .m-picker-container {
    @apply maz-absolute maz-z-default-backdrop maz-overflow-hidden maz-rounded-lg maz-bg-color maz-elevation;

    min-width: 250px;

    &.--has-double {
      min-width: 440px;
    }
  }
</style>
