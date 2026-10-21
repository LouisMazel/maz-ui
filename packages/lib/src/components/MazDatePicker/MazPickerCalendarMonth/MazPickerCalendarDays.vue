<script lang="ts" setup>
import { computed } from 'vue'
import { getDaysOfWeek } from '../utils'

const props = defineProps({
  locale: { type: String, required: true },
  firstDayOfWeek: { type: Number, required: true },
})

const days = computed(() => getDaysOfWeek(props.locale, props.firstDayOfWeek))
const longDays = computed(() => getDaysOfWeek(props.locale, props.firstDayOfWeek, 'long'))
</script>

<template>
  <div role="row" class="maz-picker-calendar-days maz:grid maz:grid-cols-7 maz:justify-between maz:gap-1 maz:text-center">
    <span
      v-for="(label, index) in days"
      :key="label"
      role="columnheader"
      :aria-label="longDays[index]"
      class="maz:text-xs maz:text-muted"
    >
      {{ label }}
    </span>
  </div>
</template>
