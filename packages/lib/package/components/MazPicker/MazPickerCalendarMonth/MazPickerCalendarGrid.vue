<template>
  <div class="maz-picker-calendar-days">
    <div v-for="first in firstDay" :key="first" />
    <MazBtn
      v-for="(day, i) in dayCount"
      :key="i"
      size="mini"
      :color="checkIsSameDate(day) ? color : 'transparent'"
      type="button"
      :class="{
        '--is-today': checkIsToday(day),
        '--is-selected': checkIsSameDate(day),
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
  import { computed, PropType } from 'vue'
  import {
    getDaysInMonth,
    getFirstAndLastDayOfMonth,
    isSameDate,
    isToday,
  } from '../utils'
  import MazBtn from '../../MazBtn.vue'
  import { Color } from '../../types'

  const props = defineProps({
    modelValue: { type: String, default: undefined },
    currentDate: { type: Date, required: true },
    locale: { type: String, required: true },
    firstDayOfWeek: { type: Number, required: true },
    color: { type: String as PropType<Color>, required: true },
  })

  const emits = defineEmits(['update:model-value'])

  const date = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:model-value', value),
  })

  const year = computed(() => props.currentDate.getFullYear())
  const month = computed(() => props.currentDate.getMonth() + 1)

  const dayCount = computed(() => getDaysInMonth(year.value, month.value))

  const firstDay = computed(() => {
    const { firstDay } = getFirstAndLastDayOfMonth(props.currentDate)
    const firstDayOffset = firstDay >= 0 ? firstDay : 0
    return firstDayOffset
  })

  const selectDay = (value: number) => {
    date.value = new Date(props.currentDate.setDate(value)).toDateString()
  }

  const checkIsToday = (day: number): boolean => {
    const clonedDate = new Date(props.currentDate.getTime())
    return isToday(new Date(clonedDate).setDate(day))
  }
  const checkIsSameDate = (day: number): boolean => {
    if (!props.modelValue) {
      return false
    }
    const clonedDate = new Date(props.currentDate.getTime())
    const itemDay = new Date(clonedDate).setDate(day)
    const selectedDay = new Date(props.modelValue)

    return isSameDate(new Date(itemDay), new Date(selectedDay))
  }
</script>

<style lang="postcss" scoped>
  .maz-picker-calendar-days {
    @apply maz-grid maz-grid-cols-7 maz-gap-1 maz-flex-center;

    & button {
      @apply maz-h-8 maz-cursor-pointer;
      @apply maz-p-1 !important;

      &.--is-today:not(.--is-selected) {
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

  html.dark {
    .maz-picker-calendar-days button.--is-today:not(.--is-selected) {
      @apply maz-bg-color-lighter !important;
    }
  }
</style>
