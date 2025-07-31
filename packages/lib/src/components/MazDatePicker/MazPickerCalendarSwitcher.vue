<script lang="ts" setup>
import { MazChevronLeft } from '@maz-ui/icons'
import { capitalize } from '@maz-ui/utils/src/helpers/capitalize.js'
import { formatDate } from '@maz-ui/utils/src/helpers/formatDate.js'

import dayjs from 'dayjs'
import { computed } from 'vue'
import MazBtn from '../MazBtn.vue'

const props = defineProps({
  calendarDate: { type: String, default: undefined },
  locale: { type: String, required: true },
  double: { type: Boolean, required: true },
})

const emits = defineEmits([
  'previous',
  'next',
  'open-month-switcher',
  'open-year-switcher',
  'update:calendar-date',
])

const calendarDate2 = computed(() => dayjs(props.calendarDate))

const monthLabel = computed(() => {
  return props.double
    ? `${capitalize(
      formatDate(calendarDate2.value.format(), props.locale, { month: 'short' }) ?? calendarDate2.value.format(),
    )} - ${capitalize(
      formatDate(calendarDate2.value.add(1, 'month').format(), props.locale, {
        month: 'short',
      }) ?? calendarDate2.value.add(1, 'month').format(),
    )}`
    : capitalize(formatDate(calendarDate2.value.format(), props.locale, { month: 'short' }) ?? calendarDate2.value.format())
})

const yearLabel = computed(() =>
  formatDate(calendarDate2.value.format(), props.locale, { year: 'numeric' }),
)

function previousMonth() {
  emits('update:calendar-date', dayjs(props.calendarDate).subtract(1, 'month').format())
}

function nextMonth() {
  emits('update:calendar-date', dayjs(props.calendarDate).add(1, 'month').format())
}
</script>

<template>
  <div class="m-date-picker-calendar-switcher">
    <MazBtn size="xs" color="transparent" type="button" @click="previousMonth">
      <MazChevronLeft class="maz-text-lg" />
    </MazBtn>
    <MazBtn
      size="sm"
      color="transparent"
      type="button"
      class="m-date-picker-calendar-switcher__date"
      @click="$emit('open-month-switcher', $event)"
    >
      {{ monthLabel }}
    </MazBtn>
    <MazBtn
      size="sm"
      color="transparent"
      type="button"
      class="m-date-picker-calendar-switcher__date"
      @click="$emit('open-year-switcher', $event)"
    >
      {{ yearLabel }}
    </MazBtn>
    <MazBtn size="xs" color="transparent" type="button" @click="nextMonth">
      <MazChevronLeft class="maz-rotate-180 maz-text-lg" />
    </MazBtn>
  </div>
</template>

<style lang="postcss" scoped>
  .m-date-picker-calendar-switcher {
  @apply maz-flex maz-space-x-2 maz-border-b maz-border-divider maz-px-2 maz-py-1;

  &__date {
    @apply maz-flex-1 maz-truncate maz-text-center;
  }
}
</style>
