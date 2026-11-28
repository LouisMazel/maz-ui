<script lang="ts" setup>
import type { Dayjs } from 'dayjs/esm/index.js'
import type { PropType } from 'vue'
import type { MazColor } from '../../types.ts'
import type { MazDatePickerValue } from '../types.ts'
import { debounce } from '@maz-ui/utils/helpers/debounce'
import { formatDate } from '@maz-ui/utils/helpers/formatDate'
import dayjs from 'dayjs/esm/index.js'
import { computed, onScopeDispose, ref, shallowRef, watch } from 'vue'
import { useReducedMotion } from '../../../composables/useReducedMotion.ts'
import { useSlidingIndicator } from '../../../composables/useSlidingIndicator.ts'
import MazBtn from '../../MazBtn.vue'
import MazRollingText from '../../MazRollingText.vue'

import { getDaysInMonth, getFirstDayOfMonth, isRangeValue, isSameDate, isSameDay, isValidDate } from '../utils.ts'

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
const monthContainer = shallowRef<HTMLElement>()
const slideSign = ref(1)
const isKeyboardInput = ref(false)
const isMonthChanging = ref(false)
let monthChangeTimer: ReturnType<typeof setTimeout> | undefined

const { shouldReduceMotion } = useReducedMotion()

const INDICATOR_COLORS = new Set<MazColor>(['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'destructive', 'contrast', 'neutral'])
const DAY_UNIT_FORMAT: Intl.NumberFormatOptions = { style: 'unit', unit: 'day', unitDisplay: 'long' }

function setMonthContainer(element: unknown) {
  if (element)
    monthContainer.value = element as HTMLElement
}

function getDayElement(key: string | undefined) {
  return key
    ? monthContainer.value?.querySelector<HTMLElement>(`[data-date="${key}"]`) ?? undefined
    : undefined
}

const calendarDateArray = computed<string[]>(() => [props.calendarDate])

const hoverColor = computed(() => props.color === 'neutral'
  ? 'var(--maz-neutral)'
  : `color-mix(in srgb, var(--maz-${props.color}) 20%, transparent)`)

const rangeBandStyle = computed(() => {
  const color = props.color === 'transparent' ? 'primary' : props.color
  const mix = (percent: number) => `color-mix(in oklab, var(--maz-${color}) ${percent}%, var(--maz-surface))`

  return {
    '--m-range-band': mix(22),
    '--m-range-band-hover': mix(38),
    '--m-range-band-dark': mix(38),
    '--m-range-band-dark-hover': mix(60),
  }
})

const modelValue = computed({
  get: () => props.modelValue,
  set: value => emits('update:model-value', value),
})

const monthDays = computed<{ label: string | number, date: Dayjs }[]>(() =>
  Array.from({
    length: getDaysInMonth(props.calendarDate),
  }, (_v, i) => i + 1).map(day => ({
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

  return Array.from({
    length: Math.ceil(cells.length / 7),
  }, (_v, i) => cells.slice(i * 7, i * 7 + 7))
})

function getDayLabel(date: Dayjs) {
  return formatDate(date.toDate(), props.locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
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

  if (isRangeValue(value)) {
    return value.start
      ? getDateKey(dayjs(value.start))
      : undefined
  }

  return value && isValidDate(value)
    ? getDateKey(dayjs(value))
    : undefined
}

/**
 * Roving tabindex: a single day of the month is in the tab sequence, the arrows move between days
 */
const tabbableDateKey = computed(() => {
  const enabledKeys = monthDays.value.filter(({ date }) => !isDayDisabled(date)).map(({ date }) => getDateKey(date))
  const candidates = [
    focusedDateKey.value,
    getSelectedDateKey(),
    getDateKey(dayjs()),
  ]

  return candidates.find(key => key && enabledKeys.includes(key)) ?? enabledKeys[0]
})

const selectedIndicatorKey = computed(() => {
  const key = props.range || !INDICATOR_COLORS.has(props.color)
    ? undefined
    : getSelectedDateKey()

  return key && monthDays.value.some(({ date }) => getDateKey(date) === key)
    ? key
    : undefined
})

const selectedIndicatorTarget = computed(() => getDayElement(selectedIndicatorKey.value))

const { style: selectedIndicatorStyle, isReady: isSelectedIndicatorReady } = useSlidingIndicator({
  container: monthContainer,
  active: selectedIndicatorTarget,
  orientation: 'vertical',
})

const hasSelectedIndicator = computed(() => isSelectedIndicatorReady.value && !!selectedIndicatorTarget.value)

const isInstant = computed(() => isKeyboardInput.value || isMonthChanging.value)

const indicatorInlineStyle = computed(() => ({
  ...selectedIndicatorStyle.value,
  ...(isInstant.value && { transitionDuration: '0s' }),
  backgroundColor: `var(--maz-${props.color})`,
}))

const rangeDaysCount = computed(() => {
  const value = props.modelValue

  if (!props.range || !props.hoverredDay || !isRangeValue(value) || !value.start || value.end)
    return undefined

  return props.hoverredDay.startOf('day').diff(dayjs(value.start).startOf('day'), 'day') + 1
})

const rangeCountTarget = computed(() => getDayElement(rangeDaysCount.value && props.hoverredDay
  ? getDateKey(props.hoverredDay)
  : undefined))

const lastRangeCountTarget = shallowRef<HTMLElement>()
const heldRangeDaysCount = ref<number>()
const hasHeldRangeCount = computed(() => heldRangeDaysCount.value !== undefined)
const isRangeCountPlacing = ref(false)
let rangeCountHoldTimer: ReturnType<typeof setTimeout> | undefined
let rangeCountPlacingFrame: number | undefined

const RANGE_COUNT_HOLD = 80

function stopPlacingAfterFrames() {
  if (typeof requestAnimationFrame !== 'function') {
    isRangeCountPlacing.value = false
    return
  }

  cancelAnimationFrame(rangeCountPlacingFrame as number)
  rangeCountPlacingFrame = requestAnimationFrame(() => {
    rangeCountPlacingFrame = requestAnimationFrame(() => {
      isRangeCountPlacing.value = false
    })
  })
}

watch([rangeDaysCount, rangeCountTarget], ([count, target]) => {
  if (count && target) {
    clearTimeout(rangeCountHoldTimer)
    rangeCountHoldTimer = undefined

    if (!hasHeldRangeCount.value) {
      isRangeCountPlacing.value = true
      stopPlacingAfterFrames()
    }

    heldRangeDaysCount.value = count
    lastRangeCountTarget.value = target
    return
  }

  if (hasHeldRangeCount.value && rangeCountHoldTimer === undefined) {
    rangeCountHoldTimer = setTimeout(() => {
      rangeCountHoldTimer = undefined
      heldRangeDaysCount.value = undefined
    }, RANGE_COUNT_HOLD)
  }
})

onScopeDispose(() => {
  clearTimeout(rangeCountHoldTimer)

  if (typeof cancelAnimationFrame === 'function' && rangeCountPlacingFrame !== undefined)
    cancelAnimationFrame(rangeCountPlacingFrame)
})

const { style: rangeCountStyle } = useSlidingIndicator({
  container: monthContainer,
  active: lastRangeCountTarget,
  orientation: 'vertical',
})

const RANGE_COUNT_FADE = 'calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1))'
const RANGE_COUNT_MOVE = 'calc(var(--maz-motion-normal, 250ms) * var(--maz-motion-scale, 1))'

const rangeCountInlineStyle = computed(() => {
  const style = rangeCountStyle.value
  const isMoveInstant = isInstant.value || isRangeCountPlacing.value

  if (!style.transitionProperty) {
    return isMoveInstant
      ? { ...style, transitionDuration: '0s' }
      : style
  }

  const move = isMoveInstant ? '0s' : RANGE_COUNT_MOVE

  return {
    ...style,
    transitionProperty: 'transform, width, height, opacity',
    transitionDuration: `${move}, ${move}, ${move}, ${RANGE_COUNT_FADE}`,
  }
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
      return {
        date: date.add(isRtl
          ? -1
          : 1, 'day'),
        step: isRtl
          ? -1
          : 1,
      }
    case 'ArrowLeft':
      return {
        date: date.add(isRtl
          ? 1
          : -1, 'day'),
        step: isRtl
          ? 1
          : -1,
      }
    case 'ArrowDown':
      return {
        date: date.add(7, 'day'),
        step: 1,
      }
    case 'ArrowUp':
      return {
        date: date.subtract(7, 'day'),
        step: -1,
      }
    case 'Home':
      return { date: startOfWeek, step: 1 }
    case 'End':
      return {
        date: startOfWeek.add(6, 'day'),
        step: -1,
      }
    case 'PageUp':
      return {
        date: date.subtract(1, event.shiftKey ? 'year' : 'month'),
        step: -1,
      }
    case 'PageDown':
      return {
        date: date.add(1, event.shiftKey ? 'year' : 'month'),
        step: 1,
      }
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
  isKeyboardInput.value = true

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
    const isStartDate = value.start
      ? isSameDate(date, value.start, 'date')
      : false
    const isEndDate = value.end
      ? isSameDate(date, value.end, 'date')
      : false
    const isBetweenDates = checkIsBetween(date)

    if (isStartDate || isEndDate || isBetweenDates) {
      return props.color
    }
    return 'transparent'
  }
  else {
    return checkIsSameDate(date)
      ? props.color
      : 'transparent'
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

function onDayClick(event: MouseEvent, date: Dayjs) {
  isKeyboardInput.value = event.detail === 0
  selectDay(date)
}

function onDayHover(date: Dayjs) {
  isKeyboardInput.value = false

  if (props.range)
    setHoverredDay(date)
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

const SLIDE_RELEASE_DELAY = 400
const MONTH_CHANGE_SETTLE = 100

const removeContainerHeight = debounce(() => {
  if (MazDatePickerGrid.value) {
    MazDatePickerGrid.value.style.minHeight = ''
  }
}, SLIDE_RELEASE_DELAY)

function setContainerHeight() {
  if (MazDatePickerGrid.value) {
    MazDatePickerGrid.value.style.minHeight = `${MazDatePickerGrid.value?.clientHeight || 176}px`

    removeContainerHeight()
  }
}

onScopeDispose(() => clearTimeout(monthChangeTimer))

watch(
  () => props.calendarDate,
  (calendarDate, oldCalendarValue) => {
    const isRtl = !!MazDatePickerGrid.value && globalThis.getComputedStyle(MazDatePickerGrid.value).direction === 'rtl'
    const isNext = dayjs(calendarDate).isAfter(oldCalendarValue, 'date')

    isMonthChanging.value = true
    clearTimeout(monthChangeTimer)
    monthChangeTimer = setTimeout(() => {
      isMonthChanging.value = false
    }, MONTH_CHANGE_SETTLE)

    slideSign.value = (isNext ? 1 : -1) * (isRtl ? -1 : 1)

    setContainerHeight()
  },
)
</script>

<template>
  <div
    ref="MazDatePickerGrid"
    class="maz-picker-calendar-grid maz:relative"
    :style="{ '--m-picker-slide': slideSign }"
  >
    <TransitionGroup name="maz-picker-month" :css="!shouldReduceMotion">
      <div
        v-for="(dateArray, dateIndex) in [calendarDateArray]"
        :key="`${dateArray[dateIndex]}`"
        :ref="setMonthContainer"
        class="maz-picker-calendar-grid__container maz:relative maz:isolate maz:grid maz:grid-cols-7 maz:items-start maz:gap-y-1"
        :class="{ '--is-range': range, 'maz:gap-x-1': !range, '--has-indicator': hasSelectedIndicator }"
        :style="range ? rangeBandStyle : undefined"
      >
        <span
          v-if="selectedIndicatorKey"
          class="maz-picker-calendar-grid__indicator"
          aria-hidden="true"
          :style="indicatorInlineStyle"
        />
        <Transition name="maz-picker-count">
          <span
            v-if="range && heldRangeDaysCount"
            class="maz-picker-calendar-grid__count"
            aria-hidden="true"
            :style="rangeCountInlineStyle"
          >
            <span class="maz-picker-calendar-grid__count-chip">
              <MazRollingText :value="heldRangeDaysCount" :format="DAY_UNIT_FORMAT" :locale="locale" />
            </span>
          </span>
        </Transition>
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
                class="maz:relative maz:z-1 maz:size-8 maz:cursor-interactive maz:rounded-full"
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
                @click="onDayClick($event, day.date)"
                @keydown="onDayKeydown($event, day.date)"
                @mouseover="onDayHover(day.date)"
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
      @apply maz:rounded-e-none!;
    }

    &.--is-last-hoverred,
    &.--is-last {
      @apply maz:rounded-s-none!;
    }

    &.--is-between-hoverred {
      @apply maz:rounded-none! maz:bg-(--m-range-band) maz:text-foreground maz:dark:bg-(--m-range-band-dark);

      &:hover {
        @apply maz:bg-(--m-range-band-hover) maz:text-foreground maz:dark:bg-(--m-range-band-dark-hover);
      }
    }

    &.--is-between {
      @apply maz:rounded-none! maz:bg-(--m-range-band) maz:text-foreground maz:dark:bg-(--m-range-band-dark);

      &:hover {
        @apply maz:bg-(--m-range-band-hover) maz:text-foreground maz:dark:bg-(--m-range-band-dark-hover);
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

/* Months slide a short way in the direction of the navigation (the sign follows the RTL) */
.maz-picker-month-enter-active,
.maz-picker-month-leave-active {
  position: absolute;
  inset-block-start: 0;
  inset-inline: 0;
}

.maz-picker-month-enter-active {
  transition:
    transform calc(var(--maz-motion-normal, 250ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out),
    opacity calc(var(--maz-motion-normal, 250ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
}

.maz-picker-month-leave-active {
  transition:
    transform calc(var(--maz-motion-normal, 250ms) * var(--maz-motion-scale, 1) * 0.7) var(--maz-easing-in, ease-in),
    opacity calc(var(--maz-motion-normal, 250ms) * var(--maz-motion-scale, 1) * 0.7) var(--maz-easing-in, ease-in);
}

.maz-picker-month-enter-from {
  opacity: 0;
  transform: translateX(calc(var(--m-picker-slide, 1) * 1.5rem));
}

.maz-picker-month-leave-to {
  opacity: 0;
  transform: translateX(calc(var(--m-picker-slide, 1) * -1.5rem));
}

/* The mark of the selected day travels between days: the day keeps its text, the background is the indicator */
.maz-picker-calendar-grid__indicator,
.maz-picker-calendar-grid__count {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  pointer-events: none;
}

.maz-picker-calendar-grid__indicator {
  z-index: 0;
  border-radius: 9999px;
}

.maz-picker-calendar-grid__container.--has-indicator button.--is-selected:not(:disabled) {
  background-color: transparent !important;
}

.maz-picker-calendar-grid__count {
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.maz-picker-calendar-grid__count-chip {
  flex: none;
  padding-inline: 0.5rem;
  border-radius: 9999px;
  background-color: var(--maz-contrast);
  color: var(--maz-contrast-foreground);
  font-size: 0.6875rem;
  line-height: 1.125rem;
  white-space: nowrap;
  translate: 0 calc(-100% - 0.125rem);
}

.maz-picker-count-enter-active {
  transition: opacity calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1)) var(--maz-easing-out, ease-out);
}

.maz-picker-count-leave-active {
  transition: opacity calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1) * 0.7)
    var(--maz-easing-in, ease-in);
}

.maz-picker-count-enter-from,
.maz-picker-count-leave-to {
  opacity: 0;
}
</style>
