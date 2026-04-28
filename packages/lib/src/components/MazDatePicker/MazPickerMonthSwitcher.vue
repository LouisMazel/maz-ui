<script lang="ts" setup>
import type { Dayjs } from 'dayjs'
import type { PropType } from 'vue'
import type { MazColor } from '../types'
import { MazXMark } from '@maz-ui/icons/raw/MazXMark'
import { capitalize } from '@maz-ui/utils/helpers/capitalize'
import { formatDate } from '@maz-ui/utils/helpers/formatDate'
import dayjs from 'dayjs'
import { computed } from 'vue'

import MazBtn from '../MazBtn.vue'

import MazIcon from '../MazIcon.vue'
import { isSameDate } from './utils'

const props = defineProps({
  calendarDate: { type: String, required: true },
  color: { type: String as PropType<MazColor>, required: true },
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
            formatDate(monthDate.format(), props.locale, {
              month: 'short',
            }) ?? monthDate.add(1, 'month').format(),
          )} - ${capitalize(
            formatDate(monthDate.add(1, 'month').format(), props.locale, {
              month: 'short',
            }) ?? monthDate.add(1, 'month').format(),
          )}`,
          date: monthDate,
        }
      : {
          label: capitalize(
            formatDate(monthDate.format(), props.locale, {
              month: 'long',
            }) ?? monthDate.format(),
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
  <div class="maz-picker-month-switcher maz:absolute maz:inset-0 maz:z-1 maz:flex maz:flex-col maz:bg-container">
    <div class="maz-picker-month-switcher__header maz:flex maz:justify-end maz:border-b maz:border-divider maz:p-2">
      <MazBtn size="xs" color="transparent" type="button" @click.stop="$emit('close', $event)">
        <MazIcon :icon="MazXMark" class="maz:text-lg" />
      </MazBtn>
    </div>
    <div class="maz-picker-month-switcher__main maz:grid maz:flex-1 maz:gap-1 maz:overflow-y-auto maz:p-2 maz:flex-center" :class="[double ? '--has-double' : '', double ? 'maz:grid-cols-3' : 'maz:grid-cols-2']">
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

<style scoped>
@reference "../../tailwindcss/tailwind.css";

.maz-picker-month-switcher__main > button {
  @apply maz:h-full!;
}
</style>
