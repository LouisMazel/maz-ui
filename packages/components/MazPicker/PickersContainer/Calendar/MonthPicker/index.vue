<template>
  <TransitionGroup
    class="month-picker pos-r"
    :class="{ 'month-picker--long': (monthDays.length + weekStart) > 35 }"
    tag="div"
    :name="transitionDaysName"
  >
    <div
      v-for="m in [month]"
      :key="m.month"
      class="month-picker__days"
    >
      <div
        v-for="(w, i) in Array.from(Array(weekStart).keys())"
        :key="`previous-${i}`"
      />
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
          'is-keyboard-selected': isKeyboardSelected(day),
          'is-in-range': !isDisabled(day) && isBetween(day),
          'is-between-hoverred': value && value.start && !isDisabled(day) && isBetweenHoverred(day),
          'is-first-in-range': isFirstInRange(day),
          'is-last-in-range': isLastInRange(day)
        }"
        @mouseenter="$emit('hoverred-day', day)"
        @mouseleave="$emit('hoverred-day', null)"
        @click="selectDay(day)"
      >
        {{ day.format('D') }}
      </MazBtn>
    </div>
  </TransitionGroup>
</template>

<script>
  import KeyboardAccessibility from './../../../mixins/keyboard-accessibility'
  import { EventBus } from './../../../utils'

  export default {
    name: 'MonthPicker',
    mixins: [KeyboardAccessibility],
    props: {
      value: { type: Object, default: null },
      month: { type: Object, required: true },
      minDate: { type: Object, default: null },
      maxDate: { type: Object, default: null },
      noWeekendsDays: { type: Boolean, default: false },
      disabledDates: { type: Array, required: true },
      disabledWeekly: { type: Array, required: true },
      isVisible: { type: Boolean, required: true },
      hasDouble: { type: Boolean, required: true },
      hoverredDay: { type: Object, default: null }
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
        set (value) {
          const valueToEmit = this.isRangeMode
            ? value
            : value.set({
              hour: value?.hour() ?? 0,
              minute: value?.minute() ?? 0
            })
          this.$emit('input', valueToEmit)
        }
      },
      allDays () {
        return this.monthDays
      },
      monthDays () {
        return this.month.getMonthDays()
      },
      weekStart () {
        return this.month.getWeekStart()
      },
      isRangeMode () {
        return !!this.dateMoment && Object.keys(this.dateMoment).includes('start')
      }
    },
    watch: {
      month (value) {
        const newValueIsSmaller = this.currentMonth.start > value.start
        this.transitionDaysName = newValueIsSmaller ? 'slideprev' : 'slidenext'
        this.$nextTick(() => { this.currentMonth = value })
      }
    },
    mounted () {
      if (this.noWeekendsDays && this.isWeekEndDay(this.dateMoment)) {
        console.warn(`MazPicker: the value provide is a weekend day and you use the option 'no-weekends-days'`)
      }
      if (this.isDateDisabled(this.dateMoment)) {
        console.warn(`MazPicker: the value provide is a disabled date by th option 'disabled-dates'`)
      }
    },
    methods: {
      isToday (day) {
        return day.isSame(new Date(), 'day')
      },
      isBetweenHoverred (day) {
        if (!this.isRangeMode || this.dateMoment.end) return false
        return day.isBetween(this.dateMoment.start, this.hoverredDay, null, '[]')
      },
      isBetween (day) {
        if (!this.isRangeMode) return false
        return day.isBetween(this.dateMoment.start, this.dateMoment.end, null, '[]')
      },
      isFirstInRange (day) {
        if (!this.isRangeMode) return false
        return day.isSame(this.dateMoment.start, 'day')
      },
      isLastInRange (day) {
        if (!this.isRangeMode) return false
        return day.isSame(this.dateMoment.end, 'day')
      },
      isSelectedDate (day) {
        return this.isRangeMode
          ? (this.dateMoment?.start?.isSame(day, 'day') ?? false) || (this.dateMoment?.end?.isSame(day, 'day') ?? false)
          : this.dateMoment ? this.dateMoment.isSame(day, 'day') : false
      },
      isDisabled (day) {
        return day.isBefore(this.minDate) ||
          day.isAfter(this.maxDate) ||
          (this.noWeekendsDays && this.isWeekEndDay(day)) ||
          this.isDateDisabled(day) ||
          this.isDayDisabledWeekly(day)
      },
      isWeekEndDay (day) {
        const dayConst = day.day()
        const weekendsDaysNumbers = [6, 0]
        return this.noWeekendsDays ? weekendsDaysNumbers.indexOf(dayConst) > -1 : false
      },
      isDateDisabled (day) {
        return this.disabledDates.some(d => d.isSame(day, 'day'))
      },
      isDayDisabledWeekly (day) {
        const dayConst = day.day()
        return this.disabledWeekly.includes(dayConst)
      },
      isKeyboardSelected (day) {
        return day.isSame(this.keyboardSelectedDay, 'day')
      },
      selectDay (day) {
        EventBus.$emit('day-selected')
        let valueToSend = day
        if (this.isRangeMode) {
          const { start, end } = this.dateMoment
          if (!start || (start && end) || day.isBefore(this.dateMoment.start)) {
            valueToSend = {
              start: day,
              end: null
            }
          } else {
            valueToSend = {
              start: this.dateMoment.start,
              end: day
            }
          }
        }

        this.dateMoment = valueToSend
      }
    }
  }
</script>

<style lang="scss" scoped>
  .month-picker {
    min-height: 194px;
    min-width: 268px;
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

      &.is-between-hoverred {
        color: white;
        background-color: rgba($primary-color, .4);
      }

      &.is-in-range {
        color: white;
        background-color: rgba($primary-color, .6);
        width: calc(100% + 5px);

        &:not(.active) {
          border-radius: 0;
        }

        &.active:not(.is-last-in-range) {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }

        &.is-last-in-range:not(.is-first-in-range) {
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
