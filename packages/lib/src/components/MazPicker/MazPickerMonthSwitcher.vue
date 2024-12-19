<script lang="ts" setup>
import type { Color } from '../types'
import dayjs, { type Dayjs } from 'dayjs'
import { computed, type PropType } from 'vue'
import XIcon from '../../../icons/x-mark.svg'
import { capitalize } from '../../filters/capitalize'

import { date } from '../../filters/date'

import MazBtn from '../MazBtn.vue'
import { isSameDate } from './utils'

const props = defineProps({
  calendarDate: { type: String, required: true },
  color: { type: String as PropType<Color>, required: true },
  locale: { type: String, required: true },
  double: { type: Boolean, required: true },
})

const emits = defineEmits(['update:calendar-date', 'close'])

const months = computed<
  {
    label: string
    date: Dayjs
  }[]
>(() => {
  return Array.from({ length: 12 }, (_v, i) => i).map((monthNumber) => {
    const monthDate = dayjs(props.calendarDate).set('month', monthNumber)

    return props.double
      ? {
          label: `${capitalize(
            date(monthDate.format(), props.locale, {
              month: 'short',
            }),
          )} - ${capitalize(
            date(monthDate.add(1, 'month').format(), props.locale, {
              month: 'short',
            }),
          )}`,
          date: monthDate,
        }
      : {
          label: capitalize(
            date(monthDate.format(), props.locale, {
              month: 'long',
            }),
          ),
          date: monthDate,
        }
  })
})

function selectMonth(date: Dayjs) {
  emits('update:calendar-date', date.format())
  emits('close')
}
</script>

<template>
  <div class="maz-picker-month-switcher">
    <div class="maz-picker-month-switcher__header">
      <MazBtn size="xs" color="transparent" type="button" @click.stop="$emit('close', $event)">
        <XIcon class="maz-text-lg" />
      </MazBtn>
    </div>
    <div class="maz-picker-month-switcher__main" :class="{ '--has-double': double }">
      <MazBtn
        v-for="month in months"
        :key="month.label"
        :size="props.double ? 'sm' : 'xs'"
        :class="{
          '--is-selected': isSameDate(month.date, calendarDate, 'month'),
        }"
        :color="isSameDate(month.date, calendarDate, 'month') ? color : 'transparent'"
        type="button"
        @click.stop="selectMonth(month.date)"
      >
        {{ month.label }}
      </MazBtn>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  .maz-picker-month-switcher {
  @apply maz-absolute maz-inset-0 maz-z-1 maz-flex maz-flex-col maz-bg-color;

  &__header {
    @apply maz-flex maz-justify-end maz-border-b maz-border-color-lighter maz-p-2;
  }

  &__main {
    @apply maz-grid maz-flex-1 maz-grid-cols-2 maz-gap-1 maz-overflow-y-auto maz-p-2 maz-flex-center;

    &.--has-double {
      @apply maz-grid-cols-3;
    }

    & > button {
      @apply maz-h-full !important;
    }
  }
}
</style>
