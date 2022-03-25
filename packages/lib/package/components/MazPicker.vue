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
      :color="color"
      @click="isFocused = !isFocused"
    >
      <template #right-icon>
        <button
          tabindex="-1"
          class="maz-custom maz-flex maz-h-full maz-bg-transparent maz-flex-center"
        >
          <MazIcon
            :src="ChevronDownIcon"
            class="m-picker__button__chevron maz-h-5 maz-w-5 maz-text-normal"
          />
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
        v-model="modelValue"
        v-model:current-date="currentDate"
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
    watch,
    getCurrentInstance,
    nextTick,
  } from 'vue'
  import MazInput from './MazInput.vue'
  import MazPickerContainer from './MazPicker/MazPickerContainer.vue'
  import { vClickOutside } from './../directives/click-outside.directive'
  import ChevronDownIcon from './../icons/chevron-down.svg'
  import MazIcon from './MazIcon.vue'
  import { Color, Position } from './types'

  import { date } from '../filters'

  import {
    getCurrentDate,
    getFormattedDate,
    getRangeFormattedDate,
    getISODate,
    getRangeISODate,
    checkValueWithMinMaxDates,
    isValueDisabledWeekly,
    getDaysInMonth,
    getFirstDateOfWeek,
    DateTimeFormatOptions,
    getTimeString,
    getCurrentDateForTimeValue,
    getBrowserLocale,
    fetchLocale,
    isValueDisabledDate,
  } from './MazPicker/utils'

  import { PickerValue, PickerShortcut, SimpleValue } from './MazPicker/types'

  const props = defineProps({
    modelValue: {
      type: [String, Object] as PropType<PickerValue>,
      default: undefined,
    },
    minDate: { type: String, default: undefined },
    maxDate: { type: String, default: undefined },
    open: { type: Boolean, default: false },
    inputDateStyle: {
      type: String as PropType<Intl.DateTimeFormatOptions['dateStyle']>,
      default: 'full',
    },
    inputTimeStyle: {
      type: String as PropType<Intl.DateTimeFormatOptions['timeStyle']>,
      default: 'short',
    },
    timeZone: {
      type: String as PropType<Intl.DateTimeFormatOptions['timeZone']>,
      default: 'UTC',
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
      default: () => {
        const defaultShorts: PickerShortcut[] = [
          {
            identifier: 'last7Days',
            label: 'Last 7 days',
            value: {
              start: new Date().setDate(new Date().getDate() - 6),
              end: new Date(),
            },
          },
          {
            identifier: 'last30Days',
            label: 'Last 30 days',
            value: {
              start: new Date().setDate(new Date().getDate() - 29),
              end: new Date(),
            },
          },
          {
            identifier: 'thisWeek',
            label: 'This week',
            value: {
              start: getFirstDateOfWeek(new Date()),
              end: getFirstDateOfWeek(new Date()).setDate(
                getFirstDateOfWeek(new Date()).getDate() + 6,
              ),
            },
          },
          {
            identifier: 'thisMonth',
            label: 'This month',
            value: {
              start: new Date().setDate(1),
              end: new Date().setDate(
                getDaysInMonth(new Date().getFullYear(), new Date().getMonth()),
              ),
            },
          },
          {
            identifier: 'thisYear',
            label: 'This year',
            value: {
              start: new Date(`${new Date().getFullYear()}-01-01`),
              end: new Date(`${new Date().getFullYear()}-12-31`),
            },
          },
        ]
        return defaultShorts
      },
    },
    shortcut: { type: String, default: undefined },
    time: { type: Boolean, default: false },
    onlyTime: { type: Boolean, default: false },
    minuteInterval: { type: Number, default: 5 },
    noUseBrowserLocale: { type: Boolean, default: false },
    noFetchLocal: { type: Boolean, default: false },
  })

  const instance = getCurrentInstance()

  const currentLocale = ref<string>(props.locale || 'en-US')

  const containerUniqueId = computed(
    () => `mazPickerContainer-${instance?.uid}`,
  )

  const emits = defineEmits(['update:model-value', 'close'])

  const MazPicker = ref<HTMLDivElement>()
  const PickerContainer = ref<typeof MazPickerContainer>()

  const hasDouble = computed(() => props.double && !props.time)
  const hasDate = computed(() => !props.onlyTime)
  const hasTime = computed(() => props.time || props.onlyTime)
  const isRangeMode = computed(() => typeof props.modelValue === 'object')

  onBeforeMount(() => {
    if (isRangeMode.value && hasTime.value) {
      throw new Error(
        `[maz-ui](MazPicker) you can't use time picker with range picker`,
      )
    }
  })

  const modelValue = computed({
    get: () => props.modelValue,
    set: (value) => {
      // TODO: format output
      emitValue(value)

      if (props.autoClose && typeof props.modelValue !== 'object') {
        closeCalendar()
      }
    },
  })

  const getCurrentDateValue = () => {
    return typeof props.modelValue === 'object'
      ? getCurrentDate(props.modelValue.start)
      : props.onlyTime
      ? getCurrentDateForTimeValue(props.modelValue)
      : getCurrentDate(props.modelValue)
  }

  const currentDate = ref(getCurrentDateValue())

  const formatterOptions = computed<DateTimeFormatOptions>(() => {
    const { inputDateStyle, timeZone, inputTimeStyle, hour12 } = props

    return {
      dateStyle: inputDateStyle,
      timeStyle: hasTime.value ? inputTimeStyle : undefined,
      timeZone,
      hour12,
    }
  })

  const inputValue = computed(() => {
    if (props.onlyTime) {
      const baseDate = new Date().toISOString().split('T')[0]

      return modelValue.value
        ? date(
            new Date(`${baseDate} ${modelValue.value}`),
            currentLocale.value,
            {
              timeStyle: props.inputTimeStyle,
            },
          )
        : undefined
    } else if (typeof modelValue.value === 'object') {
      return getRangeFormattedDate({
        value: modelValue.value,
        locale: currentLocale.value,
        options: formatterOptions.value,
      })
    } else {
      return getFormattedDate({
        value: modelValue.value,
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
          currentLocale.value = browserLocale
        }
      } else if (!props.noFetchLocal) {
        const locale = await fetchLocale()

        if (locale) currentLocale.value = locale
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
        })
        if (newValue) {
          emitValue(newValue)
        }
        if (newCurrentDate) currentDate.value = newCurrentDate
      } else if (typeof value === 'object' && (value.start || value.end)) {
        // RANGE
        let newStartValue = value.start
        let newEndValue = value.end

        if (value.start) {
          const { newValue, newCurrentDate } = checkValueWithMinMaxDates({
            value: value.start,
            minDate: props.minDate,
            maxDate: props.maxDate,
          })

          if (newValue) newStartValue = newValue

          if (newCurrentDate) currentDate.value = newCurrentDate
        }
        if (value.end) {
          const { newValue } = checkValueWithMinMaxDates({
            value: value.end,
            minDate: props.minDate,
            maxDate: props.maxDate,
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

  const emitValue = (value: PickerValue) => {
    const newValue = props.onlyTime
      ? getTimeString(value as SimpleValue)
      : typeof value === 'object'
      ? getRangeISODate(value, hasTime.value)
      : getISODate(value, hasTime.value)

    emits('update:model-value', newValue)
  }

  // model value watcher
  watch(
    () => [modelValue.value, props.minDate, props.maxDate],
    (values, oldValues) => {
      const value = values[0] as PickerValue
      const oldValue = oldValues?.[0] as PickerValue

      currentDate.value = getCurrentDateValue()

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

  // Disable weekly watcher
  watch(
    () => [modelValue.value, props.disabledWeekly, props.disabledDates],
    (values) => {
      const value = values[0] as PickerValue
      const disabledWeekly = values[1] as number[]
      const disabledDates = values[2] as string[]

      if (typeof value === 'object' && (value.start || value.end)) {
        if (
          (value.start &&
            isValueDisabledWeekly({ value: value.start, disabledWeekly })) ||
          (value.start &&
            isValueDisabledDate({ value: value.start, disabledDates }))
        ) {
          modelValue.value = { start: undefined, end: value.end }
        }
        if (
          (value.end &&
            isValueDisabledWeekly({ value: value.end, disabledWeekly })) ||
          (value.end &&
            isValueDisabledDate({ value: value.end, disabledDates }))
        ) {
          modelValue.value = { start: value.start, end: undefined }
        }
      } else if (typeof value === 'string') {
        if (
          isValueDisabledWeekly({ value, disabledWeekly }) ||
          isValueDisabledDate({ value, disabledDates })
        ) {
          modelValue.value = undefined
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

    & .m-picker__button__chevron {
      @apply maz-transition-transform maz-duration-200;
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
