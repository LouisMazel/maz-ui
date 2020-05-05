<template>
  <div class="week-days-labels">
    <div
      v-for="(days, i) in weekDays"
      :key="i"
      class="week-days-labels__days maz-text-muted maz-fs-11"
    >
      {{ days | capitalize }}
    </div>
  </div>
</template>

<script>
import { getWeekDays } from '../../../modules/month'

export default {
  name: 'WeekDaysLabes',
  props: {
    locale: { type: String, default: null }
  },
  computed: {
    weekDays () {
      return getWeekDays(this.locale)
    }
  }
}
</script>
