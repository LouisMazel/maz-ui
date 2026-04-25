<script lang="ts" setup>
import { computed } from 'vue'
import { getDaysOfWeek } from '../utils'

const props = defineProps({
  locale: { type: String, required: true },
  firstDayOfWeek: { type: Number, required: true },
})

const days = computed(() => getDaysOfWeek(props.locale, props.firstDayOfWeek))
</script>

<template>
  <div class="maz-picker-calendar-days maz:grid maz:grid-cols-7 maz:justify-between maz:gap-1 maz:text-center">
    <span v-for="label in days" :key="label" class="maz:text-xs maz:text-muted">
      {{ label }}
    </span>
  </div>
</template>
