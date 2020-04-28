<template>
  <div class="month-picker">
    <div
      v-for="(start, i) in weekStart"
      :key="`${i}-empty-day`"
      class="month-picker__empty-day"
    />
    <MazBtn
      v-for="(day, i) in monthDays"
      :key="i"
      tabindex="-1"
      class="month-picker__day text-color bg-color-light"
      size="mini"
      no-shadow
      @click="selectDay(day)"
    >
      {{ day.format('D') }}
    </MazBtn>
  </div>
</template>

<script>
  import Month from '../../../modules/month'

  export default {
    name: 'MonthPicker',
    props: {
      dateMoment: { type: Object, required: true }
    },
    computed: {
      month () {
        return new Month(this.dateMoment.month(), this.dateMoment.year())
      },
      monthDays () {
        return this.month.getMonthDays()
      },
      weekStart () {
        return this.month.getWeekStart()
      }
    },
    methods: {
      selectDay (day) {
        console.log('day', day.format('YYYY-MM-DD'))
      }
    }
  }
</script>

<style lang="scss" scoped>
  .month-picker {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-gap: 10px;
    justify-items: center;

    &__day {
      padding: 0;
      width: 35px;
      height: 35px;
      font-size: .875em;
    }
  }
</style>
