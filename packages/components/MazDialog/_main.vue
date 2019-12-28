<template>
  <transition
    name="dialog-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <div
      v-if="value"
      class="maz-dialog maz-dialog--mask"
      :class="{
        'maz-dialog--success': success,
        'maz-dialog--danger': danger,
        'is-dark': dark
      }"
    >
      <div class="maz-dialog__wrapper flex align-center">
        <div
          v-click-outside="closeDialog"
          :style="widthStyle"
          class="maz-dialog__container dialog-animation flex direction-column"
          @keydown.esc="closeDialog"
        >
          <div
            v-if="!hideHeader"
            class="maz-dialog__header flex space-between align-center p-3"
          >
            <p class="fw-400 fs-20 m-0 w-100">
              <slot name="title">
                Header
              </slot>
            </p>

            <!-- Close button -->
            <transition name="fade">
              <div
                v-if="hasClose"
                class="flex close-modal"
                @click="$emit('input', false)"
              >
                <i class="material-icons">
                  close
                </i>
              </div>
            </transition>
          </div>
          <div
            class="maz-dialog__body p-3"
          >
            <slot>Content</slot>
          </div>
          <div
            v-if="!hideFooter"
            class="maz-dialog__footer flex align-end justify-end p-3"
          >
            <slot name="footer">
              <MazBtn
                id="DialogCloseBtn"
                color="default"
                outline
                size="md"
                @click="$emit('input', false)"
              >
                Close
              </MazBtn>
              <MazBtn
                v-if="!noValidation"
                class="ml-3"
                color="primary"
                size="md"
                @click="$emit('validate')"
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

  export default {
    name: 'MazDialog',
    directives: {
      clickOutside: vClickOutside.directive
    },
    props: {
      value: { type: Boolean, default: false },
      maxWidth: { type: String, default: '500px' },
      persistent: { type: Boolean, default: false },
      hasClose: { type: Boolean, default: true },
      hideHeader: { type: Boolean, default: false },
      hideFooter: { type: Boolean, default: false },
      noValidation: { type: Boolean, default: false },
      success: { type: Boolean, default: false },
      danger: { type: Boolean, default: false },
      dark: { type: Boolean, default: false }
    },
    computed: {
      widthStyle () {
        return {
          maxWidth: this.maxWidth
        }
      }
    },
    methods: {
      closeDialog () {
        if (!this.persistent) {
          this.$emit('input', false)
        }
      },
      afterEnter () {
        this.$emit('opened')
      },
      afterLeave () {
        this.$emit('closed')
      }
    }
  }
</script>
