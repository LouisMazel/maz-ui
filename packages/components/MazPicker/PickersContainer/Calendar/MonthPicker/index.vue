<template>
  <TransitionGroup
    class="month-picker"
    :class="{ 'month-picker--long': (monthDays.length + weekStart) > 35 }"
    tag="div"
    :name="transitionDaysName"
  >
    <div
      v-for="m in [month]"
      :key="m.month"
      class="month-picker__days"
    >
      <MazBtn
        v-for="(day, i) in allDays"
        :key="i"
        class="month-picker__day text-color bg-color-light flex flex-center"
        size="mini"
        tabindex="-1"
        :no-shadow="!isSelectedDate(day)"
        :disabled="isDisabled(day)"
        :active="isSelectedDate(day)"
        :class="{
          'highlight': isToday(day),
          'is-disabled text-muted fw-400': !isSameMonth(day),
          'is-keyboard-selected': isKeyboardSelected(day),
          'is-in-range': isBetween(day) && !isDisabled(day),
          'is-last-in-range': isLastInRange(day)
        }"
        @click="selectDay(day)"
      >
        {{ hasDouble && isDisabled(day) ? null : day.format('D') }}
      </MazBtn>
    </div>
  </TransitionGroup>
</template>

<script>
  import KeyboardAccessibility from './../../../mixins/keyboard-accessibility'
  export default {
    name: 'MonthPicker',
    mixins: [KeyboardAccessibility],
    props: {
      value: { type: Object, required: true },
      month: { type: Object, required: true },
      minDate: { type: Object, default: null },
      maxDate: { type: Object, default: null },
      noWeekendsDays: { type: Boolean, default: false },
      disabledDates: { type: Array, required: true },
      disabledWeekly: { type: Array, required: true },
      isVisible: { type: Boolean, required: true },
      hasDouble: { type: Boolean, required: true }
    },
    data () {
      return {
        transitionDaysName: 'slidenext',
        currentMonth: this.month
      }
    },
    computed: {
      dateMoment: {
        get () {
          return this.value
        },
        set (day) {
          this.$emit('input', day)
        }
      },
      allDays () {
        return [
          ...this.previousMonthDays,
          ...this.monthDays,
          ...this.nextMonthDays
        ]
      },
      previousMonthDays () {
        return this.month.getPreviousMonthDays()
      },
      monthDays () {
        return this.month.getMonthDays()
      },
      nextMonthDays () {
        return this.month.getNextMonthDays()
      },
      weekStart () {
        return this.month.getWeekStart()
      },
      isRangeMode () {
        return !!this.value.start
      }
    },
    watch: {
      month (value) {
        const newValueIsSmaller = this.currentMonth.start > value.start
        this.transitionDaysName = newValueIsSmaller ? 'slideprev' : 'slidenext'
        this.$nextTick(() => { this.currentMonth = value })
      },
      value: {
        handler (value) {
          if (this.noWeekendsDays && this.isWeekEndDay(value)) {
            console.warn(`MazPicker: the value provide is a weekend day and you use the option 'no-weekends-days'`)
          }
          if (this.isDateDisabled(value)) {
            console.warn(`MazPicker: the value provide is a disabled date by th option 'disabled-dates'`)
          }
        },
        immediate: true
      }
    },
    methods: {
      isToday (day) {
        return day.isSame(new Date(), 'day')
      },
      isBetween (day) {
        return day.isBetween(this.value.start, this.value.end, null, '[]')
      },
      isLastInRange (day) {
        return day.isSame(this.value.end)
      },
      isSelectedDate (day) {
        return this.isRangeMode
          ? this.dateMoment.start.isSame(day, 'day') || this.dateMoment.end.isSame(day, 'day')
          : this.dateMoment.isSame(day, 'day')
      },
      isDisabled (day) {
        return day.isBefore(this.minDate) ||
          day.isAfter(this.maxDate) ||
          (this.noWeekendsDays && this.isWeekEndDay(day)) ||
          this.isDateDisabled(day) ||
          this.isDayDisabledWeekly(day) ||
          (!this.isSameMonth(day) && this.hasDouble)
      },
      isWeekEndDay (day) {
        const dayConst = day.day()
        const weekendsDaysNumbers = [6, 0]
        return this.noWeekendsDays ? weekendsDaysNumbers.indexOf(dayConst) > -1 : false
      },
      isSameMonth (day) {
        return this.month.month === day.month()
      },
      isDateDisabled (day) {
        return this.disabledDates.some(d => d.isSame(day))
      },
      isDayDisabledWeekly (day) {
        const dayConst = day.day()
        return this.disabledWeekly.includes(dayConst)
      },
      isKeyboardSelected (day) {
        return day.isSame(this.keyboardSelectedDay)
      },
      selectDay (day) {
        if (!this.isRangeMode) {
          this.dateMoment = day
          return
        }
        if (day.isBefore(this.value.start)) {
          this.dateMoment = {
            start: day,
            end: null
          }
        } else {
          this.dateMoment = {
            ...this.dateMoment.start,
            end: day
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .month-picker {
    min-height: 194px;
    min-width: 300px;
    width: 100%;
    overflow: hidden;

    &--long {
      min-height: 231px;
    }

    &__days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-gap: 5px;
      width: 100%;
      justify-items: center;
    }

    &__day {
      $day-size: 32px;

      padding: 0;
      width: $day-size;
      height: $day-size;
      font-size: 1em;
      z-index: 1;
      position: relative;

      &.highlight:not(.active):not(.btn--disabled)::before,
      &.is-keyboard-selected:not(.active)::before {
        $circle-size: 26px;

        content: '';
        position: absolute;
        height: $circle-size;
        width: $circle-size;
        border-radius: $circle-size;
        background-color: rgba(black, .15);
        z-index: -1;
      }

      &.is-keyboard-selected {
        font-weight: 700;

        &:not(.active)::before {
          border-radius: $border-radius;
          background-color: rgba(black, .15);
        }
      }

      &.is-in-range {
        color: white;
        // position: absolute;
        // left: -5px;
        // right: -5px;
        background-color: rgba($primary-color, .6);
        width: calc(100% + 5px);

        &:not(.active) {
          border-radius: 0;
        }

        &.active:not(.is-last-in-range) {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }

        &.is-last-in-range {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      }

      &.active:not(:disabled) {
        color: white;
        background-color: $primary-color;
        font-weight: 600;
      }

      &:hover {
        color: white;
        background-color: rgba($primary-color, .4);
      }

      &:disabled {
        color: rgba(black, .25);
        background-color: transparent;
        border: none;
      }
    }
  }
</style>
