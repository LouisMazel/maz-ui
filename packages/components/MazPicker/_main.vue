<template>
  <div
    :id="`${$attrs.id}-wrapper`"
    ref="parent"
    v-click-outside="closePicker"
    class="maz-picker"
  >
    <!-- Input  -->
    <MazInput
      v-if="hasInput"
      :id="`${$attrs.id}-input`"
      ref="custom-input"
      v-model="dateFormatted"
      v-bind="$attrs"
      :dark="dark"
      :hint="hint"
      :error="error"
      :is-focus="hasPickerOpen"
      :color="color"
      :label="label"
      :no-label="noLabel"
      :clearable="!noClearButton"
      @focus="toggleDatePicker(true)"
    />

    <slot
      v-else
    />

    <div
      v-if="hasPickerOpen && overlay"
      class="time-picker-overlay"
      @click.stop="closePicker"
    />

    <!-- Date picker container -->
    <PickersContainer
      v-if="!isDisabled"
      :id="`${$attrs.id}-picker-container`"
      ref="agenda"
      v-model="dateTime"
      :visible="hasPickerOpen"
      :position="pickerPosition"
      :inline="inline"
      :color="color"
      :button-color="buttonColor"
      :dark="dark"
      :no-header="noHeader"
      :only-time="onlyTime"
      :only-date="hasOnlyDate"
      :minute-interval="minuteInterval"
      :locale="locale"
      :min-date="minDate"
      :max-date="maxDate"
      :format="format"
      :no-weekends-days="noWeekendsDays"
      :disabled-weekly="disabledWeekly"
      :has-button-validate="hasButtonValidate"
      :has-no-button="hasNoButton"
      :range="range"
      :disabled-dates="disabledDates"
      :disabled-hours="disabledHours"
      :enabled-dates="enabledDates"
      :no-shortcuts="noShortcuts"
      :button-now-translation="buttonNowTranslation"
      :no-button-now="noButtonNow"
      :first-day-of-week="firstDayOfWeek"
      :shortcut="shortcut"
      :custom-shortcuts="customShortcuts"
      :no-keyboard="noKeyboard"
      :right="right"
      :behaviour="_behaviour"
      @validate="validate"
      @close="closePicker"
    />
  </div>
</template>

