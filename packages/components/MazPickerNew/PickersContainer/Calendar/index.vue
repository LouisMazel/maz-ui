<template>
  <div class="calendar px-2 pos-r mw-100">
    <MonthYearSwitcher
      :month="month"
      class="mt-2"
      @change-month="changeMonth"
    />
    <WeekDaysLabels
      :locale="locale"
      class="mt-2 mb-3"
    />
    <MonthPicker
      v-model="dateMoment"
      :month="month"
      :min-date="minDate"
      :max-date="maxDate"
      :no-weekends-days="noWeekendsDays"
      :disabled-dates="disabledDates"
      :disabled-weekly="disabledWeekly"
      :is-visible="isVisible"
      class="mb-2"
      @change-month="changeMonth"
    />
  </div>
</template>

<script>
  import WeekDaysLabels from './WeekDaysLabels'
  import MonthPicker from './MonthPicker'
  import MonthYearSwitcher from './MonthYearSwitcher'
  import Month from './../../modules/month'

  export default {
    name: 'Calendar',
    components: { WeekDaysLabels, MonthPicker, MonthYearSwitcher },
    props: {
      value: { type: Object, required: true },
      locale: { type: String, required: true },
      minDate: { type: Object, default: null },
      maxDate: { type: Object, default: null },
      noWeekendsDays: { type: Boolean, default: false },
      disabledDates: { type: Array, required: true },
      disabledWeekly: { type: Array, required: true },
      isVisible: { type: Boolean, default: false }
    },
    data () {
      return {
        month: null
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
      }
    },
    watch: {
      value: {
        handler (newValue, oldValue) {
          if (!this.month || newValue.month() !== oldValue.month()) {
            this.month = new Month(this.value.month(), this.value.year())
          }
        },
        immediate: true
      }
    },
    methods: {
      changeMonth (val) {
        let month = this.month.month + (val === 'prev' ? -1 : +1)
        let year = this.month.year
        if (month > 11 || month < 0) {
          year += (val === 'prev' ? -1 : +1)
          month = (val === 'prev' ? 11 : 0)
        }
        this.month = new Month(month, year, this.locale)
      }
    }
  }
</script>
