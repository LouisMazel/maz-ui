<template>
  <Teleport to="body" :selector="selector">
    <Transition
      appear
      :name="transition"
      @after-enter="onBackdropAnimationEnter"
      @after-leave="onBackdropAnimationLeave"
    >
      <div
        v-if="present"
        :class="[
          'm-backdrop',
          { '--backdrop-present': present },
          backdropClass,
        ]"
        tabindex="-1"
        role="dialog"
      >
        <div
          class="m-backdrop-overlay"
          :class="{ '--disabled': persistent }"
          tabindex="-1"
          @click.self="onBackdropClicked"
        />
        <div
          class="m-backdrop-content"
          :class="modalClass"
          v-bind="$attrs"
          role="document"
          tabindex="0"
        >
          <slot :close="() => close()"></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
  import { defineComponent, ref, PropType, watch } from 'vue'

  const MODAL_OPENED_CLASS = '--backdrop-present'

  const addClassToDocument = () =>
    document.documentElement.classList.add(MODAL_OPENED_CLASS)
  const removeClassFromDocument = () =>
    document.documentElement.classList.remove(MODAL_OPENED_CLASS)

  export default defineComponent({
    inheritAttrs: false,

    props: {
      modelValue: { type: Boolean, default: true },
      selector: { type: String, default: '#modals-container' },
      beforeClose: {
        type: Function as PropType<() => boolean>,
        default: undefined,
      },
      persistent: { type: Boolean, default: false },
      backdropClass: { type: [Array, String, Object], default: () => [] },
      transition: { type: String, default: 'backdrop-anim' },
      escKey: { type: Boolean, default: true },
      zOffset: { type: Number, default: 20 },
      defaultZIndex: { type: Number, default: 1050 },
      modalClass: { type: String, default: undefined },
    },

    emits: ['open', 'close', 'update:model-value'],

    setup(props, { emit }) {
      const present = ref(props.modelValue)

      const $toggleBackdrop = (show: boolean) => (present.value = show)

      const openModal = () => $toggleBackdrop(true)
      const close = () => $toggleBackdrop(false)

      const toggleModal = (show: boolean, ...rest: unknown[]) => {
        const guard: (...args: unknown[]) => boolean = props.beforeClose
          ? props.beforeClose
          : () => true

        if (show) {
          openModal()
        } else if (!props.beforeClose || guard(...rest) === false) {
          close()
        }
      }

      const onBackdropAnimationEnter = () => {
        emit('open')
      }

      const onBackdropAnimationLeave = () => {
        emit('update:model-value', false)
        emit('close')
      }

      const onBackdropClicked = () => {
        if (!props.persistent) toggleModal(false)
      }

      const onKeyPress = (event: KeyboardEvent) => {
        if (props.escKey && event.code === 'Escape') {
          if (!props.persistent) toggleModal(false)
        }
      }

      watch(
        () => props.modelValue,
        (value) => {
          present.value = value
          if (value) {
            addClassToDocument()
            window.addEventListener('keyup', onKeyPress, false)
          } else {
            window.removeEventListener('keyup', onKeyPress)
            removeClassFromDocument()
          }
        },
        // { immediate: true },
      )

      return {
        present,
        openModal,
        close,
        onBackdropClicked,
        onBackdropAnimationEnter,
        onBackdropAnimationLeave,
        toggleModal,
      }
    },
  })
</script>

<style lang="postcss">
  /* stylelint-disable no-descending-specificity */
  html.--backdrop-present {
    overflow-y: hidden;
    height: 100vh;
  }

  .m-backdrop.bottom-sheet-anim-enter-active,
  .m-backdrop.bottom-sheet-anim-leave-active {
    transition: opacity ease-in-out 250ms;

    & .m-backdrop-content {
      transition: transform ease-in-out 250ms;
      transform: translateY(0);
    }
  }

  .m-backdrop.bottom-sheet-anim-enter-from,
  .m-backdrop.bottom-sheet-anim-leave-to {
    opacity: 0;

    & .m-backdrop-content {
      transform: translateY(100%);
    }
  }

  .m-backdrop.modal-anim-enter-active,
  .m-backdrop.modal-anim-leave-active {
    transition: opacity ease-in-out 250ms;

    & .m-backdrop-content {
      transition: transform ease-in-out 250ms;
      transform: translateY(0);
    }
  }

  .m-backdrop.modal-anim-enter-from,
  .m-backdrop.modal-anim-leave-to {
    opacity: 0;

    & .m-backdrop-content {
      transform: translateY(-25px);
    }
  }

  .m-backdrop.backdrop-anim-enter-active,
  .m-backdrop.backdrop-anim-leave-active {
    transition: opacity ease-in-out 250ms;
  }

  .m-backdrop.backdrop-anim-enter-from,
  .m-backdrop.backdrop-anim-leave-to {
    opacity: 0;
  }

  .m-backdrop {
    @apply maz-fixed maz-inset-0 maz-flex maz-opacity-100 maz-flex-center;

    backdrop-filter: blur(3px);
    z-index: 1050;

    &-overlay {
      touch-action: none;

      @apply maz-absolute maz-inset-0 maz-bg-overlay;

      &:not(.--disabled) {
        @apply maz-cursor-pointer;
      }
    }

    &-content {
      @apply focus:maz-outline-none maz-relative maz-z-1;
    }

    &.--bottom-sheet {
      & .m-backdrop-content {
        @apply maz-absolute maz-bottom-0 maz-left-0 maz-right-0;
      }
    }

    &.--fullscreen {
      @apply maz-items-start mob-l:maz-items-center;

      &.--center-top {
        @apply maz-items-start mob-l:maz-pt-28;
      }

      & .m-backdrop-content {
        @apply maz-relative maz-w-full mob-l:maz-w-auto;
      }
    }
  }
</style>
