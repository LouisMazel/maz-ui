<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { MazDatePickerShortcut, MazDatePickerValue } from './MazDatePicker/types'
import type { DateTimeFormatOptions } from './MazDatePicker/utils'
import type { MazInputProps } from './MazInput.vue'
import type { MazPopoverProps } from './MazPopover.vue'
import type { MazColor } from './types'
import { MazCalendar, MazClock } from '@maz-ui/icons'
import MazChevronDownIcon from '@maz-ui/icons/svg/chevron-down.svg'
import { useTranslations } from '@maz-ui/translations/src/useTranslations.js'
import { formatDate } from '@maz-ui/utils/src/formatters/formatDate.js'

import dayjs from 'dayjs'

import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import {
  computed,
  defineAsyncComponent,
  onBeforeMount,
  ref,
  useTemplateRef,
  watch,
} from 'vue'
import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import {
  checkValueWithMinMaxDates,
  getDefaultsShortcuts,
  getFormattedDate,
  getISODate,
  getRangeFormattedDate,
  getRangeISODate,
  isRangeValue,
  isValueDisabledDate,
  isValueDisabledWeekly,
} from './MazDatePicker/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MazDatePickerProps>(), {
  format: 'YYYY-MM-DD',
  open: false,
  inputFormat: () => ({ dateStyle: 'medium', timeStyle: 'full' }),
  hideHeader: false,
  disabled: false,
  firstDayOfWeek: 0,
  autoClose: false,
  double: false,
  inline: false,
  color: 'primary',
  pickerPosition: 'bottom-start',
  time: false,
  onlyTime: false,
  minuteInterval: 5,
  useBrowserLocale: true,
  fetchLocal: true,
  shortcuts: true,
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
   * @property {MazDatePickerValue | undefined} value - The new selected value
   */
  'update:model-value': [value: MazDatePickerValue | undefined]

  /**
   * Emitted when the picker closes
   * @event close
   */
  'close': [void]
}>()

const { t, locale } = useTranslations()

export type { MazDatePickerPartialRangeValue, MazDatePickerRangeValue, MazDatePickerShortcut, MazDatePickerValue } from './MazDatePicker/types'

dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

export interface MazDatePickerProps {
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
   * The props to apply to the input component
   * @default undefined
   * @type {MazInputProps}
   */
  inputProps?: MazInputProps

  /**
   * The value of the date picker component
   * If an object is provided, the picker will be a range picker
   * @type {MazDatePickerValue}
   * @default undefined
   */
  modelValue?: MazDatePickerValue

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
   * @model
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
   * @default { dateStyle: 'medium', timeStyle: 'full' }
   */
  inputFormat?: Intl.DateTimeFormatOptions

  /**
   * Custom function to transform the formatted date display
   * @type {Function}
   * @param {object} payload - The transformation payload
   * @param {string} payload.formattedDate - The formatted date string
   * @param {MazDatePickerValue} payload.value - The current picker value
   * @param {string} payload.locale - The current locale
   * @returns {string} The transformed date string
   */
  inputDateTransformer?: (payload: { formattedDate?: string, value?: MazDatePickerValue, locale: string }) => string

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
   * @values primary, secondary, success, destructive, warning, info, accent, contrast
   * @default 'primary'
   */
  color?: MazColor

  /**
   * The position where the picker popover should appear
   * @type {MazPopoverProps['position']}
   * @values top, bottom, left, right, top-left, top-right, bottom-left, bottom-right
   */
  pickerPosition?: MazPopoverProps['position']

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
   * @type {MazDatePickerShortcut[] | false}
   * @default [predefined shortcuts array]
   */
  shortcuts?: MazDatePickerShortcut[] | boolean

