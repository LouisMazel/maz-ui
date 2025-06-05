<script lang="ts" setup>
import type { Dayjs } from 'dayjs'
import type { PropType } from 'vue'
import type { MazColor } from '../../types'
import type { MazPickerPartialRangeValue, MazPickerValue } from '../types'
import dayjs from 'dayjs'
import { computed, ref, watch } from 'vue'
import { debounce } from '../../../helpers/debounce'
import MazBtn from '../../MazBtn.vue'

import { getDaysInMonth, getFirstDayOfMonth, isSameDate, isSameDay, isToday } from '../utils'

const props = defineProps({
  modelValue: {
    type: [String, Object] as PropType<MazPickerValue>,
    default: undefined,
  },
  calendarDate: { type: String, required: true },
  hasTime: { type: Boolean, required: true },
  locale: { type: String, required: true },
  firstDayOfWeek: { type: Number, required: true },
  color: { type: String as PropType<MazColor>, required: true },
  minDate: { type: String, default: undefined },
  maxDate: { type: String, default: undefined },
  disabledWeekly: { type: Array as PropType<number[]>, required: true },
  disabledDates: { type: Array as PropType<string[]>, required: true },
  hoverredDay: { type: Object as PropType<Dayjs>, default: undefined },
  disabled: { type: Boolean, required: true },
})

const emits = defineEmits(['update:model-value', 'update:hoverred-day'])

enum DaySelect {
  UNSELECTED,
  SELECTED,
  BETWEEN,
  BETWEEN_HOVERRED,
}

const MazPickerGrid = ref<HTMLDivElement>()
const transitionName = ref<'maz-slidenext' | 'maz-slideprev'>('maz-slidenext')

const calendarDateArray = computed<string[]>(() => [props.calendarDate])

const isRangeMode = computed(() => props.modelValue && typeof props.modelValue === 'object')

const hoverColor = computed(() => `var(--maz-color-${props.color}-alpha-20)`)
const betweenColor = computed(() => `var(--maz-color-${props.color}-alpha)`)
const betweenColorAlpha = computed(() => `var(--maz-color-${props.color}-alpha-20)`)

const modelValue = computed({
  get: () => props.modelValue,
  set: value => emits('update:model-value', value),
})

const monthDays = computed<{ label: string | number, date: Dayjs }[]>(() =>
  Array.from({ length: getDaysInMonth(props.calendarDate) }, (_v, i) => i + 1).map(day => ({
    label: day,
    date: dayjs(props.calendarDate).set('date', day),
  })),
)

const emptyDaysCount = computed(() => {
  const firstDayMonth = getFirstDayOfMonth(props.calendarDate)
  return (firstDayMonth - props.firstDayOfWeek + 7) % 7
})

function setHoverredDay(day?: Dayjs) {
  const value = props.modelValue as MazPickerPartialRangeValue

  if (value.start && !value.end && day && day.isAfter(value.start)) {
    emits('update:hoverred-day', day)
  }
  else {
    emits('update:hoverred-day')
  }
}

function isBetweenHoverred(day: Dayjs): DaySelect | undefined {
  const value = props.modelValue as MazPickerPartialRangeValue

  if (!value.start || !props.hoverredDay) {
    return undefined
  }

  const isBetween = dayjs(day).isBetween(value.start, props.hoverredDay, 'date', '(]')

  return isBetween ? DaySelect.BETWEEN_HOVERRED : undefined
}

function isLastDayHoverred(day: Dayjs) {
  if (!props.hoverredDay) {
    return
  }

  return dayjs(day).isSame(props.hoverredDay)
}

function isFirstDay(day: Dayjs): boolean {
  if (!props.modelValue) {
    return false
  }

  if (props.modelValue && typeof props.modelValue === 'object' && props.modelValue?.start) {
    return isSameDate(day, props.modelValue.start, 'date')
  }

  return false
}

function isLastDay(day: Dayjs): boolean {
  if (!props.modelValue) {
    return false
  }

  if (props.modelValue && typeof props.modelValue === 'object' && props.modelValue?.end) {
    return isSameDate(day, props.modelValue.end, 'date')
  }
  return false
}

function getDayButtonColor(date: Dayjs): MazColor {
  const value = props.modelValue

  if (typeof value === 'object') {
    return (value.start ? isSameDate(date, value.start, 'date') : false)
      || (value.end ? isSameDate(date, value.end, 'date') : false)
      ? props.color
      : checkIsBetween(date)
        ? props.color
        : 'transparent'
  }
  else {
    return checkIsSameDate(date) ? props.color : 'transparent'
  }
}

function isSelectedOrBetween(day: Dayjs): DaySelect {
  if (props.modelValue && typeof props.modelValue === 'object') {
    if (props.modelValue.start && isSameDate(day, props.modelValue.start, 'date')) {
      return DaySelect.SELECTED
    }
    if (props.modelValue.end) {
      if (isSameDate(day, props.modelValue.end, 'date')) {
        return DaySelect.SELECTED
      }

      if (checkIsBetween(day)) {
        return DaySelect.BETWEEN
      }
    }
  }
  else if (checkIsSameDate(day)) {
    return DaySelect.SELECTED
  }

  return DaySelect.UNSELECTED
}

