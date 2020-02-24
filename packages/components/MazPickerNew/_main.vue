<template>
  <div
    :id="uniqueId"
    ref="mazPicker"
    class="maz-picker-new"
    @blur.capture="closePicker"
  >
    <MazInput
      :id="uniqueId"
      v-model="value"
      v-bind="$attrs"
      readonly
      @focus="openPicker(true)"
    />

    <transition
      :name="position !== 'bottom' ? 'slide' : 'slideinvert'"
    >
      <PickersContainer
        v-if="hasPickerOpen"
      />
    </transition>
  </div>
</template>

<script>
  import PickersContainer from './_subs/PickersContainer'
  import uniqueId from './../../mixins/uniqueId'

  export default {
    name: 'MazPickerNew',
    components: { PickersContainer },
    mixins: [uniqueId],
    props: {
      value: {
        validator: prop => ['string', 'object'].includes(typeof prop) || prop === null,
        required: true
      },
      open: { type: Boolean, default: false },
      // override the date picker postion (top / bottom)
      position: { type: String, default: null }
    },
    data () {
      return {
        isOpen: false
      }
    },
    computed: {
      hasPickerOpen () {
        return this.open || this.isOpen
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
