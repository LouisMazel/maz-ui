<template>
  <div
    ref="MazPicker"
    v-click-outside="closeCalendarOnClickOutside"
    class="m-picker"
    :style="style"
    :class="[
      `m-picker--${color}`,
      `m-picker--${pickerContainerPosition.vertical}`,
      `m-picker--${pickerContainerPosition.horizontal}`,
      {
        '--is-open': isOpen,
      },
    ]"
    @keydown.esc="closeCalendar"
  >
    <MazInput
      v-if="!customElementSelector && !inline"
      :model-value="inputValue"
      readonly
      v-bind="$attrs"
      autocomplete="off"
      class="m-picker__input"
      :label="label"
      :placeholder="placeholder"
      :color="color"
      @click="isFocused = !isFocused"
    >
      <template #right-icon>
        <button tabindex="-1" class="m-picker__button">
          <MazIcon :src="ChevronDownIcon" class="m-picker__button__chevron" />
        </button>
      </template>
    </MazInput>

    <Transition
      :name="
        pickerContainerPosition.vertical === 'top'
          ? 'maz-slideinvert'
          : 'maz-slide'
      "
    >
      <MazPickerContainer
        v-show="isOpen"
        :id="containerUniqueId"
        ref="PickerContainer"
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
        :disabled-hours="disabledHours"
        :disabled-dates="disabledDates"
        :minute-interval="minuteInterval"
        :no-shortcuts="noShortcuts"
        @close="closeCalendar"
      />
    </Transition>
  </div>
</template>

<script lang="ts">
  export type { PickerValue } from './MazPicker/types'
  export type { Color, Position } from './types'
</script>

