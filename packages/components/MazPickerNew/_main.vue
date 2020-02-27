<template>
  <div
    :id="uniqueId"
    ref="mazPicker"
    class="maz-picker-new"
    :class="{
      'is-dark': dark
    }"
    @blur.capture="closePicker"
  >
    <MazInput
      :id="uniqueId"
      v-model="inputValue"
      v-bind="$attrs"
      readonly
      :focus="hasPickerOpen"
      @focus="openPicker(true)"
    />

    <transition
      :name="position !== 'bottom' ? 'slide' : 'slideinvert'"
    >
      <PickersContainer
        v-if="hasPickerOpen"
        :date-moment="dateMoment"
      />
    </transition>
  </div>
</template>

<script>
  import PickersContainer from './PickersContainer'
  import uniqueId from './../../mixins/uniqueId'
  import moment from 'moment'

  export default {
    name: 'MazPickerNew',
    components: { PickersContainer },
    mixins: [uniqueId],
    props: {
      // input value
      value: {
        validator: prop => ['string', 'object'].includes(typeof prop) || prop === null,
        required: true
      },
      // if is `true`, the picker is open
      open: { type: Boolean, default: false },
      // override the date picker postion (top / bottom)
      position: { type: String, default: null },
      // format returned
      format: { type: String, default: 'YYYY-MM-DD' },
      // format of input
      formatted: { type: String, default: 'LL' },
      // set dark mode
      dark: { type: Boolean, default: false }
    },
    data () {
      return {
        isOpen: null
      }
    },
    computed: {
      inputValue () {
        return this.value ? moment(this.value).format(this.formatted) : null
      },
      dateMoment () {
        return this.value ? moment(this.value) : moment()
      },
      dateFormat () {
        return this.value ? moment(this.value).format(this.format) : null
      },
      hasPickerOpen () {
        return this.isOpen || this.open
      }
    },
    methods: {
      openPicker () {
        this.isOpen = true
      },
      closePicker () {
        this.isOpen = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .maz-picker-new {
    position: relative;
  }
</style>
