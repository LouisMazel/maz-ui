<template>
  <div ref="MazPickerGrid" class="maz-picker-calendar-grid">
    <TransitionGroup :name="transitionName">
      <div
        v-for="(dateArray, dateIndex) in [calendarDateArray]"
        :key="`${dateArray[dateIndex]}`"
        class="maz-picker-calendar-grid__container"
        :class="{ '--is-range': isRangeMode }"
      >
        <div v-for="first in emptyDaysCount" :key="first" />
        <MazBtn
          v-for="({ label, date }, i) in monthDays"
          :key="i"
          size="mini"
          :color="getDayButtonColor(date)"
          type="button"
          :disabled="
            isSmallerMinDate(date) ||
            isBiggerMaxDate(date) ||
            isDisabledWeekly(date) ||
            isDisabledDate(date)
          "
          :class="{
            '--is-today': checkIsToday(date),
            '--is-first': isFirstDay(date),
            '--is-last':
              isLastDay(date) || (isRangeMode && isLastDayHoverred(date)),
            '--is-selected': isSelectedOrBetween(date) === DaySelect.SELECTED,
            '--is-between': isSelectedOrBetween(date) === DaySelect.BETWEEN,
            '--is-between-hoverred': isRangeMode
              ? isBetweenHoverred(date) === DaySelect.BETWEEN_HOVERRED
              : undefined,
          }"
          @click="selectDay(date)"
          @mouseover="isRangeMode ? setHoverredDay(date) : undefined"
          @mouseleave="isRangeMode ? setHoverredDay() : undefined"
        >
          <span>
            {{ label }}
          </span>
        </MazBtn>
      </div>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
  import { computed, type PropType, ref, watch } from 'vue'
  import {
    getDaysInMonth,
    getFirstDayOfMonth,
    isSameDate,
    isToday,
    isSameDay,
  } from '../utils'
  import MazBtn from '@components/MazBtn.vue'
  import type { Color } from '@components/types'
  import { debounce } from '@package/helpers'
  import type { PartialRangeValue, PickerValue } from '../types'
  import dayjs, { Dayjs } from 'dayjs'

  enum DaySelect {
    UNSELECTED,
    SELECTED,
    BETWEEN,
    BETWEEN_HOVERRED,
  }

  const props = defineProps({
    modelValue: {
      type: [String, Object] as PropType<PickerValue>,
      default: undefined,
    },
    calendarDate: { type: String, required: true },
    hasTime: { type: Boolean, required: true },
    locale: { type: String, required: true },
    firstDayOfWeek: { type: Number, required: true },
    color: { type: String as PropType<Color>, required: true },
    minDate: { type: String, default: undefined },
    maxDate: { type: String, default: undefined },
    disabledWeekly: { type: Array as PropType<number[]>, required: true },
    disabledDates: { type: Array as PropType<string[]>, required: true },
    hoverredDay: { type: Object as PropType<Dayjs>, default: undefined },
  })

  const emits = defineEmits(['update:model-value', 'update:hoverred-day'])

  const MazPickerGrid = ref<HTMLDivElement>()
  const transitionName = ref<'maz-slidenext' | 'maz-slideprev'>('maz-slidenext')

  const calendarDateArray = computed<string[]>(() => [props.calendarDate])

  const isRangeMode = computed(() => typeof props.modelValue === 'object')

  const hoverColor = computed(() => `var(--maz-color-${props.color}-alpha-20)`)
  const betweenColor = computed(() => `var(--maz-color-${props.color}-alpha)`)
  const betweenColorAlpha = computed(
    () => `var(--maz-color-${props.color}-alpha-20)`,
  )

  const modelValue = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:model-value', value),
  })

  const monthDays = computed<{ label: string | number; date: Dayjs }[]>(() =>
    Array.from(
      { length: getDaysInMonth(props.calendarDate) },
      (_v, i) => i + 1,
    ).map((day) => ({
      label: day,
      date: dayjs(props.calendarDate).set('date', day),
    })),
  )

  const emptyDaysCount = computed(() => {
    return Math.abs(
      getFirstDayOfMonth(props.calendarDate) - props.firstDayOfWeek,
    )
  })

  const setHoverredDay = (day?: Dayjs) => {
    const value = props.modelValue as PartialRangeValue

    if (value.start && !value.end && day && day.isAfter(value.start)) {
      emits('update:hoverred-day', day)
    } else {
      emits('update:hoverred-day', undefined)
    }
  }

  const isBetweenHoverred = (day: Dayjs): DaySelect | undefined => {
    const value = props.modelValue as PartialRangeValue

    if (!value.start || !props.hoverredDay) {
      return undefined
    }

    const isBetween = dayjs(day).isBetween(
      value.start,
      props.hoverredDay,
      'date',
      '(]',
    )

    return isBetween ? DaySelect.BETWEEN_HOVERRED : undefined
  }

  const isLastDayHoverred = (day: Dayjs) => {
    if (!props.hoverredDay) {
      return undefined
    }

    return dayjs(day).isSame(props.hoverredDay)
  }

  const isFirstDay = (day: Dayjs): boolean => {
    if (!props.modelValue) {
      return false
    }

    if (typeof props.modelValue === 'object' && props.modelValue?.start) {
      return isSameDate(day, props.modelValue.start, 'date')
    }

    return false
  }

  const isLastDay = (day: Dayjs): boolean => {
    if (!props.modelValue) {
      return false
    }

    if (typeof props.modelValue === 'object' && props.modelValue?.end) {
      return isSameDate(day, props.modelValue.end, 'date')
    }
    return false
  }

  const getDayButtonColor = (date: Dayjs): Color => {
    const value = props.modelValue

    if (typeof value === 'object') {
      return (value.start ? isSameDate(date, value.start, 'date') : false) ||
        (value.end ? isSameDate(date, value.end, 'date') : false)
        ? props.color
        : checkIsBetween(date)
        ? props.color
        : 'transparent'
    } else {
      return checkIsSameDate(date) ? props.color : 'transparent'
    }
  }

  const isSelectedOrBetween = (day: Dayjs): DaySelect => {
    if (typeof props.modelValue === 'object') {
      if (props.modelValue.start) {
        if (isSameDate(day, props.modelValue.start, 'date')) {
          return DaySelect.SELECTED
        }
      }
      if (props.modelValue.end) {
        if (isSameDate(day, props.modelValue.end, 'date')) {
          return DaySelect.SELECTED
        }

        if (checkIsBetween(day)) {
          return DaySelect.BETWEEN
        }
      }
    } else if (checkIsSameDate(day)) {
      return DaySelect.SELECTED
    }

    return DaySelect.UNSELECTED
  }

  const selectDay = (value: Dayjs) => {
    if (isRangeMode.value) {
      setHoverredDay()
    }

    const valueFormatted = value.format()
    if (typeof modelValue.value === 'object') {
      let values = modelValue.value

      if (values.start && values.end) {
        values = {
          start: undefined,
          end: undefined,
        }
      }

      const isBeforeStartDate = dayjs(valueFormatted).isBefore(
        values.start,
        'date',
      )

      if (!values.start || isBeforeStartDate) {
        modelValue.value = {
          start: valueFormatted,
          end: undefined,
        }
      } else {
        modelValue.value = {
          start: values.start,
          end: valueFormatted,
        }
      }
    } else {
      modelValue.value = valueFormatted
    }
  }

  const checkIsToday = (day: Dayjs): boolean => {
    return isToday(day)
  }

  const checkIsSameDate = (day: Dayjs): boolean => {
    if (!props.modelValue) {
      return false
    }

    const value = props.modelValue as string

    return isSameDate(day, value, 'date')
  }

  const checkIsBetween = (day: Dayjs): boolean => {
    const value = props.modelValue as PartialRangeValue

    if (!value.start || !value.end) {
      return false
    }

    return dayjs(day).isBetween(value.start, value.end, 'date', '()')
  }

  const isSmallerMinDate = (day: Dayjs): boolean => {
    if (!props.minDate) {
      return false
    }

    return dayjs(day).isBefore(props.minDate, 'date')
  }

  const isDisabledWeekly = (day: Dayjs): boolean => {
    if (!props.disabledWeekly?.length) {
      return false
    }

    return props.disabledWeekly.some((disabledDay) =>
      isSameDay(day, disabledDay),
    )
  }

  const isDisabledDate = (day: Dayjs): boolean => {
    if (!props.disabledDates?.length) {
      return false
    }

    return props.disabledDates.some((disabledDay) =>
      isSameDate(day, disabledDay, 'date'),
    )
  }

  const isBiggerMaxDate = (day: Dayjs): boolean => {
    if (!props.maxDate) {
      return false
    }

    return dayjs(day).isAfter(props.maxDate, 'date')
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
    () => props.calendarDate,
    (calendarDate, oldCalendarValue) => {
      transitionName.value = dayjs(calendarDate).isAfter(
        oldCalendarValue,
        'date',
      )
        ? 'maz-slidenext'
        : 'maz-slideprev'

      setContainerHeight()
    },
  )
