<template>
  <div
    ref="TimePicker"
    :style="[{height: `${hasDate ? height : 150}px`}]"
    class="time-picker maz-flex maz-flex-fixed maz-flex-1"
    :class="{
      'border-left border-left-solid border-color': hasDate
    }"
  >
    <div
      v-for="column in columns"
      :key="column.type"
      :ref="column.type"
      :class="`time-picker__column-${column.type}`"
      class="time-picker__column maz-flex-1 maz-flex maz-direction-column maz-align-center"
      @scroll="noScrollEvent
        ? null
        : column.type === 'hours' ? onScrollHours($event) : column.type === 'minutes' ? onScrollMinutes($event) : onScrollApms($event)
      "
    >
      <div>
        <div
          class="before"
          :style="[columnPadding]"
        />
        <MazBtn
          v-for="item in column.items"
          :key="item.item"
          size="mini"
          :no-shadow="!isActive(column.type, item.value)"
          tabindex="-1"
          class="time-picker__column__item maz-flex maz-flex-center maz-bg-transparent maz-text-color maz-p-0"
          :active="isActive(column.type, item.value)"
          :disabled="item.disabled"
          @click="item.disabled ? null : setTime(item.value, column.type)"
        >
          {{ item.item }}
        </MazBtn>
        <div
          class="after"
          :style="[columnPadding]"
        />
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import {
  ArrayHourRange,
  ArrayMinuteRange,
  debounce,
  getTimeFormat
} from './../../../utils'
import MazBtn from '../../../../MazBtn'

const scrollSmoothElement = (elem, parentHeight, hasSmoothEffect) => {
  const selected = elem.querySelector('.time-picker__column__item.maz-active')
  if (selected) {
    const boundsSelected = selected.getBoundingClientRect()
    const boundsElem = elem.getBoundingClientRect()
    if (boundsSelected && boundsElem) {
      const scrollValue = (ITEM_HEIGHT / 2) + boundsSelected.top - boundsElem.top - parentHeight / 2
      elem.scrollBy({
        top: scrollValue,
        behavior: hasSmoothEffect ? 'smooth' : 'auto'
      })
    }
  }
}

const ITEM_HEIGHT = 28

