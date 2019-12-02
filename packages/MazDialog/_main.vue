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
        'maz-dialog--danger': danger
      }"
    >
      <div class="maz-dialog__wrapper flex align-center">
        <div
          v-click-outside="closeDialog"
          :style="widthStyle"
          class="maz-dialog__container flex direction-column"
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
            class="maz-dialog__footer flex align-end p-3"
          >
            <slot name="footer">
              <MazBtn
                type="default"
                outline
                size="md"
                @click="$emit('input', false)"
              >
                Close
              </MazBtn>
              <MazBtn
                v-if="!noValidation"
                class="ml-3"
                type="primary"
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
      danger: { type: Boolean, default: false }
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

<style lang="scss" scoped>
  .maz-dialog {
    &--mask {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1050;
      width: 100%;
      height: 100%;
      background-color: rgba(#303144, 0.7);
      transition: all 0.3s ease;
      overflow-y: auto;
      overflow-x: hidden;
    }

    &__wrapper {
      vertical-align: middle;
      min-height: 100%;
      width: 100%;
    }

    &__body {
      max-height: 100vh;
      color: var(--maz-text-color);
    }

    &__container {
      margin: 30px auto;
      background-color: #FFF;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
      transition: all 0.3s ease;
      border-radius: var(--maz-border-radius);

      @media only screen and (max-width: var(--maz-breakpoint-tablet)) {
        width: 100%;
      }
    }

    &__header {
      background-color: var(--maz-bg-color-dark);
      border-top-left-radius: var(--maz-border-radius);
      border-top-right-radius: var(--maz-border-radius);
      border: none;
      color: var(--maz-text-color-dark);

      h5 {
        color: white;
        margin-top: 0;
        font-size: 1.25rem !important;
      }

      .close-modal i {
        font-size: 18px;
        color: #FFF;
        cursor: pointer;

        &:hover {
          font-weight: bold;
        }
      }
    }

    &--success {
      .maz-dialog__header {
        background-color: var(--maz-valid-color);
      }
    }

    &--danger {
      .maz-dialog__header {
        background-color: var(--maz-error-color);
      }
    }
  }

  /** Modal animation **/
  .dialog-fade-enter-active .maz-dialog__container {
    animation: dialog-fade-in 0.4s;
  }

  .dialog-fade-leave-active .maz-dialog__container {
    animation: dialog-fade-out 0.4s;
  }

  @keyframes dialog-fade-in {
    0% {
      transform: translate3d(0, -30px, 0);
      opacity: 0;
    }

    100% {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }

  @keyframes dialog-fade-out {
    0% {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }

    100% {
      transform: translate3d(0, -30px, 0);
      opacity: 0;
    }
  }
</style>
