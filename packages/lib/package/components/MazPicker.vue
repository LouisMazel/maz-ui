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
    <Transition name="maz-slide">
      <MazPickerContainer
        v-if="isOpen"
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

<script lang="ts" setup>
  import {
    computed,
    onMounted,
    onUnmounted,
    Prop,
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
    isBigger,
    isSameDay,
    isSmaller,
  } from './MazPicker/utils'

  const props = defineProps({
    modelValue: {
      validator: (prop) =>
        ['string'].includes(typeof prop) || prop === undefined,
      required: true,
    } as Prop<undefined | string>,
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
      default: 'bottom left',
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

  const modelValue = computed({
    get: () => props.modelValue,
    set: (value) => {
      // TODO: format output
      emits('update:model-value', value)
      if (props.autoClose) {
        closeCalendar()
      }
    },
  })

  const currentDate = ref(getCurrentDate(props.modelValue))

  const inputValue = computed(() => {
    const { inputDateStyle, locale, timeZone } = props
    return getFormattedDate({
      value: modelValue.value,
      inputDateStyle,
      // inputTimeStyle: inputTimeStyle,
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

  const listPositionClass = computed(() => {
    const vertical = props.listPosition.includes('top') ? 'top' : 'bottom'
    const horizontal = props.listPosition.includes('right') ? 'right' : 'left'

    return {
      vertical,
      horizontal,
    }
  })

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

  const checkValueWithMinMaxDates = (value: string) => {
    if (props.minDate && isSmaller(value, props.minDate)) {
      modelValue.value = props.minDate
      currentDate.value = getCurrentDate(props.minDate)
    } else if (props.maxDate && isBigger(value, props.maxDate)) {
      modelValue.value = props.maxDate
      currentDate.value = getCurrentDate(props.maxDate)
    }
    if (props.disabledWeekly) {
      const isDisabled = props.disabledWeekly.some((dayNumber) =>
        isSameDay(new Date(value), dayNumber),
      )
      if (isDisabled) {
        modelValue.value = undefined
      }
    }
  }

  watch(
    () => props.modelValue,
    (value) => (value ? checkValueWithMinMaxDates(value) : undefined),
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
