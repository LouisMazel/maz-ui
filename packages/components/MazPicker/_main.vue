<template>
  <div
    :id="uniqueId"
    ref="MazPicker"
    class="maz-picker"
    :class="{
      'is-dark': dark
    }"
    @blur.capture="closePicker($event, 'blur')"
  >
    <MazInput
      v-if="!inline"
      :id="uniqueId"
      v-model="inputValue"
      v-bind="$attrs"
      :label="label"
      readonly
      :focus="hasPickerOpen"
      @focus="openPicker(true)"
    >
      <div
        slot="input-icon-right"
        class="maz-picker__arrow flex flex-center"
        tabindex="-1"
      >
        <!-- The arrow icon -->
        <slot name="arrow">
          <!-- Default arrow svg `<ArrowIcon />` -->
          <ArrowIcon :orientation="hasPickerOpen ? 'up': null" />
        </slot>
      </div>
    </MazInput>

    <transition
      :name="pickerTransition"
    >
      <PickersContainer
        v-if="hasPickerOpen"
        ref="PickersContainer"
        v-model="dateMoment"
        :locale="locale"
        :position="calcPosition"
        :has-header="hasHeader"
        :has-footer="hasFooter"
        :has-validate="hasValidate"
        :has-double="hasDouble"
        :has-keyboard="hasKeyboard"
        :is-visible="hasPickerOpen"
        :has-now="hasNow"
        :now-translation="nowTranslation"
        :min-date="minDateMoment"
        :max-date="maxDateMoment"
        :no-weekends-days="noWeekendsDays"
        :disabled-dates="disabledDatesMoment"
        :disabled-weekly="disabledWeekly"
        :auto-close="autoClose"
        :shortcuts="shortcuts"
        :inline="inline"
      />
    </transition>
  </div>
</template>

