<template>
  <div
    class="pickers-container bg-color-light"
    :class="[position, { 'inline': inline }]"
    tabindex="0"
  >
    <HeaderPicker
      v-if="hasHeader"
      :value="dateMoment"
    />
    <Calendar
      v-model="dateMoment"
      :locale="locale"
      :min-date="minDate"
      :max-date="maxDate"
      :no-weekends-days="noWeekendsDays"
      :disabled-dates="disabledDates"
      :disabled-weekly="disabledWeekly"
      :is-visible="isVisible"
      :has-double="hasDouble"
    />
    <FooterPicker
      v-if="hasFooter"
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
    components: { HeaderPicker, Calendar, FooterPicker },
    props: {
      value: { type: Object, required: true },
      locale: { type: String, default: null },
      position: { type: String, required: true },
      hasHeader: { type: Boolean, required: true },
      hasFooter: { type: Boolean, required: true },
      hasValidate: { type: Boolean, required: true },
      hasNow: { type: Boolean, required: true },
      nowTranslation: { type: String, required: true },
      minDate: { type: Object, default: null },
      maxDate: { type: Object, default: null },
      noWeekendsDays: { type: Boolean, default: false },
      autoClose: { type: Boolean, default: false },
      inline: { type: Boolean, default: false },
      isVisible: { type: Boolean, default: false },
      disabledDates: { type: Array, required: true },
      disabledWeekly: { type: Array, required: true },
      hasDouble: { type: Boolean, required: true }
    },
    computed: {
      dateMoment: {
        get () {
          return this.value
        },
        set (day) {
          this.$emit('input', day)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .pickers-container {
    border-radius: $border-radius;
    overflow: hidden;
    z-index: 9;
    outline: none;

    &:not(.inline) {
      box-shadow: 0 0 8px 0 rgba(0, 0, 0, .1);
      position: absolute;
      top: 100%;
      left: 0;
    }

    &.top {
      top: inherit;
      bottom: 100%;
    }

    &.right {
      left: inherit;
      right: 0;
    }
  }
</style>
