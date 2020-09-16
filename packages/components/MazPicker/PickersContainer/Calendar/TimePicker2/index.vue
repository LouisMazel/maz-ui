<template>
  <div
    ref="TimePicker"
    :style="[{height: `${hasDate ? height : 150}px`}]"
    class="time-picker maz-flex maz-flex-fixed maz-flex-1"
    :class="{
      'maz-border-left maz-border-left-solid maz-border-color': hasDate
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
      <div
        class="before"
        :style="[columnPadding]"
      />
      <MazBtn
        v-for="({ item, disabled, value: v }) in column.items"
        :key="item"
        size="mini"
        tabindex="-1"
        no-shadow
        class="time-picker__column__item maz-flex maz-flex-center maz-flex-fixed maz-bg-transparent maz-text-color maz-p-0"
        :color="color"
        :active="isActive(column.type, v)"
        :disabled="disabled"
        @click="disabled ? null : selectTime(v, column.type)"
      >
        {{ item }}
      </MazBtn>
      <div
        class="after"
        :style="[columnPadding]"
      />
    </div>
  </div>
</template>

<script>
import {
  ArrayHourRange,
  ArrayMinuteRange,
  debounce,
  getTimeFormat,
  scrollSmoothElement,
  findNearestNumberInList,
  getValue
} from './../../../utils'
import moment from 'moment'
import MazBtn from '../../../../MazBtn'

const ITEM_HEIGHT = 28

