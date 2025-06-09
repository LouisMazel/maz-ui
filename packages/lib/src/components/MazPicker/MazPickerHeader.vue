<script lang="ts" setup>
import type { MazColor } from '../types'
import type { MazPickerValue } from './types'
import type { DateTimeFormatOptions } from './utils'
import dayjs from 'dayjs'
import { computed, ref, watch } from 'vue'
import { capitalize } from '../../formatters/capitalize'
import { date } from '../../formatters/date'

const props = defineProps<{
  modelValue: MazPickerValue | undefined
  color: MazColor
  locale: string
  hideShortcuts: boolean
  double: boolean
  hasDate: boolean
  hasTime: boolean
  formatterOptions: DateTimeFormatOptions
  calendarDate: string
}>()

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
    const dateOption = props.hideShortcuts && !props.double ? 'short' : 'long'
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
    @apply maz-bg-primary maz-text-primary-foreground;

    & .m-picker-header__year-text {
      @apply maz-text-primary-100;
    }
  }

  &.--secondary {
    @apply maz-bg-secondary maz-text-secondary;

    & .m-picker-header__year-text {
      @apply maz-text-secondary-100;
    }
  }

  &.--info {
    @apply maz-bg-info maz-text-info-foreground;

    & .m-picker-header__year-text {
      @apply maz-text-info-100;
    }
  }

  &.--success {
    @apply maz-bg-success maz-text-success-foreground;

    & .m-picker-header__year-text {
      @apply maz-text-success-100;
    }
  }

  &.--warning {
    @apply maz-bg-warning maz-text-warning-foreground;

    & .m-picker-header__year-text {
      @apply maz-text-warning-100;
    }
  }

  &.--destructive {
    @apply maz-bg-destructive maz-text-destructive-foreground;

    & .m-picker-header__year-text {
      @apply maz-text-destructive-100;
    }
  }

  &.--accent {
    @apply maz-bg-accent maz-text-accent-foreground;

    & .m-picker-header__year-text {
      @apply maz-text-accent-100;
    }
  }

  &.--contrast {
    @apply maz-bg-contrast-500 dark:maz-bg-contrast-400 maz-text-foreground dark:maz-text-foreground;

    & .m-picker-header__year-text {
      @apply maz-text-foreground;
    }
  }

  &.--transparent {
    @apply maz-border-b maz-border-divider maz-text-foreground;
  }
}
</style>