<script>
  import moment from 'moment'
  import vClickOutside from 'v-click-outside'

  import PickersContainer from './_subs/PickersContainer'

  import { getDefaultLocale } from './utils'

  // import props from './props'

  const updateMomentLocale = (locale, firstDayOfWeek) => {
    moment.locale(locale)
    if (firstDayOfWeek) {
      const firstDayNumber = Number.isInteger(firstDayOfWeek) && firstDayOfWeek === 0
        ? 7
        : firstDayOfWeek || moment.localeData(locale).firstDayOfWeek()
      moment.updateLocale(locale, {
        week: {
          dow: firstDayNumber
        }
      })
    }
  }

  const nearestMinutes = (interval, date, format) => {
    const roundedMinutes = Math.ceil(date.minute() / interval) * interval
    return moment(date.clone().minute(roundedMinutes).second(0), format)
  }

  /**
   * Object containing the default behaviour values of the calendar.
   * Those values can be overrided by the `behaviour` property.
   * @const defaultBehaviour
   */
  const defaultBehaviour = {
    time: {
      nearestIfDisabled: true
    }
  }

  export default {
    name: 'MazPicker',
    components: {
      PickersContainer
    },
    directives: {
      clickOutside: vClickOutside.directive
    },
    inheritAttrs: false,
    props: {
      value: { type: [String, Object], default: null },
      label: { type: String, default: 'Select date & time' },
      noLabel: { type: Boolean, default: false },
      hint: { type: String, default: null },
      error: { type: Boolean, default: null },
      color: { type: String, default: 'dodgerblue' },
      buttonColor: { type: String, default: null },
      dark: { type: Boolean, default: false },
      overlay: { type: Boolean, default: false },
      inline: { type: Boolean, default: false },
      position: { type: String, default: null },
      locale: { type: String, default: getDefaultLocale() },
      formatted: { type: String, default: 'llll' },
      format: { type: String, default: 'YYYY-MM-DD hh:mm a' },
      outputFormat: { type: String, default: null },
      minuteInterval: { type: [String, Number], default: 1 },
      minDate: { type: String, default: null },
      maxDate: { type: String, default: null },
      autoClose: { type: Boolean, default: false },
      onlyTime: { type: Boolean, default: false },
      onlyDate: { type: Boolean, default: false },
      noHeader: { type: Boolean, default: false },
      range: { type: Boolean, default: false },
      noWeekendsDays: { type: Boolean, default: false },
      disabledWeekly: { type: Array, default: () => ([]) },
      noShortcuts: { type: Boolean, default: false },
      noButton: { type: Boolean, default: false },
      disabledDates: { type: Array, default: () => ([]) },
      disabledHours: { type: Array, default: () => ([]) },
      enabledDates: { type: Array, default: () => ([]) },
      open: { type: Boolean, default: false },
      persistent: { type: Boolean, default: false },
      inputSize: { type: String, default: null },
      buttonNowTranslation: { type: String, default: null },
      noButtonNow: { type: Boolean, default: false },
      noButtonValidate: { type: Boolean, default: false },
      firstDayOfWeek: { type: Number, default: null },
      shortcut: { type: String, default: null },
      customShortcuts: {
        type: Array,
        default: () => ([
          { key: 'thisWeek', label: 'This week', value: 'isoWeek' },
          { key: 'lastWeek', label: 'Last week', value: '-isoWeek' },
          { key: 'last7Days', label: 'Last 7 days', value: 7 },
          { key: 'last30Days', label: 'Last 30 days', value: 30 },
          { key: 'thisMonth', label: 'This month', value: 'month' },
          { key: 'lastMonth', label: 'Last month', value: '-month' },
          { key: 'thisYear', label: 'This year', value: 'year' },
          { key: 'lastYear', label: 'Last year', value: '-year' }
        ])
      },
      noValueToCustomElem: { type: Boolean, default: false },
      behaviour: { type: Object, default: () => ({}) },
      noKeyboard: { type: Boolean, default: false },
      right: { type: Boolean, default: false },
      noClearButton: { type: Boolean, default: false }
    },
    data () {
      return {
        pickerOpen: false,
        pickerPosition: this.position
      }
    },
    computed: {
      hasPickerOpen () {
        return this.persistent || this.pickerOpen
      },
      hasNoButton () {
        return this.noButton
      },
      hasButtonValidate () {
        return !this.inline && !this.autoClose
      },
      hasOnlyDate () {
        return this.onlyDate || this.range
      },
      dateFormatted: {
        get () {
          const dateFormatted = this.range
            ? this.getRangeDatesFormatted(this.locale)
            : this.getDateFormatted(this.locale)
          this.$emit('formatted-value', dateFormatted)
          return dateFormatted
        },
        set (value) {
          this.$emit('input', value)
        }
      },
      hasCustomElem () {
        return this.$slots.default
      },
      hasInput () {
        return !this.inline && !this.$slots.default
      },
      dateTime: {
        get () {
          const dateTime = this.range
            ? { start: this.value && this.value.start ? moment(this.value.start, this.formatOutput).format('YYYY-MM-DD') : null,
                end: this.value && this.value.end ? moment(this.value.end, this.formatOutput).format('YYYY-MM-DD') : null }
            : this.getDateTime()
          return dateTime
        },
        set (value) {
          if (this.autoClose && this.range && (value.end && value.start)) {
            this.closePicker()
          } else if (this.autoClose && !this.range) {
            this.closePicker()
          }
          const newValue = this.range ? this.getRangeDateToSend(value) : this.getDateTimeToSend(value)
          this.$emit('input', newValue)
          if (this.hasCustomElem && !this.noValueToCustomElem) {
            this.$nextTick(() => {
              this.setValueToCustomElem()
            })
          }
        }
      },
      formatOutput () {
        return this.outputFormat || this.format
      },
      /**
       * Returns true if the field is disabled
       * @function isDisabled
       * @returns {boolean}
       */
      isDisabled () {
        return typeof this.$attrs.disabled !== 'undefined' && this.$attrs.disabled !== false
      },
      /**
       * Returns the behaviour object with the overrided values
       * @function _behaviour
       * @returns {Object}
       */
      _behaviour () {
        const { time } = defaultBehaviour

        return {
          time: {
            ...time,
            ...this.behaviour.time
          }
        }
      }
    },
    watch: {
      open (val) {
        if (this.isDisabled) return
        this.pickerOpen = val
      },
      locale (value) {
        updateMomentLocale(value, this.firstDayOfWeek)
      }
    },
    mounted () {
      updateMomentLocale(this.locale, this.firstDayOfWeek)
      this.pickerPosition = this.getPosition()
      this.pickerOpen = this.open
      if (this.hasCustomElem) {
        this.addEventToTriggerElement()
        if (!this.noValueToCustomElem) {
          this.setValueToCustomElem()
        }
      }
      if (this.format === 'YYYY-MM-DD hh:mm a' && this.onlyTime) {
        console.warn(`A (time) format must be indicated/ (Ex : format="HH:mm")`)
      }
    },
    beforeDestroy () {
      this.$emit('destroy')
      if (this.hasCustomElem) {
        this.addEventToTriggerElement()
      }
    },
    methods: {
      setValueToCustomElem () {
        /**
         * TODO: Find a way (perhaps), to bind default attrs to custom element.
         */
        const target = this.$slots.default[0]
        if (target) {
          if (target.tag === 'input') {
            target.elm.value = this.dateFormatted
          } else {
            target.elm.innerHTML = this.dateFormatted ? this.dateFormatted : this.label
          }
        } else {
          window.console.warn(`Impossible to find custom element`)
        }
      },
      addEventToTriggerElement () {
        const target = this.$slots.default[0].elm
        if (target) {
          target.addEventListener('click', () => {
            this.toggleDatePicker()
          })
        } else {
          window.console.warn(`Impossible to find custom element`)
        }
      },
      getRangeDatesFormatted () {
        const hasStartValues = this.value && this.value.start
        const hasEndValues = this.value && this.value.end
        if (hasStartValues || hasEndValues) {
          const datesFormatted = hasStartValues ? `${moment(this.value.start, this.formatOutput).set({ hour: 0, minute: 0, second: 0 }).format(this.formatted)}` : '...'
          return hasEndValues ? `${datesFormatted} - ${moment(this.value.end, this.formatOutput).set({ hour: 23, minute: 59, second: 59 }).format(this.formatted)}` : `${datesFormatted} - ...`
        } else {
          return null
        }
      },
      getDateFormatted () {
        const date = this.value
          ? moment(this.value, this.formatOutput).format(this.formatted)
          : null
        return date
      },
      getRangeDateToSend (payload) {
        const { start, end } = typeof payload !== 'undefined' ? payload : this.value
        return start || end
          ? { start: start ? moment(start, 'YYYY-MM-DD').set({ hour: 0, minute: 0, second: 0 }).format(this.formatOutput) : null,
              end: end ? moment(end, 'YYYY-MM-DD').set({ hour: 23, minute: 59, second: 59 }).format(this.formatOutput) : null,
              shortcut: payload.value }
          : { start: moment().format(this.formatOutput),
              end: moment().format(this.formatOutput),
              shortcut: payload.value }
      },
      getDateTimeToSend (value) {
        const dateTime = typeof value !== 'undefined' ? value : this.value
        const dateToSend = dateTime
          ? moment(dateTime, 'YYYY-MM-DD HH:mm')
          : null
        const dateTimeToSend = dateToSend ? nearestMinutes(this.minuteInterval, moment(dateToSend), 'YYYY-MM-DD HH:mm').format(this.formatOutput) : null
        return dateTimeToSend
      },
      getDateTime () {
        const date = this.value
          ? moment(this.value, this.formatOutput)
          : null
        return date ? nearestMinutes(this.minuteInterval, date, this.formatOutput).format('YYYY-MM-DD HH:mm') : null
      },
      /**
       * Closes the datepicker
       * @function closePicker
       */
      closePicker () {
        if (this.pickerOpen) {
          this.$emit('is-hidden')
          this.pickerOpen = false
          this.setBodyOverflow(false)
        }
      },
      toggleDatePicker (val) {
        if (this.isDisabled) return
        const isOpen = (val === false || val === true) ? val : !this.pickerOpen
        this.setBodyOverflow(isOpen)
        this.pickerOpen = isOpen

        if (isOpen) {
          this.$emit('is-shown')
        }

        if (this.pickerOpen && !this.position) {
          this.pickerPosition = this.getPosition()
        }
      },
      setBodyOverflow (value) {
        if (window.innerWidth < 412) {
          const body = document.getElementsByTagName('body')[0]
          body.style.overflow = value ? 'hidden' : null
        }
      },
      getPosition () {
        if (this.position) {
          return this.position
        } else {
          const parentRect = this.$refs.parent.getBoundingClientRect()
          const windowHeight = window.innerHeight
          let datePickerHeight = 445

          datePickerHeight = this.noButton ? datePickerHeight - 41 : datePickerHeight
          datePickerHeight = this.noHeader ? datePickerHeight - 58 : datePickerHeight
          if (parentRect.top < datePickerHeight) {
            // No place on top --> bottom
            return 'bottom'
          } else if (windowHeight - (parentRect.height + datePickerHeight + parentRect.top) >= 0) {
            // Have place on bottom --> bottom
            return 'bottom'
          } else {
            // No place on bottom --> top
            return 'top'
          }
        }
      },
      validate () {
        this.$emit('validate')
        this.closePicker()
      }
    }
  }
</script>
