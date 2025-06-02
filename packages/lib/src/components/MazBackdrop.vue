<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { nextTick, onMounted, ref, watch } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const {
  modelValue = false,
  teleportSelector = 'body',
  beforeClose = undefined,
  persistent = false,
  noCloseOnEscKey = false,
  transitionName = 'backdrop-anim',
  backdropClass = undefined,
  backdropContentClass = undefined,
  contentPadding = false,
  justify = 'none',
  align = 'none',
} = defineProps<MazBackdropProps>()

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

function removeClassFromDocument() {
  const backdropPresents = document.querySelector('.m-backdrop.--present')

  if (!backdropPresents) {
    document.documentElement.classList.remove(MODAL_OPENED_CLASS)
  }
}

export interface MazBackdropProps {
  /** @model Modal's model value */
  modelValue?: boolean
  /** Teleport selector */
  teleportSelector?: string
  /** Function called before modal is close */
  beforeClose?: () => Promise<void> | void
  /** Persistent dialog (not closable by clicking outside and remove close button) */
  persistent?: boolean
  /** Prevent close on escape key */
  noCloseOnEscKey?: boolean
  /** Transition name */
  transitionName?: string
  /** Backdrop class */
  backdropClass?: HTMLAttributes['class']
  /** Backdrop content class */
  backdropContentClass?: HTMLAttributes['class']
  /** Add padding to the content */
  contentPadding?: boolean
  /** Justify content */
  justify?: 'center' | 'end' | 'start' | 'space-between' | 'space-around' | 'none'
  /** Align content */
  align?: 'center' | 'end' | 'start' | 'none'
  /** Variant */
  variant?: 'bottom-sheet' | 'dialog' | 'drawer'
}

const present = ref(modelValue)

function close() {
  toggleModal(false)
}