</script>

<style lang="postcss" scoped>
  .maz-picker-calendar-grid {
    @apply maz-relative;

    transition: all 300ms ease-in-out;

    &__container {
      @apply maz-relative maz-grid maz-grid-cols-7 maz-items-start maz-gap-1;

      &.--is-range {
        @apply maz-gap-0 maz-gap-y-1;
      }

      & button {
        @apply maz-h-8 maz-cursor-pointer;
        @apply maz-p-1 !important;

        &.--is-today:not(.--is-selected):not(.--is-between):not(.--is-between-hoverred) {
          @apply maz-bg-color-light !important;
        }

        &:hover,
        &:focus {
          &:not(.--is-selected):not(.--is-between):not(.--is-between-hoverred) {
            /* stylelint-disable */
            background-color: v-bind(hoverColor) !important;
            /* stylelint-enable */
          }
        }

        &.--is-first:not(.--is-last) {
          @apply maz-rounded-r-none !important;
        }

        &.--is-last:not(.--is-first) {
          @apply maz-rounded-l-none !important;
        }

        &.--is-between-hoverred {
          &:not(.--is-last) {
            @apply maz-rounded-none !important;
          }

          /* stylelint-disable */
          background-color: v-bind(betweenColorAlpha) !important;
          /* stylelint-enable */
        }

        &.--is-between {
          @apply maz-rounded-none !important;

          /* stylelint-disable */
          background-color: v-bind(betweenColor) !important;
          /* stylelint-enable */

          &.--white,
          &.--transparent {
            @apply maz-bg-gray-400 !important;
          }

          &.--black {
            @apply maz-bg-gray-800 !important;
          }
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
    & .maz-picker-calendar-grid {
      button.--is-today:not(.--is-selected):not(.--is-between):not(.--is-between-hoverred) {
        @apply maz-bg-color-lighter !important;
      }
    }
  }

  /** Slide next/prev animation  **/
  .maz-slidenext-leave-active,
  .maz-slidenext-enter-active,
  .maz-slideprev-leave-active,
  .maz-slideprev-enter-active {
    @apply maz-absolute maz-top-0 maz-left-0 maz-right-0;

    transition: transform 300ms ease-in-out;
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
