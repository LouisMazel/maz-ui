<template>
  <div
    :class="[{'is-dark': dark}]"
    class="datepicker-buttons-container flex justify-end"
  >
    <button
      v-if="hasButtonNow"
      class="datepicker-button now flex align-center justify-center"
      :class="{'right-margin': hasButtonValidate}"
      tabindex="-1"
      type="button"
      @click="emitNow()"
    >
      <span
        :style="[bgStyle]"
        class="datepicker-button-effect"
      />
      <span
        class="datepicker-button-content"
        :style="[colorStyle]"
      >
        {{ buttonNowTranslation || 'Now' }}
      </span>
    </button>
    <button
      v-if="hasButtonValidate"
      type="button"
      tabindex="-1"
      class="datepicker-button validate flex flex-center"
      @click.stop="$emit('validate')"
    >
      <span
        class="datepicker-button-effect"
        :style="[bgStyle]"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        :style="[colorStyle]"
      >
        <path
          d="M0 0h24v24H0z"
          fill="none"
        />
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    </button>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'ButtonValidate',
  props: {
    /**
     * TODO: Remove wrong default values
     */
    dark: { type: Boolean, default: null },
    buttonColor: { type: String, default: null },
    buttonNowTranslation: { type: String, default: null },
    onlyTime: { type: Boolean, default: null },
    noButtonNow: { type: Boolean, default: null },
    range: { type: Boolean, default: null },
    hasButtonValidate: { type: Boolean, default: null }
  },
  computed: {
    colorStyle () {
      return {
        color: this.buttonColor,
        fill: this.buttonColor
      }
    },
    bgStyle () {
      return {
        backgroundColor: this.buttonColor
      }
    },
    hasButtonNow () {
      return !this.onlyTime && !this.noButtonNow && !this.range
    }
  },
  methods: {
    emitNow () {
      this.$emit('now', moment().format('YYYY-MM-DD HH:mm'))
    }
  }
}
</script>
