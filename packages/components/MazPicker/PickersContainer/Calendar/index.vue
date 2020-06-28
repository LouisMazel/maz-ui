<template>
  <div
    :id="`Calendar${_uid}`"
    ref="Calendar"
    class="calendar maz-position-relative maz-mw-100 maz-overflow-hidden maz-flex"
    :class="{
      'is-range': isRangeMode
    }"
  >
    <RangeShortcuts
      v-if="hasShortcuts"
      ref="RangeShortcuts"
      :shortcuts="shortcuts"
      :value="shortcut"
      :color="color"
      :height="contentHeight"
      @change-range="$emit('input', $event)"
    />
    <div
      v-if="hasDate"
      ref="MonthsContainer"
      class="calendar__months-container maz-overflow-hidden maz-flex-1"
    >
      <MonthYearSwitcher
        :months="months"
        class="maz-px-2"
        @change-month="changeMonth"
        @open-month-year-selector="yearMonthSelectorMode = $event"
      />
      <div class="maz-flex maz-overflow-x-auto">
        <div
          v-for="(month, i) in months"
          :key="`month-${i}`"
          class="calendar__months maz-flex-1"
          style="min-width: 268px;"
          :class="{ 'has-double maz-border-top maz-border-top-solid maz-border-color': hasDouble }"
        >
          <WeekDaysLabels
            :locale="locale"
            class="maz-p-2"
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
            class="maz-p-2"
            @change-month="changeMonth"
            @hoverred-day="hoverredDay = $event"
          />
        </div>
      </div>
      <YearMonthSelector
        v-if="months.length"
        v-model="yearMonthSelectorMode"
        :month="months[0]"
        :color="color"
        :has-double="hasDouble"
        @change-month-year="changeMonthYear"
      />
    </div>
    <TimePicker
      v-if="hasTime"
      v-model="dateMoment"
      :format="format"
      :height="contentHeight"
      :min-date="minDate"
      :max-date="maxDate"
      :has-date="hasDate"
      :minute-interval="minuteInterval"
      :disabled-hours="disabledHours"
      :behaviour="behaviour"
    />
  </div>
</template>

<script>
import WeekDaysLabels from './WeekDaysLabels'
import MonthPicker from './MonthPicker'
import MonthYearSwitcher from './MonthYearSwitcher'
import YearMonthSelector from './YearMonthSelector'
import RangeShortcuts from './RangeShortcuts'
import TimePicker from './TimePicker'
import Month from './../../modules/month'

import moment from 'moment'

const CONTENT_HEIGHT = 275

export default {
  name: 'Calendar',
  components: {
    WeekDaysLabels,
    MonthPicker,
    MonthYearSwitcher,
    YearMonthSelector,
    RangeShortcuts,
    TimePicker
  },
  props: {
    value: { type: Object, default: null },
    format: { type: String, default: null },
    shortcut: { type: String, default: null },
    locale: { type: String, default: null },
    color: { type: String, default: null },
    minDate: { type: Object, default: null },
    maxDate: { type: Object, default: null },
    noWeekendsDays: { type: Boolean, default: false },
    disabledDates: { type: Array, required: true },
    disabledWeekly: { type: Array, required: true },
    isVisible: { type: Boolean, default: false },
    hasDouble: { type: Boolean, required: true },
    hasKeyboard: { type: Boolean, required: true },
    shortcuts: { type: Array, default: null },
    hasShortcuts: { type: Boolean, required: true },
    hasTime: { type: Boolean, required: true },
    hasDate: { type: Boolean, required: true },
    minuteInterval: { type: Number, required: true },
    disabledHours: { type: Array, required: true },
    behaviour: { type: Object, required: true }
  },
  data () {
    return {
      months: [],
      yearMonthSelectorMode: null,
      hoverredDay: null,
      contentHeight: CONTENT_HEIGHT
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
      const { value } = this
      if (this.isRangeMode) {
        return value.end || value.start || moment()
      }
      return value || moment()
    }
  },
  watch: {
    value: {
      handler (newValue, oldValue) {
        const newCurrentValue = this.isRangeMode && newValue
          ? newValue.end || newValue.start
          : newValue
        const oldCurrentValue = this.isRangeMode && oldValue
          ? oldValue.end || oldValue.start
          : oldValue

        if (
          !this.months.length || this.isDifferentYear(newCurrentValue, oldCurrentValue) ||
          (this.monthsAreDifferent(newCurrentValue, oldCurrentValue) && !this.valueIsInMonths(newCurrentValue.month()))
        ) {
          const { value } = this
          const currentYear = this.currentValue.year()
          const currentMonth = this.currentValue.month()
          const hasRangeValuesOnDifferentsMonths = value && value.start && value.end && value.start.month() !== value.end.month()
          this.months = this.getMonths({
            year: currentYear,
            month: hasRangeValuesOnDifferentsMonths ? currentMonth - 1 : currentMonth
          })
        }
      },
      immediate: true
    },
    months: {
      async handler () {
        this.contentHeight = CONTENT_HEIGHT
        await this.$nextTick()
        const { MonthsContainer } = this.$refs
        this.contentHeight = MonthsContainer && MonthsContainer.clientHeight ? MonthsContainer.clientHeight : CONTENT_HEIGHT
      },
      immediate: true
    }
  },
  methods: {
    monthsAreDifferent (newValue, oldValue) {
      if (!newValue || !oldValue) return false
      return newValue.month() !== oldValue.month()
    },
    valueIsInMonths (newMonth) {
      return this.months.some(m => m.month === newMonth)
    },
    isDifferentYear (newCurrentValue, oldCurrentValue) {
      if (!newCurrentValue || !oldCurrentValue) return false
      return newCurrentValue.year() !== oldCurrentValue.year()
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
      const numberOfMonths = Array.from(Array(this.hasDouble ? 2 : 1).keys())
      return numberOfMonths.map((i) => {
        const newMonthNumber = month + i
        const monthNumber = newMonthNumber === 12 ? 0 : newMonthNumber
        const yearNumber = newMonthNumber === 12 ? year + 1 : year
        return new Month(monthNumber, yearNumber, this.locale)
      })
    }
  }
}
</script>
