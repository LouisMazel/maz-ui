<template>
  <div
    :id="uniqueId"
    ref="mazPicker"
    class="maz-picker-new"
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
          <!-- the arrow svg -->
          <ArrowIcon :orientation="hasPickerOpen ? 'up': null" />
        </slot>
      </div>
    </MazInput>

    <transition
      :name="pickerTransition"
    >
      <PickersContainer
        v-if="hasPickerOpen"
        v-model="dateMoment"
        :locale="locale"
        :position="calcPosition"
        :has-header="hasHeader"
        :has-footer="hasFooter"
        :has-validate="hasValidate"
        :has-double="hasDouble"
        :is-visible="hasPickerOpen"
        :has-now="hasNow"
        :now-translation="nowTranslation"
        :min-date="minDateMoment"
        :max-date="maxDateMoment"
        :no-weekends-days="noWeekendsDays"
        :disabled-dates="disabledDatesMoment"
        :disabled-weekly="disabledWeekly"
        :auto-close="autoClose"
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
  import { getDefaultLocale, EventBus } from './utils'

  const hasDateBetweenMinMaxDate = (date, minDate, maxDate) => {
    return {
      isBefore: date.isBefore(minDate),
      isAfter: date.isAfter(maxDate)
    }
  }

  const NOT_ALLOWED_CLASSES_TO_CLOSE = [
    ['month-picker__day', 'is-disabled'],
    ['year-month-selector__btn'],
    ['year-month-selector__close']
  ]

  const updateComputedDataWithProps = () => 'updated'

  export default {
    name: 'MazPickerNew',
    components: { PickersContainer, ArrowIcon },
    mixins: [uniqueId],
    props: {
      // input value
      value: {
        validator: prop => ['string', 'object'].includes(typeof prop) || prop === null,
        required: true
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
      // format returned
      format: { type: String, default: 'YYYY-MM-DD' },
      // format of input
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
      doubleCalendar: { type: Boolean, default: false },
      // Enable range mode to select periode
      range: { type: Boolean, default: false },
      // Change placeholder/label of input
      label: { type: String, default: 'Select date' }
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
          return this.value ? moment(this.value, this.format).format(this.formatted) : null
        },
        set () {
          this.$emit('input', null)
        }
      },
      dateMoment: {
        get () {
          updateComputedDataWithProps(this.locale)
          return this.value ? moment(this.value, this.format) : moment()
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
        return !this.noNow
      },
      disabledDatesMoment () {
        return this.disabledDates.map(d => moment(d, this.format))
      },
      hasDouble () {
        return this.doubleCalendar || this.range
      }
    },
    watch: {
      dateMoment: {
        handler (value) {
          const { minDateMoment, maxDateMoment } = this
          if (value && (minDateMoment || maxDateMoment)) {
            const { isBefore, isAfter } = hasDateBetweenMinMaxDate(
              value,
              minDateMoment,
              maxDateMoment
            )
            if (isAfter) this.$emit('input', this.maxDateMoment)
            if (isBefore) this.$emit('input', this.minDateMoment)

            // return the date value (in `@formatted` event)
            // @arg date formatted with "formatted" option
            if (this.value) this.$emit('formatted', value.format(this.formatted))
          }
        },
        immediate: true
      },
      locale: {
        async handler (locale) {
          moment.locale(locale)
        },
        immediate: true
      },
      isOpen (value) {
        if (value) {
          console.log('okokokokok')
          this.calcPosition = this.position || `${this.getPosition()} left`
        }
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
        // return the date value (in `@input` or `v-model`)
        // @arg date formatted with "format" option
        this.$emit('input', value.format(this.format))
      },
      openPicker () {
        this.isOpen = true
      },
      closePicker (e = {}) {
        if (
          this.$el.contains(e.relatedTarget) ||
          NOT_ALLOWED_CLASSES_TO_CLOSE.some(classes =>
            classes.every(c =>
              (e.target?.classList ?? []).contains(c)
            )
          )
        ) return
        this.isOpen = false
      },
      getPosition () {
        const parentRect = this.$refs.mazPicker.getBoundingClientRect()
        const windowHeight = window.innerHeight
        let datePickerHeight = 417

        datePickerHeight = this.noButton ? datePickerHeight - 54 : datePickerHeight
        datePickerHeight = this.noHeader ? datePickerHeight - 64 : datePickerHeight
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
  .maz-picker-new {
    position: relative;

    .maz-picker__arrow {
      color: $border-color;
      outline: none;
      transition: all .25s cubic-bezier(.645, .045, .355, 1);

      svg path.arrow {
        fill: $border-color;
      }
    }
  }
</style>
