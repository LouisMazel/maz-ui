<template>
  <div class="maz-picker-calendar-days">
    <span v-for="{ label } in days" :key="label">
      {{ label }}
    </span>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { getWeekDays } from '../utils'

  const props = defineProps({
    locale: { type: String, required: true },
    firstDayOfWeek: { type: Number, required: true },
  })

  const days = computed(() => getWeekDays(props.locale, props.firstDayOfWeek))
</script>

<style lang="postcss" scoped>
  .maz-picker-calendar-days {
    @apply maz-flex maz-w-full maz-justify-between maz-space-x-2 maz-px-1 maz-text-center;

    & span {
      @apply maz-text-xs maz-text-muted;
    }
  }
</style>
