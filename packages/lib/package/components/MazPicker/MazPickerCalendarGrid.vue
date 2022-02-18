<template>
  <div class="maz-picker-calendar-days">
    <div v-for="first in firstLastDay.firstDay" :key="first" />
    <MazBtn
      v-for="(day, i) in dayCount"
      :key="i"
      size="mini"
      color="transparent"
      type="button"
      :class="{
        '--is-today': checkIsToday(day),
      }"
      @click="selectDay(day)"
    >
      <span>
        {{ day }}
      </span>
    </MazBtn>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { getDaysInMonth, getFirstAndLastDayOfMonth, isToday } from './utils'
  import MazBtn from '../MazBtn.vue'

  const props = defineProps({
    modelValue: { type: String, default: undefined },
    currentDate: { type: Date, required: true },
    locale: { type: String, required: true },
    firstDayOfWeek: { type: Number, required: true },
  })

  const emits = defineEmits(['update:model-value'])

  const date = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:model-value', value),
  })

  const year = computed(() => props.currentDate.getFullYear())
  const month = computed(() => props.currentDate.getMonth())

  const dayCount = computed(() => getDaysInMonth(year.value, month.value))

  const firstLastDay = computed(() =>
    getFirstAndLastDayOfMonth(props.currentDate),
  )

  const selectDay = (value: number) => {
    date.value = new Date(props.currentDate.setDate(value)).toDateString()
  }

  const checkIsToday = (day: number): boolean => {
    var clonedDate = new Date(props.currentDate.getTime())
    return isToday(new Date(clonedDate).setDate(day))
  }
</script>

<style lang="postcss" scoped>
  .maz-picker-calendar-days {
    @apply maz-grid maz-grid-cols-7 maz-gap-2 maz-flex-center;

    & button {
      @apply maz-h-8 maz-cursor-pointer maz-p-0;

      &.--is-today {
        @apply maz-bg-color-light !important;
      }

      & span {
        @apply maz-text-sm;
      }

      &:disabled {
        @apply maz-cursor-not-allowed;
      }
    }
  }
</style>
