<template>
  <div class="week-days-labels">
    <div
      v-for="(days, i) in weekDays"
      :key="i"
      class="week-days-labels__days text-muted"
    >
      {{ days | capitalize }}
    </div>
  </div>
</template>

<script>
  import { getWeekDays } from '../../../modules/Month'

  export default {
    name: 'WeekDaysLabes',
    computed: {
      weekDays () {
        return getWeekDays(this.locale)
        // this.firstDayOfWeek
      }
    }
  }
</script>

<style lang="scss" scoped>
  .week-days-labels {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-gap: 10px;
    justify-items: center;
    font-size: .875em;
  }
</style>
