<template>
  <div class="maz-picker-calendar-days">
    <span v-for="label in days" :key="label">
      {{ label }}
    </span>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { getDaysOfWeek } from '../utils'

  const props = defineProps({
    locale: { type: String, required: true },
    firstDayOfWeek: { type: Number, required: true },
  })

  const days = computed(() => getDaysOfWeek(props.locale, props.firstDayOfWeek))
</script>

<style lang="postcss" scoped>
  .maz-picker-calendar-days {
    @apply maz-grid maz-grid-cols-7 maz-justify-between maz-gap-1 maz-text-center;

    & span {
      @apply maz-text-xs maz-text-muted;
    }
  }
</style>
