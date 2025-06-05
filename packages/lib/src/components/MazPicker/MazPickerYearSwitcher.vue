<script lang="ts" setup>
import type { Dayjs } from 'dayjs'
import type { PropType } from 'vue'
import type { MazColor } from '../types'
import ChevronLeft from '@maz-ui/icons/svg/chevron-left.svg'
import XMark from '@maz-ui/icons/svg/x-mark.svg'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'

import { date } from '../../formatters/date'
import MazBtn from '../MazBtn.vue'

import { isSameDate } from './utils'

const props = defineProps({
  color: { type: String as PropType<MazColor>, required: true },
  locale: { type: String, required: true },
  calendarDate: { type: String, required: true },
})

const emits = defineEmits(['update:calendar-date', 'close'])

const currentDateTmp = ref(props.calendarDate)

const years = computed<
  {
    label: string
    date: Dayjs
  }[]
>(() => {
  return Array.from({ length: 15 }, (_v, i) => i - 7).map((yearNumber) => {
    const currentYear = dayjs(currentDateTmp.value).get('year')
    const dateYear = dayjs(currentDateTmp.value).set('year', currentYear + yearNumber)

    return {
      label: date(dateYear.format(), props.locale, {
        year: 'numeric',
      }),
      date: dateYear,
    }
  })
})

function selectYear(date: Dayjs) {
  emits('update:calendar-date', dayjs(date).format())
  emits('close')
}

function previousYears() {
  currentDateTmp.value = dayjs(currentDateTmp.value).subtract(7, 'year').format()
}
function nextYears() {
  currentDateTmp.value = dayjs(currentDateTmp.value).add(7, 'year').format()
}
</script>

<template>
  <div class="maz-picker-year-switcher">
    <div class="maz-picker-year-switcher__header">
      <div class="maz-flex maz-space-x-2">
        <MazBtn size="xs" color="transparent" type="button" @click.stop="previousYears">
          <ChevronLeft class="maz-text-lg" />
        </MazBtn>
        <MazBtn size="xs" color="transparent" type="button" @click.stop="nextYears">
          <ChevronLeft class="maz-rotate-180 maz-text-lg" />
        </MazBtn>
      </div>
      <MazBtn size="xs" color="transparent" type="button" @click.stop="$emit('close', $event)">
        <XMark class="maz-text-lg" />
      </MazBtn>
    </div>
    <div class="maz-picker-year-switcher__main">
      <MazBtn
        v-for="year in years"
        :key="year.label"
        size="sm"
        type="button"
        :class="{
          '--is-selected': isSameDate(year.date, calendarDate, 'year'),
        }"
        :color="isSameDate(year.date, calendarDate, 'year') ? color : 'transparent'"
        @click.stop="selectYear(year.date)"
      >
        {{ year.label }}
      </MazBtn>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  .maz-picker-year-switcher {
  @apply maz-absolute maz-inset-0 maz-z-1 maz-flex maz-flex-col maz-bg-color;

  &__header {
    @apply maz-flex maz-justify-between maz-space-x-2 maz-border-b maz-border-color-lighter maz-p-2;
  }

  &__main {
    @apply maz-grid maz-flex-1 maz-grid-cols-3 maz-gap-2 maz-overflow-y-auto maz-p-2 maz-flex-center;
  }
}
</style>
