<script lang="ts" setup>
import type { Dayjs } from 'dayjs/esm'
import type { PropType } from 'vue'
import type { MazColor } from '../../types'
import type { MazDatePickerValue } from '../types'
import { debounce } from '@maz-ui/utils/helpers/debounce'
import { formatDate } from '@maz-ui/utils/helpers/formatDate'
import dayjs from 'dayjs/esm'
import { computed, ref, watch } from 'vue'
import MazBtn from '../../MazBtn.vue'

import { getDaysInMonth, getFirstDayOfMonth, isRangeValue, isSameDate, isSameDay, isValidDate } from '../utils'

const props = defineProps({
  modelValue: {
    type: [String, Object] as PropType<MazDatePickerValue>,
    default: undefined,
  },
  calendarDate: { type: String, required: true },
  hasTime: { type: Boolean, required: true },
  locale: { type: String, required: true },
  firstDayOfWeek: { type: Number, required: true },
  color: { type: String as PropType<MazColor>, required: true },
  minDate: { type: String, default: undefined },
  inline: { type: Boolean, required: true },
  maxDate: { type: String, default: undefined },
  disabledWeekly: { type: Array as PropType<number[]>, required: true },
  disabledDates: { type: Array as PropType<string[]>, required: true },
  hoverredDay: { type: Object as PropType<Dayjs>, default: undefined },
  disabled: { type: Boolean, required: true },
  range: { type: Boolean, required: true },
})

const emits = defineEmits(['update:model-value', 'update:hoverred-day', 'navigate'])

enum DaySelect {
  UNSELECTED,
  SELECTED,
  BETWEEN,
  BETWEEN_HOVERRED,
}

const MazDatePickerGrid = ref<HTMLDivElement>()
const transitionName = ref<'maz-slidenext' | 'maz-slideprev'>('maz-slidenext')

const calendarDateArray = computed<string[]>(() => [props.calendarDate])

const hoverColor = computed(() => `color-mix(in srgb, var(--maz-${props.color}) 20%, transparent)`)
const hoverTextColor = computed(() => `var(--maz-${props.color}-foreground)`)

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

const DATE_KEY_FORMAT = 'YYYY-MM-DD'

function getDateKey(date: Dayjs) {
  return date.format(DATE_KEY_FORMAT)
}

/**
 * The days split in weeks (rows of the grid), the leading empty cells are `undefined`
 */
const weeks = computed(() => {
  const cells: ({ label: string | number, date: Dayjs } | undefined)[] = [
    ...Array.from<undefined>({ length: emptyDaysCount.value }).fill(undefined),
    ...monthDays.value,
  ]

  return Array.from({ length: Math.ceil(cells.length / 7) }, (_v, i) => cells.slice(i * 7, i * 7 + 7))
})

