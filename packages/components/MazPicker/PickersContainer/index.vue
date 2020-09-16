<template>
  <div
    class="pickers-container maz-elevation"
    :class="[position, { 'inline': inline }]"
    tabindex="-1"
  >
    <HeaderPicker
      v-if="hasHeader"
      :value="dateMoment"
      :locale="locale"
      :has-time="hasTime"
      :has-date="hasDate"
      :format="format"
      :color="color"
    />
    <Calendar
      v-model="dateMoment"
      :format="format"
      :locale="locale"
      :color="color"
      :shortcut="shortcut"
      :min-date="minDate"
      :max-date="maxDate"
      :minute-interval="minuteInterval"
      :no-weekends-days="noWeekendsDays"
      :disabled-dates="disabledDates"
      :disabled-weekly="disabledWeekly"
      :is-visible="isVisible"
      :has-double="hasDouble"
      :shortcuts="shortcuts"
      :has-keyboard="hasKeyboard"
      :has-time="hasTime"
      :has-date="hasDate"
      :has-shortcuts="hasShortcuts"
      :disabled-hours="disabledHours"
    />
    <FooterPicker
      v-if="hasFooter"
      :color="color"
      :value="dateMoment"
      :has-validate="hasValidate"
      :has-now="hasNow"
      :now-translation="nowTranslation"
    />
  </div>
</template>

<script>
import HeaderPicker from './HeaderPicker'
import Calendar from './Calendar'
import FooterPicker from './FooterPicker'

export default {
  name: 'PickersContainer',
  components: {
    HeaderPicker,
    Calendar,
    FooterPicker
  },
  props: {
    value: { type: Object, default: null },
    format: { type: String, default: null },
    shortcut: { type: String, default: null },
    locale: { type: String, default: null },
    position: { type: String, required: true },
    color: { type: String, required: true },
    hasHeader: { type: Boolean, required: true },
    hasFooter: { type: Boolean, required: true },
    hasValidate: { type: Boolean, required: true },
    hasNow: { type: Boolean, required: true },
    nowTranslation: { type: String, required: true },
    minDate: { type: String, default: null },
    maxDate: { type: String, default: null },
    noWeekendsDays: { type: Boolean, default: false },
    autoClose: { type: Boolean, default: false },
    inline: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: false },
    disabledDates: { type: Array, required: true },
    disabledWeekly: { type: Array, required: true },
    hasDouble: { type: Boolean, required: true },
    hasKeyboard: { type: Boolean, required: true },
    hasTime: { type: Boolean, required: true },
    hasDate: { type: Boolean, required: true },
    shortcuts: { type: Array, default: null },
    hasShortcuts: { type: Boolean, required: true },
    minuteInterval: { type: Number, required: true },
    disabledHours: { type: Array, required: true }
  },
  computed: {
    dateMoment: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>
