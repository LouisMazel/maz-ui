<template>
  <div ref="MazPickerGrid" class="maz-picker-calendar-grid">
    <TransitionGroup :name="transitionName">
      <div
        v-for="(dateArray, dateIndex) in [currentDateArray]"
        :key="`${dateArray[dateIndex]}`"
        class="maz-picker-calendar-grid__container"
      >
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
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
  import { computed, PropType, ref, watch } from 'vue'
  import {
    cloneDate,
    getDaysInMonth,
    getFirstAndLastDayOfMonth,
    isSameDate,
    isToday,
    isBigger,
  } from '../utils'
  import MazBtn from '../../MazBtn.vue'
  import { Color } from '../../types'
  import { debounce } from './../../../utils'

  const props = defineProps({
    modelValue: { type: String, default: undefined },
    currentDate: { type: Date, required: true },
    locale: { type: String, required: true },
    firstDayOfWeek: { type: Number, required: true },
    color: { type: String as PropType<Color>, required: true },
  })

  const emits = defineEmits(['update:model-value'])

  const MazPickerGrid = ref<HTMLDivElement>()
  const transitionName = ref<'maz-slidenext' | 'maz-slideprev'>('maz-slidenext')
  const currentDateTmp = ref<Date>(cloneDate(props.currentDate))

  const date = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:model-value', value),
  })

  const currentDateArray = computed(() => [cloneDate(props.currentDate)])

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
    const clonedDate = cloneDate(props.currentDate)
    return isToday(new Date(clonedDate).setDate(day))
  }

  const checkIsSameDate = (day: number): boolean => {
    if (!props.modelValue) {
      return false
    }
    const clonedDate = cloneDate(props.currentDate)
    const itemDay = new Date(clonedDate).setDate(day)
    const selectedDay = new Date(props.modelValue)

    return isSameDate(new Date(itemDay), new Date(selectedDay))
  }

  const removeContainerHeight = debounce(() => {
    if (MazPickerGrid.value) {
      MazPickerGrid.value.style.height = ''
    }
  }, 500)

  const setContainerHeight = () => {
    if (MazPickerGrid.value) {
      MazPickerGrid.value.style.height = `${
        MazPickerGrid.value?.clientHeight || 176
      }px`

      removeContainerHeight()
    }
  }

  watch(
    () => props.currentDate,
    (currentDate) => {
      transitionName.value = isBigger(currentDateTmp.value, currentDate)
        ? 'maz-slideprev'
        : 'maz-slidenext'
      currentDateTmp.value = currentDate
      setContainerHeight()
    },
  )
</script>

<style lang="postcss" scoped>
  .maz-picker-calendar-grid {
    @apply maz-relative maz-overflow-hidden;

    transition: all 300ms;

    &__container {
      @apply maz-relative maz-grid maz-h-full maz-grid-cols-7 maz-gap-1 maz-flex-center;

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
  }

  html.dark {
    .maz-picker-calendar-grid button.--is-today:not(.--is-selected) {
      @apply maz-bg-color-lighter !important;
    }
  }

  /** Slide next/prev animation  **/
  .maz-slidenext-leave-active,
  .maz-slidenext-enter-active,
  .maz-slideprev-leave-active,
  .maz-slideprev-enter-active {
    position: absolute;
    transition: all 300ms ease-in-out;
    @apply maz-inset-0;
  }

  /* .maz-slidenext-enter-to, */
  .maz-slideprev-leave-to,
  .maz-slidenext-enter-from {
    transform: translateX(100%);
  }

  .maz-slidenext-leave-to,
  .maz-slideprev-enter-from {
    transform: translateX(-100%);
  }
</style>
