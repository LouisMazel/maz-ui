<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { MazInputProps } from './MazInput.vue'
import type { MazPickerShortcut, MazPickerValue } from './MazPicker/types'
import type { DateTimeFormatOptions } from './MazPicker/utils'
import type { MazColor, MazPosition } from './types'
import { MazCalendar, MazClock } from '@maz-ui/icons'
import MazChevronDownIcon from '@maz-ui/icons/svg/chevron-down.svg'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import isBetween from 'dayjs/plugin/isBetween'

import {
  computed,
  defineAsyncComponent,
  nextTick,
  onBeforeMount,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import { vClickOutside } from '../directives/vClickOutside'
import { date } from '../formatters/date'
import {
  checkValueWithMinMaxDates,
  fetchLocale,
  getBrowserLocale,
  getFormattedDate,
  getISODate,
  getRangeFormattedDate,
  getRangeISODate,
  isRangeValue,
  isValueDisabledDate,
  isValueDisabledWeekly,
} from './MazPicker/utils'

export type { MazPickerPartialRangeValue, MazPickerRangeValue, MazPickerShortcut, MazPickerValue } from './MazPicker/types'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MazPickerProps & MazPickerInputProps>(), {
  style: undefined,
  class: undefined,
  modelValue: undefined,
  format: 'YYYY-MM-DD',
  open: false,
  label: undefined,
  placeholder: undefined,
  inputDateStyle: () => ({ dateStyle: 'medium', timeStyle: 'full' }),
  inputDateTransformer: undefined,
  locale: undefined,
  hideHeader: false,
  disabled: false,
  firstDayOfWeek: 0,
  autoClose: false,
  customElementSelector: undefined,
  double: false,
  inline: false,
  color: 'primary',
  pickerPosition: undefined,
  time: false,
  onlyTime: false,
  minuteInterval: 5,
  useBrowserLocale: true,
  fetchLocal: true,
  shortcut: undefined,
  shortcuts: () => [
    {
      label: 'Last 7 days',
      identifier: 'last7Days',
      value: {
        start: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
        end: dayjs().format('YYYY-MM-DD'),
      },
    },
    {
      label: 'Last 30 days',
      identifier: 'last30Days',
      value: {
        start: dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
        end: dayjs().format('YYYY-MM-DD'),
      },
    },
    {
      label: 'This week',
      identifier: 'thisWeek',
      value: {
        start: dayjs().startOf('week').format('YYYY-MM-DD'),
        end: dayjs().endOf('week').format('YYYY-MM-DD'),
      },
    },
    {
      label: 'Last week',
      identifier: 'lastWeek',
      value: {
        start: dayjs().subtract(1, 'week').startOf('week').format('YYYY-MM-DD'),
        end: dayjs().subtract(1, 'week').endOf('week').format('YYYY-MM-DD'),
      },
    },
    {
      label: 'This month',
      identifier: 'thisMonth',
      value: {
        start: dayjs().set('date', 1).format('YYYY-MM-DD'),
        end: dayjs().set('date', dayjs().daysInMonth()).format('YYYY-MM-DD'),
      },
    },
    {
      label: 'This year',
      identifier: 'thisYear',
      value: {
        start: dayjs().startOf('year').format('YYYY-MM-DD'),
        end: dayjs().endOf('year').format('YYYY-MM-DD'),
      },
    },
    {
      label: 'Last year',
      identifier: 'lastYear',
      value: {
        start: dayjs().subtract(1, 'year').startOf('year').format('YYYY-MM-DD'),
        end: dayjs().subtract(1, 'year').endOf('year').format('YYYY-MM-DD'),
      },
    },
  ],
  minDate: undefined,
  maxDate: undefined,
  disabledWeekly: () => [],
  disabledDates: () => [],
  disabledHours: () => [],
  range: false,
})

const emits = defineEmits<{
  /**
   * Emitted when the picker value changes
   * @event update:model-value
   * @property {MazPickerValue | undefined} value - The new selected value
   */
  'update:model-value': [value: MazPickerValue | undefined]

  /**
   * Emitted when the picker closes
   * @event close
   */
  'close': [void]
}>()

const MazPickerContainer = defineAsyncComponent(() => import('./MazPicker/MazPickerContainer.vue'))

type MazPickerInputProps = Omit<MazInputProps, 'modelValue' | 'debounce' | 'type'>

dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

export interface MazPickerProps {
  /**
   * The unique identifier of the component
   * @type {string}
   */
  id?: string

  /**
   * The inline style object for the component
   * @type {HTMLAttributes['style']}
   */
  style?: HTMLAttributes['style']

  /**
   * The CSS class(es) to apply to the component
   * @type {HTMLAttributes['class']}
   */
  class?: HTMLAttributes['class']

  /**
   * The value of the date picker component
   * If an object is provided, the picker will be a range picker
   * @type {MazPickerValue}
   * @default undefined
   */
  modelValue?: MazPickerValue

  /**
   * The format pattern for date display and parsing
   * @type {string}
   * @default 'YYYY-MM-DD'
   * @example 'YYYY-MM-DD', 'DD/MM/YYYY', 'YYYY-MM-DD HH:mm'
   */
  format?: string

  /**
   * Controls whether the picker window is open
   * @type {boolean}
   * @default false
   */
  open?: boolean

  /**
   * The label text displayed above the input field
   * @type {string}
   */
  label?: string

  /**
   * The placeholder text shown when no value is selected
   * @type {string}
   */
  placeholder?: string

  /**
   * The Intl.DateTimeFormatOptions for styling the input date display
   * @type {Intl.DateTimeFormatOptions}
   * @default { dateStyle: 'full' }
   */
  inputDateStyle?: Intl.DateTimeFormatOptions

  /**
   * Custom function to transform the formatted date display
   * @type {Function}
   * @param {object} payload - The transformation payload
   * @param {string} payload.formattedDate - The formatted date string
   * @param {MazPickerValue} payload.value - The current picker value
   * @param {string} payload.locale - The current locale
   * @returns {string} The transformed date string
   */
  inputDateTransformer?: (payload: { formattedDate?: string, value?: MazPickerValue, locale: string }) => string

  /**
   * The locale string for date formatting and localization
   * @type {string}
   * @example 'en-US', 'fr-FR', 'de-DE'
   */
  locale?: string

  /**
   * Controls whether the calendar header is hidden
   * @type {boolean}
   * @default false
   */
  hideHeader?: boolean

  /**
   * Controls whether the component is disabled
   * @type {boolean}
   * @default false
   */
  disabled?: boolean

  /**
   * The first day of the week in the calendar
   * @type {number}
   * @values 0, 1, 2, 3, 4, 5, 6
   * @default 0
   * @example 0 (Sunday), 1 (Monday), 6 (Saturday)
   */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6

  /**
   * Controls whether the picker closes automatically after date selection
   * @type {boolean}
   * @default false
   */
  autoClose?: boolean

  /**
   * CSS selector for a custom element that triggers the picker
   * @type {string}
   * @example '#my-button', '.trigger-class'
   */
  customElementSelector?: string

  /**
   * Controls whether the picker displays two months side by side
   * @type {boolean}
   * @default false
   */
  double?: boolean

  /**
   * Controls whether the picker is displayed inline without input field
   * @type {boolean}
   * @default false
   */
  inline?: boolean

  /**
   * The color theme of the component
   * @type {MazColor}
   * @values primary, secondary, success, danger, warning, info
   * @default 'primary'
   */
  color?: MazColor

  /**
   * The position where the picker popover should appear
   * @type {MazPosition}
   * @values top, bottom, left, right, top-left, top-right, bottom-left, bottom-right
   */
  pickerPosition?: MazPosition

  /**
   * Controls whether the picker includes a time selector
   * @type {boolean}
   * @default false
   */
  time?: boolean

  /**
   * Controls whether the picker shows only time selection (no date)
   * @type {boolean}
   * @default false
   */
  onlyTime?: boolean

  /**
   * The interval in minutes for the time picker minute selection
   * @type {number}
   * @default 5
   * @values 1, 5, 10, 15, 30
   */
  minuteInterval?: number

  /**
   * Controls whether to automatically detect and use the browser's locale
   * @type {boolean}
   * @default true
   */
  useBrowserLocale?: boolean

  /**
   * Controls whether to fetch locale data dynamically
   * @type {boolean}
   * @default true
   */
  fetchLocal?: boolean

  /**
   * Array of predefined date range shortcuts or false to disable
   * @type {MazPickerShortcut[] | false}
   * @default [predefined shortcuts array]
   */
  shortcuts?: MazPickerShortcut[] | false

