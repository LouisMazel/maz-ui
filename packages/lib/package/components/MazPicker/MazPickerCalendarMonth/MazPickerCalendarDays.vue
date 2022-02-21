<template>
  <div class="maz-picker-calendar-days">
    <div v-for="day in days" :key="day">
      <span>
        {{ day }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { getWeekDays } from '../utils'

  const props = defineProps({
    locale: { type: String, required: true },
    firstDayOfWeek: { type: Number, required: true },
  })

  const days = getWeekDays(props.locale, props.firstDayOfWeek)
</script>

<style lang="postcss" scoped>
  .maz-picker-calendar-days {
    @apply maz-grid maz-grid-cols-7 maz-gap-2 maz-text-center;

    & span {
      @apply maz-text-xs maz-text-muted;
    }
  }
</style>
