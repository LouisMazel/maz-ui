<template>
  <div
    :id="`${id}-DatePicker`"
    :class="{'flex-1 inline': inline, 'p-0 range flex-1': range, 'is-dark': dark, 'has-shortcuts': range && !noShortcuts}"
    class="datepicker-container flex flex-fixed"
  >
    <RangeShortcuts
      v-if="range && !noShortcuts"
      ref="range-shortcuts"
      :value="shortcut"
      :color="color"
      :dark="dark"
      :custom-shortcuts="customShortcuts"
      :height="height"
      @change-range="$emit('input', $event)"
    />
    <div class="calendar w-100">
      <div class="datepicker-controls flex flex-center">
        <div class="arrow-month h-100">
          <button
            type="button"
            tabindex="-1"
            class="datepicker-button datepicker-prev text-center h-100 flex align-center"
            @click="changeMonth('prev')"
          >
            <svg viewBox="0 0 1000 1000">
              <path
                d="M336.2 274.5l-210.1 210h805.4c13 0 23 10 23 23s-10 23-23 23H126.1l210.1 210.1c11
                11 11 21 0 32-5 5-10 7-16 7s-11-2-16-7l-249.1-249c-11-11-11-21 0-32l249.1-249.1c21-21.1 53 10.9 32 32z"
              />
            </svg>
          </button>
        </div>
        <div
          class="datepicker-container-label flex-1 flex justify-center"
        >
          <TransitionGroup
            :name="transitionLabelName"
            class="h-100 flex align-center flex-1 flex justify-end"
          >
            <CustomButton
              v-for="m in [month]"
              :key="m.month"
              class="date-buttons fs-16 padding-button"
              :color="color"
              :dark="dark"
              @click="selectingYearMonth = 'month'"
            >
              {{ monthFormatted }}
            </CustomButton>
          </TransitionGroup>
          <TransitionGroup
            :name="transitionLabelName"
            class="h-100 flex align-center flex-1 flex"
          >
            <CustomButton
              v-for="y in [year]"
              :key="y"
              class="date-buttons fs-16 padding-button"
              :color="color"
              :dark="dark"
              @click="selectingYearMonth = 'year'"
            >
              {{ year }}
            </CustomButton>
          </TransitionGroup>
        </div>
        <div class="arrow-month h-100 text-right">
          <button
            type="button"
            tabindex="-1"
            class="datepicker-button datepicker-next text-center h-100 flex align-center justify-end"
            @click="changeMonth('next')"
          >
            <svg viewBox="0 0 1000 1000">
              <path d="M694.4 242.4l249.1 249.1c11 11 11 21 0 32L694.4 772.7c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210.1-210.1H67.1c-13 0-23-10-23-23s10-23 23-23h805.4L662.4 274.5c-21-21.1 11-53.1 32-32.1z" />
            </svg>
          </button>
        </div>
      </div>
      <WeekDays
        :week-days="weekDays"
        :dark="dark"
      />
      <div
        :style="{height: (monthDays.length + weekStart) > 35 ? '250px' : '210px'}"
        class="month-container"
      >
        <TransitionGroup :name="transitionDaysName">
          <div
            v-for="m in [month]"
            :key="m.month"
            class="datepicker-days flex"
          >
            <div
              v-for="start in weekStart"
              :key="start + 'startEmptyDay'"
              class="datepicker-day flex flex-center"
            />
            <button
              v-for="day in monthDays"
              :key="day.format('D')"
              :class="{
                selected: isSelected(day) && !isDisabled(day),
                disabled: (isDisabled(day) || isWeekEndDay(day)),
                enable: !(isDisabled(day) || isWeekEndDay(day)),
                between: isBetween(day) && range,
                first: firstInRange(day) && range,
                last: lastInRange(day) && !!value.end && range
              }"
              :disabled="isDisabled(day) || isWeekEndDay(day)"
              type="button"
              tabindex="-1"
              class="datepicker-day flex flex-center"
              @click="selectDate(day)"
            >
              <span
                v-if="isToday(day)"
                class="datepicker-today"
              />
              <span
                v-show="!isDisabled(day) || isSelected(day)"
                :style="bgStyle"
                class="datepicker-day-effect"
              />
              <span
                v-if="isKeyboardSelected(day)"
                class="datepicker-day-keyboard-selected"
              />
              <span class="datepicker-day-text flex-1">
                {{ day.format('D') }}
              </span>
            </button>
            <div
              v-for="end in endEmptyDays"
              :key="end + 'endEmptyDay'"
              class="datepicker-day flex flex-center"
            />
          </div>
        </TransitionGroup>
      </div>
      <YearMonthSelector
        v-if="selectingYearMonth"
        :locale="locale"
        :color="color"
        :dark="dark"
        :mode="selectingYearMonth"
        :month="month"
        @input="selectYearMonth"
        @back="selectingYearMonth = null"
      />
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import { getWeekDays } from '../../../../modules/month'
  import RangeShortcuts from './_subs/RangeShortcuts'
  import YearMonthSelector from './_subs/YearMonthSelector'
  import WeekDays from './_subs/WeekDays'
  import CustomButton from '../../../../_subs/CustomButton'
  import KeyboardAccessibility from '../../../../mixins/keyboard-accessibility'

  export default {
    name: 'DatePicker',
    components: {
      RangeShortcuts, YearMonthSelector, WeekDays, CustomButton
    },
    mixins: [KeyboardAccessibility],
    props: {
      id: { type: String, default: null },
      value: { type: [String, Object], default: null },
      shortcut: { type: String, default: null },
      color: { type: String, default: null },
      minDate: { type: String, default: null },
      maxDate: { type: String, default: null },
      locale: { type: String, default: null },
      inline: { type: Boolean, default: null },
      noWeekendsDays: { type: Boolean, default: null },
      disabledWeekly: { type: Array, default: Array },
      range: { type: Boolean, default: false },
      disabledDates: { type: Array, default: Array },
      enabledDates: { type: Array, default: Array },
      dark: { type: Boolean, default: false },
      month: { type: Object, default: null },
      height: { type: Number, default: null },
      noShortcuts: { type: Boolean, default: null },
      firstDayOfWeek: { type: Number, default: null },
      customShortcuts: { type: Array, default: Array },
      visible: { type: Boolean, default: null }
    },
    data () {
      return {
        transitionDaysName: 'slidenext',
        transitionLabelName: 'slidevnext',
        selectingYearMonth: null,
        isKeyboardActive: true
      }
    },
    computed: {
      bgStyle () {
        return {
          backgroundColor: this.color
        }
      },
      endEmptyDays () {
        const getDays = (this.monthDays.length + this.weekStart) > 35
        const number = getDays ? 42 : 35
        return number - this.monthDays.length - this.weekStart
      },
      monthDays () {
        return this.month.getMonthDays()
      },
      weekStart () {
        return this.month.getWeekStart()
      },
      monthFormatted () {
        return `${this.month.getFormatted()}`
      },
      year () {
        return `${this.month.getYear()}`
      },
      weekDays () {
        return getWeekDays(this.locale, this.firstDayOfWeek)
      }
    },
    methods: {
      isKeyboardSelected (day) {
        return day && this.newValue ? day.format('YYYY-MM-DD') === this.newValue.format('YYYY-MM-DD') : null
      },
      isToday (day) {
        return moment(day.format('YYYY-MM-DD')).isSame(moment().format('YYYY-MM-DD'))
      },
      isDisabled (day) {
        return (
          this.isDateDisabled(day) ||
          !this.isDateEnabled(day) ||
          this.isBeforeMinDate(day) ||
          this.isAfterEndDate(day) ||
          this.isDayDisabledWeekly(day) ||
          (this.isWeekEndDay(day) && this.noWeekendsDays)
        )
      },
      isDateDisabled (day) {
        return this.disabledDates.indexOf(day.format('YYYY-MM-DD')) > -1
      },
      isDateEnabled (day) {
        return this.enabledDates.length === 0 || this.enabledDates.indexOf(day.format('YYYY-MM-DD')) > -1
      },
      isBeforeMinDate (day) {
        return day.isBefore(moment(this.minDate, 'YYYY-MM-DD'))
      },
      isAfterEndDate (day) {
        return moment(day).isAfter(this.maxDate)
      },
      isSelected (day) {
        const date = [
          ...(this.value && this.value.start
            ? [moment(this.value.start).format('YYYY-MM-DD')]
            : this.range ? [] : [moment(this.value).format('YYYY-MM-DD')]),
          ...(this.value && this.value.end
            ? [moment(this.value.end).format('YYYY-MM-DD')]
            : this.range ? [] : [moment(this.value).format('YYYY-MM-DD')])
        ]
        return date.indexOf(day.format('YYYY-MM-DD')) > -1
      },
      isBetween (day) {
        const range = this.value && this.value.end
          ? moment.range(moment(this.value.start), moment(this.value.end)).contains(day)
          : false
        return range
      },
      firstInRange (day) {
        return this.value && this.value.start ? moment(moment(this.value.start).format('YYYY-MM-DD')).isSame(day.format('YYYY-MM-DD')) : false
      },
      lastInRange (day) {
        return this.value && this.value.end ? moment(moment(this.value.end).format('YYYY-MM-DD')).isSame(day.format('YYYY-MM-DD')) : false
      },
      isDayDisabledWeekly (day) {
        const dayConst = moment(day).day()
        return this.disabledWeekly.indexOf(dayConst) > -1
      },
      isWeekEndDay (day) {
        const dayConst = moment(day).day()
        const weekendsDaysNumbers = [6, 0]
        return this.noWeekendsDays ? weekendsDaysNumbers.indexOf(dayConst) > -1 : false
      },
      selectDate (day) {
        if (this.range && !this.noShortcuts) {
          this.$refs['range-shortcuts'].selectedShortcut = null
        }
        if (this.range) {
          if (!this.value.start || this.value.end || day.isBefore(moment(this.value.start))) {
            this.value.start = day.format('YYYY-MM-DD')
            this.value.end = null
          } else {
            this.value.end = day.format('YYYY-MM-DD')
          }
          this.$emit('input', this.value)
        } else {
          this.$emit('input', moment(day).format('YYYY-MM-DD'))
        }
      },
      changeMonth (val) {
        this.transitionDaysName = `slide${val}`
        this.transitionLabelName = `slidev${val}`
        this.$emit('change-month', val)
      },
      selectYearMonth (event) {
        const { month, year } = event
        const isBefore = year === this.month.year
          ? month < this.month.month
          : year < this.month.year
        this.transitionLabelName = isBefore ? `slidevprev` : `slidevnext`
        this.selectingYearMonth = null
        this.$emit('change-year-month', event)
      }
    }
  }
</script>