<script>
  import PickersContainer from './PickersContainer'
  import uniqueId from './../../mixins/uniqueId'
  import ArrowIcon from './../_subs/ArrowIcon'
  import moment from 'moment'
  import {
    getDefaultLocale,
    EventBus,
    checkIfTargetIsAllowedToCloseComponent,
    hasDateBetweenMinMaxDate,
    updateComputedDataWithProps,
    getDateMoment,
    getFormattedValue
  } from './utils'

  const NOT_ALLOWED_CLASSES_TO_CLOSE = [
    ['month-picker__day', 'is-disabled'],
    ['year-month-selector__btn'],
    ['year-month-selector__close']
  ]

  export default {
    name: 'MazPicker',
    components: {
      PickersContainer,
      ArrowIcon
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
      format: { type: String, default: 'YYYY-MM-DD' },
      // the value in `@formatted` event & shown in input will be formatted with this
      formatted: { type: String, default: 'LL' },
      // minimum date the user can set (same format as the model)
      minDate: { type: String, default: null },
      // maximum date the user can set (same format as the model)
      maxDate: { type: String, default: null },
      // set dark mode
      dark: { type: Boolean, default: false },
      // set dark mode
      persistent: { type: Boolean, default: false },
      // to remove the picker's header
      noHeader: { type: Boolean, default: false },
      // to remove the picker's footer (buttons container)
      noFooter: { type: Boolean, default: false },
      // to remove the `now` button
      noNow: { type: Boolean, default: false },
      // translation of now of button
      nowTranslation: { type: String, default: 'Today' },
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
      label: { type: String, default: 'Select date' },
      // Disabled keyboard accessibility & navigation
      noKeyboard: { type: Boolean, default: false },
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
      }
    },
    data () {
      return {
        isOpen: null,
        calcPosition: 'bottom left'
      }
    },
    computed: {
      inputValue: {
        get () {
          updateComputedDataWithProps(this.locale)
          return getFormattedValue(this.value, this.format, this.formatted, this.range)
        },
        set () {
          this.emitValue(null)
        }
      },
      dateMoment: {
        get () {
          updateComputedDataWithProps(this.locale)
          return getDateMoment(this.value, this.format, this.range)
        },
        set (value) {
          this.emitValue(value)

          if (this.autoClose) this.closePicker()
        }
      },
      minDateMoment () {
        return moment(this.minDate, this.format)
      },
      maxDateMoment () {
        return moment(this.maxDate, this.format)
      },
      hasPickerOpen () {
        return this.isOpen || this.open || this.inline
      },
      pickerTransition () {
        return this.calcPosition.includes('bottom') ? 'slide' : 'slideinvert'
      },
      hasHeader () {
        return !this.noHeader
      },
      hasFooter () {
        return !this.noFooter
      },
      hasValidate () {
        return !this.inline && !this.autoClose
      },
      hasNow () {
        return !this.noNow && !this.range
      },
      hasKeyboard () {
        return !this.noKeyboard && !this.hasDouble && !this.range
      },
      disabledDatesMoment () {
        return this.disabledDates.map(d => moment(d, this.format))
      },
      hasDouble () {
        return this.double
      }
    },
    watch: {
      dateMoment: {
        handler (value) {
          const { minDateMoment, maxDateMoment, range } = this
          if (value && (minDateMoment || maxDateMoment)) {
            this.emitFormatted(value)

            if (range) return

            const { isBefore, isAfter } = hasDateBetweenMinMaxDate(
              value,
              minDateMoment,
              maxDateMoment,
              range
            )
            if (isAfter) this.emitValue(this.maxDateMoment)
            if (isBefore) this.emitValue(this.minDateMoment)
          }
        },
        immediate: true
      },
      locale: {
        handler (locale) {
          import(/* webpackChunkName: "locale-[request]" */ `moment/locale/${locale}.js`).then(() => {
            moment.locale(locale)
          })
        },
        immediate: true
      },
      hasPickerOpen: {
        handler (value) {
          if (value) this.calcPosition = this.position || `${this.getPosition()} left`
        },
        immediate: true
      }
    },
    mounted () {
      EventBus.$on('validate', this.closePicker)
      EventBus.$on('now', () => { this.emitValue(moment()) })
      EventBus.$on('close', this.closePicker)
    },
    beforeDestroy () {
      EventBus.$off('validate')
      EventBus.$off('now')
      EventBus.$off('close')
    },
    methods: {
      emitValue (value) {
        let valueToSend
        if (this.range) {
          const { start, end } = value
          valueToSend = {
            start: start instanceof moment ? start.format(this.format) : null,
            end: end instanceof moment ? end.format(this.format) : null
          }
        } else {
          valueToSend = value instanceof moment ? value.format(this.format) : null
        }
        // return the date value (in `@input` or `v-model`)
        // @arg date formatted with "format" option
        this.$emit('input', valueToSend)
      },
      emitFormatted (value) {
        // return the date value (in `@formatted` event)
        // @arg date formatted with "formatted" option
        if (this.value) this.$emit('formatted', getFormattedValue(value, this.format, this.formatted, this.range))
      },
      openPicker () {
        this.isOpen = true
      },
      closePicker (e = {}) {
        if (
          this.$el.contains(e.relatedTarget) || checkIfTargetIsAllowedToCloseComponent(NOT_ALLOWED_CLASSES_TO_CLOSE, e.target)
        ) return
        this.isOpen = false
      },
      getPosition () {
        if (!this.$refs.MazPicker) return

        const DOUBLE_PICKER_HEIGHT = 435
        const PICKER_HEIGHT = 386
        const HEADER_HEIGHT = 61
        const FOOTER_HEIGHT = 54
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

<style lang="scss">
  .maz-picker {
    position: relative;

    .maz-picker__arrow {
      color: $icon-color;
      outline: none;
      transition: all .25s cubic-bezier(.645, .045, .355, 1);

      svg path.arrow {
        fill: $icon-color;
      }
    }
  }

  .is-dark.maz-picker,
  .is-dark .maz-picker {
    .maz-picker__arrow {
      color: $icon-color-dark;

      svg path.arrow {
        fill: $icon-color-dark;
      }
    }
  }
</style>
