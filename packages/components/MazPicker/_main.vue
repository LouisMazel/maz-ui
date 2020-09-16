<template>
  <div
    :id="uniqueId"
    ref="MazPicker"
    class="maz-base-component maz-picker"
    :class="[{
      'maz-is-dark': dark
    }, `maz-picker--${color}`]"
    @blur.capture="closePicker($event, 'blur')"
  >
    <MazInput
      v-if="!inline"
      :id="uniqueId"
      v-model="inputValue"
      v-bind="$attrs"
      :placeholder="placeholder"
      readonly
      :color="color"
      :focus="hasPickerOpen"
      @focus="openPicker(true)"
    >
      <!-- Custom left icon -->
      <slot
        slot="icon-left"
        name="icon-left"
      />
      <div
        slot="icon-right"
        class="maz-picker__arrow maz-flex maz-flex-center"
        tabindex="-1"
      >
        <!-- The arrow icon -->
        <slot name="arrow">
          <!-- Default arrow svg `<ArrowIcon />` -->
          <ArrowIcon :orientation="hasPickerOpen ? 'up': null" />
        </slot>
      </div>
    </MazInput>

    <button
      v-if="hasOverlay"
      tabindex="-1"
      class="maz-picker__overlay"
      @click="closePicker"
    />

    <transition
      :name="pickerTransition"
    >
      <PickersContainer
        v-if="hasPickerOpen"
        ref="PickersContainer"
        v-model="dateMoment"
        :locale="locale"
        :position="calcPosition"
        :format="format"
        :has-header="hasHeader"
        :has-footer="hasFooter"
        :has-validate="hasValidate"
        :has-double="hasDouble"
        :has-keyboard="hasKeyboard"
        :has-now="hasNow"
        :has-time="hasTime"
        :has-date="hasDate"
        :is-visible="hasPickerOpen"
        :minute-interval="minuteInterval"
        :now-translation="nowTranslation"
        :min-date="minDate"
        :max-date="maxDate"
        :no-weekends-days="noWeekendsDays"
        :disabled-dates="disabledDatesMoment"
        :disabled-weekly="disabledWeekly"
        :auto-close="autoClose"
        :shortcuts="shortcuts"
        :shortcut="shortcut"
        :has-shortcuts="hasShortcuts"
        :disabled-hours="disabledHours"
        :inline="inline"
        :color="color"
      />
    </transition>
  </div>
</template>

<script>
import PickersContainer from './PickersContainer'
import uniqueId from './../../mixins/uniqueId'
import ArrowIcon from './../_subs/ArrowIcon'
import MazInput from './../MazInput'
import capitalize from './../../filters/capitalize'

import moment from 'moment'
import {
  getDefaultLocale,
  EventBus,
  checkIfTargetIsAllowedToCloseComponent,
  hasDateBetweenMinMaxDate,
  forceUpdateComputedData,
  getDateMoment,
  getFormattedValue
} from './utils'

const NOT_ALLOWED_CLASSES_TO_CLOSE = [
  ['year-month-selector__btn'],
  ['year-month-selector__close']
]

const DOUBLE_PICKER_HEIGHT = 435
const PICKER_HEIGHT = 386
const HEADER_HEIGHT = 57
const FOOTER_HEIGHT = 54

/**
 * > Date, Time & Range Picker
 */

