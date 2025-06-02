<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { PickerShortcut, PickerValue } from './MazPicker/types'
import type { DateTimeFormatOptions } from './MazPicker/utils'
import type { Color, Position } from './types'
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

import ChevronDownIcon from '../../icons/chevron-down.svg'

import { useInstanceUniqId } from '../composables/useInstanceUniqId'
import { vClickOutside } from '../directives/vClickOutside'
import { date } from '../filters/date'
import MazPickerContainer from './MazPicker/MazPickerContainer.vue'
import {
  checkValueWithMinMaxDates,

  fetchLocale,
  getBrowserLocale,
  getFormattedDate,
  getISODate,
  getRangeFormattedDate,
  getRangeISODate,
  isValueDisabledDate,
  isValueDisabledWeekly,
} from './MazPicker/utils'

defineOptions({
  inheritAttrs: false,
})
const props = withDefaults(defineProps<MazPickerProps>(), {
  style: undefined,
  class: undefined,
  modelValue: undefined,
  format: 'YYYY-MM-DD',
  open: false,
  label: undefined,
  placeholder: undefined,
  inputDateStyle: () => ({ dateStyle: 'full' }),
  inputDateTransformer: undefined,
  locale: undefined,
  noHeader: false,
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
  noUseBrowserLocale: false,
  noFetchLocal: false,
  noShortcuts: false,
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
})
const emits = defineEmits(['update:model-value', 'close'])
dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

export interface MazPickerProps {
  /** The id of the component */
  id?: string
  /** The style of the component */
  style?: HTMLAttributes['style']
  /** The class of the component */
  class?: HTMLAttributes['class']
  /** The value of the component */
  modelValue?: PickerValue
  /** The format of the date */
  format?: string
  /** If true picker window will be open */
  open?: boolean
  /** The label of the input */
  label?: string
  /** The placeholder of the input */
  placeholder?: string
  /** The style of the input date */
  inputDateStyle?: Intl.DateTimeFormatOptions
  /**
   * The transformer of the input date
   * @type {(payload: { formattedDate?: string; value?: PickerValue; locale: string }) => string}
   */
  inputDateTransformer?: (payload: { formattedDate?: string, value?: PickerValue, locale: string }) => string
  /** The locale of the component */
  locale?: string
  /** If true, the header will be hidden */
  noHeader?: boolean
  /** If true, the component will be disabled */
  disabled?: boolean
  /** The first day of the week (between 0 and 6) */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  /** If true, the picker will close after a date selection */
  autoClose?: boolean
  /** The selector of the custom element to trigger the picker */
  customElementSelector?: string
  /** If true, the picker will be double */
  double?: boolean
  /** If true, the picker will be inline */
  inline?: boolean
  /** The color of the component */
  color?: Color
  /** The position of the picker */
  pickerPosition?: Position
  /** If true, the picker has a time picker */
  time?: boolean
  /** If true, the picker will be a time picker */
  onlyTime?: boolean
  /** The interval of the minutes */
  minuteInterval?: number
  /** If true, the browser locale will be used */
  noUseBrowserLocale?: boolean
  /** If true, the browser locale will not be fetched */
  noFetchLocal?: boolean
  /** If true, the shortcuts will be hidden */
  noShortcuts?: boolean
  /** The shortcuts of the picker */
  shortcuts?: PickerShortcut[]
  /** The shortcut of the picker */
  shortcut?: string
  /** The min date of the picker */
  minDate?: string
  /** The max date of the picker */
  maxDate?: string
  /** The disabled  weekly days of the picker */
  disabledWeekly?: number[]
  /** The disabled dates of the picker */
  disabledDates?: string[]
  /** The disabled hours of the time picker */
  disabledHours?: number[]
  /** The input will be displayed in full width */
  block?: boolean
}

const MazInput = defineAsyncComponent(() => import('./MazInput.vue'))
const instanceId = useInstanceUniqId({ componentName: 'MazPicker', providedId: props.id })

const internalLocale = ref(props.locale)
const currentLocale = computed<string>(() => props.locale ?? internalLocale.value ?? 'en-US')

const containerUniqueId = computed(() => `mazPickerContainer-${instanceId.value}`)

const MazPicker = ref<HTMLDivElement>()

const currentValue = computed<PickerValue>({
  get: () => {
    return props.modelValue && typeof props.modelValue === 'object'
      ? {
          start: props.modelValue.start
            ? dayjs(props.modelValue.start, props.format).format()
            : undefined,
          end: props.modelValue.end
            ? dayjs(props.modelValue.end, props.format).format()
            : undefined,
        }
      : props.modelValue
        ? dayjs(props.modelValue, props.format).format()
        : undefined
  },
  set: (value) => {
    if (props.disabled) {
      return
    }

    emitValue(value)

    const isRangeMode = typeof value === 'object'

    if (props.autoClose && (!isRangeMode || (isRangeMode && value.end))) {
      closeCalendar()
    }
  },
})

const hasTime = computed(() => props.time || props.onlyTime)
const hasDouble = computed(() => props.double && !props.onlyTime)
const hasDate = computed(() => !props.onlyTime)
const isRangeMode = computed(() => typeof currentValue.value === 'object')

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

function getCalendarDate(value: PickerValue): string {
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
  else if (typeof currentValue.value === 'object') {
    formattedDate = getRangeFormattedDate({
      value: currentValue.value,
      locale: currentLocale.value,
      options: formatterOptions.value,
    })
  }
  else {
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
    if (!props.noUseBrowserLocale && browserLocale) {
      internalLocale.value = browserLocale
    }
    else if (!props.noFetchLocal) {
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
function checkMinMaxValues(value: PickerValue) {
  if (props.minDate || props.maxDate) {
    if (typeof value === 'string') {
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
    else if (typeof value === 'object' && (value.start || value.end)) {
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
}

function setCalendarDate(value: string) {
  if (value && !dayjs(calendarDate.value).isSame(value, 'month')) {
    calendarDate.value = value
  }
}

function emitValue(value: PickerValue) {
  if (typeof value === 'object') {
    const newValue = getRangeISODate(value, props.format)
    emits('update:model-value', newValue)

    if (newValue.start) {
      setCalendarDate(newValue.start)
    }
  }
  else {
    emits('update:model-value', getISODate(value, props.format))
  }
}

// model value watcher
watch(
  () => [currentValue.value, props.minDate, props.maxDate],
  (values, oldValues) => {
    const value = values[0] as PickerValue
    const oldValue = oldValues?.[0] as PickerValue

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
    const value = values[0] as PickerValue
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
      v-if="!customElementSelector && !inline"
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
      <template #right-icon>
        <button
          type="button"
          tabindex="-1"
          class="m-picker__button"
          @click="isFocused = !isFocused"
        >
          <ChevronDownIcon class="m-picker__button__chevron maz-text-lg" />
        </button>
      </template>
    </MazInput>

    <Transition
      :name="pickerContainerPosition.vertical === 'top' ? 'maz-slideinvert' : 'maz-slide'"
    >
      <MazPickerContainer
        v-show="isOpen"
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
        :no-header="noHeader"
        :min-date="minDate"
        :format="format"
        :is-hour12="isHour12"
        :max-date="maxDate"
        :disabled-weekly="disabledWeekly"
        :inline="inline"
        :first-day-of-week="firstDayOfWeek"
        :shortcuts="shortcuts"
        :shortcut="shortcut"
        :disabled="disabled"
        :disabled-hours="disabledHours"
        :disabled-dates="disabledDates"
        :minute-interval="minuteInterval"
        :no-shortcuts="noShortcuts"
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
