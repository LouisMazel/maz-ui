<script lang="ts" setup>
import type { MazColor } from '../types'
import type { MazDatePickerValue } from './types'
import type { DateTimeFormatOptions } from './utils'
import { capitalize } from '@maz-ui/utils/helpers/capitalize'
import { formatDate } from '@maz-ui/utils/helpers/formatDate'
import dayjs from 'dayjs'
import { computed, ref, watch } from 'vue'

const {
  modelValue,
  color,
  locale,
  hideShortcuts,
  double,
  hasDate,
  hasTime,
  formatterOptions,
} = defineProps<{
  modelValue: MazDatePickerValue | undefined
  color: MazColor
  locale: string
  hideShortcuts: boolean
  double: boolean
  hasDate: boolean
  hasTime: boolean
  formatterOptions: DateTimeFormatOptions
}>()

const refDate = computed(() =>
  typeof modelValue === 'string' ? modelValue : modelValue?.start,
)

const transitionName = ref<'maz-slidevnext' | 'maz-slidevprev'>('maz-slidevnext')

const year = computed(() => {
  if (modelValue && typeof modelValue === 'object') {
    return `${
      modelValue.start
        ? formatDate(modelValue.start, locale, {
            year: 'numeric',
            timeZone: formatterOptions.timeZone,
          })
        : '...'
    } - ${
      modelValue.end
        ? formatDate(modelValue.end, locale, {
            year: 'numeric',
            timeZone: formatterOptions.timeZone,
          })
        : '...'
    }`
  }
  else if (typeof modelValue === 'string') {
    return formatDate(modelValue, locale, {
      year: 'numeric',
      timeZone: formatterOptions.timeZone,
    })
  }

  return '-'
})

const yearArray = computed(() => (hasDate ? [year.value] : undefined))

const dateString = computed(() => {
  if (
    modelValue
    && typeof modelValue === 'object'
    && (modelValue.start || modelValue.end)
  ) {
    const dateOption = hideShortcuts && !double ? 'short' : 'long'
    return `${
      modelValue.start
        ? capitalize(
            formatDate(modelValue.start, locale, {
              weekday: dateOption,
              month: dateOption,
              day: 'numeric',
              timeZone: formatterOptions.timeZone,
            }) ?? modelValue.start,
          )
        : '...'
    } - ${
      modelValue.end
        ? capitalize(
            formatDate(modelValue.end, locale, {
              weekday: dateOption,
              month: dateOption,
              day: 'numeric',
              timeZone: formatterOptions.timeZone,
            }) ?? modelValue.end,
          )
        : '...'
    }`
  }
  else if (typeof modelValue === 'string') {
    const formattedDate = formatDate(modelValue, locale, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      timeZone: formatterOptions.timeZone,
    })
    return formattedDate ? capitalize(formattedDate) : undefined
  }

  return '-'
})

const dateStringArray = computed(() => (hasDate ? [dateString.value] : undefined))

const timeValue = computed(() => {
  return refDate.value
    ? formatDate(refDate.value, locale, {
        timeStyle: 'short',
        timeZone: formatterOptions.timeZone,
        hour12: formatterOptions.hour12,
      })
    : undefined
})

const timeArray = computed(() => (hasTime ? [timeValue.value] : undefined))

watch(
  () => modelValue,
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
  <div class="m-date-picker-header" :class="[`--${color}`]">
    <div v-if="hasDate" class="m-date-picker-header__date">
      <TransitionGroup :name="transitionName" tag="div" class="m-date-picker-header__year-transition">
        <span v-for="(y, yi) in yearArray" :key="`${y}-${yi}`" class="m-date-picker-header__year-text">
          {{ y }}
        </span>
      </TransitionGroup>
      <TransitionGroup :name="transitionName" tag="div" class="m-date-picker-header__date-transition">
        <span
          v-for="(d, di) in dateStringArray"
          :key="`${d}-${di}`"
          class="m-date-picker-header__date-text"
        >
          {{ d }}
        </span>
      </TransitionGroup>
    </div>
    <div v-if="timeArray" class="m-date-picker-header__time" :class="{ '--has-date': hasDate }">
      <TransitionGroup :name="transitionName" tag="div" class="m-date-picker-header__time-transition">
        <span v-for="(t, ti) in timeArray" :key="`${t}-${ti}`" class="m-date-picker-header__time-text">
          {{ t }}
        </span>
      </TransitionGroup>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  .m-date-picker-header {
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

      & .m-date-picker-header__time-transition {
        @apply maz-w-full maz-flex-center;
      }
    }
  }

  &.--primary {
    @apply maz-bg-primary maz-text-primary-foreground;
  }

  &.--secondary {
    @apply maz-bg-secondary maz-text-secondary-foreground;
  }

  &.--info {
    @apply maz-bg-info maz-text-info-foreground;
  }

  &.--success {
    @apply maz-bg-success maz-text-success-foreground;
  }

  &.--warning {
    @apply maz-bg-warning maz-text-warning-foreground;
  }

  &.--destructive {
    @apply maz-bg-destructive maz-text-destructive-foreground;
  }

  &.--accent {
    @apply maz-bg-accent maz-text-accent-foreground;
  }

  &.--contrast {
    @apply maz-bg-contrast-500 dark:maz-bg-contrast-400 maz-text-foreground dark:maz-text-foreground;
  }

  &.--transparent {
    @apply maz-border-b maz-border-divider maz-text-foreground;
  }
}
</style>