function getDayLabel(date: Dayjs) {
  return formatDate(date.toDate(), props.locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function isToday(date: Dayjs) {
  return date.isSame(dayjs(), 'date')
}

function isDayDisabled(date: Dayjs) {
  return props.disabled
    || isSmallerMinDate(date)
    || isBiggerMaxDate(date)
    || isDisabledWeekly(date)
    || isDisabledDate(date)
}

const focusedDateKey = ref<string>()

function getSelectedDateKey(): string | undefined {
  const value = props.modelValue

  if (isRangeValue(value))
    return value.start ? getDateKey(dayjs(value.start)) : undefined

  return value && isValidDate(value) ? getDateKey(dayjs(value)) : undefined
}

/**
 * Roving tabindex: a single day of the month is in the tab sequence, the arrows move between days
 */
const tabbableDateKey = computed(() => {
  const enabledKeys = monthDays.value.filter(({ date }) => !isDayDisabled(date)).map(({ date }) => getDateKey(date))
  const candidates = [focusedDateKey.value, getSelectedDateKey(), getDateKey(dayjs())]

  return candidates.find(key => key && enabledKeys.includes(key)) ?? enabledKeys[0]
})

function isBeyondBounds(date: Dayjs, step: number) {
  if (step < 0)
    return !!props.minDate && date.isBefore(props.minDate, 'date')

  return !!props.maxDate && date.isAfter(props.maxDate, 'date')
}

function getEnabledDate(date: Dayjs, step: number): Dayjs | undefined {
  let candidate = date

  for (let attempt = 0; attempt < 366; attempt++) {
    if (isBeyondBounds(candidate, step))
      return undefined

    if (!isDayDisabled(candidate))
      return candidate

    candidate = candidate.add(step, 'day')
  }

  return undefined
}

function getKeyboardTarget(event: KeyboardEvent, date: Dayjs): { date: Dayjs, step: number } | undefined {
  const isRtl = !!MazDatePickerGrid.value && globalThis.getComputedStyle(MazDatePickerGrid.value).direction === 'rtl'
  const startOfWeek = date.subtract((date.day() - props.firstDayOfWeek + 7) % 7, 'day')

  switch (event.key) {
    case 'ArrowRight':
      return { date: date.add(isRtl ? -1 : 1, 'day'), step: isRtl ? -1 : 1 }
    case 'ArrowLeft':
      return { date: date.add(isRtl ? 1 : -1, 'day'), step: isRtl ? 1 : -1 }
    case 'ArrowDown':
      return { date: date.add(7, 'day'), step: 1 }
    case 'ArrowUp':
      return { date: date.subtract(7, 'day'), step: -1 }
    case 'Home':
      return { date: startOfWeek, step: 1 }
    case 'End':
      return { date: startOfWeek.add(6, 'day'), step: -1 }
    case 'PageUp':
      return { date: date.subtract(1, event.shiftKey ? 'year' : 'month'), step: -1 }
    case 'PageDown':
      return { date: date.add(1, event.shiftKey ? 'year' : 'month'), step: 1 }
    default:
      return undefined
  }
}

function focusDate(date: Dayjs) {
  const root = MazDatePickerGrid.value?.closest('.maz-picker-calendar__months') ?? MazDatePickerGrid.value
  const dayButton = root?.querySelector<HTMLElement>(`[data-date="${getDateKey(date)}"]:not(:disabled)`)

  if (dayButton) {
    dayButton.focus()
    return
  }

  // The day is in a month not displayed: the calendar switches month then focuses it
  emits('navigate', date.format())
}

function onDayKeydown(event: KeyboardEvent, date: Dayjs) {
  const target = getKeyboardTarget(event, date)

  if (!target)
    return

  event.preventDefault()

  const enabledDate = getEnabledDate(target.date, target.step)

  if (enabledDate)
    focusDate(enabledDate)
}

function onDayFocus(date: Dayjs) {
  focusedDateKey.value = getDateKey(date)

  if (props.range)
    setHoverredDay(date)
}

function setHoverredDay(day?: Dayjs) {
  const value = props.modelValue

  if (!value || !isRangeValue(value)) {
    return
  }

  if (value.start && !value.end && day && day.isAfter(value.start)) {
    emits('update:hoverred-day', day)
  }
  else {
    emits('update:hoverred-day')
  }
}

function isBetweenHoverred(day: Dayjs): DaySelect | undefined {
  const value = props.modelValue

  if (!value || !isRangeValue(value) || !value.start || !props.hoverredDay) {
    return undefined
  }

  const isBetween = dayjs(day).isBetween(value.start, props.hoverredDay, 'date', '()')

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
    const isStartDate = value.start ? isSameDate(date, value.start, 'date') : false
    const isEndDate = value.end ? isSameDate(date, value.end, 'date') : false
    const isBetweenDates = checkIsBetween(date)

    if (isStartDate || isEndDate || isBetweenDates) {
      return props.color
    }
    return 'transparent'
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
  if (props.range) {
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

function checkIsSameDate(day: Dayjs): boolean {
  const value = props.modelValue
  if (!value || !isValidDate(value)) {
    return false
  }

  return isSameDate(day, value, 'date')
}

function checkIsBetween(day: Dayjs): boolean {
  const value = props.modelValue

  if (!isRangeValue(value) || !value.start || !value.end) {
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
  if (MazDatePickerGrid.value) {
    MazDatePickerGrid.value.style.minHeight = ''
  }
}, 400)

function setContainerHeight() {
  if (MazDatePickerGrid.value) {
    MazDatePickerGrid.value.style.minHeight = `${MazDatePickerGrid.value?.clientHeight || 176}px`

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
  <div
    ref="MazDatePickerGrid"
    class="maz-picker-calendar-grid maz:relative maz:transition-all maz:duration-300 maz:ease-in-out"
  >
    <TransitionGroup :name="transitionName">
      <div
        v-for="(dateArray, dateIndex) in [calendarDateArray]"
        :key="`${dateArray[dateIndex]}`"
        class="maz-picker-calendar-grid__container maz:relative maz:grid maz:grid-cols-7 maz:items-start maz:gap-y-1"
        :class="{ '--is-range': range, 'maz:gap-x-1': !range }"
      >
        <div v-for="(week, weekIndex) in weeks" :key="weekIndex" role="row" class="maz:contents">
          <template v-for="(day, dayIndex) in week" :key="day ? getDateKey(day.date) : `empty-${dayIndex}`">
            <div v-if="!day" role="gridcell" />
            <div
              v-else
              role="gridcell"
              class="maz:contents"
              :aria-selected="isSelectedOrBetween(day.date) !== DaySelect.UNSELECTED ? 'true' : undefined"
            >
              <MazBtn
                size="mini"
                :color="getDayButtonColor(day.date)"
                type="button"
                :block="inline"
                :disabled="isDayDisabled(day.date)"
                :data-date="getDateKey(day.date)"
                :aria-label="getDayLabel(day.date)"
                :aria-current="isToday(day.date) ? 'date' : undefined"
                :tabindex="tabbableDateKey === getDateKey(day.date) ? 0 : -1"
                class="maz:size-8 maz:cursor-pointer maz:rounded-full"
                :class="{
                  '--is-first': isFirstDay(day.date) && isSelectedOrBetween(day.date) === DaySelect.SELECTED,
                  '--is-last': isLastDay(day.date) && isSelectedOrBetween(day.date) === DaySelect.SELECTED,
                  '--is-last-hoverred': isLastDayHoverred(day.date),
                  '--is-selected': isSelectedOrBetween(day.date) === DaySelect.SELECTED,
                  '--is-between': isSelectedOrBetween(day.date) === DaySelect.BETWEEN,
                  '--is-between-hoverred': range
                    ? isBetweenHoverred(day.date) === DaySelect.BETWEEN_HOVERRED
                    : undefined,
                }"
                @click="selectDay(day.date)"
                @keydown="onDayKeydown($event, day.date)"
                @mouseover="range ? setHoverredDay(day.date) : undefined"
                @mouseleave="range ? setHoverredDay() : undefined"
                @focus="onDayFocus(day.date)"
                @blur="range ? setHoverredDay() : undefined"
              >
                <span class="maz:text-sm" aria-hidden="true">
                  {{ day.label }}
                </span>
              </MazBtn>
            </div>
          </template>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
@reference "../../../tailwindcss/tailwind.css";

.maz-picker-calendar-grid__container {
  &.--is-range {
    button {
      @apply maz:w-full;
    }
  }

  & button {
    &:hover:not(.--is-selected, .--is-between, .--is-between-hoverred) {
      background-color: v-bind('hoverColor');
    }

    &.--is-first {
      @apply maz:rounded-r-none!;
    }

    &.--is-last-hoverred,
    &.--is-last {
      @apply maz:rounded-l-none!;
    }

    &.--is-between-hoverred {
      @apply maz:bg-surface-600 maz:dark:bg-surface-400 maz:rounded-none!;
    }

    &.--is-between {
      @apply maz:bg-surface-600 maz:dark:bg-surface-400 maz:rounded-none! maz:text-foreground;

      &:hover {
        color: v-bind('hoverTextColor');
      }

      &.--transparent {
        @apply maz:bg-gray-400!;
      }
    }

    &:disabled {
      @apply maz:disabled-cursor maz:border-transparent;

      &.--is-selected {
        @apply maz:bg-surface-600! maz:dark:bg-surface-400 maz:text-muted!;
      }
    }
  }
}

/** Slide next/prev animation  **/
.maz-slidenext-leave-active,
.maz-slidenext-enter-active,
.maz-slideprev-leave-active,
.maz-slideprev-enter-active {
  @apply maz:absolute maz:left-0 maz:inset-e-0 maz:top-0;

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
