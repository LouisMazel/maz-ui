<template>
  <div class="m-picker-calendar-switcher">
    <MazBtn
      size="mini"
      color="transparent"
      type="button"
      @click="previousMonth"
    >
      <MazIcon :src="ChevronLeftIcon" size="1.2rem" />
    </MazBtn>
    <MazBtn
      size="sm"
      color="transparent"
      class="m-picker-calendar-switcher__date"
      @click="$emit('open-month-switcher', $event)"
    >
      {{ monthLabel }}
    </MazBtn>
    <MazBtn
      size="sm"
      color="transparent"
      class="m-picker-calendar-switcher__date"
      @click="$emit('open-year-switcher', $event)"
    >
      {{ yearLabel }}
    </MazBtn>
    <MazBtn size="mini" color="transparent" type="button" @click="nextMonth">
      <MazIcon :src="ChevronRightIcon" size="1.2rem" />
    </MazBtn>
  </div>
</template>

<script lang="ts" setup>
  import ChevronLeftIcon from './../../icons/chevron-left.svg'
  import ChevronRightIcon from './../../icons/chevron-right.svg'
  import MazIcon from '../MazIcon.vue'
  import MazBtn from '../MazBtn.vue'
  import { computed } from 'vue'
  import { date, capitalize } from '../../filters'
  import dayjs from 'dayjs'

  const props = defineProps({
    modelValue: { type: String, default: undefined },
    calendarDate: { type: String, default: undefined },
    locale: { type: String, required: true },
    double: { type: Boolean, required: true },
  })

  const emits = defineEmits([
    'previous',
    'next',
    'open-month-switcher',
    'open-year-switcher',
    'update:current-date',
  ])

  const currentDate = computed(() => dayjs(props.modelValue))

  const monthLabel = computed(() => {
    return props.double
      ? `${capitalize(
          date(currentDate.value.format(), props.locale, { month: 'long' }),
        )} - ${capitalize(
          date(currentDate.value.add(1, 'month').format(), props.locale, {
            month: 'long',
          }),
        )}`
      : capitalize(
          date(currentDate.value.format(), props.locale, { month: 'long' }),
        )
  })

  const yearLabel = computed(() =>
    date(currentDate.value.format(), props.locale, { year: 'numeric' }),
  )

  const previousMonth = () => {
    emits(
      'update:current-date',
      dayjs(props.calendarDate).subtract(1, 'month').format(),
    )
  }

  const nextMonth = () => {
    emits(
      'update:current-date',
      dayjs(props.calendarDate).add(1, 'month').format(),
    )
  }
</script>

<style lang="postcss" scoped>
  .m-picker-calendar-switcher {
    @apply maz-flex maz-space-x-2 maz-border-b maz-border-color-lighter maz-py-1 maz-px-2;

    &__date {
      @apply maz-flex-1 maz-truncate maz-text-center;
    }
  }
</style>