async function toggleModal(value) {
  if (!value) {
    emits('before-close')
    await beforeClose?.()
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
  if (!persistent) {
    close()
  }
}

function onKeyPress(event: KeyboardEvent) {
  if (!noCloseOnEscKey && event.key === 'Escape' && !persistent) {
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
  if (modelValue) {
    addClassAndEventToDocument()
  }
  else {
    removeClassAndEventToDocument()
  }
})

let initialFocusableElement: HTMLElement | null = null

function findFirstFocusableElement(selector: string) {
  const modal = document.querySelector(selector)
  const focusableElements = 'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'

  const focusableElementsArray = modal && Array.from(modal.querySelectorAll<HTMLLinkElement | HTMLButtonElement | HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>(focusableElements))

  const visibleFocusableElements = focusableElementsArray?.filter((el) => {
    const style = window.getComputedStyle(el)
    return style.display !== 'none' && style.visibility !== 'hidden' && !el.disabled
  })

  return visibleFocusableElements && visibleFocusableElements.length > 0 ? visibleFocusableElements[0] : null
}

watch(
  () => modelValue,
  async (value) => {
    present.value = value

    if (value) {
      addClassAndEventToDocument()

      initialFocusableElement = document.activeElement as HTMLElement | null

      await nextTick()
      const firstFocusableElement = findFirstFocusableElement('.m-backdrop-content')
      firstFocusableElement?.focus()
    }
    else {
      removeClassAndEventToDocument()

      await nextTick()
      initialFocusableElement?.focus()
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
      <div v-if="present" class="m-backdrop --present m-reset-css" v-bind="$attrs" :class="[backdropClass, variant && `--variant-${variant}`, { '--persistent': persistent }]">
        <div role="dialog" class="m-backdrop-container" aria-modal="true">
          <div class="m-backdrop-wrapper">
            <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
            <div
              class="m-backdrop-content"
              :class="[backdropContentClass, `--justify-${justify}`, `--align-${align}`, { '--padding': contentPadding }]"
              role="button"
              tabindex="-1"
              @click.self="onBackdropClicked"
            >
              <!-- @slot Place your content here
                @binding {Function} close close function
                @binding {Function} on-backdrop-clicked onBackdropClicked function (respects persistent prop)
              -->
              <slot :close="close" :on-backdrop-clicked="onBackdropClicked" />
            </div>
          </div>
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

<style lang="postcss" scoped>
.m-backdrop {
  @apply maz-fixed maz-inset-0 maz-z-default-backdrop maz-bg-overlay;

  backdrop-filter: blur(4px);

  &.--persistent {
    & .m-backdrop-content {
      @apply maz-cursor-default;
    }
  }

  &-container {
    @apply maz-fixed maz-inset-0 maz-z-default-backdrop;
  }

  &-wrapper {
    @apply maz-fixed maz-inset-0 maz-overflow-y-auto;
  }

  &-content {
    @apply maz-flex maz-min-h-full tab-s:maz-items-center tab-s:maz-p-0 maz-items-end;

    &.--padding {
      @apply maz-p-4;
    }

    &.--justify-center {
      @apply maz-justify-center;
    }

    &.--justify-end {
      @apply maz-justify-end;
    }

    &.--justify-start {
      @apply maz-justify-start;
    }

    &.--justify-space-between {
      @apply maz-justify-between;
    }

    &.--justify-space-around {
      @apply maz-justify-around;
    }

    &.--align-center {
      @apply maz-items-center;
    }

    &.--align-end {
      @apply maz-items-end;
    }

    &.--align-start {
      @apply maz-items-start;
    }

    > * {
      @apply maz-cursor-default;
    }
  }

  &.--variant-bottom-sheet {
    .m-backdrop-content {
      @apply maz-fixed maz-inset-0;
    }
  }

  &.--variant-drawer {
    .m-backdrop-content {
      @apply maz-fixed maz-inset-0;
    }
  }

  /*
* Animations
*/
  &.bottom-sheet-anim-enter-active,
  &.bottom-sheet-anim-leave-active {
    transition: opacity 250ms ease-in-out;

    & .m-backdrop-content > * {
      transition: transform 250ms ease-in-out;
    }
  }

  &.bottom-sheet-anim-enter-from,
  &.bottom-sheet-anim-leave-to {
    opacity: 0;

    & .m-backdrop-content > * {
      transform: translateY(100%);
    }
  }

  &.modal-anim-enter-active,
  &.modal-anim-leave-active {
    transition: opacity 250ms ease-in-out;

    & .m-backdrop-content > * {
      transition: transform 250ms ease-in-out;
    }
  }

  &.modal-anim-enter-from,
  &.modal-anim-leave-to {
    opacity: 0;

    & .m-backdrop-content > * {
      transform: scale(0.5);
    }
  }

  &.drawer-anim-top-enter-active,
  &.drawer-anim-top-leave-active {
    transition: opacity 250ms ease-in-out;

    & .m-backdrop-content > * {
      transition: transform 250ms ease-in-out;
    }
  }

  &.drawer-anim-top-enter-from,
  &.drawer-anim-top-leave-to {
    opacity: 0;

    & .m-backdrop-content > * {
      transform: translateY(-100%);
    }
  }

  &.drawer-anim-bottom-enter-active,
  &.drawer-anim-bottom-leave-active {
    transition: opacity 250ms ease-in-out;

    & .m-backdrop-content > * {
      transition: transform 250ms ease-in-out;
    }
  }

  &.drawer-anim-bottom-enter-from,
  &.drawer-anim-bottom-leave-to {
    opacity: 0;

    & .m-backdrop-content > * {
      transform: translateY(100%);
    }
  }

  &.drawer-anim-left-enter-active,
  &.drawer-anim-left-leave-active {
    transition: opacity 250ms ease-in-out;

    & .m-backdrop-content > * {
      transition: transform 250ms ease-in-out;
    }
  }

  &.drawer-anim-left-enter-from,
  &.drawer-anim-left-leave-to {
    opacity: 0;

    & .m-backdrop-content > * {
      transform: translateX(-100%);
    }
  }

  &.drawer-anim-right-enter-active,
  &.drawer-anim-right-leave-active {
    transition: opacity 250ms ease-in-out;

    & .m-backdrop-content > * {
      transition: transform 250ms ease-in-out;
    }
  }

  &.drawer-anim-right-enter-from,
  &.drawer-anim-right-leave-to {
    opacity: 0;

    & .m-backdrop-content > * {
      transform: translateX(100%);
    }
  }

  &.backdrop-anim-enter-active,
  &.backdrop-anim-leave-active {
    transition: opacity 250ms ease-in-out;
  }

  &.backdrop-anim-enter-from,
  &.backdrop-anim-leave-to {
    opacity: 0;
  }
}
</style>
