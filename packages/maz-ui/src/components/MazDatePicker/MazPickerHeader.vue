<script lang="ts" setup>
import type { MazColor } from '../types.ts'
import type { MazDatePickerValue } from './types.ts'
import type { DateTimeFormatOptions } from './utils.ts'
import { capitalize } from '@maz-ui/utils/helpers/capitalize'
import { formatDate } from '@maz-ui/utils/helpers/formatDate'
import dayjs from 'dayjs/esm/index.js'
import { computed, ref, watch } from 'vue'
import MazRollingText from '../MazRollingText.vue'

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
  typeof modelValue === 'string'
    ? modelValue
    : modelValue?.start,
)

const rollDirection = ref<'up' | 'down'>('up')

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

const dateString = computed(() => {
  if (
    modelValue
    && typeof modelValue === 'object'
    && (modelValue.start || modelValue.end)
  ) {
    const dateOption = hideShortcuts && !double
      ? 'short'
      : 'long'
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
    return formattedDate
      ? capitalize(formattedDate)
      : undefined
  }

  return '-'
})

const timeValue = computed(() => {
  return refDate.value
    ? formatDate(refDate.value, locale, {
        timeStyle: 'short',
        timeZone: formatterOptions.timeZone,
        hour12: formatterOptions.hour12,
      })
    : undefined
})

watch(
  () => modelValue,
  (modelValue, oldModelValue) => {
    const currentValue = typeof modelValue === 'object'
      ? modelValue.start
      : modelValue
    const oldValue = typeof oldModelValue === 'object'
      ? oldModelValue.start
      : oldModelValue

    rollDirection.value
      = dayjs(currentValue).isAfter(oldValue, 'date')
        || dayjs(currentValue).isSame(oldValue, 'date')
        ? 'up'
        : 'down'
  },
)
</script>

<template>
  <div class="m-date-picker-header maz:z-1 maz:flex maz:justify-between maz:space-y-1 maz:p-2 maz:font-normal" :class="[`--${color}`]">
    <div v-if="hasDate" class="m-date-picker-header__date">
      <div class="m-date-picker-header__year-transition maz:flex maz:h-5 maz:items-center maz:overflow-hidden maz:leading-3">
        <span class="m-date-picker-header__year-text maz:text-sm maz:opacity-70">
          <MazRollingText :value="year" :direction="rollDirection" />
        </span>
      </div>
      <div class="m-date-picker-header__date-transition maz:flex maz:h-6 maz:items-center maz:overflow-hidden maz:leading-4">
        <span class="m-date-picker-header__date-text">
          <MazRollingText :value="dateString ?? ''" :direction="rollDirection" />
        </span>
      </div>
    </div>
    <div v-if="hasTime" class="m-date-picker-header__time maz:flex maz:items-end maz:justify-center" :class="{ '--has-date': hasDate, 'maz:w-full': !hasDate }">
      <div class="m-date-picker-header__time-transition maz:flex maz:h-6 maz:items-center maz:justify-end maz:overflow-hidden maz:leading-4">
        <span class="m-date-picker-header__time-text">
          <MazRollingText :value="timeValue ?? ''" :direction="rollDirection" />
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../../tailwindcss/tailwind.css";

.m-date-picker-header {
  &.--primary {
    @apply maz:bg-primary maz:text-primary-foreground;
  }

  &.--secondary {
    @apply maz:bg-secondary maz:text-secondary-foreground;
  }

  &.--info {
    @apply maz:bg-info maz:text-info-foreground;
  }

  &.--success {
    @apply maz:bg-success maz:text-success-foreground;
  }

  &.--warning {
    @apply maz:bg-warning maz:text-warning-foreground;
  }

  &.--destructive {
    @apply maz:bg-destructive maz:text-destructive-foreground;
  }

  &.--accent {
    @apply maz:bg-accent maz:text-accent-foreground;
  }

  &.--contrast {
    @apply maz:bg-contrast maz:text-contrast-foreground;
  }

  &.--neutral {
    @apply maz:border-b maz:border-divider maz:bg-neutral maz:text-neutral-foreground;
  }

  &.--transparent {
    @apply maz:border-b maz:border-divider maz:text-foreground;
  }
}

.m-date-picker-header__time:not(.--has-date) .m-date-picker-header__time-transition {
  @apply maz:w-full maz:flex-center;
}

.m-date-picker-header__time-transition {
  min-inline-size: 5rem;
}
</style>