  /**
   * The identifier of the currently selected shortcut
   * @type {string}
   */
  shortcut?: MazDatePickerShortcut['identifier']

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
const MazPopover = defineAsyncComponent(() => import('./MazPopover.vue'))
const MazPickerContainer = defineAsyncComponent(() => import('./MazDatePicker/MazPickerContainer.vue'))

const instanceId = useInstanceUniqId({ componentName: 'MazDatePicker', providedId: props.id })

const currentValue = computed<MazDatePickerValue>({
  get: () => {
    const isRangeMode = typeof props.modelValue === 'object' || props.range

    if (isRangeMode) {
      return {
        start: typeof props.modelValue === 'object' && props.modelValue.start
          ? dayjs(props.modelValue.start, props.format).format()
          : undefined,
        end: typeof props.modelValue === 'object' && props.modelValue.end
          ? dayjs(props.modelValue.end, props.format).format()
          : undefined,
      }
    }

    return typeof props.modelValue === 'string' && props.modelValue
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

const internalShortcuts = computed(() => {
  if (!isRangeMode.value || props.shortcuts === false) {
    return false
  }

  return getDefaultsShortcuts({
    lastSevenDays: t('datePicker.shortcuts.lastSevenDays'),
    lastThirtyDays: t('datePicker.shortcuts.lastThirtyDays'),
    thisWeek: t('datePicker.shortcuts.thisWeek'),
    lastWeek: t('datePicker.shortcuts.lastWeek'),
    thisMonth: t('datePicker.shortcuts.thisMonth'),
    thisYear: t('datePicker.shortcuts.thisYear'),
    lastYear: t('datePicker.shortcuts.lastYear'),
  })
})

const localeModel = defineModel<string>('locale', { default: undefined })
localeModel.value = props.locale ?? locale.value

const containerUniqueId = computed(() => `MazDatePickerContainer-${instanceId.value}`)

const popoverComponent = useTemplateRef('popover')

onBeforeMount(() => {
  if (isRangeMode.value && hasTime.value) {
    console.error(`[maz-ui](MazDatePicker) You can't use time picker with range picker`)
  }
  if (hasTime.value && !(props.format.includes('h') || props.format.includes('H'))) {
    console.error(
      `[maz-ui](MazDatePicker) When you use the time picker, you must provided a format with time - Ex: "YYYY-MM-DD HH:mm"`,
    )
  }
  if (props.format.includes('h') && !(props.format.includes('a') || props.format.includes('A'))) {
    console.error(
      '[maz-ui](MazDatePicker) if you use the 12 format "h" or "hh", you must add "a" or "A" at the end of the format - Ex: "YYYY-MM-DD hh:mm a"',
    )
  }
})

/**
 * Gets the base calendar date considering min/max constraints
 * @param {MazDatePickerValue} value - The picker value
 * @returns {string} The formatted date for the calendar
 */
function getCalendarDate(value: MazDatePickerValue): string {
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
  ...props.inputFormat,
  timeStyle: props.inputFormat.timeStyle ?? hasTime.value ? 'short' : undefined,
  hour12: hasTime.value ? props.inputFormat.hour12 ?? isHour12.value : undefined,
} satisfies DateTimeFormatOptions))

const inputValue = computed(() => {
  if (!currentValue.value)
    return

  let formattedDate: string | undefined

  if (props.onlyTime && typeof currentValue.value === 'string' && currentValue.value) {
    formattedDate = currentValue.value
      ? formatDate(dayjs(currentValue.value).format(), localeModel.value, {
          timeStyle: formatterOptions.value.timeStyle,
          hour12: formatterOptions.value.hour12,
        })
      : undefined
  }
  else if (isRangeMode.value && isRangeValue(currentValue.value)) {
    formattedDate = getRangeFormattedDate({
      value: currentValue.value,
      locale: localeModel.value,
      options: formatterOptions.value,
    })
  }
  else if (typeof currentValue.value === 'string' && currentValue.value) {
    formattedDate = getFormattedDate({
      value: dayjs(currentValue.value).format(),
      locale: localeModel.value,
      options: formatterOptions.value,
    })
  }

  return props.inputDateTransformer && formattedDate ? props.inputDateTransformer({ formattedDate, value: props.modelValue, locale: localeModel.value }) : formattedDate
})

const hasPickerOpen = defineModel<boolean>('open', { default: false })

function closeCalendar() {
  popoverComponent.value?.close()
  emits('close')
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function checkMinMaxValues(value: MazDatePickerValue) {
  if (!props.minDate && !props.maxDate) {
    return
  }

  if (!isRangeMode.value && ((typeof value === 'string' && value) || !value)) {
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

function emitValue(value: MazDatePickerValue) {
  if (isRangeMode.value && (typeof value === 'object' || value === undefined)) {
    const newValue = getRangeISODate(value, props.format) ?? { start: undefined, end: undefined }
    emits('update:model-value', newValue)

    if (newValue.start) {
      setCalendarDate(newValue.start)
    }
  }
  else if ((typeof value === 'string' && value) || value === undefined) {
    emits('update:model-value', getISODate(value, props.format))
  }
}

// model value watcher
watch(
  () => [currentValue.value, props.minDate, props.maxDate],
  (values, oldValues) => {
    const value = values[0] as MazDatePickerValue
    const oldValue = oldValues?.[0] as MazDatePickerValue

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
    else if ((typeof value === 'string' && value) && value !== oldValue) {
      emitValue(value)
      checkMinMaxValues(value)
    }
  },
  { immediate: true },
)

// Disable weekly watcher
watch(
  () => [currentValue.value, props.disabledWeekly, props.disabledDates],
  (values) => {
    const value = values[0] as MazDatePickerValue
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
      typeof value === 'string' && value
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
  <MazPopover
    v-if="!inline"
    ref="popover"
    class="m-date-picker m-reset-css"
    :style
    :offset="0"
    :class="[
      `m-date-picker--${color}`,
      {
        '--is-open': hasPickerOpen,
        '--is-disabled': disabled,
      },
      props.class,
    ]"
    trigger="click"
    :disabled
    :block
    :prefer-position="pickerPosition"
    :position-delay="100"
    fallback-position="top-start"
  >
    <template #trigger="{ isOpen, close, open: openPicker, toggle: togglePicker }">
      <!--
        @slot Replace the default input with your own element
          @default MazInput

          @binding {boolean} is-open Current open state of the popover
          @binding {function} close Function to close the popover
          @binding {function} open Function to open the popover
          @binding {function} toggle Function to toggle the popover
      -->
      <slot name="trigger" :is-open="isOpen" :close="close" :open="openPicker" :toggle="togglePicker">
        <MazInput
          v-show="!customElementSelector && !inline"
          :model-value="inputValue"
          readonly
          v-bind="{ ...inputProps, ...$attrs }"
          block
          autocomplete="off"
          class="m-date-picker__input"
          :label="label"
          :disabled="disabled"
          :placeholder="placeholder"
          :color="color"
        >
          <template #left-icon>
            <MazCalendar v-if="hasDate" class="maz-text-xl" />
            <MazClock v-else-if="hasTime" class="maz-text-xl" />
          </template>
          <template #right-icon>
            <MazChevronDownIcon class="m-date-picker__button__chevron maz-text-lg" />
          </template>
        </MazInput>
      </slot>
    </template>

    <MazPickerContainer
      :id="containerUniqueId"
      v-model="currentValue"
      v-model:calendar-date="calendarDate"
      :color
      :locale="localeModel"
      :has-date
      :double="hasDouble"
      :has-time
      :formatter-options
      :hide-header
      :min-date
      :format
      :is-hour12="isHour12"
      :max-date
      :disabled-weekly
      :inline
      :first-day-of-week
      :shortcuts="internalShortcuts"
      :shortcut
      :disabled
      :disabled-hours
      :disabled-dates
      :minute-interval
      :range="isRangeMode"
      @close="closeCalendar"
    />
  </MazPopover>

  <MazPickerContainer
    v-else
    :id="containerUniqueId"
    v-model="currentValue"
    v-model:calendar-date="calendarDate"
    :color
    :locale="localeModel"
    :has-date
    :double="hasDouble"
    :has-time
    :formatter-options
    :hide-header
    :min-date
    :format
    :is-hour12="isHour12"
    :max-date
    :disabled-weekly
    :inline
    :first-day-of-week
    :shortcuts="internalShortcuts"
    :shortcut
    :disabled
    :disabled-hours
    :disabled-dates
    :minute-interval
    :range="isRangeMode"
    @close="closeCalendar"
  />
</template>

<style lang="postcss" scoped>
.m-date-picker {
  @apply maz-relative maz-inline-block;

  & .m-date-picker__button {
    @apply maz-flex maz-h-full maz-cursor-not-allowed maz-bg-transparent maz-pr-1 maz-flex-center;

    &__chevron {
      @apply maz-text-foreground maz-transition-transform maz-duration-200;
    }
  }

  &.--is-open {
    & .m-date-picker__button__chevron {
      transform: rotate(180deg);
    }
  }

  &:not(.--is-disabled) {
    & .m-date-picker__button {
      @apply maz-cursor-pointer;
    }

    & .m-date-picker__input:deep(input) {
      @apply maz-cursor-pointer !important;
    }
  }
}
</style>
