<template>
  <div
    :id="`Calendar${_uid}`"
    ref="Calendar"
    class="calendar pos-r mw-100 overflow-hidden flex"
  >
    <!-- !noShortcuts -->
    <!-- :value="shortcut" -->
    <RangeShortcuts
      v-if="isRangeMode"
      ref="RangeShortcuts"
      :shortcuts="shortcuts"
      :height="200"
      @change-range="$emit('input', $event)"
    />
    <div class="overflow-hidden flex-1 flex-fixed">
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
          :class="{ 'has-double border-top border-top-solid border-color': hasDouble }"
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
            :hoverred-day="hoverredDay"
            :is-visible="isVisible"
            class="p-2"
            @change-month="changeMonth"
            @hoverred-day="hoverredDay = $event"
          />
        </div>
      </div>
      <YearMonthSelector
        v-if="months.length"
        v-model="yearMonthSelectorMode"
        :month="months[0]"
        :has-double="hasDouble"
        @change-month-year="changeMonthYear"
      />
    </div>
  </div>
</template>

<script>
  import WeekDaysLabels from './WeekDaysLabels'
  import MonthPicker from './MonthPicker'
  import MonthYearSwitcher from './MonthYearSwitcher'
  import YearMonthSelector from './YearMonthSelector'
  import RangeShortcuts from './RangeShortcuts'
  import Month from './../../modules/month'

  import moment from 'moment'

  export default {
    name: 'Calendar',
    components: {
      WeekDaysLabels,
      MonthPicker,
      MonthYearSwitcher,
      YearMonthSelector,
      RangeShortcuts
    },
    props: {
      value: { type: Object, default: null },
      locale: { type: String, default: null },
      minDate: { type: Object, default: null },
      maxDate: { type: Object, default: null },
      noWeekendsDays: { type: Boolean, default: false },
      disabledDates: { type: Array, required: true },
      disabledWeekly: { type: Array, required: true },
      isVisible: { type: Boolean, default: false },
      hasDouble: { type: Boolean, required: true },
      hasKeyboard: { type: Boolean, required: true },
      shortcuts: { type: Array, default: null }
    },
    data () {
      return {
        months: [],
        yearMonthSelectorMode: null,
        hoverredDay: null
      }
    },
    computed: {
      dateMoment: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('input', value)
        }
      },
      isRangeMode () {
        return !!this.value && Object.keys(this.value).includes('start')
      },
      currentValue () {
        if (this.isRangeMode) {
          return this.value.start || moment()
        }
        return this.value || moment()
      }
    },
    watch: {
      value: {
        handler (newValue, oldValue) {
          if (
            !this.months.length || (!this.hasDouble && this.monthsAreDifferent(newValue, oldValue) && !this.valueIsInMonths(newValue.month()))
          ) {
            // re-focus the current day to active the trigger blur for close the date picker on clik outside
            if (this.months) this.focusCurrentDay()
            this.months = this.getMonths({
              year: this.currentValue.year(),
              month: this.currentValue.month()
            })
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
      monthsAreDifferent (newValue, oldValue) {
        if (!newValue || !oldValue) return false
        return newValue.month() !== oldValue.month()
      },
      valueIsInMonths (newMonth) {
        return this.months.some(m => m.month === newMonth)
      },
      changeMonth (val) {
        let month = this.months[0].month + (val === 'prev' ? -1 : +1)
        let year = this.months[0].year
        if (month > 11 || month < 0) {
          year += (val === 'prev' ? -1 : +1)
          month = (val === 'prev' ? 11 : 0)
        }
        this.months = this.getMonths({ year, month })
      },
      changeMonthYear (payload) {
        this.months = this.getMonths(payload)
      },
      getMonths ({ month, year }) {
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