export default {
  name: 'TimePicker',
  components: { MazBtn },
  props: {
    value: { type: Object, default: Object },
    format: { type: String, default: null },
    minDate: { type: String, default: null },
    maxDate: { type: String, default: null },
    minuteInterval: { type: Number, required: true },
    height: { type: Number, required: true },
    hasDate: { type: Boolean, required: true },
    disabledHours: { type: Array, required: true },
    color: { type: String, default: null }
  },
  data () {
    return {
      hour: null,
      minute: null,
      noScrollEvent: false,
      columnPadding: {}
    }
  },
  computed: {
    dateMoment: {
      get () {
        return this.value || moment()
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    timeFormat () {
      const hasTimeFormat = this.format?.toLowerCase().includes('h') ?? false
      if (hasTimeFormat) {
        return getTimeFormat(this.format)
      } else {
        throw new Error('[MazPicker]: Time format must be indicated or set "no-timer" option')
      }
    },
    isTwelveFormat () {
      return this.timeFormat.includes('h')
    },
    hours () {
      const { timeFormat, apm, isTwelveFormat, _disabledHours } = this
      const twoDigit = timeFormat?.toLowerCase().includes('hh') ?? false
      const isAfternoon = apm ? apm === 'pm' || apm === 'PM' : false
      const minH = isTwelveFormat ? 1 : 0
      const maxH = isTwelveFormat ? 12 : 23

      return ArrayHourRange(
        minH,
        maxH,
        twoDigit,
        isAfternoon,
        _disabledHours
      )
    },
    minutes () {
      const { minuteInterval, disabledMinutes } = this
      const twoDigit = this.timeFormat?.toLowerCase().includes('mm') ?? false
      return ArrayMinuteRange(
        0,
        60,
        twoDigit,
        minuteInterval,
        disabledMinutes
      )
    },
    apms () {
      const { isTwelveFormat, timeFormat } = this
      if (!timeFormat.includes('A') && !timeFormat.includes('a')) return null
      const upper = [{ value: 'AM', item: 'AM' }, { value: 'PM', item: 'PM' }]
      const lower = [{ value: 'am', item: 'am' }, { value: 'pm', item: 'pm' }]
      return isTwelveFormat
        ? timeFormat.includes('A') ? upper : lower
        : null
    },
    columns () {
      const { hours, minutes, apms } = this
      return [
        { type: 'hours', items: hours },
        { type: 'minutes', items: minutes },
        ...(apms ? [{ type: 'apms', items: apms }] : [])
      ]
    },
    isMinDate () {
      const { dateMoment, minDate } = this
      return dateMoment ? dateMoment.isSame(minDate, 'day') : false
    },
    isMaxDate () {
      const { dateMoment, maxDate } = this
      return dateMoment ? dateMoment.isSame(maxDate, 'day') : false
    },
    isMinHour () {
      const { dateMoment, minDate } = this
      return dateMoment.isSame(minDate, 'hour')
    },
    isMaxHour () {
      const { dateMoment, maxDate } = this
      return dateMoment.isSame(maxDate, 'hour')
    },
    disabledMinutes () {
      const { isMinDate, isMaxDate, isMinHour, isMaxHour, minDate, maxDate, format } = this
      if (isMinDate && isMinHour) {
        // get min limit of minDate
        const minMinute = parseInt(moment(minDate, format).format('m'), 10)
        return Array.from({ length: minMinute }, (x, i) => i)
      } else if (isMaxDate && isMaxHour) {
        // get min limit of maxDate
        const maxMinute = parseInt(moment(maxDate, format).format('m'), 10)
        return Array.from({ length: maxMinute }).fill().map((_, i) => 60 - i)
      }
      return []
    },
    _disabledHours () {
      let hoursDisabled
      const { isMinDate, isMaxDate, minDate, maxDate, format, disabledHours } = this
      if (isMinDate) {
        const minHour = parseInt(moment(minDate, format).format('H'), 10)
        hoursDisabled = Array.from({ length: minHour }, (x, i) => i)
      } else if (isMaxDate) {
        const maxhour = parseInt(moment(maxDate, format).format('H'), 10)
        hoursDisabled = Array.from({ length: 24 - maxhour }).fill().map((_, i) => 24 - i)
      }
      return [
        ...(hoursDisabled ? hoursDisabled : []),
        ...disabledHours
      ]
    }
  },
  watch: {
    value: {
      async handler (value) {
        if (!value) return
        await this.setTime()
        await this.validateTime()
        await this.emitValue()
        await this.initPositionView()
      },
      immediate: true
    },
    format: {
      async handler (newValue, oldValue) {
        if (newValue !== oldValue) {
          this.validateFormat()
        }
      },
      immediate: true
    },
    height: {
      async handler (newValue, oldValue) {
        if (newValue === oldValue) return
        await this.buildColumnPad()
        await this.initPositionView()
      },
      immediate: true
    }
  },
  mounted () {
    this.$watch(vm => [vm.disabledMinutes, vm._disabledHours].join(), async () => {
      await this.emitValue()
    })
  },
  methods: {
    setTime () {
      const { dateMoment, isTwelveFormat, apms } = this
      if (!dateMoment) return

      const hour = parseInt(dateMoment.format('H'), 10)

      // set hour value
      this.hour = isTwelveFormat && [0,12].includes(hour) ? hour === 0 ? 12 : 24 : hour
      // set minute value
      this.minute = parseInt(dateMoment.format('m'), 10)

      if (isTwelveFormat) this.apm = this.hour > 12 ? apms[1].value : apms[0].value
    },
    async validateTime () {
      await this.$nextTick()

      const { isDisabled, getAvailableTime, hour, minute } = this

      this.hour = isDisabled('hours', hour)
        ? getAvailableTime('hours', hour)
        : hour

      this.minute = isDisabled('minutes', minute)
        ? getAvailableTime('minutes', minute)
        : minute
    },
    isDisabled (type, value) {
      return type === 'minutes'
        ? this.disabledMinutes.includes(value)
        : this._disabledHours.includes(value)
    },
    isActive (type, value) {
      const { hour, minute, apm } = this
      return (
        type === 'hours'
          ? hour
          : type === 'minutes'
            ? minute
            : apm ? apm : null
      ) === value
    },
    getAvailableTime (type, number) {
      const list = this[type].map((i) => !i.disabled ? i.value : null).filter((i) => i !== null)
      return findNearestNumberInList(list, number)
    },
    onScrollHours: debounce(async function (scroll) {
      const { apm, isTwelveFormat, initPositionView, emitValue } = this
      const value = getValue(scroll)
      const hour = isTwelveFormat
        ? (apm?.toLowerCase() ?? false) === 'am'
          ? value + 1
          : (value + 1 + 12)
        : value
      this.hour = hour === 24 && !isTwelveFormat ? 23 : hour
      await emitValue()
      await initPositionView('hours')
    }, 100),
    onScrollMinutes: debounce(async function (scroll) {
      const { minuteInterval, initPositionView, emitValue } = this
      const value = getValue(scroll)
      const minute = value * minuteInterval
      this.minute = minute === 60 ? 59 : minute
      await emitValue()
      await initPositionView('minutes')
    }, 100),
    onScrollApms: debounce(async function (scroll) {
      const { apms, apm, hour, initPositionView, emitValue } = this
      const value = getValue(scroll)
      if (apms && apms[value] && apm !== apms[value].value) {
        const newHour = apm === apms[1].value ? hour - 12 : hour + 12
        this.hour = newHour
      }
      await emitValue()
      await initPositionView('apms')
    }, 100),
    async selectTime (item, type) {
      const { hour, apm, apms, initPositionView, emitValue } = this
      if (type === 'hours') {
        this.hour = item
      } else if (type === 'minutes') {
        this.minute = item
      } else if (type === 'apms' && apm !== item) {
        const newHour = item === apms[1].value ? hour + 12 : hour - 12
        this.hour = newHour
      }
      await emitValue()
      await initPositionView(type)
    },
    emitValue () {
      const { hour: h, minute, format, isTwelveFormat } = this
      const hour = isTwelveFormat && [12, 24].includes(h) ? h === 24 ? 12 : 0 : h
      this.dateMoment = moment((this.dateMoment).set({
        hour,
        minute
      }), format)
    },
    validateFormat () {
      if (this.isTwelveFormat && !this.apms) throw new Error(`MazPicker - Format Error : To have the twelve hours format, the format must have "A" or "a" (Ex : ${this.format} a)`)
    },
    async buildColumnPad () {
      await this.$nextTick()
      const pad = (this.$refs?.TimePicker?.clientHeight ?? 150) / 2 - ITEM_HEIGHT / 2
      this.columnPadding = {
        height: `${pad}px`,
        flex: `0 0 ${pad}px`
      }
    },
    async initPositionView (containers = this.isTwelveFormat ? ['hours', 'minutes', 'apms'] : ['hours', 'minutes']) {
      await this.$nextTick()
      if (!Array.isArray(containers)) containers = [containers]
      this.noScrollEvent = true
      const hasSmoothEffect = true

      containers.forEach(container => {
        if (!this.$refs[container]) return
        const elem = this.$refs[container][0]
        const timePickerHeight = this.$refs.TimePicker?.clientHeight ?? null
        scrollSmoothElement(elem, timePickerHeight, hasSmoothEffect, ITEM_HEIGHT)
      })
      setTimeout(() => {
        this.noScrollEvent = false
      }, 300)
    },
  }
}
</script>
