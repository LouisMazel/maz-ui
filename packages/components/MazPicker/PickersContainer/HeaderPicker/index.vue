<template>
  <div
    class="header-picker p-2 bg-primary text-white flex"
  >
    <div
      v-if="hasDate"
      class="header-picker__date-container flex-1 flex direction-column space-around"
    >
      <TransitionGroup
        :name="transitionName"
        tag="div"
        class="header-picker__year dots-text"
      >
        <span
          v-for="y in [year]"
          :key="y"
        >
          {{ y }}
        </span>
      </TransitionGroup>
      <TransitionGroup
        :name="transitionName"
        tag="div"
        class="header-picker__date dots-text"
      >
        <span
          v-for="date in [dateFormatted]"
          :key="date"
          class="dots-text "
        >
          {{ dateFormatted ? date : '-' }}
        </span>
      </TransitionGroup>
    </div>
    <div
      v-if="hasTime && !isTwelveFormat"
      class="header-picker__time flex"
      :class="[
        !hasDate ? 'flex-center': 'align-end'
      ]"
    >
      <TransitionGroup
        v-if="timeFormatted.hour"
        :name="transitionName"
        class="header-picker__hour flex justify-end"
      >
        <span
          v-for="hour in [timeFormatted.hour]"
          :key="hour"
        >
          {{ hour }}
        </span>
      </TransitionGroup>
      <span
        class="header-picker__dots-divider"
      >
        {{ timeFormatted.hour ? ':' : '-' }}
      </span>
      <TransitionGroup
        v-if="timeFormatted.minute"
        :name="transitionName"
        class="header-picker__minute"
      >
        <span
          v-for="min in [timeFormatted.minute]"
          :key="min"
        >
          {{ min }}
        </span>
      </TransitionGroup>
    </div>
    <div
      v-else-if="hasTime"
      class="header-picker__time flex"
      :class="[
        !hasDate ? 'flex-center': 'align-end'
      ]"
    >
      <TransitionGroup
        :name="transitionName"
        class="header-picker__twelve flex justify-center"
      >
        <span
          v-for="(time, i) in [timeFormatted]"
          :key="`${time}-${i}`"
        >
          {{ timeFormatted || '-' }}
        </span>
      </TransitionGroup>
    </div>
    <MazBtn
      fab
      size="mini"
      no-shadow
      class="header-picker__close"
      @click="close"
    >
      <i class="material-icons">
        close
      </i>
    </MazBtn>
  </div>
</template>

<script>
import moment from 'moment'
import { getFormattedValuesIntl, getTimeFormat, EventBus } from './../../utils'

export default {
  name: 'HeaderPicker',
  props: {
    value: { type: Object, default: null },
    locale: { type: String, required: true },
    hasTime: { type: Boolean, required: true },
    hasDate: { type: Boolean, required: true },
    format: { type: String, required: true }
  },
  data () {
    return {
      transitionName: 'slidevnext',
      currentDate: this.value
    }
  },
  computed: {
    isRangeMode () {
      return !!this.value && Object.keys(this.value).includes('start')
    },
    currentValue () {
      if (this.isRangeMode) {
        return this.value.end || moment()
      }
      return this.value || moment()
    },
    year () {
      return this.currentValue.year()
    },
    dateFormatted () {
      const dates = []
      const { locale } = this
      if (this.isRangeMode) {
        dates.push(this.value.start, this.value.end)
      } else {
        dates.push(this.value)
      }
      return getFormattedValuesIntl({ locale, dates })
    },
    timeFormatted () {
      return !this.isTwelveFormat ? {
        hour: this?.value?.format('HH') ?? null,
        minute: this?.value?.format('mm') ?? null
      } : this?.value?.format(this.timeFormat) ?? null
    },
    timeFormat () {
      return getTimeFormat(this.format)
    },
    isTwelveFormat () {
      return this.timeFormat.includes('A') || this.timeFormat.includes('a')
    }
  },
  watch: {
    value: {
      handler () {
        const newValueIsSmaller = this.currentDate ? this.currentValue.isBefore(this.currentDate) : false
        this.transitionName = newValueIsSmaller ? 'slidevprev' : 'slidevnext'
        this.$nextTick(() => { this.currentDate = this.currentValue })
      },
      immediate: true
    }
  },
  methods: {
    close (e) {
      EventBus.$emit('close', e)
    }
  }
}
</script>
