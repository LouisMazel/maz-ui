<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { nextTick, onMounted, ref, watch } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const {
  modelValue = false,
  teleportSelector = 'body',
  beforeClose,
  persistent = false,
  closeOnEscape = true,
  transitionName = 'backdrop-anim',
  contentPadding = false,
  justify = 'none',
  align = 'none',
  ariaLabelledby,
  ariaDescribedby,
} = defineProps<MazBackdropProps>()

const emits = defineEmits<{
  /** Emitted when modal is open */
  'open': [value: void]
  /** Emitted when modal is close */
  'close': [value: void]
  /**
   * Emitted when modal is open or close
   * @property {boolean} value - The value of the model
   */
  'update:model-value': [value: boolean]
  /** Emitted before modal is close */
  'before-close': [value: void]
}>()

const MODAL_OPENED_CLASS = '--backdrop-present'

function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth
}

function addClassToDocument() {
  const scrollbarWidth = getScrollbarWidth()

  if (scrollbarWidth > 0) {
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`)
    document.documentElement.classList.add('--has-scrollbar')
  }

  document.documentElement.classList.add(MODAL_OPENED_CLASS)
}

function removeClassFromDocument() {
  const backdropPresents = document.querySelector('.m-backdrop.--present')

  if (!backdropPresents) {
    document.documentElement.classList.remove(MODAL_OPENED_CLASS)
    document.documentElement.classList.remove('--has-scrollbar')
    document.documentElement.style.removeProperty('--scrollbar-width')
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
  closeOnEscape?: boolean
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
  /** ID for aria-labelledby */
  ariaLabelledby?: string
  /** ID for aria-describedby */
  ariaDescribedby?: string
}

const present = ref(modelValue)

function close() {
  if (persistent) {
    return
  }

  toggleModal(false)
}

async function toggleModal(value?: boolean) {
  const newValue = value ?? !present.value

  if (!newValue) {
    emits('before-close')
    await beforeClose?.()
  }

  present.value = newValue
}

function onBackdropAnimationEnter() {
  emits('open')
}

function onBackdropAnimationLeave() {
  emits('update:model-value', false)
  emits('close')
  removeClassAndEventToDocument()
}

function onKeyPress(event: KeyboardEvent) {
  if (closeOnEscape && event.key === 'Escape') {
    close()
  }
}

function addClassAndEventToDocument() {
  addClassToDocument()
  document.addEventListener('keyup', onKeyPress, false)
  document.addEventListener('keydown', trapFocus, false)
}

function removeClassAndEventToDocument() {
  try {
    document.removeEventListener('keyup', onKeyPress)
    document.removeEventListener('keydown', trapFocus)
  }
  catch (error) {
    console.warn('Error removing event listeners:', error)
  }
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

function getAllFocusableElements(selector: string) {
  const modal = document.querySelector(selector)
  const focusableElements = 'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], input[type="email"], input[type="password"], input[type="url"], input[type="tel"], input[type="number"], input[type="search"], input[type="date"], input[type="time"], select, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'

  const focusableElementsArray = modal && [...modal.querySelectorAll<HTMLElement>(focusableElements)]

  const visibleFocusableElements = focusableElementsArray?.filter((el) => {
    const style = globalThis.getComputedStyle(el)
    const isDisabled = 'disabled' in el ? (el as HTMLInputElement | HTMLButtonElement | HTMLSelectElement | HTMLTextAreaElement).disabled : false
    return style.display !== 'none' && style.visibility !== 'hidden' && !isDisabled && el.tabIndex !== -1
  })

  return visibleFocusableElements || []
}

function findFirstFocusableElement(selector: string) {
  const focusableElements = getAllFocusableElements(selector)
  return focusableElements.length > 0 ? focusableElements[0] : null
}

function trapFocus(event: KeyboardEvent) {
  if (event.key !== 'Tab')
    return

  const focusableElements = getAllFocusableElements('.m-backdrop-content')
  if (focusableElements.length === 0)
    return

  const firstFocusable = focusableElements[0]
  const lastFocusable = focusableElements.at(-1)

  if (event.shiftKey) {
    if (document.activeElement === firstFocusable) {
      event.preventDefault()
      lastFocusable?.focus()
    }
  }
  else {
    if (document.activeElement === lastFocusable) {
      event.preventDefault()
      firstFocusable?.focus()
    }
  }
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

const JUSTIFY_CLASS = {
  'center': 'maz:justify-center',
  'end': 'maz:justify-end',
  'start': 'maz:justify-start',
  'space-between': 'maz:justify-between',
  'space-around': 'maz:justify-around',
  'none': '',
} as const

const ALIGN_CLASS = {
  center: 'maz:items-center',
  end: 'maz:items-end',
  start: 'maz:items-start',
  none: 'maz:items-end maz:tab-s:items-center',
} as const

defineExpose({
  /**
   * Animation leave event
   * @description This is used to handle animation leave events
   */
  onBackdropAnimationLeave,
  /**
   * Close the backdrop
   * @description This is used to close the backdrop
   */
  close,
  /**
   * The present state of the backdrop
   * @description This is used to check if the backdrop is present (open)
   */
  present,
  /**
   * Toggle the backdrop
   * @description This is used to toggle the backdrop
   * @param {boolean} value - The value to toggle the backdrop (optional)
   */
  toggleModal,
  /**
   * Key press event
   * @description This is used to handle key press events
   */
  onKeyPress,
})
</script>

<template>
  <Teleport :to="teleportSelector" :disabled="!present">
    <Transition
      appear
      :name="transitionName"
      @after-enter="onBackdropAnimationEnter"
      @after-leave="onBackdropAnimationLeave"
    >
      <div
        v-if="present"
        class="m-backdrop --present m-reset-css maz:fixed maz:inset-0 maz:z-default-backdrop maz:bg-overlay/25 maz:backdrop-blur-sm"
        v-bind="$attrs"
        :class="[backdropClass, variant && `--variant-${variant}`, { '--persistent': persistent }]"
        :aria-labelledby="ariaLabelledby"
        :aria-describedby="ariaDescribedby"
      >
        <div role="dialog" class="m-backdrop-container maz:fixed maz:inset-0 maz:z-default-backdrop" aria-modal="true">
          <div class="m-backdrop-wrapper maz:fixed maz:inset-0 maz:overflow-y-auto">
            <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
            <div
              class="m-backdrop-content maz:flex maz:min-h-full maz:tab-s:p-0"
              :class="[
                backdropContentClass,
                JUSTIFY_CLASS[justify],
                ALIGN_CLASS[align],
                `--justify-${justify}`,
                `--align-${align}`,
                {
                  '--padding': contentPadding,
                  'maz:p-4': contentPadding,
                  'maz:cursor-default': persistent,
                  'maz:fixed maz:inset-0': variant === 'bottom-sheet' || variant === 'drawer',
                },
              ]"
              role="button"
              tabindex="-1"
              @pointerdown.self="close"
            >
              <!-- @slot Place your content here
                @binding {Function} close close function
              -->
              <slot :close="close" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
html.--backdrop-present {
  overflow-y: hidden;
  block-size: 100vh !important;
}

html.--backdrop-present.--has-scrollbar {
  padding-inline-end: var(--scrollbar-width);
}
</style>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-backdrop {
  transition-behavior: allow-discrete;

  &-content > * {
    @apply maz:cursor-default;
  }

  /*
* Animations
*/
  &.bottom-sheet-anim-enter-active,
  &.bottom-sheet-anim-leave-active {
    transition: opacity 250ms ease-in-out;
    transition-behavior: allow-discrete;

    & .m-backdrop-content > * {
      transition: transform 250ms ease-in-out;
      transition-behavior: allow-discrete;
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
    transition-behavior: allow-discrete;

    & .m-backdrop-content > * {
      transition: transform 250ms ease-in-out;
      transition-behavior: allow-discrete;
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
    transition-behavior: allow-discrete;

    & .m-backdrop-content > * {
      transition: transform 250ms ease-in-out;
      transition-behavior: allow-discrete;
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
    transition-behavior: allow-discrete;

    & .m-backdrop-content > * {
      transition: transform 250ms ease-in-out;
      transition-behavior: allow-discrete;
    }
  }

  &.drawer-anim-bottom-enter-from,
  &.drawer-anim-bottom-leave-to {
    opacity: 0;

    & .m-backdrop-content > * {
      transform: translateY(100%);
    }
  }

  &.drawer-anim-start-enter-active,
  &.drawer-anim-start-leave-active,
  &.drawer-anim-end-enter-active,
  &.drawer-anim-end-leave-active {
    transition: opacity 250ms ease-in-out;
    transition-behavior: allow-discrete;

    & .m-backdrop-content > * {
      transition: transform 250ms ease-in-out;
      transition-behavior: allow-discrete;
    }
  }

  &.drawer-anim-start-enter-from,
  &.drawer-anim-start-leave-to {
    opacity: 0;

    & .m-backdrop-content > * {
      transform: translateX(-100%);
    }
  }

  &.drawer-anim-end-enter-from,
  &.drawer-anim-end-leave-to {
    opacity: 0;

    & .m-backdrop-content > * {
      transform: translateX(100%);
    }
  }
}

[dir='rtl'] .m-backdrop {
  &.drawer-anim-start-enter-from,
  &.drawer-anim-start-leave-to {
    & .m-backdrop-content > * {
      transform: translateX(100%);
    }
  }

  &.drawer-anim-end-enter-from,
  &.drawer-anim-end-leave-to {
    & .m-backdrop-content > * {
      transform: translateX(-100%);
    }
  }

  &.backdrop-anim-enter-active,
  &.backdrop-anim-leave-active {
    transition: opacity 250ms ease-in-out;
    transition-behavior: allow-discrete;
  }

  &.backdrop-anim-enter-from,
  &.backdrop-anim-leave-to {
    opacity: 0;
  }
}
</style>