<script lang="ts" setup>
  import {
    computed,
    onBeforeMount,
    onMounted,
    onUnmounted,
    ref,
    getCurrentInstance,
    type PropType,
    type StyleValue,
    watch,
    nextTick,
  } from 'vue'

  import dayjs from 'dayjs'
  import customParseFormat from 'dayjs/plugin/customParseFormat'
  import isBetween from 'dayjs/plugin/isBetween'

  import MazInput from './MazInput.vue'
  import MazPickerContainer from './MazPicker/MazPickerContainer.vue'
  import { vClickOutside } from '@package/directives/click-outside.directive'
  import ChevronDownIcon from '@package/icons/chevron-down.svg'
  import MazIcon from './MazIcon.vue'
  import type { Color, Position } from './types'

  import { date } from '../filters'

  import {
    getFormattedDate,
    getRangeFormattedDate,
    getISODate,
    getRangeISODate,
    checkValueWithMinMaxDates,
    isValueDisabledWeekly,
    type DateTimeFormatOptions,
    getBrowserLocale,
    fetchLocale,
    isValueDisabledDate,
  } from './MazPicker/utils'

  import type { PickerValue, PickerShortcut } from './MazPicker/types'

  dayjs.extend(customParseFormat)
  dayjs.extend(isBetween)

  const defaultInputDateStyle: Intl.DateTimeFormatOptions = {
    dateStyle: 'full',
  }

  const props = defineProps({
    modelValue: {
      type: [String, Object] as PropType<PickerValue>,
      default: undefined,
    },
    format: { type: String, default: 'YYYY-MM-DD' },
    open: { type: Boolean, default: false },
    label: { type: String, default: undefined },
    placeholder: { type: String, default: undefined },
    inputDateStyle: {
      type: Object as PropType<Intl.DateTimeFormatOptions>,
      default: () => ({
        dateStyle: 'full',
      }),
    },
    locale: { type: String, default: undefined },
    style: { type: Object as PropType<StyleValue>, default: undefined },
    noHeader: { type: Boolean, default: false },
    firstDayOfWeek: {
      type: Number,
      default: 0,
      validator: (value: number) => {
        const isValid = Array.from({ length: 7 }, (_v, i) => i).includes(value)

        if (!isValid) {
          // eslint-disable-next-line no-console
          console.error(
            '[maz-ui](MazPicker) "first-day-of-week" should be between 0 and 6',
          )
        }

        return isValid
      },
    },
    autoClose: { type: Boolean, default: false },
    customElementSelector: { type: String, default: undefined },
    double: { type: Boolean, default: false },
    inline: { type: Boolean, default: false },
    color: {
      type: String as PropType<Color>,
      default: 'primary',
      validator: (value: Color) => {
        return [
          'primary',
          'secondary',
          'info',
          'success',
          'warning',
          'danger',
          'white',
          'black',
          'transparent',
        ].includes(value)
      },
    },
    pickerPosition: {
      type: String as PropType<Position>,
      default: undefined,
      validator: (value: Position) => {
        return [
          'top',
          'top right',
          'top left',
          'bottom',
          'bottom right',
          'bottom left',
          'left',
          'right',
        ].includes(value)
      },
    },
    time: { type: Boolean, default: false },
    onlyTime: { type: Boolean, default: false },
    minuteInterval: { type: Number, default: 5 },
    noUseBrowserLocale: { type: Boolean, default: false },
    noFetchLocal: { type: Boolean, default: false },
    noShortcuts: { type: Boolean, default: false },
    shortcuts: {
      type: Array as PropType<PickerShortcut[]>,
      default: () => [
        {
          label: 'Last 7 days',
          identifier: 'last7Days',
          value: {
            start: dayjs().subtract(6, 'day').format(),
            end: dayjs().format(),
          },
        },
        {
          label: 'Last 30 days',
          identifier: 'last30Days',
          value: {
            start: dayjs().subtract(29, 'day').format(),
            end: dayjs().format(),
          },
        },
        {
          label: 'This week',
          identifier: 'thisWeek',
          value: {
            start: dayjs().startOf('week').format(),
            end: dayjs().endOf('week').format(),
          },
        },
        {
          label: 'Last week',
          identifier: 'lastWeek',
          value: {
            start: dayjs().subtract(1, 'week').startOf('week').format(),
            end: dayjs().subtract(1, 'week').endOf('week').format(),
          },
        },
        {
          label: 'This month',
          identifier: 'thisMonth',
          value: {
            start: dayjs().set('date', 1).format(),
            end: dayjs().set('date', dayjs().daysInMonth()).format(),
          },
        },
        {
          label: 'Last month',
          identifier: 'lastMonth',
          value: {
            start: dayjs().subtract(1, 'month').set('date', 1).format(),
            end: dayjs()
              .subtract(1, 'month')
              .set('date', dayjs().subtract(1, 'month').daysInMonth())
              .format(),
          },
        },
        {
          label: 'This year',
          identifier: 'thisYear',
          value: {
            start: dayjs().startOf('year').format(),
            end: dayjs().endOf('year').format(),
          },
        },
        {
          label: 'Last year',
          identifier: 'lastYear',
          value: {
            start: dayjs().subtract(1, 'year').startOf('year').format(),
            end: dayjs().subtract(1, 'year').endOf('year').format(),
          },
        },
      ],
    },
    shortcut: { type: String, default: undefined },
    minDate: { type: String, default: undefined },
    maxDate: { type: String, default: undefined },
    disabledWeekly: {
      type: Array as PropType<number[]>,
      default: () => [],
      validator: (value: number) => {
        return 7 >= value && value >= 0
      },
    },
    disabledDates: { type: Array as PropType<string[]>, default: () => [] },
    disabledHours: {
      type: Array as PropType<number[]>,
      default: () => [],
      validator: (value: number) => {
        return 23 >= value && value >= 0
      },
    },
  })

  const instance = getCurrentInstance()

  const internalLocale = ref<string>(props.locale || 'en-US')
  const currentLocale = computed<string>(
    () => props.locale ?? internalLocale.value,
  )

  const containerUniqueId = computed(
    () => `mazPickerContainer-${instance?.uid}`,
  )

  const emits = defineEmits(['update:model-value', 'close'])

  const MazPicker = ref<HTMLDivElement>()

  const hasTime = computed(() => props.time || props.onlyTime)
  const hasDouble = computed(() => props.double && !props.onlyTime)
  const hasDate = computed(() => !props.onlyTime)
  const isRangeMode = computed(() => typeof currentValue.value === 'object')

  onBeforeMount(() => {
    if (isRangeMode.value && hasTime.value) {
      // eslint-disable-next-line no-console
      console.error(
        `[maz-ui](MazPicker) You can't use time picker with range picker`,
      )
    }
    if (
      hasTime.value &&
      !(props.format.includes('h') || props.format.includes('H'))
    ) {
      // eslint-disable-next-line no-console
      console.error(
        `[maz-ui](MazPicker) When you use the time picker, you must provided a format with time - Ex: "YYYY-MM-DD HH:mm"`,
      )
    }
    if (
      props.format.includes('h') &&
      !(props.format.includes('a') || props.format.includes('A'))
    ) {
      /* eslint-disable no-console */
      console.error(
        '[maz-ui](MazPicker) if you use the 12 format "h" or "hh", you must add "a" or "A" at the end of the format - Ex: "YYYY-MM-DD hh:mm a"',
      )
    }
  })

  const currentValue = computed<PickerValue>({
    get: () => {
      return typeof props.modelValue === 'object'
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
      emitValue(value)

      if (props.autoClose && value !== 'object') {
        closeCalendar()
      }
    },
  })

  const getCalendarDate = (value: PickerValue): string => {
    const baseDate =
      (typeof value === 'object' ? value.start : value) ?? dayjs().format()

    if (props.minDate && dayjs(baseDate).isBefore(props.minDate)) {
      return props.minDate
    } else if (props.maxDate && dayjs(baseDate).isAfter(props.maxDate)) {
      return props.minDate ?? props.maxDate
    } else {
      return baseDate
    }
  }

  const calendarDate = ref(getCalendarDate(currentValue.value))

  const isHour12 = computed(
    () =>
      props.format.includes('a') ||
      props.format.includes('A') ||
      props.format.includes('h'),
  )

  const formatterOptions = computed<DateTimeFormatOptions>(() => ({
    ...defaultInputDateStyle,
    ...props.inputDateStyle,
    timeStyle:
      props.inputDateStyle.timeStyle ?? hasTime.value ? 'short' : undefined,
    hour12: props.inputDateStyle.hour12 ?? isHour12.value,
  }))

  const inputValue = computed(() => {
    if (!currentValue.value) return undefined

    if (props.onlyTime) {
      return currentValue.value
        ? date(
            dayjs(currentValue.value as string).format(),
            currentLocale.value,
            {
              timeStyle: formatterOptions.value.timeStyle,
            },
          )
        : undefined
    } else if (typeof currentValue.value === 'object') {
      return getRangeFormattedDate({
        value: currentValue.value,
        locale: currentLocale.value,
        options: formatterOptions.value,
      })
    } else {
      return getFormattedDate({
        value: dayjs(currentValue.value).format(),
        locale: currentLocale.value,
        options: formatterOptions.value,
      })
    }
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

  const isOpen = computed(
    () =>
      isFocused.value ||
      props.open ||
      programaticallyOpened.value ||
      props.inline,
  )

  onMounted(async () => {
    if (props.customElementSelector) {
      addEventToTriggerCustomElement(props.customElementSelector)
    }

    if (!props.locale) {
      const browserLocale = getBrowserLocale()
      if (!props.noUseBrowserLocale && browserLocale) {
        if (browserLocale) {
          internalLocale.value = browserLocale
        }
      } else if (!props.noFetchLocal) {
        const locale = await fetchLocale()

        if (locale) internalLocale.value = locale
      }
    }
  })

  onUnmounted(() => {
    if (props.customElementSelector) {
      removeEventToTriggerCustomElement(props.customElementSelector)
    }
  })

  const getPickerContainerPosition = async (): Promise<{
    vertical: 'top' | 'bottom'
    horizontal: 'left' | 'right'
  }> => {
    if (props.pickerPosition) {
      const horizontal = props.pickerPosition.includes('right')
        ? 'right'
        : 'left'
      const vertical = props.pickerPosition.includes('top') ? 'top' : 'bottom'

      return {
        horizontal,
        vertical,
      }
    } else {
      return {
        horizontal: 'left',
        vertical: await calcVerticalPosition(MazPicker.value),
      }
    }
  }

  const calcVerticalPosition = async (
    parent?: HTMLDivElement,
  ): Promise<'top' | 'bottom'> => {
    if (typeof window === 'undefined') {
      return 'bottom'
    }

    const OFFSET = 30

    await nextTick()

    const pickerContainer = document.querySelector(
      `#${containerUniqueId.value}`,
    )

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

  const closeCalendar = () => {
    isFocused.value = false
    programaticallyOpened.value = false
    emits('close')
  }

  function closeCalendarOnClickOutside() {
    if (!props.customElementSelector) {
      closeCalendar()
    }
  }

  const toggleProgramatically = () => {
    programaticallyOpened.value = !programaticallyOpened.value
  }

  const addEventToTriggerCustomElement = (selector: string) => {
    const target = document.querySelector(selector)
    if (target) {
      target.addEventListener('click', toggleProgramatically)
    } else {
      throw new Error(
        `[maz-ui](MazPicker) impossible to find custom element with selector "${selector}"`,
      )
    }
  }

  const removeEventToTriggerCustomElement = (selector: string) => {
    const target = document.querySelector(selector)
    target?.removeEventListener('click', toggleProgramatically)
  }

  const checkMinMaxValues = (value: PickerValue) => {
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
      } else if (typeof value === 'object' && (value.start || value.end)) {
        let newStartValue = value.start
        let newEndValue = value.end

        if (value.start) {
          const { newValue, newCurrentDate } = checkValueWithMinMaxDates({
            value: value.start,
            minDate: props.minDate,
            maxDate: props.maxDate,
            format: props.format,
          })

          if (newValue) newStartValue = newValue

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

          if (newValue) newEndValue = newValue
        }

        emitValue({
          start: newStartValue,
          end: newEndValue,
        })
      }
    }
  }

  const setCalendarDate = (value: string) => {
    if (value && !dayjs(calendarDate.value).isSame(value, 'month')) {
      calendarDate.value = value
    }
  }

  const emitValue = (value: PickerValue) => {
    if (typeof value === 'object') {
      const newValue = getRangeISODate(value, props.format)
      emits('update:model-value', newValue)

      if (newValue.start) {
        setCalendarDate(newValue.start)
      }
    } else {
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
          !oldValue ||
          (typeof oldValue === 'object' &&
            (oldValue.start !== value.start || oldValue.end !== value.end))
        ) {
          emitValue(value)
          checkMinMaxValues(value)
        }
      } else if (typeof value === 'string' && value !== oldValue) {
        emitValue(value)
        checkMinMaxValues(value)
      }
    },
    { immediate: true },
  )

  watch(
    () => isOpen.value,
    async (value) => {
      if (value) {
        pickerContainerPosition.value = await getPickerContainerPosition()
      }
    },
    { immediate: true },
  )

  // // Disable weekly watcher
  watch(
    () => [currentValue.value, props.disabledWeekly, props.disabledDates],
    (values) => {
      const value = values[0] as PickerValue
      const disabledWeekly = values[1] as number[]
      const disabledDates = values[2] as string[]

      if (typeof value === 'object' && (value.start || value.end)) {
        if (
          (value.start &&
            isValueDisabledWeekly({ value: value.start, disabledWeekly })) ||
          (value.start &&
            isValueDisabledDate({ value: value.start, disabledDates })) ||
          (value.end &&
            isValueDisabledWeekly({ value: value.end, disabledWeekly })) ||
          (value.end &&
            isValueDisabledDate({ value: value.end, disabledDates }))
        ) {
          currentValue.value = { start: undefined, end: undefined }
        }
        if (
          (value.end &&
            isValueDisabledWeekly({ value: value.end, disabledWeekly })) ||
          (value.end &&
            isValueDisabledDate({ value: value.end, disabledDates }))
        ) {
          currentValue.value = { start: value.start, end: undefined }
        }
      } else if (typeof value === 'string') {
        if (
          isValueDisabledWeekly({ value, disabledWeekly }) ||
          isValueDisabledDate({ value, disabledDates })
        ) {
          currentValue.value = undefined
        }
      }
    },
    { immediate: true },
  )
</script>

<style lang="postcss" scoped>
  .m-picker {
    @apply maz-relative;

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
      @apply maz-flex maz-h-full maz-bg-transparent maz-pr-1 maz-flex-center;

      &__chevron {
        @apply maz-h-5 maz-w-5 maz-text-normal maz-transition-transform maz-duration-200;
      }
    }

    &.--is-open {
      & .m-picker__button__chevron {
        transform: rotate(180deg);
      }
    }

    &__input:deep(input) {
      @apply maz-cursor-pointer !important;
    }
  }
</style>
