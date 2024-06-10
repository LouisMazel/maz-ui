<script lang="ts" setup>
import { type HTMLAttributes, onMounted, ref, watch } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  teleportSelector: 'body',
  beforeClose: undefined,
  persistent: false,
  noCloseOnEscKey: false,
  transitionName: 'backdrop-anim',
  backdropClass: undefined,
  backdropContentClass: undefined,
})

const emits = defineEmits<{
  /** emitted when modal is open */
  'open': [value: void]
  /** emitted when modal is close */
  'close': [value: void]
  /** emitted when modal is open or close */
  'update:model-value': [value: boolean]
  /** emitted before modal is close */
  'before-close': [value: void]
}>()

const MODAL_OPENED_CLASS = '--backdrop-present'

function addClassToDocument() {
  document.documentElement.classList.add(MODAL_OPENED_CLASS)
}

async function removeClassFromDocument() {
  const backdropPresents = document.querySelector('.m-backdrop.--present')

  if (!backdropPresents) {
    document.documentElement.classList.remove(MODAL_OPENED_CLASS)
  }
}

export interface Props {
  modelValue?: boolean
  teleportSelector?: string
  beforeClose?: () => Promise<void> | void
  persistent?: boolean
  noCloseOnEscKey?: boolean
  transitionName?: string
  backdropClass?: HTMLAttributes['class']
  backdropContentClass?: HTMLAttributes['class']
}

const present = ref(props.modelValue)

function close() {
  toggleModal(false)
}

async function toggleModal(value) {
  if (!value) {
    emits('before-close')
    await props.beforeClose?.()
  }

  present.value = value
}

function onBackdropAnimationEnter() {
  emits('open')
}

function onBackdropAnimationLeave() {
  emits('update:model-value', false)
  emits('close')
  removeClassAndEventToDocument()
}

function onBackdropClicked() {
  if (!props.persistent) {
    close()
  }
}

function onKeyPress(event: KeyboardEvent) {
  if (!props.noCloseOnEscKey && event.key === 'Escape' && !props.persistent) {
    close()
  }
}

function addClassAndEventToDocument() {
  addClassToDocument()
  document.addEventListener('keyup', onKeyPress, false)
}

function removeClassAndEventToDocument() {
  document.removeEventListener('keyup', onKeyPress)
  removeClassFromDocument()
}

onMounted(() => {
  if (props.modelValue) {
    addClassAndEventToDocument()
  }
  else {
    removeClassAndEventToDocument()
  }
})

watch(
  () => props.modelValue,
  (value) => {
    present.value = value

    if (value) {
      addClassAndEventToDocument()
    }
    else {
      removeClassAndEventToDocument()
    }
  },
)

defineExpose({
  onBackdropAnimationEnter,
  onBackdropAnimationLeave,
  onBackdropClicked,
  close,
  present,
  toggleModal,
  onKeyPress,
})
</script>

<template>
  <Teleport :to="teleportSelector">
    <Transition
      appear
      :name="transitionName"
      @after-enter="onBackdropAnimationEnter"
      @after-leave="onBackdropAnimationLeave"
    >
      <div
        v-if="present"
        class="m-backdrop --present"
        :class="[backdropClass]"
        tabindex="-1"
        role="dialog"
      >
        <button
          class="m-backdrop-overlay"
          :class="{ '--disabled': persistent }"
          tabindex="-1"
          @click.self="onBackdropClicked"
        />
        <div
          class="m-backdrop-content"
          :class="backdropContentClass"
          v-bind="$attrs"
          role="document"
          tabindex="0"
        >
          <slot :close="close" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="postcss">
  html.--backdrop-present {
  overflow-y: hidden;
  height: 100vh !important;
}
</style>

<style lang="postcss">
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
    transition-property: transform, opacity;
    transition-duration: 250ms;
    transition-timing-function: ease-in-out;
    opacity: 1;
    transform: scale(1);
  }
}

.m-backdrop.modal-anim-enter-from,
.m-backdrop.modal-anim-leave-to {
  opacity: 0;

  & .m-backdrop-content {
    opacity: 0;
    transform: scale(0.5);
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
  @apply maz-fixed maz-inset-0 maz-z-default-backdrop maz-flex maz-opacity-100 maz-flex-center;

  backdrop-filter: blur(3px);

  &-overlay {
    touch-action: none;

    @apply maz-absolute maz-inset-0 maz-bg-overlay;

    &:not(.--disabled) {
      @apply maz-cursor-pointer;
    }
  }

  &-content {
    @apply maz-relative maz-z-1 focus:maz-outline-none;
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
