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
  import { cloneDate } from './utils'

  const props = defineProps({
    modelValue: { type: String, default: undefined },
    locale: { type: String, required: true },
    currentDate: { type: Date, required: true },
    double: { type: Boolean, required: true },
  })

  const emits = defineEmits([
    'previous',
    'next',
    'update:current-date',
    'open-month-switcher',
    'open-year-switcher',
  ])

  const clonedCurrentDate = computed(() => cloneDate(props.currentDate))

  const monthLabel = computed(() => {
    const clonedDate = cloneDate(props.currentDate)
    return props.double
      ? `${capitalize(
          date(clonedDate, props.locale, { month: 'long' }),
        )} - ${capitalize(
          date(clonedDate.setMonth(clonedDate.getMonth() + 1), props.locale, {
            month: 'long',
          }),
        )}`
      : capitalize(date(clonedDate, props.locale, { month: 'long' }))
  })

  const yearLabel = computed(() =>
    date(clonedCurrentDate.value, props.locale, { year: 'numeric' }),
  )

  const previousMonth = () => {
    const value = cloneDate(
      clonedCurrentDate.value.setMonth(clonedCurrentDate.value.getMonth() - 1),
    )
    emits('update:current-date', value)
  }

  const nextMonth = () => {
    const value = cloneDate(
      clonedCurrentDate.value.setMonth(clonedCurrentDate.value.getMonth() + 1),
    )
    emits('update:current-date', value)
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
