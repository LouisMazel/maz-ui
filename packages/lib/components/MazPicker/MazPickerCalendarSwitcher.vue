<template>
  <div class="m-picker-calendar-switcher">
    <MazBtn size="xs" color="transparent" type="button" @click="previousMonth">
      <ChevronLeftIcon />
    </MazBtn>
    <MazBtn
      size="sm"
      color="transparent"
      type="button"
      class="m-picker-calendar-switcher__date"
      @click="$emit('open-month-switcher', $event)"
    >
      {{ monthLabel }}
    </MazBtn>
    <MazBtn
      size="sm"
      color="transparent"
      type="button"
      class="m-picker-calendar-switcher__date"
      @click="$emit('open-year-switcher', $event)"
    >
      {{ yearLabel }}
    </MazBtn>
    <MazBtn size="xs" color="transparent" type="button" @click="nextMonth">
      <ChevronRightIcon />
    </MazBtn>
  </div>
</template>

<script lang="ts" setup>
  import ChevronLeftIcon from './../../icons/chevron-left.svg'
  import ChevronRightIcon from './../../icons/chevron-right.svg'
  import MazBtn from '../MazBtn.vue'
  import { computed } from 'vue'
  import { capitalize } from './../../modules/filters/capitalize'
  import { date } from './../../modules/filters/date'
  import dayjs from 'dayjs'

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
          date(calendarDate2.value.format(), props.locale, { month: 'long' }),
        )} - ${capitalize(
          date(calendarDate2.value.add(1, 'month').format(), props.locale, {
            month: 'long',
          }),
        )}`
      : capitalize(date(calendarDate2.value.format(), props.locale, { month: 'long' }))
  })

  const yearLabel = computed(() =>
    date(calendarDate2.value.format(), props.locale, { year: 'numeric' }),
  )

  const previousMonth = () => {
    emits('update:calendar-date', dayjs(props.calendarDate).subtract(1, 'month').format())
  }

  const nextMonth = () => {
    emits('update:calendar-date', dayjs(props.calendarDate).add(1, 'month').format())
  }
</script>

<style lang="postcss" scoped>
  .m-picker-calendar-switcher {
    @apply maz-flex maz-space-x-2 maz-border-b maz-border-color-lighter maz-px-2 maz-py-1;

    &__date {
      @apply maz-flex-1 maz-truncate maz-text-center;
    }
  }
</style>