  /**
   * The identifier of the currently selected shortcut
   * @type {string}
   */
  shortcut?: MazPickerShortcut['identifier']

  /**
   * The minimum selectable date in ISO format
   * @type {string}
   * @example '2023-01-01'
   */
  minDate?: string

  /**
   * The maximum selectable date in ISO format
   * @type {string}
   * @example '2024-12-31'
   */
  maxDate?: string

  /**
   * Array of weekday numbers to disable (0 = Sunday, 6 = Saturday)
   * @type {number[]}
   * @default []
   * @example [0, 6] to disable weekends
   */
  disabledWeekly?: number[]

  /**
   * Array of specific dates to disable in ISO format
   * @type {string[]}
   * @default []
   * @example ['2023-12-25', '2024-01-01']
   */
  disabledDates?: string[]

  /**
   * Array of hour numbers to disable in the time picker (0-23)
   * @type {number[]}
   * @default []
   * @example [0, 1, 2, 22, 23] to disable night hours
   */
  disabledHours?: number[]

  /**
   * Controls whether the input displays in full width
   * @type {boolean}
   * @default false
   */
  block?: boolean

  /**
   * Controls whether the picker operates in range selection mode
   * @type {boolean}
   * @default false
   */
  range?: boolean
}

const MazInput = defineAsyncComponent(() => import('./MazInput.vue'))
const instanceId = useInstanceUniqId({ componentName: 'MazPicker', providedId: props.id })

const internalLocale = ref(props.locale)
const currentLocale = computed<string>(() => props.locale ?? internalLocale.value ?? 'en-US')

const containerUniqueId = computed(() => `mazPickerContainer-${instanceId.value}`)

const MazPicker = ref<HTMLDivElement>()

const currentValue = computed<MazPickerValue>({
  get: () => {
    const isRangeMode = typeof props.modelValue === 'object' || props.range

    return isRangeMode
      ? {
          start: typeof props.modelValue === 'object' && props.modelValue.start
            ? dayjs(props.modelValue.start, props.format).format()
            : undefined,
          end: typeof props.modelValue === 'object' && props.modelValue.end
            ? dayjs(props.modelValue.end, props.format).format()
            : undefined,
        }
      : typeof props.modelValue === 'string'
        ? dayjs(props.modelValue, props.format).format()
        : undefined
  },
  set: (value) => {
    if (props.disabled) {
      return
    }

    const emittedValue = props.range && !isRangeValue(value)
      ? {
          start: value,
          end: undefined,
        }
      : value

    emitValue(emittedValue)

    const isRangeMode = typeof value === 'object' || props.range

    if (props.autoClose && (!isRangeMode || (isRangeMode && typeof value === 'object' && value.end))) {
      closeCalendar()
    }
  },
})

const hasTime = computed(() => props.time || props.onlyTime)
const hasDouble = computed(() => props.double && !props.onlyTime)
const hasDate = computed(() => !props.onlyTime)
const isRangeMode = computed(() => typeof currentValue.value === 'object' || props.range)

onBeforeMount(() => {
  if (isRangeMode.value && hasTime.value) {
    console.error(`[maz-ui](MazPicker) You can't use time picker with range picker`)
  }
  if (hasTime.value && !(props.format.includes('h') || props.format.includes('H'))) {
    console.error(
      `[maz-ui](MazPicker) When you use the time picker, you must provided a format with time - Ex: "YYYY-MM-DD HH:mm"`,
    )
  }
  if (props.format.includes('h') && !(props.format.includes('a') || props.format.includes('A'))) {
    console.error(
      '[maz-ui](MazPicker) if you use the 12 format "h" or "hh", you must add "a" or "A" at the end of the format - Ex: "YYYY-MM-DD hh:mm a"',
    )
  }
})

/**
 * Gets the base calendar date considering min/max constraints
 * @param {MazPickerValue} value - The picker value
 * @returns {string} The formatted date for the calendar
 */
function getCalendarDate(value: MazPickerValue): string {
  const baseDate = (typeof value === 'object' ? value.start : value) ?? dayjs().format()

  if (props.minDate && dayjs(baseDate).isBefore(props.minDate)) {
    return props.minDate
  }
  else if (props.maxDate && dayjs(baseDate).isAfter(props.maxDate)) {
    return props.minDate ?? props.maxDate
  }
  else {
    return baseDate
  }
}

