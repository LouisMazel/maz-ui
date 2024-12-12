<script lang="ts" setup>
import type { PickerValue } from '@components/MazPicker/types'
import type { DateTimeFormatOptions } from '@components/MazPicker/utils'
import type { Color } from '@components/types'
import { capitalize } from '@filters/capitalize'
import { date } from '@filters/date'
import dayjs from 'dayjs'
import { computed, type PropType, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Object] as PropType<PickerValue>,
    default: undefined,
  },
  color: { type: String as PropType<Color>, required: true },
  locale: { type: String, required: true },
  noShortcuts: { type: Boolean, required: true },
  double: { type: Boolean, required: true },
  hasDate: { type: Boolean, required: true },
  hasTime: { type: Boolean, required: true },
  formatterOptions: {
    type: Object as PropType<DateTimeFormatOptions>,
    required: true,
  },
  calendarDate: { type: String, required: true },
})

const refDate = computed(() =>
  typeof props.modelValue === 'string' ? props.modelValue : props.modelValue?.start,
)

const transitionName = ref<'maz-slidevnext' | 'maz-slidevprev'>('maz-slidevnext')

const year = computed(() => {
  if (props.modelValue && typeof props.modelValue === 'object') {
    return `${
      props.modelValue.start
        ? date(props.modelValue.start, props.locale, {
          year: 'numeric',
          timeZone: props.formatterOptions.timeZone,
        })
        : '...'
    } - ${
      props.modelValue.end
        ? date(props.modelValue.end, props.locale, {
          year: 'numeric',
          timeZone: props.formatterOptions.timeZone,
        })
        : '...'
    }`
  }
  else if (typeof props.modelValue === 'string') {
    return date(props.modelValue, props.locale, {
      year: 'numeric',
      timeZone: props.formatterOptions.timeZone,
    })
  }

  return '-'
})

const yearArray = computed(() => (props.hasDate ? [year.value] : undefined))

const dateString = computed(() => {
  if (
    props.modelValue
    && typeof props.modelValue === 'object'
    && (props.modelValue.start || props.modelValue.end)
  ) {
    const dateOption = props.noShortcuts && !props.double ? 'short' : 'long'
    return `${
      props.modelValue.start
        ? capitalize(
          date(props.modelValue.start, props.locale, {
            weekday: dateOption,
            month: dateOption,
            day: 'numeric',
            timeZone: props.formatterOptions.timeZone,
          }),
        )
        : '...'
    } - ${
      props.modelValue.end
        ? capitalize(
          date(props.modelValue.end, props.locale, {
            weekday: dateOption,
            month: dateOption,
            day: 'numeric',
            timeZone: props.formatterOptions.timeZone,
          }),
        )
        : '...'
    }`
  }
  else if (typeof props.modelValue === 'string') {
    return capitalize(
      date(props.modelValue, props.locale, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        timeZone: props.formatterOptions.timeZone,
      }),
    )
  }

  return '-'
})

const dateStringArray = computed(() => (props.hasDate ? [dateString.value] : undefined))

const timeValue = computed(() => {
  return refDate.value
    ? date(refDate.value, props.locale, {
      timeStyle: 'short',
      timeZone: props.formatterOptions.timeZone,
      hour12: props.formatterOptions.hour12,
    })
    : undefined
})

const timeArray = computed(() => (props.hasTime ? [timeValue.value] : undefined))

watch(
  () => props.modelValue,
  (modelValue, oldModelValue) => {
    const currentValue = typeof modelValue === 'object' ? modelValue.start : modelValue
    const oldValue = typeof oldModelValue === 'object' ? oldModelValue.start : oldModelValue

    transitionName.value
        = dayjs(currentValue).isAfter(oldValue, 'date')
        || dayjs(currentValue).isSame(oldValue, 'date')
        ? 'maz-slidevnext'
        : 'maz-slidevprev'
  },
)
</script>

<template>
  <div class="m-picker-header" :class="[`--${color}`]">
    <div v-if="hasDate" class="m-picker-header__date">
      <TransitionGroup :name="transitionName" tag="div" class="m-picker-header__year-transition">
        <span v-for="(y, yi) in yearArray" :key="`${y}-${yi}`" class="m-picker-header__year-text">
          {{ y }}
        </span>
      </TransitionGroup>
      <TransitionGroup :name="transitionName" tag="div" class="m-picker-header__date-transition">
        <span
          v-for="(d, di) in dateStringArray"
          :key="`${d}-${di}`"
          class="m-picker-header__date-text"
        >
          {{ d }}
        </span>
      </TransitionGroup>
    </div>
    <div v-if="timeArray" class="m-picker-header__time" :class="{ '--has-date': hasDate }">
      <TransitionGroup :name="transitionName" tag="div" class="m-picker-header__time-transition">
        <span v-for="(t, ti) in timeArray" :key="`${t}-${ti}`" class="m-picker-header__time-text">
          {{ t }}
        </span>
      </TransitionGroup>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  .m-picker-header {
  @apply maz-z-1 maz-flex maz-justify-between maz-space-y-1 maz-p-2 maz-font-normal;

  &__year-transition {
    @apply maz-flex maz-h-5 maz-items-center maz-overflow-hidden maz-leading-3;
  }

  &__date-transition,
  &__time-transition {
    @apply maz-flex maz-h-6 maz-items-center maz-overflow-hidden maz-leading-4;
  }

  &__time-transition {
    @apply maz-flex maz-justify-end;

    min-width: 5rem;
  }

  &__year-text {
    @apply maz-text-sm;
  }

  &__time {
    @apply maz-flex maz-items-end maz-justify-center;

    &:not(.--has-date) {
      @apply maz-w-full;

      & .m-picker-header__time-transition {
        @apply maz-w-full maz-flex-center;
      }
    }
  }

  &.--primary {
    @apply maz-bg-primary maz-text-primary-contrast;

    & .m-picker-header__year-text {
      @apply maz-text-primary-100;
    }
  }

  &.--secondary {
    @apply maz-bg-secondary maz-text-secondary-contrast;

    & .m-picker-header__year-text {
      @apply maz-text-secondary-100;
    }
  }

  &.--info {
    @apply maz-bg-info maz-text-info-contrast;

    & .m-picker-header__year-text {
      @apply maz-text-info-100;
    }
  }

  &.--success {
    @apply maz-bg-success maz-text-success-contrast;

    & .m-picker-header__year-text {
      @apply maz-text-success-100;
    }
  }

  &.--warning {
    @apply maz-bg-warning maz-text-warning-contrast;

    & .m-picker-header__year-text {
      @apply maz-text-warning-100;
    }
  }

  &.--danger {
    @apply maz-bg-danger maz-text-danger-contrast;

    & .m-picker-header__year-text {
      @apply maz-text-danger-100;
    }
  }

  &.--black {
    @apply maz-bg-black maz-text-black-contrast;
  }

  &.--white {
    @apply maz-bg-white maz-text-white-contrast;

    & .m-picker-header__year-text {
      @apply maz-text-muted;
    }
  }

  &.--transparent {
    @apply maz-border-b maz-border-color-light maz-text-normal;
  }
}
</style>
