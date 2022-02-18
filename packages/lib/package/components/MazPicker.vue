<template>
  <div
    ref="MazPicker"
    v-click-outside="closeCalendar"
    class="m-picker"
    :style="style"
    :class="[
      `m-picker--${color}`,
      {
        '--is-open': isOpen,
      },
    ]"
    @keydown.esc="closeCalendar"
  >
    <MazInput
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
        :no-header="noHeader"
        :first-day-of-week="firstDayOfWeek"
      />
    </Transition>
  </div>
</template>

<script lang="ts" setup>
  import { computed, Prop, PropType, ref, StyleValue } from 'vue'
  import MazInput from './MazInput.vue'
  import MazPickerContainer from './MazPicker/MazPickerContainer.vue'
  import { vClickOutside } from './../directives/click-outside.directive'
  import ChevronDownIcon from './../icons/chevron-down.svg'
  import MazIcon from './MazIcon.vue'
  import { Color } from './types'
  import { getCurrentDate, getFormattedDate } from './MazPicker/utils'

  const props = defineProps({
    modelValue: {
      validator: (prop) =>
        ['string'].includes(typeof prop) || prop === undefined,
      required: true,
    } as Prop<undefined | string>,
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
    firstDayOfWeek: { type: Number, default: 0 },
    autoClose: { type: Boolean, default: false },
    // not completed
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
    // unused
    // listPosition: { type: String, default: undefined },
    // format: { type: String, default: 'YYYY-MM-DD h:mm a' },
    // formatted: { type: String, default: 'llll' },
    // minDate: { type: String, default: undefined },
    // maxDate: { type: String, default: undefined },
    // persistent: { type: Boolean, default: false },
    // noFooter: { type: Boolean, default: false },
    // noNow: { type: Boolean, default: false },
    // nowTranslation: { type: String, default: 'Now' },
    // noWeekendsDays: { type: Boolean, default: false },
    // inline: { type: Boolean, default: false },
    // disabledDates: { type: Array, default: () => [] },
    // disabledWeekly: { type: Array, default: () => [] },
    // double: { type: Boolean, default: false },
    // range: { type: Boolean, default: false },
    // noKeyboard: { type: Boolean, default: false },
    // noTime: { type: Boolean, default: false },
    // noDate: { type: Boolean, default: false },
    // minuteInterval: { type: Number, default: 1 },
    // disabledHours: { type: Array, default: () => [] },
    // noOverlay: { type: Boolean, default: false },
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

  const inputValue = computed(() =>
    getFormattedDate({
      value: modelValue.value,
      inputDateStyle: props.inputDateStyle,
      // inputTimeStyle: props.inputTimeStyle,
      locale: props.locale,
      timeZone: props.timeZone,
    }),
  )

  const isFocused = ref(false)
  const isOpen = computed(() => isFocused.value || props.open)

  const closeCalendar = () => {
    isFocused.value = false
    emits('close')
  }
</script>

<style lang="postcss" scoped>
  .m-picker {
    @apply maz-relative;

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