const calendarDate = ref(getCalendarDate(currentValue.value))

const isHour12 = computed(
  () => props.format.includes('a') || props.format.includes('A') || props.format.includes('h'),
)

const formatterOptions = computed<DateTimeFormatOptions>(() => ({
  ...props.inputDateStyle,
  timeStyle: props.inputDateStyle.timeStyle ?? hasTime.value ? 'short' : undefined,
  hour12: hasTime.value ? props.inputDateStyle.hour12 ?? isHour12.value : undefined,
} satisfies DateTimeFormatOptions))

const inputValue = computed(() => {
  if (!currentValue.value)
    return

  let formattedDate: string | undefined

  if (props.onlyTime) {
    formattedDate = currentValue.value
      ? date(dayjs(currentValue.value as string).format(), currentLocale.value, {
          timeStyle: formatterOptions.value.timeStyle,
          hour12: formatterOptions.value.hour12,
        })
      : undefined
  }
  else if (isRangeMode.value && isRangeValue(currentValue.value)) {
    formattedDate = getRangeFormattedDate({
      value: currentValue.value,
      locale: currentLocale.value,
      options: formatterOptions.value,
    })
  }
  else if (typeof currentValue.value === 'string') {
    formattedDate = getFormattedDate({
      value: dayjs(currentValue.value).format(),
      locale: currentLocale.value,
      options: formatterOptions.value,
    })
  }

  return props.inputDateTransformer && formattedDate ? props.inputDateTransformer({ formattedDate, value: props.modelValue, locale: currentLocale.value }) : formattedDate
})

const isFocused = ref(false)
const programaticallyOpened = ref(false)
const pickerContainerPosition = ref<{
  vertical: 'top' | 'bottom'
  horizontal: 'left' | 'right'
}>({
  vertical: 'bottom',
  horizontal: 'left',
})

const isOpen = computed(() => {
  return (
    ((isFocused.value || props.open || programaticallyOpened.value) && !props.disabled)
    || props.inline
  )
})

const isMounted = ref(false)

onMounted(async () => {
  isMounted.value = true
  if (props.customElementSelector) {
    addEventToTriggerCustomElement(props.customElementSelector)
  }

  if (!props.locale) {
    const browserLocale = getBrowserLocale()
    if (props.useBrowserLocale && browserLocale) {
      internalLocale.value = browserLocale
    }
    else if (props.fetchLocal) {
      const locale = await fetchLocale()

      if (locale)
        internalLocale.value = locale
    }
  }
})

onUnmounted(() => {
  if (props.customElementSelector) {
    removeEventToTriggerCustomElement(props.customElementSelector)
  }
})

async function getPickerContainerPosition(): Promise<{
  vertical: 'top' | 'bottom'
  horizontal: 'left' | 'right'
}> {
  if (props.pickerPosition) {
    const horizontal = props.pickerPosition.includes('right') ? 'right' : 'left'
    const vertical = props.pickerPosition.includes('top') ? 'top' : 'bottom'

    return {
      horizontal,
      vertical,
    }
  }
  else {
    return {
      horizontal: 'left',
      vertical: await calcVerticalPosition(MazPicker.value),
    }
  }
}

async function calcVerticalPosition(parent?: HTMLDivElement): Promise<'top' | 'bottom'> {
  if (typeof window === 'undefined') {
    return 'bottom'
  }

  const OFFSET = 30

  await nextTick()

  const pickerContainer = document.querySelector(`#${containerUniqueId.value}`)

  const parentRect = parent?.getBoundingClientRect()
  const windowHeight = window.innerHeight

  const pickerHeight = (pickerContainer?.clientHeight ?? 0) - OFFSET

  const spaceOnBottom = (parentRect && windowHeight - parentRect.bottom) ?? 0
  const spaceOnTop = (parentRect && parentRect.top) ?? 0

  const hasSpaceOnBottom = spaceOnBottom && spaceOnBottom >= pickerHeight

  const hasSpaceOnTop = spaceOnTop && spaceOnTop >= pickerHeight

  if (!hasSpaceOnBottom && (hasSpaceOnTop || spaceOnTop >= spaceOnBottom)) {
    return 'top'
  }

  return 'bottom'
}

function closeCalendar() {
  isFocused.value = false
  programaticallyOpened.value = false
  emits('close')
}

