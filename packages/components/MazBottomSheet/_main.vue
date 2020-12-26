<template>
  <transition
    name="maz-bottom-sheet"
    class="maz-base-component maz-bottom-sheet"
  >
    <div
      v-if="value"
      class="maz-bottom-sheet__mask"
      :class="{
        'is-open': value,
        'no-overlay': noOverlay,
        'maz-is-dark': dark
      }"
    >
      <div
        v-click-outside="vcoConfig"
        class="maz-bottom-sheet__wrapper"
      >
        <div
          class="maz-bottom-sheet__container maz-bottom-sheet-animation maz-bg-color maz-position-relative maz-elevation"
          :class="{
            'maz-py-6': !noPadding
          }"
        >
          <!-- Slot content -->
          <slot>
            <!-- `<h1>Default content</h1>` -->
            <div class="maz-flex maz-direction-column maz-flex-center">
              <h1>Default content</h1>
            </div>
          </slot>
          <MazBtn
            v-if="!noClose"
            size="mini"
            class="maz-bottom-sheet__close"
            fab
            no-shadow
            color="transparent"
            @click="$emit('input', false)"
          >
            <i class="material-icons maz-text-color">close</i>
          </MazBtn>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import vClickOutside from 'v-click-outside'
import MazBtn from '../MazBtn'

export default {
  name: 'MazBottomSheet',
  components: { MazBtn },
  directives: {
    clickOutside: vClickOutside.directive
  },
  props: {
    value: { type: Boolean, required: false },
    excludedClasses: { type: Array, default: Array },
    persistent: { type: Boolean, default: false },
    noClose: { type: Boolean, default: false },
    noPadding: { type: Boolean, default: false },
    noOverlay: { type: Boolean, default: false },
    dark: { type: Boolean, default: false }
  },
  data () {
    return {
      vcoConfig: {
        handler: this.closeSheet,
        middleware: this.preventClickOutside,
        events: ['click'],
        isActive: true
      }
    }
  },
  methods: {
    preventClickOutside () {
      return !this.excludedClasses.includes(event.target.className)
    },
    closeSheet () {
      if (this.persistent) return
      // Return state of bottom sheet
      // @arg Boolean
      this.$emit('input', false)
      // Emit on close sheet
      this.$emit('close')
    }
  }
}
</script>
