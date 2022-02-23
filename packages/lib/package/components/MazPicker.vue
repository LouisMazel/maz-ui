<template>
  <div
    ref="MazPicker"
    v-click-outside="closeCalendar"
    class="m-picker"
    :style="style"
    :class="[
      `m-picker--${color}`,
      `m-picker--${listPositionClass.vertical}`,
      `m-picker--${listPositionClass.horizontal}`,
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
            class="m-picker__button__chevron maz-h-5 maz-w-5 maz-text-normal-text"
          />
        </button>
      </template>
    </MazInput>
    <Transition
      :name="
        listPositionClass.vertical === 'top' ? 'maz-slideinvert' : 'maz-slide'
      "
    >
      <MazPickerContainer
        v-if="isOpen"
        id="mazPickerContainer"
        ref="PickerContainer"
        v-model="modelValue"
        v-model:current-date="currentDate"
        :color="color"
        :locale="locale"
        :has-footer="hasFooter"
        :double="double"
        :no-header="noHeader"
        :min-date="minDate"
        :max-date="maxDate"
        :disabled-weekly="disabledWeekly"
        :inline="inline"
        :first-day-of-week="firstDayOfWeek"
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
    onMounted,
    onUnmounted,
    PropType,
    ref,
    StyleValue,
    watch,
  } from 'vue'
  import MazInput from './MazInput.vue'
  import MazPickerContainer from './MazPicker/MazPickerContainer.vue'
  import { vClickOutside } from './../directives/click-outside.directive'
  import ChevronDownIcon from './../icons/chevron-down.svg'
  import MazIcon from './MazIcon.vue'
  import { Color, Position } from './types'
  import {
    getCurrentDate,
    getFormattedDate,
    getRangeFormattedDate,
    getISODate,
    getRangeISODate,
    checkValueWithMinMaxDates,
    isValueDisabledWeekly,
  } from './MazPicker/utils'

  import { PickerValue } from './MazPicker/types'

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
      default: undefined,
    },
    locale: { type: String, default: 'en-US' },
    style: { type: Object as PropType<StyleValue>, default: undefined },
    noHeader: { type: Boolean, default: false },
    firstDayOfWeek: {
      type: Number,
      default: 0,
      validator: (value: number) => {
        const isValid = value >= 0 && value <= 6
        if (!isValid) {
          // eslint-disable-next-line no-console
          console.error(
            '[maz-ui](MazPicker) "first-day-of-week" should be between 0 and 6',
          )
        }
        return isValid ? true : false
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
    listPosition: {
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
        ].includes(value)
      },
    },
    disabledWeekly: { type: Array as PropType<number[]>, default: undefined },
    // unused
    // format: { type: String, default: 'YYYY-MM-DD h:mm a' },
    // formatted: { type: String, default: 'llll' },
    // disabledDates: { type: Array, default: () => [] },
    // range: { type: Boolean, default: false },
    // noKeyboard: { type: Boolean, default: false },
    // noTime: { type: Boolean, default: false },
    // noDate: { type: Boolean, default: false },
    // minuteInterval: { type: Number, default: 1 },
    // disabledHours: { type: Array, default: () => [] },
    // shortcut: { type: String, default: undefined },
    // noShortcuts: { type: Boolean, default: false },
    // shortcuts: {
    //   type: Array,
    //   default: () => [
    //     { key: 'thisWeek', label: 'This week', value: 'isoWeek' },
    //     { key: 'lastWeek', label: 'Last week', value: '-isoWeek' },
    //     { key: 'last7Days', label: 'Last 7 days', value: 7 },
    //     { key: 'last30Days', label: 'Last 30 days', value: 30 },
    //     { key: 'thisMonth', label: 'This month', value: 'month' },
    //     { key: 'lastMonth', label: 'Last month', value: '-month' },
    //     { key: 'thisYear', label: 'This year', value: 'year' },
    //     { key: 'lastYear', label: 'Last year', value: '-year' },
    //   ],
    // },
  })

  const emits = defineEmits(['update:model-value', 'close'])

  const MazPicker = ref<HTMLDivElement>()
  const PickerContainer = ref<typeof MazPickerContainer | undefined>(undefined)

  const modelValue = computed({
    get: () => props.modelValue,
    set: (value) => {
      // TODO: format output

      emitValue(value)

      if (props.autoClose) {
        closeCalendar()
      }
    },
  })

  const currentDate = ref(
    typeof props.modelValue === 'object'
      ? getCurrentDate(props.modelValue.start)
      : getCurrentDate(props.modelValue),
  )

  const inputValue = computed(() => {
    const { inputDateStyle, locale, timeZone } = props
    if (typeof modelValue.value === 'object') {
      return getRangeFormattedDate({
        value: modelValue.value,
        inputDateStyle,
        // inputTimeStyle,
        locale,
        timeZone,
      })
    }

    return getFormattedDate({
      value: modelValue.value,
      inputDateStyle,
      // inputTimeStyle,
      locale,
      timeZone,
    })
  })

  const isFocused = ref(false)
  const programaticallyOpened = ref(false)

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

  onMounted(() => {
    if (props.customElementSelector) {
      addEventToTriggerCustomElement(props.customElementSelector)
    }
  })

  onUnmounted(() => {
    if (props.customElementSelector) {
      removeEventToTriggerCustomElement(props.customElementSelector)
    }
  })

  const listPositionClass = computed<{
    vertical: 'top' | 'bottom'
    horizontal: 'left' | 'right'
  }>(() => {
    if (props.listPosition) {
      const horizontal = props.listPosition.includes('right') ? 'right' : 'left'
      const vertical = props.listPosition.includes('top') ? 'top' : 'bottom'

      return {
        horizontal,
        vertical,
      }
    } else {
      return {
        horizontal: 'left',
        vertical: calcVerticalPosition(MazPicker.value, PickerContainer.value),
      }
    }
  })

  const calcVerticalPosition = (
    parent?: HTMLDivElement,
    _pickerContainer?: typeof MazPickerContainer,
  ): 'top' | 'bottom' => {
    if (typeof window === 'undefined') {
      return 'bottom'
    }

    const OFFSET = 30

    const parentRect = parent?.getBoundingClientRect()

    const windowHeight = window.innerHeight
    const pickerHeight =
      (document.querySelector('#mazPickerContainer')?.clientHeight ?? 0) +
      OFFSET

    if (
      parentRect &&
      (parentRect.top < pickerHeight ||
        windowHeight - (parentRect.height + pickerHeight + parentRect.top) >= 0)
    ) {
      return 'bottom'
    } else {
      return 'top'
    }
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
        if (newValue) modelValue.value = newValue
        if (newCurrentDate) currentDate.value = newCurrentDate
      } else if (typeof value === 'object' && (value.start || value.end)) {
        if (value.start) {
          const { newValue, newCurrentDate } = checkValueWithMinMaxDates({
            value: value.start,
            minDate: props.minDate,
            maxDate: props.maxDate,
          })
          if (newValue) {
            modelValue.value = { start: newValue, end: value.end }
          }
          if (newCurrentDate) currentDate.value = newCurrentDate
        }
        if (value.end) {
          const { newValue } = checkValueWithMinMaxDates({
            value: value.end,
            minDate: props.minDate,
            maxDate: props.maxDate,
          })
          if (newValue) {
            modelValue.value = { start: value.start, end: newValue }
          }
        }
      }
    }
  }

  const emitValue = (value: PickerValue) => {
    value =
      typeof value === 'object' ? getRangeISODate(value) : getISODate(value)
    emits('update:model-value', value)
  }

  watch(
    () => [props.modelValue, props.minDate, props.maxDate],
    (values, oldValues) => {
      const value = values[0] as PickerValue | undefined
      const oldValue = oldValues?.[0] as PickerValue | undefined

      if (typeof value === 'object' && (value.start || value.end)) {
        if (
          typeof oldValue === 'object' &&
          (oldValue.start !== value.start || oldValue.end !== value.end)
        ) {
          emitValue(value)
        }
        checkMinMaxValues(value)
      } else if (typeof value === 'string' && value !== oldValue) {
        emitValue(value)
        checkMinMaxValues(value)
      }
    },
    { immediate: true },
  )

  watch(
    () => [props.modelValue, props.disabledWeekly],
    (values, oldValues) => {
      const value = values[0] as PickerValue | undefined
      const disabledWeekly = values[1] as number[] | undefined

      if (disabledWeekly) {
        if (typeof value === 'object' && (value.start || value.end)) {
          if (
            value.start &&
            isValueDisabledWeekly({ value: value.start, disabledWeekly })
          ) {
            modelValue.value = { start: undefined, end: value.end }
          }
          if (
            value.end &&
            isValueDisabledWeekly({ value: value.end, disabledWeekly })
          ) {
            modelValue.value = { start: value.start, end: undefined }
          }
        } else if (typeof value === 'string') {
          if (isValueDisabledWeekly({ value: value, disabledWeekly })) {
            modelValue.value = undefined
          }
        }
      }

      // if ()
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
