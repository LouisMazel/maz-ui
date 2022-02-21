<template>
  <div ref="MazPickerGrid" class="maz-picker-calendar-grid">
    <TransitionGroup :name="transitionName">
      <div
        v-for="(dateArray, dateIndex) in [currentDateArray]"
        :key="`${dateArray[dateIndex]}`"
        class="maz-picker-calendar-grid__container"
      >
        <div v-for="first in emptyDaysCount" :key="first" />
        <MazBtn
          v-for="(day, i) in dayCount"
          :key="i"
          size="mini"
          :color="checkIsSameDate(day) ? color : 'transparent'"
          type="button"
          :disabled="
            checkIsSmallerMinDate(day) ||
            checkIsBiggerMaxDate(day) ||
            checkIsSameDay(day)
          "
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
    isSmaller,
    isSameDay,
    getWeekDays,
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
    minDate: { type: String, default: undefined },
    maxDate: { type: String, default: undefined },
    disabledWeekly: { type: Array as PropType<number[]>, default: undefined },
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

  const emptyDaysCount = computed(() => {
    const { firstDay } = getFirstAndLastDayOfMonth(props.currentDate)

    const weekDays = getWeekDays(props.locale, props.firstDayOfWeek)
    const indexCurrentWeekDay = weekDays.findIndex(
      ({ dayNumber }) => dayNumber === firstDay,
    )

    return indexCurrentWeekDay
  })

  const selectDay = (value: number) => {
    date.value = new Date(props.currentDate.setDate(value)).toDateString()
  }

  const checkIsToday = (day: number): boolean => {
    const clonedDate = cloneDate(props.currentDate)
    return isToday(clonedDate.setDate(day))
  }

  const checkIsSameDate = (day: number): boolean => {
    if (!props.modelValue) {
      return false
    }
    const clonedDate = cloneDate(props.currentDate)
    const itemDay = clonedDate.setDate(day)
    const selectedDay = new Date(props.modelValue)

    return isSameDate(new Date(itemDay), new Date(selectedDay))
  }

  const checkIsSmallerMinDate = (day: number): boolean => {
    if (!props.minDate) {
      return false
    }
    const clonedDate = cloneDate(props.currentDate)
    return isSmaller(clonedDate.setDate(day), new Date(props.minDate))
  }

  const checkIsSameDay = (day: number): boolean => {
    if (!props.disabledWeekly?.length) {
      return false
    }
    const clonedDate = cloneDate(props.currentDate)

    return props.disabledWeekly.some((disabledDay) =>
      isSameDay(clonedDate.setDate(day), disabledDay),
    )
  }

  const checkIsBiggerMaxDate = (day: number): boolean => {
    if (!props.maxDate) {
      return false
    }
    const clonedDate = cloneDate(props.currentDate)

    return isBigger(clonedDate.setDate(day), new Date(props.maxDate))
  }

  const removeContainerHeight = debounce(() => {
    if (MazPickerGrid.value) {
      MazPickerGrid.value.style.minHeight = ''
    }
  }, 400)

  const setContainerHeight = () => {
    if (MazPickerGrid.value) {
      MazPickerGrid.value.style.minHeight = `${
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

    transition: all 300ms ease-in-out;

    &__container {
      @apply maz-relative maz-grid maz-grid-cols-7 maz-items-start maz-gap-1;

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
    @apply maz-top-0 maz-left-0 maz-right-0;
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
