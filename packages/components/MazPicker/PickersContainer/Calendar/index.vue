<template>
  <div
    :id="`Calendar${_uid}`"
    ref="Calendar"
    class="calendar pos-r mw-100 over-hid"
  >
    <MonthYearSwitcher
      :months="months"
      class="px-2"
      @change-month="changeMonth"
      @open-month-year-selector="yearMonthSelectorMode = $event"
    />
    <div class="flex">
      <div
        v-for="(month, i) in months"
        :key="`month-${i}`"
        class="calendar__months flex-1"
        :class="{ 'has-double': hasDouble }"
      >
        <WeekDaysLabels
          :locale="locale"
          class="p-2"
        />
        <MonthPicker
          ref="MonthPicker"
          v-model="dateMoment"
          :month="month"
          :min-date="minDate"
          :max-date="maxDate"
          :has-keyboard="hasKeyboard"
          :has-double="hasDouble"
          :no-weekends-days="noWeekendsDays"
          :disabled-dates="disabledDates"
          :disabled-weekly="disabledWeekly"
          :is-visible="isVisible"
          class="p-2"
          @change-month="changeMonth"
        />
      </div>
    </div>
    <YearMonthSelector
      v-model="yearMonthSelectorMode"
      :month="months[0]"
      :has-double="hasDouble"
      @change-month-year="changeMonthYear"
    />
  </div>
</template>

<script>
  import WeekDaysLabels from './WeekDaysLabels'
  import MonthPicker from './MonthPicker'
  import MonthYearSwitcher from './MonthYearSwitcher'
  import YearMonthSelector from './YearMonthSelector'
  import Month from './../../modules/month'

  export default {
    name: 'Calendar',
    components: { WeekDaysLabels, MonthPicker, MonthYearSwitcher, YearMonthSelector },
    props: {
      value: { type: Object, required: true },
      locale: { type: String, default: null },
      minDate: { type: Object, default: null },
      maxDate: { type: Object, default: null },
      noWeekendsDays: { type: Boolean, default: false },
      disabledDates: { type: Array, required: true },
      disabledWeekly: { type: Array, required: true },
      isVisible: { type: Boolean, default: false },
      hasDouble: { type: Boolean, required: true },
      hasKeyboard: { type: Boolean, required: true }
    },
    data () {
      return {
        months: null,
        yearMonthSelectorMode: null
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
      currentValue () {
        return this.value.end ? this.value.end : this.value
      }
    },
    watch: {
      value: {
        handler (newValue, oldValue) {
          // update months if use click on a day of next or previous month
          if (
            !this.months ||
            (
              !this.hasDouble &&
            (newValue.month() !== oldValue.month() && !this.checkIfValueIsInMonths(newValue.month()))
            )
          ) {
            if (this.months) this.focusCurrentDay()
            this.months = this.getMonth({
              year: this.currentValue.year(),
              month: this.currentValue.month()
            })
            // re-focus the current day to active the trigger blur for close the date picker on clik outside
          }
        },
        immediate: true
      }
    },
    methods: {
      focusCurrentDay () {
        setTimeout(() => {
          const elem = document.querySelector(`#Calendar${this._uid} .month-picker__day.active`)
          if (elem) elem.focus()
        }, 500)
      },
      checkIfValueIsInMonths (newMonth) {
        return this.months.some(m => m.month === newMonth)
      },
      changeMonth (val) {
        let month = this.months[0].month + (val === 'prev' ? -1 : +1)
        let year = this.months[0].year
        if (month > 11 || month < 0) {
          year += (val === 'prev' ? -1 : +1)
          month = (val === 'prev' ? 11 : 0)
        }
        this.months = this.getMonth({ year, month })
      },
      changeMonthYear (payload) {
        this.months = this.getMonth(payload)
      },
      getMonth ({ month, year }) {
        const number = Array.from(Array(this.hasDouble ? 2 : 1).keys())
        return number.map((i) => {
          const newMonthNumber = month + i
          const monthNumber = newMonthNumber === 12 ? 0 : newMonthNumber
          const yearNumber = newMonthNumber === 12 ? year + 1 : year
          return new Month(monthNumber, yearNumber, this.locale)
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .calendar__months.has-double {
    border-top: 2px solid $hover-color;
  }

  .is-dark .calendar__months.has-double {
    border-color: $hover-color-dark;
  }
</style>