function selectDay(value: Dayjs) {
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

    const isBeforeStartDate = dayjs(valueFormatted).isBefore(values.start, 'date')

    modelValue.value
        = !values.start || isBeforeStartDate
        ? {
            start: valueFormatted,
            end: undefined,
          }
        : {
            start: values.start,
            end: valueFormatted,
          }
  }
  else {
    modelValue.value = valueFormatted
  }
}

function checkIsToday(day: Dayjs): boolean {
  return isToday(day)
}

function checkIsSameDate(day: Dayjs): boolean {
  if (!props.modelValue) {
    return false
  }

  const value = props.modelValue as string

  return isSameDate(day, value, 'date')
}

function checkIsBetween(day: Dayjs): boolean {
  const value = props.modelValue as MazPickerPartialRangeValue

  if (!value.start || !value.end) {
    return false
  }

  return dayjs(day).isBetween(value.start, value.end, 'date', '()')
}

function isSmallerMinDate(day: Dayjs): boolean {
  if (!props.minDate) {
    return false
  }

  return dayjs(day).isBefore(props.minDate, 'date')
}

function isDisabledWeekly(day: Dayjs): boolean {
  if (!props.disabledWeekly?.length) {
    return false
  }

  return props.disabledWeekly.some(disabledDay => isSameDay(day, disabledDay))
}

function isDisabledDate(day: Dayjs): boolean {
  if (!props.disabledDates?.length) {
    return false
  }

  return props.disabledDates.some(disabledDay => isSameDate(day, disabledDay, 'date'))
}

function isBiggerMaxDate(day: Dayjs): boolean {
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

function setContainerHeight() {
  if (MazPickerGrid.value) {
    MazPickerGrid.value.style.minHeight = `${MazPickerGrid.value?.clientHeight || 176}px`

    removeContainerHeight()
  }
}

watch(
  () => props.calendarDate,
  (calendarDate, oldCalendarValue) => {
    transitionName.value = dayjs(calendarDate).isAfter(oldCalendarValue, 'date')
      ? 'maz-slidenext'
      : 'maz-slideprev'

    setContainerHeight()
  },
)
</script>

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
            disabled
              || isSmallerMinDate(date)
              || isBiggerMaxDate(date)
              || isDisabledWeekly(date)
              || isDisabledDate(date)
          "
          :class="{
            '--is-today': checkIsToday(date),
            '--is-first': isFirstDay(date),
            '--is-last': isLastDay(date) || (isRangeMode && isLastDayHoverred(date)),
            '--is-selected': isSelectedOrBetween(date) === DaySelect.SELECTED,
            '--is-between': isSelectedOrBetween(date) === DaySelect.BETWEEN,
            '--is-between-hoverred': isRangeMode
              ? isBetweenHoverred(date) === DaySelect.BETWEEN_HOVERRED
              : undefined,
          }"
          @click="selectDay(date)"
          @mouseover="isRangeMode ? setHoverredDay(date) : undefined"
          @mouseleave="isRangeMode ? setHoverredDay() : undefined"
          @focus="isRangeMode ? setHoverredDay(date) : undefined"
          @blur="isRangeMode ? setHoverredDay() : undefined"
        >
          <span>
            {{ label }}
          </span>
        </MazBtn>
      </div>
    </TransitionGroup>
  </div>
</template>

<style lang="postcss" scoped>
  .maz-picker-calendar-grid {
  @apply maz-relative;

  transition: all 300ms ease-in-out;

  &__container {
    @apply maz-relative maz-grid maz-grid-cols-7 maz-items-start maz-gap-1;

    /* &.--is-range {
        @apply maz-gap-0 maz-gap-y-1;
      } */

    & button {
      @apply maz-h-8 maz-w-8 maz-cursor-pointer !maz-rounded-full;

      /* @apply maz-p-1 !important; */

      &.--is-today {
        &:not(.--is-selected, .--is-between, .--is-between-hoverred) {
          @apply !maz-bg-color-light dark:!maz-bg-color-lighter;
        }
      }

      &:hover {
        &:not(.--is-selected, .--is-between, .--is-between-hoverred) {
          background-color: v-bind('hoverColor') !important;
        }
      }

      &.--is-between-hoverred {
        background-color: v-bind('betweenColorAlpha') !important;
      }

      &.--is-between {
        background-color: v-bind('betweenColor') !important;

        &.--white,
        &.--transparent {
          @apply !maz-bg-gray-400;
        }

        &.--black {
          @apply !maz-bg-gray-800;
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

/** Slide next/prev animation  **/
.maz-slidenext-leave-active,
.maz-slidenext-enter-active,
.maz-slideprev-leave-active,
.maz-slideprev-enter-active {
  @apply maz-absolute maz-left-0 maz-right-0 maz-top-0;

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
