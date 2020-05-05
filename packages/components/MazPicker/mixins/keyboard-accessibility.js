/*
 * Vue mixin to inject the required methods, events to handle the date navigation
 * with the keyboard.
 * @module mixin - keyboardAccessibility
 */
import { EventBus } from './../utils'
import moment from 'moment'

const addListerner = ({ keyPressed }) => {
  if (typeof window === 'undefined') return null
  window.addEventListener('keydown', keyPressed)
}

const removeListerner = ({ keyPressed }) => {
  if (typeof window === 'undefined') return null
  window.removeEventListener('keydown', keyPressed)
}

export default {
  props: {
    hasKeyboard: { type: Boolean, default: true }
  },
  data () {
    return {
      keyboardSelectedDay: null
    }
  },
  computed: {
    currentValue () {
      const currentValue = this.isRangeMode
        ? this.keyboardSelectedDay ||
          this.value.end ||
          this.value.start ||
          moment()
        : this.keyboardSelectedDay || this.value || moment()
      return currentValue instanceof moment
        ? currentValue.clone()
        : currentValue
    }
  },
  methods: {
    keyPressed (e) {
      /*
        13 : Enter
        27 : Escape
        32 : Space
        35 : Page Down
        36 : Page Up
        37 : Left
        38 : Up
        39 : Right
        40 : Down
        40 : Right
      */
      if (
        e.keyCode === 38 ||
        e.keyCode === 40 ||
        e.keyCode === 35 ||
        e.keyCode === 36
      ) {
        e.view.event.preventDefault()
      }
      try {
        if (e.keyCode === 38) {
          this.previousWeek()
        } else if (e.keyCode === 37) {
          this.previousDay()
        } else if (e.keyCode === 39) {
          this.nextDay()
        } else if (e.keyCode === 40) {
          this.nextWeek()
        } else if (e.keyCode === 32 || e.keyCode === 13) {
          this.selectDay(this.keyboardSelectedDay)
        } else if (e.keyCode === 36) {
          this.previousMonth()
        } else if (e.keyCode === 35) {
          this.nextMonth()
        } else if (e.keyCode === 27) {
          EventBus.$emit('close', e)
        }
        // if ('activeElement' in document) document.activeElement.blur()
      } catch (err) {
        throw new Error('An error occured while switch date' + err)
      }
    },
    previousWeek () {
      const keyboardSelectedDay = this.currentValue.subtract(1, 'week')
      if (!this.isDisabled(keyboardSelectedDay)) {
        this.keyboardSelectedDay = keyboardSelectedDay
        this.checkMonth()
      }
    },
    previousDay () {
      const keyboardSelectedDay = this.currentValue.subtract(1, 'days')
      if (!this.isDisabled(keyboardSelectedDay)) {
        this.keyboardSelectedDay = keyboardSelectedDay
        this.checkMonth()
      }
    },
    nextDay () {
      const keyboardSelectedDay = this.currentValue.add(1, 'days')
      if (!this.isDisabled(keyboardSelectedDay)) {
        this.keyboardSelectedDay = keyboardSelectedDay
        this.checkMonth()
      }
    },
    nextWeek () {
      const keyboardSelectedDay = this.currentValue.add(1, 'week')
      if (!this.isDisabled(keyboardSelectedDay)) {
        this.keyboardSelectedDay = keyboardSelectedDay
        this.checkMonth()
      }
    },
    previousMonth () {
      const keyboardSelectedDay = this.currentValue.subtract(1, 'month')
      if (!this.isDisabled(keyboardSelectedDay)) {
        this.keyboardSelectedDay = keyboardSelectedDay
        this.checkMonth()
      }
    },
    nextMonth () {
      const keyboardSelectedDay = this.currentValue.add(1, 'month')
      if (!this.isDisabled(keyboardSelectedDay)) {
        this.keyboardSelectedDay = keyboardSelectedDay
        this.checkMonth()
      }
    },
    checkMonth () {
      this.$nextTick(() => {
        const newYear = parseInt(this.currentValue.format('YYYY'))
        const currentYear = this.month.year
        const isSameYear = newYear === currentYear
        if (
          parseInt(this.currentValue.format('MM') - 1) !== this.month.month &&
          isSameYear
        ) {
          if (parseInt(this.currentValue.format('MM') - 1) > this.month.month) {
            this.$emit('change-month', 'next')
          } else {
            this.$emit('change-month', 'prev')
          }
        } else if (!isSameYear) {
          if (newYear > currentYear) {
            this.$emit('change-month', 'next')
          } else {
            this.$emit('change-month', 'prev')
          }
        }
      })
    }
  },
  mounted () {
    if (this.hasKeyboard && (this.inline || this.isVisible)) {
      const { keyPressed } = this
      addListerner({ keyPressed })
    }
  },
  beforeDestroy () {
    const { keyPressed } = this
    removeListerner({ keyPressed })
  },
  watch: {
    isVisible (value) {
      const { keyPressed } = this
      if (this.hasKeyboard && value) {
        addListerner({ keyPressed })
      } else {
        removeListerner({ keyPressed })
      }
    }
  }
}
