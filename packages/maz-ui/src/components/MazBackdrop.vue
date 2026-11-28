<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { OriginTransitionTarget } from '../composables/useOriginTransition.ts'
import { computed, nextTick, onBeforeUnmount, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import { useOriginTransition } from '../composables/useOriginTransition.ts'
import { getFocusableElements, trapTabKey } from '../utils/focusable.ts'
import { holdInertBackground, releaseInertBackground } from '../utils/inertBackground.ts'
import { addOverlayLayer, isTopOverlayLayer, removeOverlayLayer } from '../utils/overlayLayers.ts'

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
  variant,
  growFromOrigin = false,
  origin,
  animated = true,
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
  /**
   * Function called before the modal closes (button, Escape, backdrop click, `close()`).
   * Return `false` (or a promise of `false`) to keep it open; any other value closes it, and a throw or a rejection keeps it open.
   */
  beforeClose?: () => Promise<boolean | void> | boolean | void
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
  /**
   * The panel grows out of the element that opened the backdrop and goes back into it (see `origin`).
   * Without it, the transition of `transitionName` runs.
   * @default false
   */
  growFromOrigin?: boolean
  /**
   * Where the panel grows from with `growFromOrigin`: an element, a CSS selector, a pointer event or a `{ x, y }` point.
   * Without it, the element under the last pointer is used, else the panel fades and scales slightly.
   */
  origin?: OriginTransitionTarget
  /**
   * `false` gives a plain fade to the panel with `growFromOrigin`
   * @default true
   */
  animated?: boolean
}

const present = ref(modelValue)

function close() {
  if (persistent) {
    return
  }

  return toggleModal(false)
}

