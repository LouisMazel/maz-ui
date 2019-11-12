<template>
  <transition
    :name="transitionName"
  >
    <div class="modal-mask">
      <div class="modal-wrapper flex align-center">
        <div
          v-click-outside="clickOutside"
          :style="widthStyle"
          class="modal-container flex flex-direction-column"
        >
          <div
            v-if="!hideHeader"
            class="modal-header flex justify-content-between align-center p-3"
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
                @click="$emit('handle-close')"
              >
                <i class="ctk-font icon-ctk-close" />
              </div>
            </transition>
          </div>
          <div
            :style="bgStyle"
            class="modal-body p-0"
          >
            <slot>Content</slot>
          </div>
          <div
            v-if="!hideFooter"
            class="modal-footer flex flex-end p-3"
          >
            <slot name="footer">
              <button
                class="btn btn-primary"
                @click="$emit('handle-close')"
              >
                {{ $t('app.buttons.labels.close') | capitalize }}
              </button>
              <button
                v-if="!noValidation"
                class="btn btn-danger ml-3"
                @click="$emit('validate')"
              >
                {{ $t('app.buttons.labels.confirm') | capitalize }}
              </button>
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
    name: 'LmDialog',
    directives: {
      clickOutside: vClickOutside.directive
    },
    props: {
      maxWidth: { type: String, default: '500px' },
      bgColor: { type: String, default: null },
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
      bgStyle () {
        return {
          backgroundColor: this.bgColor
        }
      },
      widthStyle () {
        return {
          maxWidth: this.maxWidth
        }
      }
    },
    methods: {
      clickOutside () {
        if (!this.persistent) {
          this.$emit('handle-close')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .modal-mask {
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

  .modal-wrapper {
    vertical-align: middle;
    min-height: 100%;
    width: 100%;
  }

  .modal-body {
    max-height: 100vh;
    color: $dark-color;
  }

  .modal-container {
    margin: 30px auto;
    background-color: #FFF;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    border-radius: 0.3rem;

    @media only screen and (max-width: $breakpoint-tablet) {
      width: 100%;
    }
  }

  .modal-header {
    background-color: $background-color;
    border-top-left-radius: 0.3rem;
    border-top-right-radius: 0.3rem;
    border: none;

    &.success {
      background-color: $brand-color;
    }
    &.danger {
      background-color: $danger-color;
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

  /** Modal animation **/
  .modal-enter,
  .modal-leave-active {
    transform: translate3d(0, 0, 0);
    transition: all 0.3s ease;
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    transition: all 0.3s ease;
    transform: translate3d(0, -300px, 0);
    opacity: 0;
    visibility: visible;
  }
</style>