export default {
  name: 'MazPicker',
  components: {
    PickersContainer,
    ArrowIcon,
    MazInput
  },
  mixins: [uniqueId],
  props: {
    // v-model --> input value
    // must be is the same format like
    value: {
      validator: prop => ['string', 'object'].includes(typeof prop) || prop === null,
      default: null
    },
    // if is `true`, the picker is open
    open: { type: Boolean, default: false },
    // moment JS locale
    locale: {
      validator: prop => ['string'].includes(typeof prop) || prop === null,
      default: getDefaultLocale()
    },
    // override the date picker postion (top / bottom / left / right)
    position: { type: String, default: null },
    // the value in `v-model` will be returned in this format
    format: { type: String, default: 'YYYY-MM-DD h:mm a' },
    // the value in `@formatted` event & shown in input will be formatted with this (formats availables on [MomentJS](https://momentjs.com/))
    formatted: { type: String, default: 'llll' },
    // minimum date the user can set (same format as the model)
    minDate: { type: String, default: null },
    // maximum date the user can set (same format as the model)
    maxDate: { type: String, default: null },
    // set dark mode
    dark: { type: Boolean, default: false },
    // Date picker is always open
    persistent: { type: Boolean, default: false },
    // to remove the picker's header
    noHeader: { type: Boolean, default: false },
    // to remove the picker's footer (buttons container)
    noFooter: { type: Boolean, default: false },
    // to remove the `now` button
    noNow: { type: Boolean, default: false },
    // translation of now of button
    nowTranslation: { type: String, default: 'Now' },
    // all week-ends days disabled
    noWeekendsDays: { type: Boolean, default: false },
    // close picker on select date
    autoClose: { type: Boolean, default: false },
    // Inline picker UI (no input, no dialog)
    inline: { type: Boolean, default: false },
    // disabled dates `Array of dates (same format as the value/format attribute)`,
    disabledDates: { type: Array, default: Array },
    // Days of the week which are disabled every week, in Array format with day index, Sunday as 0 and Saturday as 6: `[0,4,6]`
    disabledWeekly: { type: Array, default: Array },
    // show double calendar
    double: { type: Boolean, default: false },
    // Enable range mode to select periode
    range: { type: Boolean, default: false },
    // Change placeholder/label of input
    placeholder: { type: String, default: 'Select date time' },
    // Disabled keyboard accessibility & navigation
    noKeyboard: { type: Boolean, default: false },
    // Disabled time picker
    noTime: { type: Boolean, default: false },
    // Disabled date picker
    noDate: { type: Boolean, default: false },
    // Change minute interval in time picker
    minuteInterval: { type: Number, default: 1 },
    // Must be an Array of integer: `0` to `24` (0 = 12am, 24 = 12pm) => `[0,1,2,3,4,5,6,7,19,20,21,22,23]`
    disabledHours: { type: Array, default: Array },
    // Disable the overlay on mobile
    noOverlay: { type: Boolean, default: false },
    // pre selected shortcut: provide a shortcut key
    shortcut: { type: String, default: null },
    // Disabled shortcuts in range mode
    noShortcuts: { type: Boolean, default: false },
    // shortcuts for range mode
    shortcuts: {
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
    // choose main color
    color: { type: String, default: 'primary' }
  },
  data () {
    return {
      isOpen: null,
      calcPosition: 'bottom left',
      update: false
    }
  },
  computed: {
    inputValue: {
      get () {
        forceUpdateComputedData(this.update)
        return capitalize(getFormattedValue(this.value, this.format, this.formatted, this.range))
      },
      set () {
        this.emitValue(null)
      }
    },
    dateMoment: {
      get () {
        forceUpdateComputedData(this.update)
        return getDateMoment(this.value, this.format, this.range)
      },
      set (value) {
        this.emitValue(value)

        if (this.autoClose && !this.range) this.closePicker()
        if (this.autoClose && this.range && value.start && value.end) this.closePicker()
      }
    },
    minDateDay () {
      return this.minDate ? moment(this.minDate, this.format).startOf('day') : null
    },
    maxDateDay () {
      return this.maxDate ? moment(this.maxDate, this.format).endOf('day') : null
    },
    hasPickerOpen () {
      return this.isOpen || this.open || this.inline
    },
    pickerTransition () {
      return this.calcPosition.includes('bottom') ? 'maz-slide' : 'maz-slideinvert'
    },
    hasHeader () {
      return !this.noHeader
    },
    hasFooter () {
      return !this.noFooter && (this.hasValidate || this.hasNow)
    },
    hasValidate () {
      return !this.inline && !this.autoClose
    },
    hasNow () {
      return !this.noNow && !this.range
    },
    hasKeyboard () {
      return !this.noKeyboard && !this.hasDouble
    },
    disabledDatesMoment () {
      return this.disabledDates.map(d => moment(d, this.format))
    },
    hasDouble () {
      return this.double
    },
    hasTime () {
      return !this.noTime && !this.range
    },
    hasDate () {
      return !this.noDate
    },
    hasShortcuts () {
      return !this.noShortcuts && this.range
    },
    hasOverlay () {
      return !this.noOverlay && this.hasPickerOpen && !this.inline
    }
  },
  watch: {
    dateMoment: {
      handler (value) {
        const { minDateDay, maxDateDay, range } = this
        if (value && (minDateDay || maxDateDay)) {
          if (range) return

          const { isBefore, isAfter } = hasDateBetweenMinMaxDate(
            value,
            minDateDay,
            maxDateDay,
            range
          )
          if (isAfter) this.emitValue(this.maxDateDay)
          if (isBefore) this.emitValue(this.minDateDay)
        }
        this.emitFormatted(value)
      },
      immediate: true
    },
    locale: {
      handler (locale) {
        moment.locale(locale)
        this.update = !this.update
      },
      immediate: true
    },
    hasPickerOpen: {
      async handler (value) {
        const verticalPosition = await this.getVerticalPosition()
        if (value) this.calcPosition = this.position || `${verticalPosition} left`
      },
      immediate: true
    }
  },
  mounted () {
    EventBus.$on('validate', () => {
      this.closePicker()
      // emit when the user click on validate button
      this.$emit('validate')
    })
    EventBus.$on('now', () => {
      this.emitValue(moment())
      // emit when the user click on now button
      this.$emit('now')
    })
    EventBus.$on('close', () => { this.closePicker() })
  },
  beforeDestroy () {
    EventBus.$off('validate')
    EventBus.$off('now')
    EventBus.$off('close')
    // emit on before destroy
    this.$emit('destroy')
  },
  methods: {
    emitValue (value) {
      let valueToSend
      if (this.range) {
        if (value) {
          const { start, end } = value
          valueToSend = {
            start: start instanceof moment ? start.format(this.format) : null,
            end: end instanceof moment ? end.format(this.format) : null
          }
        } else {
          valueToSend = null
        }
      } else {
        valueToSend = value instanceof moment ? value.format(this.format) : null
      }
      // return the date value (in `@input` or `v-model`)
      // @arg date formatted with "format" option
      this.$emit('input', valueToSend)
    },
    emitFormatted (value) {
      if (this.value) {
        // return the date value (in `@formatted` event)
        // @arg date formatted with "formatted" option
        this.$emit('formatted', getFormattedValue(value, this.format, this.formatted, this.range))
      }
    },
    openPicker () {
      this.isOpen = true
      // emit when picker is show
      this.$emit('is-shown')
    },
    closePicker (e = {}) {
      if (
        this.$el.contains(e.relatedTarget) || checkIfTargetIsAllowedToCloseComponent(NOT_ALLOWED_CLASSES_TO_CLOSE, e.target)
      ) return
      this.isOpen = false
      // emit when picker is hide
      this.$emit('is-hidden')
    },
    async getVerticalPosition () {
      if (typeof window === 'undefined') return 'top'
      await this.$nextTick()

      const parentRect = this.$refs.MazPicker.getBoundingClientRect()
      const windowHeight = window.innerHeight
      let datePickerHeight = this.hasDouble ? DOUBLE_PICKER_HEIGHT : PICKER_HEIGHT

      datePickerHeight = this.noFooter ? datePickerHeight - HEADER_HEIGHT : datePickerHeight
      datePickerHeight = this.noHeader ? datePickerHeight - FOOTER_HEIGHT : datePickerHeight
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
  }
}
</script>