async function toggleModal(value?: boolean) {
  const newValue = value ?? !present.value

  if (!newValue) {
    emits('before-close')

    if (await beforeClose?.() === false)
      return
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

const originTransition = useOriginTransition({
  origin: () => origin,
  animated: () => animated,
})

function getFadeDuration(element: Element) {
  const durations = getComputedStyle(element).transitionDuration.split(',')

  return Math.max(0, ...durations.map((value) => {
    const duration = Number.parseFloat(value)

    return Number.isNaN(duration) ? 0 : (value.trim().endsWith('ms') ? duration : duration * 1000)
  }))
}

/**
 * The panel grows from (or goes back into) its origin while the backdrop fades with CSS: `done` waits for both
 */
function runPanelTransition(phase: 'enter' | 'leave', element: Element, done: () => void) {
  const panel = element.querySelector<HTMLElement>('.m-backdrop-content > *')
  const fadeDuration = getFadeDuration(element)

  let pending = panel ? 2 : 1
  let isSync = true
  const finish = () => {
    pending -= 1

    if (pending > 0)
      return

    if (isSync && typeof requestAnimationFrame === 'function')
      requestAnimationFrame(() => requestAnimationFrame(done))
    else
      done()
  }

  if (fadeDuration > 0)
    setTimeout(finish, fadeDuration)
  else
    finish()

  if (panel)
    originTransition[phase](panel, finish)

  isSync = false
}

const transitionHooks = computed(() => growFromOrigin
  ? {
      onEnter: (element: Element, done: () => void) => runPanelTransition('enter', element, done),
      onLeave: (element: Element, done: () => void) => runPanelTransition('leave', element, done),
    }
  : {})

const backdropRef = useTemplateRef<HTMLElement>('backdrop')
const contentRef = useTemplateRef<HTMLElement>('content')

const layer = {
  contains: (target: Node) => !!backdropRef.value?.contains(target),
}

/**
 * Escape only closes the top overlay: a popover, a tooltip or a dialog opened above this one
 * handles it first (and prevents its default)
 */
function onKeyPress(event: KeyboardEvent) {
  if (event.key !== 'Escape' || event.defaultPrevented || !isTopOverlayLayer(layer))
    return

  if (closeOnEscape)
    close()
}

let inertElements: HTMLElement[] = []

/**
 * The rest of the page is made `inert` while the modal is open: no focus, no click and hidden from
 * assistive technologies
 */
function setBackgroundInert() {
  const backdrop = backdropRef.value

  if (!backdrop || !backdrop.isConnected)
    return

  releaseBackgroundInert()
  inertElements = holdInertBackground(backdrop)
}

function releaseBackgroundInert() {
  releaseInertBackground(inertElements)
  inertElements = []
}

function addClassAndEventToDocument() {
  addClassToDocument()
  addOverlayLayer(layer)
  // On window: the listeners of the popovers and tooltips, on document, run first
  globalThis.addEventListener('keydown', onKeyPress, false)
  document.addEventListener('keydown', trapFocus, false)
}

function removeEventsFromDocument() {
  try {
    removeOverlayLayer(layer)
    globalThis.removeEventListener('keydown', onKeyPress)
    document.removeEventListener('keydown', trapFocus)
  }
  catch (error) {
    console.warn('Error removing event listeners:', error)
  }
}

function removeClassAndEventToDocument() {
  releaseBackgroundInert()
  removeEventsFromDocument()
  removeClassFromDocument()
}

onMounted(() => {
  if (modelValue) {
    addClassAndEventToDocument()
    setBackgroundInert()
  }
  else {
    removeClassAndEventToDocument()
  }
})

onBeforeUnmount(() => {
  releaseBackgroundInert()
  removeEventsFromDocument()
})

onUnmounted(removeClassFromDocument)

let initialFocusableElement: HTMLElement | null = null

function trapFocus(event: KeyboardEvent) {
  if (isTopOverlayLayer(layer))
    trapTabKey(event, contentRef.value)
}

watch(
  () => modelValue,
  async (value) => {
    present.value = value

    if (value) {
      addClassAndEventToDocument()

      initialFocusableElement = document.activeElement as HTMLElement | null

      await nextTick()
      setBackgroundInert()
      getFocusableElements(contentRef.value)[0]?.focus()
    }
    else {
      removeClassAndEventToDocument()

      await nextTick()
      initialFocusableElement?.focus()
    }
  },
)

/**
 * MazDialog and MazBottomSheet render their own `role="dialog"` element
 */
const hasOwnDialogRole = computed(() => variant !== 'dialog' && variant !== 'bottom-sheet')

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
      v-bind="transitionHooks"
      @after-enter="onBackdropAnimationEnter"
      @after-leave="onBackdropAnimationLeave"
    >
      <div
        v-if="present"
        ref="backdrop"
        class="m-backdrop --present m-reset-css maz:fixed maz:inset-0 maz:z-default-backdrop maz:bg-overlay/25 maz:backdrop-blur-sm"
        v-bind="$attrs"
        :class="[backdropClass, variant && `--variant-${variant}`, { '--persistent': persistent, '--grow': growFromOrigin }]"
      >
        <div
          :role="hasOwnDialogRole ? 'dialog' : undefined"
          class="m-backdrop-container maz:fixed maz:inset-0 maz:z-default-backdrop"
          :aria-modal="hasOwnDialogRole ? 'true' : undefined"
          :aria-labelledby="hasOwnDialogRole ? ariaLabelledby : undefined"
          :aria-describedby="hasOwnDialogRole ? ariaDescribedby : undefined"
        >
          <div class="m-backdrop-wrapper maz:fixed maz:inset-0 maz:scrollbar-themed maz:overflow-y-auto">
            <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
            <div
              ref="content"
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
  --m-backdrop-fade-in: calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1));
  --m-backdrop-fade-out: calc(var(--maz-motion-normal, 200ms) * 0.7 * var(--maz-motion-scale, 1));
  --m-backdrop-panel-in: calc(var(--maz-motion-slow, 300ms) * var(--maz-motion-scale, 1));
  --m-backdrop-panel-out: calc(var(--maz-motion-slow, 300ms) * 0.7 * var(--maz-motion-scale, 1));

  transition-behavior: allow-discrete;

  /*
   * Fade of the backdrop (the panels move with their own transition below)
   */
  &.backdrop-anim-enter-active,
  &.bottom-sheet-anim-enter-active,
  &.modal-anim-enter-active,
  &.drawer-anim-top-enter-active,
  &.drawer-anim-bottom-enter-active,
  &.drawer-anim-start-enter-active,
  &.drawer-anim-end-enter-active {
    transition: opacity var(--m-backdrop-fade-in) var(--maz-easing-out, ease-out);
    transition-behavior: allow-discrete;
  }

  &.backdrop-anim-leave-active,
  &.bottom-sheet-anim-leave-active,
  &.modal-anim-leave-active,
  &.drawer-anim-top-leave-active,
  &.drawer-anim-bottom-leave-active,
  &.drawer-anim-start-leave-active,
  &.drawer-anim-end-leave-active {
    transition: opacity var(--m-backdrop-fade-out) var(--maz-easing-in, ease-in);
    transition-behavior: allow-discrete;
  }

  &.backdrop-anim-enter-from,
  &.backdrop-anim-leave-to,
  &.bottom-sheet-anim-enter-from,
  &.bottom-sheet-anim-leave-to,
  &.modal-anim-enter-from,
  &.modal-anim-leave-to,
  &.drawer-anim-top-enter-from,
  &.drawer-anim-top-leave-to,
  &.drawer-anim-bottom-enter-from,
  &.drawer-anim-bottom-leave-to,
  &.drawer-anim-start-enter-from,
  &.drawer-anim-start-leave-to,
  &.drawer-anim-end-enter-from,
  &.drawer-anim-end-leave-to {
    opacity: 0;
  }

  /*
   * A panel that grows from its origin: only the veil fades, the panel stays visible all the way to its origin
   */
  &.--grow.modal-anim-enter-active {
    transition:
      background-color var(--m-backdrop-fade-in) var(--maz-easing-out, ease-out),
      backdrop-filter var(--m-backdrop-fade-in) var(--maz-easing-out, ease-out);
  }

  &.--grow.modal-anim-leave-active {
    transition:
      background-color var(--m-backdrop-panel-in) var(--maz-easing-in-out, ease-in-out),
      backdrop-filter var(--m-backdrop-panel-in) var(--maz-easing-in-out, ease-in-out);
  }

  &.--grow.modal-anim-enter-from,
  &.--grow.modal-anim-leave-to {
    opacity: 1;
    background-color: transparent;
    backdrop-filter: blur(0);
  }

  /*
   * Panels: slide (drawers, bottom sheet) or scale (modal, unless the panel grows from its origin)
   */
  &.bottom-sheet-anim-enter-active .m-backdrop-content > *,
  &.modal-anim-enter-active:not(.--grow) .m-backdrop-content > *,
  &.drawer-anim-top-enter-active .m-backdrop-content > *,
  &.drawer-anim-bottom-enter-active .m-backdrop-content > *,
  &.drawer-anim-start-enter-active .m-backdrop-content > *,
  &.drawer-anim-end-enter-active .m-backdrop-content > * {
    transition: transform var(--m-backdrop-panel-in) var(--maz-easing-out, ease-out);
    transition-behavior: allow-discrete;
  }

  &.bottom-sheet-anim-leave-active .m-backdrop-content > *,
  &.modal-anim-leave-active:not(.--grow) .m-backdrop-content > *,
  &.drawer-anim-top-leave-active .m-backdrop-content > *,
  &.drawer-anim-bottom-leave-active .m-backdrop-content > *,
  &.drawer-anim-start-leave-active .m-backdrop-content > *,
  &.drawer-anim-end-leave-active .m-backdrop-content > * {
    transition: transform var(--m-backdrop-panel-out) var(--maz-easing-in, ease-in);
    transition-behavior: allow-discrete;
  }

  &.bottom-sheet-anim-enter-from .m-backdrop-content > *,
  &.bottom-sheet-anim-leave-to .m-backdrop-content > *,
  &.drawer-anim-bottom-enter-from .m-backdrop-content > *,
  &.drawer-anim-bottom-leave-to .m-backdrop-content > * {
    transform: translateY(100%);
  }

  &.modal-anim-enter-from:not(.--grow) .m-backdrop-content > *,
  &.modal-anim-leave-to:not(.--grow) .m-backdrop-content > * {
    transform: scale(0.5);
  }

  &.drawer-anim-top-enter-from .m-backdrop-content > *,
  &.drawer-anim-top-leave-to .m-backdrop-content > * {
    transform: translateY(-100%);
  }

  &.drawer-anim-start-enter-from .m-backdrop-content > *,
  &.drawer-anim-start-leave-to .m-backdrop-content > * {
    transform: translateX(-100%);
  }

  &.drawer-anim-end-enter-from .m-backdrop-content > *,
  &.drawer-anim-end-leave-to .m-backdrop-content > * {
    transform: translateX(100%);
  }
}

.m-backdrop-content > * {
  @apply maz:cursor-default;
}

[dir='rtl'] .m-backdrop {
  &.drawer-anim-start-enter-from .m-backdrop-content > *,
  &.drawer-anim-start-leave-to .m-backdrop-content > * {
    transform: translateX(100%);
  }

  &.drawer-anim-end-enter-from .m-backdrop-content > *,
  &.drawer-anim-end-leave-to .m-backdrop-content > * {
    transform: translateX(-100%);
  }
}
</style>
