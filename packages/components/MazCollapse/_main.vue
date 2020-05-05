<template>
  <div
    class="maz-collapse maz-position-relative"
    :class="{
      'maz-is-dark': dark,
      'is-open': isOpen
    }"
  >
    <MazBtn
      class="maz-collapse__header-btn maz-flex maz-flex-center maz-border-radius-0"
      :color="dark ? 'dark' : 'white'"
      size="md"
      @click="openContent"
    >
      <!-- Header slot: replace the text in collapse button -->
      <slot name="header-text">
        <!-- `Default Header` -->
        Default Header
      </slot>
      <ArrowIcon
        class="maz-collapse__header-btn__arrow maz-ml-2"
        :white="dark"
        :color="arrowColor"
        :orientation="isOpen ? 'up': null"
      />
    </MazBtn>
    <MazTransitionExpand class="maz-collapse__content">
      <div v-show="hasContentOpen">
        <!-- Content default slot -->
        <slot>
          <!-- `<p>Default Content</p>` -->
          <p>Default Content</p>
        </slot>
      </div>
    </MazTransitionExpand>
  </div>
</template>

<script>
import MazTransitionExpand from '../MazTransitionExpand'
import ArrowIcon from '../_subs/ArrowIcon'

/**
 * > MazCollpase is a component to show or not content
 */

export default {
  name: 'MazCollapse',
  components: {
    MazTransitionExpand,
    ArrowIcon
  },
  props: {
    // Value is a Boolean to open or close the collapse
    value: { type: Boolean, default: false },
    // Set `true` to enable dark mode
    dark: { type: Boolean, default: false },
    // Is the color of the arrow, must be a hex color
    arrowColor: { type: String, default: 'black' }
  },
  data () {
    return {
      isOpen: this.value
    }
  },
  computed: {
    hasContentOpen: {
      get () {
        return this.isOpen
      },
      set (value) {
        // return a `true` or `false` if the collapse is open or not
        // @arg Boolean
        this.$emit('input', value)
        this.isOpen = value
      }
    }
  },
  watch: {
    value (val) {
      this.isOpen = val
    }
  },
  methods: {
    openContent () {
      this.hasContentOpen = !this.hasContentOpen
    }
  }
}
</script>
