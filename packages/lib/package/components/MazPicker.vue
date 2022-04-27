<template>
  <div
    ref="MazPicker"
    v-click-outside="closeCalendar"
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
        v-if="isOpen"
        :id="containerUniqueId"
        ref="PickerContainer"
        v-model="currentValue"
        v-model:calendar-date="calendarDate"
        :is-open="isOpen"
        :color="color"
        :locale="currentLocale"
        :has-footer="hasFooter"
        :has-date="hasDate"
        :double="hasDouble"
        :time="hasTime"
        :formatter-options="formatterOptions"
        :no-header="noHeader"
        :min-date="minDate"
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
    PropType,
    ref,
    StyleValue,
    getCurrentInstance,
    // watch,
    // nextTick,
  } from 'vue'
  import dayjs from 'dayjs'
  import customParseFormat from 'dayjs/plugin/customParseFormat'

  import MazInput from './MazInput.vue'
  import MazPickerContainer from './MazPicker/MazPickerContainer.vue'
  import { vClickOutside } from '@package/directives/click-outside.directive'
  import ChevronDownIcon from '@package/icons/chevron-down.svg'
  import MazIcon from './MazIcon.vue'
  import { Color, Position } from './types'

  import { date } from '../filters'

  import {
    // getCurrentDate,
    getFormattedDate,
    getRangeFormattedDate,
    getISODate,
    getRangeISODate,
    // checkValueWithMinMaxDates,
    // isValueDisabledWeekly,
    // getDaysInMonth,
    DateTimeFormatOptions,
    // getCurrentDateForTimeValue,
    getBrowserLocale,
    fetchLocale,
    // isValueDisabledDate,
  } from './MazPicker/utils'

  import { PickerValue, PickerShortcut } from './MazPicker/types'

  dayjs.extend(customParseFormat)

  const props = defineProps({
    modelValue: {
      type: [String, Object] as PropType<PickerValue>,
      default: undefined,
    },
    format: { type: String, default: 'YYYY-MM-DD' },
    minDate: { type: String, default: undefined },
    maxDate: { type: String, default: undefined },
    open: { type: Boolean, default: false },
    label: { type: String, default: 'Select date' },
    placeholder: { type: String, default: undefined },
    dateStyle: {
      type: String as PropType<Intl.DateTimeFormatOptions['dateStyle']>,
      default: 'full',
    },
    timeStyle: {
      type: String as PropType<Intl.DateTimeFormatOptions['timeStyle']>,
      default: undefined,
    },
    timeZone: {
      type: String as PropType<Intl.DateTimeFormatOptions['timeZone']>,
      default: undefined,
    },
    hour12: {
      type: Boolean as PropType<Intl.DateTimeFormatOptions['hour12']>,
      default: false,
    },
    locale: { type: String, default: undefined },
    style: { type: Object as PropType<StyleValue>, default: undefined },
    noHeader: { type: Boolean, default: false },
    firstDayOfWeek: {
      type: Number,
      default: 0,
      validator: (value: number) => {
        const isValid = [0, 1, 2, 3, 4, 5, 6].includes(value)

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
    noFooter: { type: Boolean, default: false },
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
    disabledWeekly: { type: Array as PropType<number[]>, default: () => [] },
    disabledHours: {
      type: Array as PropType<number[]>,
      default: () => [],
    },
    disabledDates: { type: Array as PropType<string[]>, default: () => [] },
    noShortcuts: { type: Boolean, default: false },
    shortcuts: {
      type: Array as PropType<PickerShortcut[]>,
      default: () => [],
    },
    shortcut: { type: String, default: undefined },
    time: { type: Boolean, default: false },
    minuteInterval: { type: Number, default: 5 },
    noUseBrowserLocale: { type: Boolean, default: false },
    noFetchLocal: { type: Boolean, default: false },
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
  // const PickerContainer = ref<typeof MazPickerContainer>()

  const hasTime = computed(
    () =>
      props.format.includes('h') || props.format.includes('H') || props.time,
  )
  const hasDouble = computed(() => props.double)
  const hasDate = computed(() => !props.time)
  const isRangeMode = computed(() => typeof currentValue.value === 'object')

  onBeforeMount(() => {
    if (isRangeMode.value && hasTime.value) {
      throw new Error(
        `[maz-ui](MazPicker) you can't use time picker with range picker`,
      )
    }
  })

  const currentValue = computed<PickerValue>({
    get: () =>
      typeof props.modelValue === 'object'
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
        : undefined,
    set: (value) => {
      // NEXT: format output
      emitValue(value)

      if (props.autoClose && value !== 'object') {
        closeCalendar()
      }
    },
  })

  const getCalendarDate = (value: PickerValue): string => {
    return (typeof value === 'object' ? value.start : value) ?? dayjs().format()
  }

  const calendarDate = ref(getCalendarDate(currentValue.value))

  const formatterOptions = computed<DateTimeFormatOptions>(() => {
    const { dateStyle, timeStyle, timeZone, hour12 } = props

    return {
      dateStyle,
      timeStyle,
      timeZone,
      hour12,
    }
  })

  const inputValue = computed(() => {
    if (!currentValue.value) return undefined

    if (props.time) {
      const baseDate = new Date().toISOString().split('T')[0]

      return currentValue.value
        ? date(
            new Date(`${baseDate} ${currentValue.value}`),
            currentLocale.value,
            {
              timeStyle: props.timeStyle,
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

  const hasFooter = computed(
    () => !props.autoClose && !props.noFooter && !props.inline,
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

  // const getPickerContainerPosition = async (): Promise<{
  //   vertical: 'top' | 'bottom'
  //   horizontal: 'left' | 'right'
  // }> => {
  //   if (props.pickerPosition) {
  //     const horizontal = props.pickerPosition.includes('right')
  //       ? 'right'
  //       : 'left'
  //     const vertical = props.pickerPosition.includes('top') ? 'top' : 'bottom'

  //     return {
  //       horizontal,
  //       vertical,
  //     }
  //   } else {
  //     return {
  //       horizontal: 'left',
  //       vertical: await calcVerticalPosition(MazPicker.value),
  //     }
  //   }
  // }

  // const calcVerticalPosition = async (
  //   parent?: HTMLDivElement,
  // ): Promise<'top' | 'bottom'> => {
  //   if (typeof window === 'undefined') {
  //     return 'bottom'
  //   }

  //   const OFFSET = 30

  //   await nextTick()

  //   const pickerContainer = document.querySelector(
  //     `#${containerUniqueId.value}`,
  //   )

  //   const parentRect = parent?.getBoundingClientRect()
  //   const windowHeight = window.innerHeight

  //   const pickerHeight = (pickerContainer?.clientHeight ?? 0) - OFFSET

  //   const spaceOnBottom = (parentRect && windowHeight - parentRect.bottom) ?? 0
  //   const spaceOnTop = (parentRect && parentRect.top) ?? 0

  //   const hasSpaceOnBottom = spaceOnBottom && spaceOnBottom >= pickerHeight

  //   const hasSpaceOnTop = spaceOnTop && spaceOnTop >= pickerHeight

  //   if (!hasSpaceOnBottom && (hasSpaceOnTop || spaceOnTop >= spaceOnBottom)) {
  //     return 'top'
  //   }

  //   return 'bottom'
  // }

  const closeCalendar = () => {
    isFocused.value = false
    programaticallyOpened.value = false
    emits('close')
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

  // const checkMinMaxValues = (value: PickerValue) => {
  //   if (props.minDate || props.maxDate) {
  //     if (typeof value === 'string') {
  //       const { newValue, newCurrentDate } = checkValueWithMinMaxDates({
  //         value,
  //         minDate: props.minDate,
  //         maxDate: props.maxDate,
  //       })
  //       if (newValue) {
  //         emitValue(newValue)
  //       }
  //       if (newCurrentDate) currentDate.value = newCurrentDate
  //     } else if (typeof value === 'object' && (value.start || value.end)) {
  //       // RANGE
  //       let newStartValue = value.start
  //       let newEndValue = value.end

  //       if (value.start) {
  //         const { newValue, newCurrentDate } = checkValueWithMinMaxDates({
  //           value: value.start,
  //           minDate: props.minDate,
  //           maxDate: props.maxDate,
  //         })

  //         if (newValue) newStartValue = newValue

  //         if (newCurrentDate) currentDate.value = newCurrentDate
  //       }
  //       if (value.end) {
  //         const { newValue } = checkValueWithMinMaxDates({
  //           value: value.end,
  //           minDate: props.minDate,
  //           maxDate: props.maxDate,
  //         })

  //         if (newValue) newEndValue = newValue
  //       }

  //       emitValue({
  //         start: newStartValue,
  //         end: newEndValue,
  //       })
  //     }
  //   }
  // }

  const emitValue = (value: PickerValue) => {
    const newValue =
      typeof value === 'object'
        ? getRangeISODate(value, props.format)
        : getISODate(value, props.format)

    emits('update:model-value', newValue)
  }

  // model value watcher
  // watch(
  //   () => [currentValue.value, props.minDate, props.maxDate],
  //   (values, oldValues) => {
  //     const value = values[0] as PickerValue
  //     const oldValue = oldValues?.[0] as PickerValue

  //     // currentDate.value = getCurrentDateValue()

  //     if (typeof value === 'object' && (value.start || value.end)) {
  //       if (
  //         !oldValue ||
  //         (typeof oldValue === 'object' &&
  //           (oldValue.start !== value.start || oldValue.end !== value.end))
  //       ) {
  //         emitValue(value)
  //         checkMinMaxValues(value)
  //       }
  //     } else if (typeof value === 'string' && value !== oldValue) {
  //       emitValue(value)
  //       checkMinMaxValues(value)
  //     }
  //   },
  //   { immediate: true },
  // )

  // watch(
  //   () => isOpen.value,
  //   async (value) => {
  //     if (value) {
  //       pickerContainerPosition.value = await getPickerContainerPosition()
  //     }
  //   },
  //   { immediate: true },
  // )

  // // Disable weekly watcher
  // watch(
  //   () => [currentValue.value, props.disabledWeekly, props.disabledDates],
  //   (values) => {
  //     const value = values[0] as PickerValue
  //     const disabledWeekly = values[1] as number[]
  //     const disabledDates = values[2] as string[]

  //     if (typeof value === 'object' && (value.start || value.end)) {
  //       if (
  //         (value.start &&
  //           isValueDisabledWeekly({ value: value.start, disabledWeekly })) ||
  //         (value.start &&
  //           isValueDisabledDate({ value: value.start, disabledDates }))
  //       ) {
  //         currentValue.value = { start: undefined, end: value.end }
  //       }
  //       if (
  //         (value.end &&
  //           isValueDisabledWeekly({ value: value.end, disabledWeekly })) ||
  //         (value.end &&
  //           isValueDisabledDate({ value: value.end, disabledDates }))
  //       ) {
  //         currentValue.value = { start: value.start, end: undefined }
  //       }
  //     } else if (typeof value === 'string') {
  //       if (
  //         isValueDisabledWeekly({ value, disabledWeekly }) ||
  //         isValueDisabledDate({ value, disabledDates })
  //       ) {
  //         currentValue.value = undefined
  //       }
  //     }
  //   },
  //   { immediate: true },
  // )
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
