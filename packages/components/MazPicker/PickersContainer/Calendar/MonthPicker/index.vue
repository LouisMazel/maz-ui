<template>
  <TransitionGroup
    class="month-picker maz-position-relative"
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
        class="month-picker__day maz-text-color maz-bg-color-light maz-flex maz-flex-center"
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
            hour: this?.value?.hour() ?? 0,
            minute: this?.value?.minute() ?? 0
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
      throw new Error('[MazPicker]: the value provide is a weekend day and you use the option \'no-weekends-days\'')
    }
    if (this.isDateDisabled(this.dateMoment)) {
      throw new Error('[MazPicker]: the value provide is a disabled date by the option \'disabled-dates\'')
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
