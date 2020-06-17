<template>
  <transition
    name="maz-dialog-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <div
      v-if="value"
      class="maz-dialog maz-dialog--mask"
      :class="{
        'maz-dialog--success': success,
        'maz-dialog--danger': danger,
        'maz-dialog--fullsize': fullsize,
        'maz-is-dark': dark
      }"
    >
      <div class="maz-dialog__wrapper maz-flex maz-align-center">
        <div
          v-click-outside="vcoConfig"
          :style="widthStyle"
          class="maz-dialog__container maz-dialog-animation maz-flex maz-direction-column maz-bg-color maz-border-radius"
          @keydown.esc="closeDialog"
        >
          <div
            v-if="!noHeader"
            class="maz-dialog__header maz-flex maz-space-between maz-align-center maz-p-3"
          >
            <!-- Replace the title element text -->
            <slot name="title">
              <!-- `<p class="maz-dialog__header__title">Title header</p>` -->
              <p class="maz-dialog__header__title">
                {{ title }}
              </p>
            </slot>

            <div
              v-if="!noClose"
              class="maz-flex close-modal"
              @click="$emit('input', false)"
            >
              <i class="material-icons">
                close
              </i>
            </div>
          </div>
          <div
            class="maz-dialog__body maz-p-3 maz-text-color"
          >
            <!-- Replace the content -->
            <slot>
              <!-- `<p>Content</p>` -->
              <p>Content</p>
            </slot>
          </div>
          <div
            v-if="!noFooter"
            class="maz-dialog__footer maz-flex maz-align-end maz-justify-end maz-p-3"
          >
            <!-- Replace the footer bar -->
            <slot name="footer">
              <!-- Two `<MazBtn />` -->
              <MazBtn
                color="default"
                outline
                size="md"
                @click="closeDialog"
              >
                Close
              </MazBtn>
              <MazBtn
                v-if="!noConfirm"
                class="maz-ml-3"
                size="md"
                :color="buttonConfirmColor"
                @click="onConfirm($event)"
              >
                Confirm
              </MazBtn>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import vClickOutside from 'v-click-outside'
import MazBtn from '../MazBtn'

export default {
  name: 'MazDialog',
  components: { MazBtn },
  directives: {
    clickOutside: vClickOutside.directive
  },
  props: {
    // `true` if dialog is open / `false` if is close
    value: { type: Boolean, required: true },
    // is the `max-width` of the dialog in pixels
    maxWidth: { type: Number, default: 500 },
    // if is `true`, is not possible to close he dialog with a click outside
    persistent: { type: Boolean, default: false },
    // remove the header
    noHeader: { type: Boolean, default: false },
    // remove the footer
    noFooter: { type: Boolean, default: false },
    // remove the close button
    noClose: { type: Boolean, default: false },
    // remove the confirm button
    noConfirm: { type: Boolean, default: false },
    // add "success" style to the dialog
    success: { type: Boolean, default: false },
    // add "danger" style to the dialog
    danger: { type: Boolean, default: false },
    // add "dark" style to the dialog
    dark: { type: Boolean, default: false },
    // exclude elements classes (elements sometimes can close the dialog)
    excludedClasses: { type: Array, default: Array },
    // make dialog fullsize
    fullsize: { type: Boolean, default: false },
    // title of the dialog
    title: { type: String, default: 'Header title' }
  },
  data () {
    return {
      vcoConfig: {
        handler: this.closeDialog,
        middleware: this.preventClickOutside,
        events: ['click'],
        isActive: true
      }
    }
  },
  computed: {
    widthStyle () {
      const { fullsize, maxWidth } = this
      return {
        maxWidth: fullsize ? null : `${maxWidth}px`
      }
    },
    buttonConfirmColor () {
      return this.danger
        ? 'danger'
        : this.success
          ? 'success'
          : 'primary'
    }
  },
  methods: {
    preventClickOutside () {
      return !this.excludedClasses.includes(event.target.className)
    },
    closeDialog () {
      if (!this.persistent) {
        // sent when dialog is close
        // @arg Boolean `false`
        this.$emit('input', false)
      }
    },
    afterEnter (e) {
      // sent when after dialog is open
      // @arg event
      this.$emit('opened', e)
    },
    afterLeave (e) {
      // sent when after dialog is close
      // @arg event
      this.$emit('closed', e)
    },
    onConfirm (e) {
      // sent when you click on confirm button
      // @arg event
      this.$emit('confirm', e)
    }
  }
}
</script>
