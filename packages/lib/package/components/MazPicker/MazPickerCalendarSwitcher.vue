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
    >
      {{ month }}
    </MazBtn>
    <MazBtn
      size="sm"
      color="transparent"
      class="m-picker-calendar-switcher__date"
    >
      {{ year }}
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

  const props = defineProps({
    modelValue: { type: String, default: undefined },
    locale: { type: String, required: true },
    currentDate: { type: Date, required: true },
  })

  const emits = defineEmits(['previous', 'next', 'update:current-date'])

  const month = computed(() => {
    return capitalize(date(props.currentDate, props.locale, { month: 'long' }))
  })
  const year = computed(() =>
    date(props.currentDate, props.locale, { year: 'numeric' }),
  )

  const previousMonth = () => {
    const value = new Date(
      props.currentDate.setMonth(props.currentDate.getMonth() - 1),
    )
    emits('update:current-date', value)
  }

  const nextMonth = () => {
    const value = new Date(
      props.currentDate.setMonth(props.currentDate.getMonth() + 1),
    )
    emits('update:current-date', value)
  }
</script>

<style lang="postcss" scoped>
  .m-picker-calendar-switcher {
    @apply maz-flex maz-space-x-2;

    &__date {
      @apply maz-flex-1 maz-text-center;
    }
  }
</style>
