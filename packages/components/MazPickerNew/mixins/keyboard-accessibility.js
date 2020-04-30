/*
  * Vue mixin to inject the required methods, events to handle the date navigation
  * with the keyboard.
  * @module mixin - keyboardAccessibility
*/
import { EventBus } from './../utils'

export default {
  props: {
    noKeyboard: { type: Boolean, default: false }
  },
  data () {
    return {
      keyboardSelectedDay: null
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
      if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 35 || e.keyCode === 36) {
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
          EventBus.$emit('close')
        }
        if ('activeElement' in document) document.activeElement.blur()
      } catch (err) {
        throw new Error('An error occured while switch date' + err)
      }
    },
    previousWeek () {
      const keyboardSelectedDay = this.keyboardSelectedDay.clone().subtract(1, 'week')
      if (!this.isDisabled(keyboardSelectedDay)) {
        this.keyboardSelectedDay = keyboardSelectedDay
        this.checkMonth()
      }
    },
    previousDay () {
      const keyboardSelectedDay = this.keyboardSelectedDay.clone().subtract(1, 'days')
      if (!this.isDisabled(keyboardSelectedDay)) {
        this.keyboardSelectedDay = keyboardSelectedDay
        this.checkMonth()
      }
    },
    nextDay () {
      const keyboardSelectedDay = this.keyboardSelectedDay.clone().add(1, 'days')
      if (!this.isDisabled(keyboardSelectedDay)) {
        this.keyboardSelectedDay = keyboardSelectedDay
        this.checkMonth()
      }
    },
    nextWeek () {
      const keyboardSelectedDay = this.keyboardSelectedDay.clone().add(1, 'week')
      if (!this.isDisabled(keyboardSelectedDay)) {
        this.keyboardSelectedDay = keyboardSelectedDay
        this.checkMonth()
      }
    },
    previousMonth () {
      const keyboardSelectedDay = this.keyboardSelectedDay.clone().subtract(1, 'month')
      if (!this.isDisabled(keyboardSelectedDay)) {
        this.keyboardSelectedDay = keyboardSelectedDay
        this.checkMonth()
      }
    },
    nextMonth () {
      const keyboardSelectedDay = this.keyboardSelectedDay.clone().add(1, 'month')
      if (!this.isDisabled(keyboardSelectedDay)) {
        this.keyboardSelectedDay = keyboardSelectedDay
        this.checkMonth()
      }
    },
    checkMonth () {
      this.$nextTick(() => {
        const newYear = parseInt(this.keyboardSelectedDay.format('YYYY'))
        const currentYear = this.month.year
        const isSameYear = newYear === currentYear
        if (parseInt(this.keyboardSelectedDay.format('MM') - 1) !== this.month.month && isSameYear) {
          if (parseInt(this.keyboardSelectedDay.format('MM') - 1) > this.month.month) {
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
    if (!this.noKeyboard && (this.inline || this.isVisible)) {
      window.addEventListener('keydown', this.keyPressed)
    }
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.keyPressed)
  },
  watch: {
    isVisible (value) {
      if (!this.noKeyboard && value) {
        window.addEventListener('keydown', this.keyPressed)
      } else {
        window.removeEventListener('keydown', this.keyPressed)
      }
    },
    value: {
      handler (value) {
        this.keyboardSelectedDay = value.clone()
      },
      immediate: true
    }
  }
}