export default {
  name: 'TimePicker',
  components: { MazBtn },
  props: {
    value: { type: Object, default: Object },
    format: { type: String, default: null },
    minDate: { type: Object, default: null },
    maxDate: { type: Object, default: null },
    minuteInterval: { type: Number, required: true },
    height: { type: Number, required: true },
    hasDate: { type: Boolean, required: true },
    disabledHours: { type: Array, required: true },
    behaviour: { type: Object, default: Object }
  },
  data () {
    return {
      hour: null,
      minute: null,
      oldvalue: false,
      columnPadding: {},
      noScrollEvent: false,
      delay: 0
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
    timeFormat () {
      const formatLower = this.format.toLowerCase()
      const hasTimeFormat = formatLower.includes('h')
      if (hasTimeFormat) {
        return getTimeFormat(this.format)
      } else {
        throw new Error('[MazPicker]: Time format must be indicated or set "no-timer" option')
      }
    },
    isTwelveFormat () {
      return this.timeFormat.includes('A') || this.timeFormat.includes('a')
    },
    minTime () {
      return this.minDate?.format(this.timeFormat) ?? null
    },
    maxTime () {
      return this.maxDate?.format(this.timeFormat) ?? null
    },
    hours () {
      const twoDigit = this.timeFormat.includes('hh') || this.timeFormat.includes('HH')
      const isAfternoon = this.apm ? this.apm === 'pm' || this.apm === 'PM' : false
      const minH = this.isTwelveFormat ? 1 : 0
      const maxH = this.isTwelveFormat ? 12 : 23

      return ArrayHourRange(
        minH,
        maxH,
        twoDigit,
        isAfternoon,
        this._disabledHours
      )
    },
    minutes () {
      const twoDigit = this.timeFormat.includes('mm') || this.timeFormat.includes('MM')
      return ArrayMinuteRange(0, 60, twoDigit, this.minuteInterval, this._disabledMinutes)
    },
    apms () {
      const ampm = this.isTwelveFormat
        ? this.minTime
          ? moment(this.minTime, 'hh:mm a').format('a')
          : this.maxTime
            ? moment(this.maxTime, 'hh:mm a').format('a')
            : ''
        : ''
      const upper = ampm
        ? [{ value: ampm.toUpperCase(), item: ampm.toUpperCase() }]
        : [{ value: 'AM', item: 'AM' }, { value: 'PM', item: 'PM' }]
      const lower = ampm
        ? [{ value: ampm, item: ampm }]
        : [{ value: 'am', item: 'am' }, { value: 'pm', item: 'pm' }]
      return this.isTwelveFormat
        ? this.timeFormat.includes('A') ? upper : lower
        : null
    },
    apm () {
      if (!this.apms) return null
      return this.hour > 12
        ? this.apms.length > 1 ? this.apms[1].value : this.apms[0].value
        : this.apms[0].value
    },
    columns () {
      return [
        { type: 'hours', items: this.hours },
        { type: 'minutes', items: this.minutes },
        ...(this.apms ? [{ type: 'apms', items: this.apms }] : [])
      ]
    },
    _disabledHours () {
      let minEnabledHour = 0
      let maxEnabledHour = 23
      if (this.minTime) {
        minEnabledHour = this.isTwelveFormat
          ? this.minTime.toUpperCase().includes('AM')
            ? moment(this.minTime, 'h:mm a').format('h')
            : parseInt(moment(this.minTime, 'h:mm a').format('h')) + 12
          : moment(this.minTime, 'HH:mm').format('HH')
      }
      if (this.maxTime) {
        maxEnabledHour = this.isTwelveFormat
          ? this.maxTime.toUpperCase().includes('AM')
            ? moment(this.maxTime, 'h:mm a').format('h')
            : parseInt(moment(this.maxTime, 'h:mm a').format('h'), 10) + 12
          : moment(this.maxTime, 'HH:mm').format('HH')
      }

      // In case if hour present as 08, 09, etc
      minEnabledHour = parseInt(minEnabledHour, 10)
      maxEnabledHour = parseInt(maxEnabledHour, 10)

      if (minEnabledHour !== 0 || maxEnabledHour !== 23) {
        const enabledHours = [...Array(24)]
          .map((_, i) => i)
          .filter(h => h >= minEnabledHour && h <= maxEnabledHour)

        if (!enabledHours.includes(this.hour) && this.behaviour && this.behaviour.time && this.behaviour.time.nearestIfDisabled) {
            this.hour = enabledHours[0] // eslint-disable-line
          this.emitValue()
        }

        const _disabledHours = [...Array(24)]
          .map((_, i) => i)
          .filter(h => !enabledHours.includes(h))
          .map(h => h < 10 ? '0' + h : '' + h)
        this.disabledHours.forEach(h => _disabledHours.push(h))

        return _disabledHours
      } else {
        return this.disabledHours
      }
    },
    _disabledMinutes () {
      let minEnabledMinute = 0
      let maxEnabledMinute = 60
      if (this.isTwelveFormat) {
        if (this.minTime && this.apm) {
          const minTime = moment(this.minTime, 'h:mm a')
          const minTimeHour = parseInt(minTime.format('h'), 10) + (this.apm.toUpperCase() === 'PM' ? 12 : 0)
          minEnabledMinute = minTimeHour === this.hour ? parseInt(minTime.format('mm'), 10) : minEnabledMinute
        } else if (this.maxTime) {
          const maxTime = moment(this.maxTime, 'h:mm a')
          const maxTimeHour = parseInt(maxTime.format('h'), 10) + (this.apm.toUpperCase() === 'PM' ? 12 : 0)
          maxEnabledMinute = maxTimeHour === this.hour ? parseInt(maxTime.format('mm'), 10) : maxEnabledMinute
        }
      } else {
        if (this.minTime) {
          const minTime = moment(this.minTime, 'HH:mm')
          const minTimeHour = parseInt(moment(this.minTime, 'HH:mm').format('HH'), 10)
          minEnabledMinute = minTimeHour === this.hour ? parseInt(minTime.format('mm'), 10) : minEnabledMinute
        } else if (this.maxTime) {
          const maxTime = moment(this.maxTime, 'HH:mm')
          const maxTimeHour = parseInt(moment(this.maxTime, 'HH:mm').format('HH'), 10)
          maxEnabledMinute = maxTimeHour === this.hour ? parseInt(maxTime.format('mm'), 10) : maxEnabledMinute
        }
      }

      if (minEnabledMinute !== 0 || maxEnabledMinute !== 60) {
        const enabledMinutes = [...Array(60)]
          .map((_, i) => i)
          .filter(m => m >= minEnabledMinute && m <= maxEnabledMinute)

        if (!enabledMinutes.includes(this.minute) && this.behaviour && this.behaviour.time && this.behaviour.time.nearestIfDisabled) {
            this.minute = enabledMinutes[0] // eslint-disable-line
          this.emitValue()
        }

        return [...Array(60)]
          .map((_, i) => i)
          .filter(m => !enabledMinutes.includes(m))
          .map(m => m < 10 ? '0' + m : '' + m)
      } else {
        return []
      }
    }
  },
  watch: {
    value: {
      async handler (newValue, oldValue) {
        if ((newValue && oldValue && newValue.format('HH:mm') !== oldValue.format('HH:mm')) || (!oldValue)) {
          await this.$nextTick()
          this.setCurrentTime()
          this.initPositionView()
        }
      },
      immediate: true
    },
    height (newValue, oldValue) {
      if (newValue !== oldValue) this.initPositionView(['hours'])
    }
  },
  mounted () {
    if (this.isTwelveFormat && !this.apms) throw new Error(`MazPicker - Format Error : To have the twelve hours format, the format must have "A" or "a" (Ex : ${this.format} a)`)
    this.buildColumnPad()
  },
  methods: {
    getValue (scroll) {
      const itemHeight = ITEM_HEIGHT
      const scrollTop = scroll.target.scrollTop
      return Math.round(scrollTop / itemHeight)
    },
    onScrollHours: debounce(function (scroll) {
      const value = this.getValue(scroll)
      const hour = this.isTwelveFormat
        ? this.apm.toLowerCase() === 'am'
          ? value + 1
          : (value + 1 + 12)
        : value
      if (this.isHoursDisabled(hour)) return
      this.hour = hour === 24 && !this.isTwelveFormat ? 23 : hour
      this.emitValue()
      this.initPositionView(['hours'])
    }, 100),
    onScrollMinutes: debounce(function (scroll) {
      const value = this.getValue(scroll)
      const minute = value * this.minuteInterval
      if (this.isMinutesDisabled(minute)) return
      this.minute = minute === 60 ? 59 : minute
      this.emitValue()
      this.initPositionView(['minutes'])
    }, 100),
    onScrollApms: debounce(function (scroll) {
      const value = this.getValue(scroll)
      if (this.apms && this.apms[value] && this.apm !== this.apms[value].value) {
        const newHour = this.apm === 'pm' || this.apm === 'PM' ? this.hour - 12 : this.hour + 12
        this.hour = newHour
      }
      this.emitValue()
      this.initPositionView(['apms'])
    }, 100),
    isActive (type, value) {
      return (type === 'hours'
        ? this.hour
        : type === 'minutes'
          ? this.minute
          : this.apm ? this.apm : null) === value
    },
    isHoursDisabled (h) {
      const hourToTest = this.apmType
        ? moment(`${h} ${this.apm}`, [`${this.hourType} ${this.apmType}`]).format('HH')
        : h < 10 ? '0' + h : '' + h
      return this._disabledHours.includes(hourToTest)
    },
    isMinutesDisabled (payload) {
      let m = payload
      m = m < 10 ? '0' + m : '' + m
      return this._disabledMinutes.includes(m)
    },
    async buildColumnPad () {
      await this.$nextTick()
      if (this.$refs.TimePicker) {
        const run = (pad) => {
          this.columnPadding = {
            height: `${pad}px`
          }
        }
        this.$nextTick(() => {
          const pad = this.$refs.TimePicker.clientHeight / 2 - ITEM_HEIGHT / 2
          run(pad)
        })
      } else {
        return null
      }
    },
    setCurrentTime () {
      if (!this.dateMoment) return
      const tmpHour = parseInt(this.dateMoment.format('HH'))
      const hourToSet = this.isTwelveFormat && (tmpHour === 12 || tmpHour === 0)
        ? tmpHour === 0 ? 12 : 24
        : tmpHour

      /**
       * Here we have two different behaviours. If the behaviour `nearestIfDisabled` is enabled
       * and the selected hour is disabled, we set the hour to the nearest hour available.
       * Otherwise just set the hour to the current value.
       */
      this.hour = this.behaviour && this.behaviour.time && this.behaviour.time.nearestIfDisabled && this.isHoursDisabled(hourToSet)
        ? this.getAvailableHour()
        : hourToSet

      this.minute = parseInt(this.dateMoment.format('mm'))
    },
    async initPositionView (containers = ['hours', 'minutes', 'apms']) {
      await this.$nextTick()
      this.noScrollEvent = true
      // if (this.apms) containers.push('apms')
      const hasSmoothEffect = containers.length === 1
      await this.$nextTick()
      containers.forEach((container) => {
        if (!this.$refs[container]) return
        const elem = this.$refs[container][0]
        const timePickerHeight = this.$refs.TimePicker.clientHeight
        // elem.scrollTop = 0
        scrollSmoothElement(elem, timePickerHeight, hasSmoothEffect)
      })
      setTimeout(() => {
        this.noScrollEvent = false
      }, 500)
    },
    getAvailableHour () {
      const availableHours = this.hours.find((element) => {
        return element.disabled === false
      })
      return availableHours ? availableHours.value : null
    },
    setTime (item, type) {
      if (type === 'hours') {
        this.hour = item
      } else if (type === 'minutes') {
        this.minute = item
      } else if (type === 'apms' && this.apm !== item) {
        const newHour = item === 'pm' || item === 'PM' ? this.hour + 12 : this.hour - 12
        this.hour = newHour
      }
      this.emitValue()
      this.initPositionView([type])
    },
    emitValue () {
      const tmpHour = this.hour ? this.hour : this.getAvailableHour()
      let hour = this.isTwelveFormat && (tmpHour === 24 || tmpHour === 12)
        ? this.apm.toLowerCase() === 'am' ? 0 : 12
        : tmpHour
      hour = (hour < 10 ? '0' : '') + hour
      const minute = this.minute ? (this.minute < 10 ? '0' : '') + this.minute : '00'
      this.dateMoment = (this.dateMoment ?? moment()).set({
        hour,
        minute
      })
    }
  }
}
</script>