function closeCalendarOnClickOutside() {
  if (!props.customElementSelector) {
    closeCalendar()
  }
}

function toggleProgramatically() {
  programaticallyOpened.value = !programaticallyOpened.value
}

function addEventToTriggerCustomElement(selector: string) {
  const target = document.querySelector(selector)
  if (target) {
    target.addEventListener('click', toggleProgramatically)
  }
  else {
    throw new Error(
      `[maz-ui](MazPicker) impossible to find custom element with selector "${selector}"`,
    )
  }
}

function removeEventToTriggerCustomElement(selector: string) {
  const target = document.querySelector(selector)
  target?.removeEventListener('click', toggleProgramatically)
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function checkMinMaxValues(value: MazPickerValue) {
  if (!props.minDate && !props.maxDate) {
    return
  }

  if (!isRangeMode.value && (typeof value === 'string' || !value)) {
    const { newValue, newCurrentDate } = checkValueWithMinMaxDates({
      value,
      minDate: props.minDate,
      maxDate: props.maxDate,
      format: props.format,
    })

    if (newValue) {
      emitValue(newValue)
    }
    if (newCurrentDate) {
      setCalendarDate(newCurrentDate)
    }
  }

  else if (isRangeMode.value && isRangeValue(value)) {
    let newStartValue = value.start
    let newEndValue = value.end

    if (value.start) {
      const { newValue, newCurrentDate } = checkValueWithMinMaxDates({
        value: value.start,
        minDate: props.minDate,
        maxDate: props.maxDate,
        format: props.format,
      })

      if (newValue)
        newStartValue = newValue

      if (newCurrentDate) {
        setCalendarDate(newCurrentDate)
      }
    }
    if (value.end) {
      const { newValue } = checkValueWithMinMaxDates({
        value: value.end,
        minDate: props.minDate,
        maxDate: props.maxDate,
        format: props.format,
      })

      if (newValue)
        newEndValue = newValue
    }

    emitValue({
      start: newStartValue,
      end: newEndValue,
    })
  }
}

function setCalendarDate(value: string) {
  if (value && !dayjs(calendarDate.value).isSame(value, 'month')) {
    calendarDate.value = value
  }
}

function emitValue(value: MazPickerValue) {
  if (isRangeMode.value && (typeof value === 'object' || value === undefined)) {
    const newValue = getRangeISODate(value, props.format) ?? { start: undefined, end: undefined }
    emits('update:model-value', newValue)

    if (newValue.start) {
      setCalendarDate(newValue.start)
    }
  }
  else if (typeof value === 'string' || value === undefined) {
    emits('update:model-value', getISODate(value, props.format))
  }
}

// model value watcher
watch(
  () => [currentValue.value, props.minDate, props.maxDate],
  (values, oldValues) => {
    const value = values[0] as MazPickerValue
    const oldValue = oldValues?.[0] as MazPickerValue

    if (typeof value === 'object' && (value.start || value.end)) {
      if (
        !oldValue
        || (typeof oldValue === 'object'
          && (oldValue.start !== value.start || oldValue.end !== value.end))
      ) {
        emitValue(value)
        checkMinMaxValues(value)
      }
    }
    else if (typeof value === 'string' && value !== oldValue) {
      emitValue(value)
      checkMinMaxValues(value)
    }
  },
  { immediate: true },
)

function keyboardHandler(event: KeyboardEvent) {
  if (event.code === 'Escape' && isOpen.value) {
    event.preventDefault()
    closeCalendar()
  }
}

watch(
  () => isOpen.value,
  async (value) => {
    if (value) {
      pickerContainerPosition.value = await getPickerContainerPosition()

      if (!props.inline && isMounted.value)
        document.addEventListener('keydown', keyboardHandler)
    }
    else if (!props.inline && isMounted.value) {
      document.removeEventListener('keydown', keyboardHandler)
    }
  },
  { immediate: true },
)

// Disable weekly watcher
watch(
  () => [currentValue.value, props.disabledWeekly, props.disabledDates],
  (values) => {
    const value = values[0] as MazPickerValue
    const disabledWeekly = values[1] as number[]
    const disabledDates = values[2] as string[]

    if (typeof value === 'object' && (value.start || value.end)) {
      if (
        (value.start && isValueDisabledWeekly({ value: value.start, disabledWeekly }))
        || (value.start && isValueDisabledDate({ value: value.start, disabledDates }))
        || (value.end && isValueDisabledWeekly({ value: value.end, disabledWeekly }))
        || (value.end && isValueDisabledDate({ value: value.end, disabledDates }))
      ) {
        currentValue.value = { start: undefined, end: undefined }
      }
      if (
        (value.end && isValueDisabledWeekly({ value: value.end, disabledWeekly }))
        || (value.end && isValueDisabledDate({ value: value.end, disabledDates }))
      ) {
        currentValue.value = { start: value.start, end: undefined }
      }
    }
    else if (
      typeof value === 'string'
      && (isValueDisabledWeekly({ value, disabledWeekly })
        || isValueDisabledDate({ value, disabledDates }))
    ) {
      currentValue.value = undefined
    }
  },
  { immediate: true },
)
</script>

<template>
  <div
    ref="MazPicker"
    v-click-outside="closeCalendarOnClickOutside"
    class="m-picker m-reset-css"
    role="none"
    :style="style"
    :class="[
      `m-picker--${color}`,
      `m-picker--${pickerContainerPosition.vertical}`,
      `m-picker--${pickerContainerPosition.horizontal}`,
      {
        '--is-open': isOpen,
        '--is-disabled': disabled,
        '--block': block,
      },
      props.class,
    ]"
  >
    <MazInput
      v-show="!customElementSelector && !inline"
      :model-value="inputValue"
      readonly
      v-bind="$attrs"
      block
      autocomplete="off"
      class="m-picker__input"
      :label="label"
      :disabled="disabled"
      :placeholder="placeholder"
      :color="color"
      @click="isFocused = !isFocused"
    >
      <template #left-icon>
        <MazCalendar v-if="hasDate" class="maz-text-xl" @click="isFocused = !isFocused" />
        <MazClock v-else-if="hasTime" class="maz-text-xl" @click="isFocused = !isFocused" />
      </template>
      <template #right-icon>
        <button
          type="button"
          tabindex="-1"
          class="m-picker__button"
          @click="isFocused = !isFocused"
        >
          <MazChevronDownIcon class="m-picker__button__chevron maz-text-lg" />
        </button>
      </template>
    </MazInput>

    <Transition
      :name="pickerContainerPosition.vertical === 'top' ? 'maz-slideinvert' : 'maz-slide'"
    >
      <MazPickerContainer
        v-if="isOpen"
        :id="containerUniqueId"
        v-model="currentValue"
        v-model:calendar-date="calendarDate"
        :is-open="isOpen"
        :color="color"
        :locale="currentLocale"
        :has-date="hasDate"
        :double="hasDouble"
        :has-time="hasTime"
        :formatter-options="formatterOptions"
        :hide-header="hideHeader"
        :min-date="minDate"
        :format="format"
        :is-hour12="isHour12"
        :max-date="maxDate"
        :disabled-weekly="disabledWeekly"
        :inline="inline"
        :first-day-of-week="firstDayOfWeek"
        :shortcuts
        :shortcut="shortcut"
        :disabled="disabled"
        :disabled-hours="disabledHours"
        :disabled-dates="disabledDates"
        :minute-interval="minuteInterval"
        :range="isRangeMode"
        @close="closeCalendar"
      />
    </Transition>
  </div>
</template>

<style lang="postcss" scoped>
  .m-picker {
  @apply maz-relative maz-inline-block;

  &.--block {
    @apply maz-w-full;
  }

  &--left .m-picker-container {
    @apply maz-left-0;
  }

  &--bottom .m-picker-container {
    @apply maz-top-full;
  }

  &--top .m-picker-container {
    @apply maz-bottom-full;
  }

  &--right .m-picker-container {
    @apply maz-right-0;
  }

  & .m-picker__button {
    @apply maz-flex maz-h-full maz-cursor-not-allowed maz-bg-transparent maz-pr-1 maz-flex-center;

    &__chevron {
      @apply maz-text-normal maz-transition-transform maz-duration-200;
    }
  }

  &.--is-open {
    & .m-picker__button__chevron {
      transform: rotate(180deg);
    }
  }

  &:not(.--is-disabled) {
    & .m-picker__button {
      @apply maz-cursor-pointer;
    }

    & .m-picker__input:deep(input) {
      @apply maz-cursor-pointer !important;
    }
  }
}
</style>
