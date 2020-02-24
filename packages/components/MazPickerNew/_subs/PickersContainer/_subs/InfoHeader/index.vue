<template>
  <div
    class="header-picker"
    :class="{'is-dark': dark}"
  >
    <div
      v-if="!onlyTime"
      class="header-picker-year"
    >
      <transition-group :name="transitionName">
        <div
          v-for="y in [year]"
          :key="y"
        >
          {{ y }}
        </div>
      </transition-group>
    </div>

    <div
      v-if="!range"
      class="flex space-between"
    >
      <transition-group
        v-if="!onlyTime"
        :name="transitionName"
        class="header-picker-date dots-text flex-1"
      >
        <span
          v-for="dateFormatted in [getDateFormatted]"
          :key="dateFormatted"
        >
          {{ value ? getDateFormatted : '...' }}
        </span>
      </transition-group>
      <div
        v-if="!isFormatTwelve && !noTime && value"
        class="header-picker-time flex"
        :style="[getTimePickerWidth()]"
        :class="[!onlyTime ? 'pl-10' : 'flex-1 justify-center']"
      >
        <transition-group
          :name="transitionName"
          class="dots-text time-number header-picker-hour flex justify-end"
        >
          <span
            v-for="hour in [dateTime.format('HH')]"
            :key="hour"
          >
            {{ hour }}
          </span>
        </transition-group>
        <span>:</span>
        <transition-group
          :name="transitionName"
          class="dots-text time-number header-picker-minute flex justify-start"
        >
          <span
            v-for="min in [dateTime.format('mm')]"
            :key="min"
          >
            {{ min }}
          </span>
        </transition-group>
      </div>
      <div
        v-else-if="!noTime && value"
        :style="[getTimePickerWidth()]"
        class="header-picker-time flex flex-fixed"
        :class="[!onlyTime ? 'pl-10' : 'flex-1 justify-center']"
      >
        <transition-group
          :name="transitionName"
          class="dots-text header-picker-hour twelve"
        >
          <span
            v-for="hour in [dateTime.format(timeFormat)]"
            :key="hour"
            class="flex-fixed"
          >
            {{ hour }}
          </span>
        </transition-group>
      </div>
      <div
        v-else-if="!noTime"
        :style="[getTimePickerWidth()]"
        class="header-picker-time flex flex-fixed"
        :class="[!onlyTime ? 'pl-10' : 'flex-1 justify-center']"
      >
        <span>...</span>
      </div>
    </div>
    <div
      v-else
      class="flex space-between"
    >
      <div class="flex space-between">
        <span class="header-picker-range dots-text flex-1">
          {{ getRangeDatesFormatted }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'HeaderPicker',
    props: {
      value: { type: [String, Object], default: null },
      color: { type: String, default: null },
      onlyTime: { type: Boolean, default: null },
      transitionName: { type: String, default: null },
      format: { type: String, default: null },
      timeFormat: { type: String, default: null },
      noTime: { type: Boolean, default: null },
      range: { type: Boolean, default: null },
      dark: { type: Boolean, default: null }
    },
    computed: {
      bgStyle () {
        return {
          padding: this.onlyTime ? '10px 0' : '10px 0 10px 10px',
          backgroundColor: this.color
        }
      },
      dateTime () {
        const date = this.value
          ? this.range
            ? (this.value.end || this.value.start)
              ? moment(this.value.end ? this.value.end : this.value.start, 'YYYY-MM-DD HH:mm')
              : moment()
            : moment(this.value, 'YYYY-MM-DD HH:mm')
          : moment()
        return date
      },
      year () {
        return this.dateTime.format('YYYY')
      },
      getDateFormatted () {
        return this.dateTime.format('ddd D MMM')
      },
      isFormatTwelve () {
        return this.format ? (this.format.indexOf('a') > -1) || (this.format.indexOf('A') > -1) : false
      },
      getRangeDatesFormatted () {
        const hasStartValues = this.value && this.value.start
        const hasEndValues = this.value && this.value.end
        if (!hasStartValues && !hasEndValues) {
          return '... - ...'
        } else if (hasStartValues || hasEndValues) {
          const datesFormatted = hasStartValues ? `${moment(this.value.start).format('ll')}` : '...'
          return hasEndValues ? `${datesFormatted} - ${moment(this.value.end).format('ll')}` : `${datesFormatted} - ...`
        } else {
          return null
        }
      }
    },
    methods: {
      getTimePickerWidth () {
        const width = this.onlyTime ? '100%' : '160px'
        const result = {
          flex: `0 0 ${width}`,
          width: `${width}`,
          minWidth: `${width}`,
          maxWidth: `${width}`
        }
        return result
      }
    }
  }
</script>
