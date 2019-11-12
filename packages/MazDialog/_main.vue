<template>
  <transition
    :name="transitionName"
    class="maz-dialog"
  >
    <div
      v-show="value"
      class="maz-dialog__mask"
    >
      <div class="maz-dialog__wrapper flex align-center">
        <div
          v-click-outside="clickOutside"
          :style="widthStyle"
          class="maz-dialog__container flex flex-direction-column"
        >
          <div
            v-if="!hideHeader"
            class="maz-dialog__header flex justify-content-between align-center p-3"
            :class="{
              'success': success,
              'danger': danger
            }"
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
                <i class="ctk-font icon-ctk-close" />
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
            class="maz-dialog__footer flex flex-end p-3"
          >
            <slot name="footer">
              <MazBtn
                size="sm"
                @click="$emit('input', false)"
              >
                Close
              </MazBtn>
              <MazBtn
                v-if="!noValidation"
                class="ml-3"
                type="danger"
                size="sm"
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
      value: { type: Boolean, required: true },
      maxWidth: { type: String, default: '500px' },
      persistent: { type: Boolean, default: false },
      hasClose: { type: Boolean, default: true },
      transitionName: { type: String, default: 'modal' },
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
      clickOutside () {
        if (!this.persistent) {
          this.$emit('input', false)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .maz-dialog {
    &__mask {
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
      border-radius: 0.3rem;

      @media only screen and (max-width: var(--maz-breakpoint-tablet)) {
        width: 100%;
      }
    }

    &__header {
      background-color: var(--maz-bg-color-dark);
      border-top-left-radius: 0.3rem;
      border-top-right-radius: 0.3rem;
      border: none;
      color: var(--maz-text-color-dark);

      &.success {
        background-color: var(--maz-primary-color);
      }

      &.danger {
        background-color: var(--maz-error-color);
      }

      h5 {
        color: white;
        margin-top: 0;
        font-size: 1.25rem !important;
      }

      .close-modal i {
        font-size: 26px;
        color: #FFF;
        cursor: pointer;

        &:hover {
          font-weight: bold;
        }
      }
    }
  }

  /** Modal animation **/
  // .modal-enter,
  // .modal-leave-active {
  //   transform: translate3d(0, 0, 0);
  //   transition: all 0.3s ease;
  //   opacity: 0;
  // }

  // .modal-enter .modal-container,
  // .modal-leave-active .modal-container {
  //   transition: all 0.3s ease;
  //   transform: translate3d(0, -300px, 0);
  //   opacity: 0;
  //   visibility: visible;
  // }
  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
</style>
