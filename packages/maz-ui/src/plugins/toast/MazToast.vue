<script lang="ts" setup>
import type { MazIconValue } from '../../components/MazIcon.vue'
import type { ToastButton, ToastOptions } from './types.ts'
import { MazArrowTopRightOnSquare } from '@maz-ui/icons/lazy/MazArrowTopRightOnSquare'
import { MazCheckCircle } from '@maz-ui/icons/lazy/MazCheckCircle'
import { MazExclamationCircle } from '@maz-ui/icons/lazy/MazExclamationCircle'
import { MazExclamationTriangle } from '@maz-ui/icons/lazy/MazExclamationTriangle'
import { MazInformationCircle } from '@maz-ui/icons/lazy/MazInformationCircle'
import { MazLinkIcon } from '@maz-ui/icons/lazy/MazLinkIcon'
import { MazXMark } from '@maz-ui/icons/raw/MazXMark'
import { useTranslations } from '@maz-ui/translations/composables/useTranslations'
import { computed, defineAsyncComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import MazDrawnIcon from '../../components/MazDrawnIcon.vue'
import MazIcon from '../../components/MazIcon.vue'
import MazSpinner from '../../components/MazSpinner.vue'
import { useTimer } from '../../composables/useTimer.ts'
import {
  createToastId,
  dampSwipe,
  getSwipeVelocity,
  getToastStack,
  getToastStackLayout,
  registerToast,
  setToastHeight,
  setToastStackFlag,
  shouldDismissSwipe,
  unregisterToast,
} from './stack.ts'

const {
  position = 'bottom-right',
  maxToasts = false,
  timeout = 10_000,
  type = 'info',
  message,
  icon = true,
  queue,
  pauseOnHover = true,
  persistent,
  destroy,
  button,
  buttons,
  html = false,
  stacked = true,
  loading = false,
} = defineProps<MazToastProps>()

const emits = defineEmits<{
  close: []
  click: [Event]
  open: []
}>()

const MazBtn = defineAsyncComponent(() => import('../../components/MazBtn.vue'))

const Toast = ref<HTMLDivElement>()

const internalButtons = computed<ToastButton[]>(() => {
  const buttonArray: ToastButton[] = []

  if (button) {
    buttonArray.push(button)
  }

  if (buttons) {
    buttonArray.push(...buttons)
  }

  return buttonArray
})

// Toasts are mounted detached (outside the app component tree), so a
// MazUiProvider's component-level `provide` can be out of reach. Resolve
// translations if available, otherwise fall back to a default label instead
// of crashing.
const translations = (() => {
  try {
    return useTranslations()
  }
  catch {
    return undefined
  }
})()

const closeLabel = computed(() => translations?.t('aria.close') ?? 'Close')

const currentType = ref<NonNullable<ToastOptions['type']>>(type)
const currentMessage = ref(message)
const status = ref<'loading' | 'success' | 'error' | undefined>(loading ? 'loading' : undefined)

const ariaRole = computed(() => (currentType.value === 'destructive' || currentType.value === 'warning'
  ? 'alert'
  : 'status'))

export interface MazToastProps extends ToastOptions {
  /**
   * The message of the toast
   */
  message?: string
  /**
   * The type of the toast
   */
  type?: ToastOptions['type']
  /**
   * The function to destroy the toast
   */
  destroy?: () => void
  /**
   * Display the toast as a pending promise (spinner, no timer) until `settle` is called
   * @default false
   */
  loading?: boolean
}

const currentIcon = computed<MazIconValue | undefined>(() => {
  if (!icon)
    return undefined
  if (icon !== true)
    return icon

  switch (type) {
    case 'destructive': {
      return MazExclamationTriangle
    }
    case 'info': {
      return MazInformationCircle
    }
    case 'success': {
      return MazCheckCircle
    }
    case 'warning': {
      return MazExclamationCircle
    }
    default: {
      return undefined
    }
  }
})

const positionY = computed(() => (position.includes('top')
  ? 'top'
  : 'bottom'))
const positionX = computed(() => {
  if (position.includes('left'))
    return 'left'
  if (position.includes('right'))
    return 'right'
  return 'center'
})

const isActive = ref(false)
const queueTimer = ref<ReturnType<typeof setTimeout>>()

const CONTAINER_POSITION_Y = {
  top: 'maz:top-0',
  bottom: 'maz:bottom-0',
} as const

const CONTAINER_POSITION_X = {
  left: 'maz:left-0 maz:w-full maz:tab-m:w-96',
  right: 'maz:inset-e-0 maz:w-full maz:tab-m:w-96',
  center: 'maz:w-full maz:tab-m:fixed maz:tab-m:left-2/4 maz:tab-m:w-96',
} as const

const TOAST_BUTTON_COLOR: Record<NonNullable<ToastOptions['type']>, string> = {
  info: 'maz:bg-info maz:text-info-foreground maz:border-info-600 maz:hover:bg-info-600 maz:dark:bg-[color-mix(in_oklab,var(--maz-info)_14%,var(--maz-container-bg,var(--maz-surface)))] maz:dark:text-info-400 maz:dark:border-info/20 maz:hover:dark:bg-[color-mix(in_oklab,var(--maz-info)_22%,var(--maz-container-bg,var(--maz-surface)))]',
  success: 'maz:bg-success maz:text-success-foreground maz:border-success-600 maz:hover:bg-success-600 maz:dark:bg-[color-mix(in_oklab,var(--maz-success)_14%,var(--maz-container-bg,var(--maz-surface)))] maz:dark:text-success-400 maz:dark:border-success/20 maz:dark:hover:bg-[color-mix(in_oklab,var(--maz-success)_22%,var(--maz-container-bg,var(--maz-surface)))]',
  warning: 'maz:bg-warning maz:text-warning-foreground maz:border-warning-600 maz:hover:bg-warning-600 maz:dark:bg-[color-mix(in_oklab,var(--maz-warning)_14%,var(--maz-container-bg,var(--maz-surface)))] maz:dark:text-warning-400 maz:dark:border-warning/20 maz:dark:hover:bg-[color-mix(in_oklab,var(--maz-warning)_22%,var(--maz-container-bg,var(--maz-surface)))]',
  destructive: 'maz:bg-destructive maz:text-destructive-foreground maz:border-destructive-600 maz:hover:bg-destructive-600 maz:dark:bg-[color-mix(in_oklab,var(--maz-destructive)_14%,var(--maz-container-bg,var(--maz-surface)))] maz:dark:text-destructive-400 maz:dark:border-destructive/20 maz:dark:hover:bg-[color-mix(in_oklab,var(--maz-destructive)_22%,var(--maz-container-bg,var(--maz-surface)))]',
  contrast: 'maz:bg-contrast maz:text-contrast-foreground maz:border-contrast-600/20 maz:hover:bg-contrast-500 maz:dark:hover:bg-contrast/70',
  neutral: 'maz:bg-neutral maz:text-neutral-foreground maz:border-divider maz:hover:bg-[color-mix(in_oklab,var(--maz-neutral-foreground)_10%,var(--maz-neutral))]',
  accent: 'maz:bg-accent maz:text-accent-foreground maz:border-accent-600 maz:hover:bg-accent-600 maz:dark:bg-[color-mix(in_oklab,var(--maz-accent)_14%,var(--maz-container-bg,var(--maz-surface)))] maz:dark:text-accent-400 maz:dark:border-accent/20 maz:dark:hover:bg-[color-mix(in_oklab,var(--maz-accent)_22%,var(--maz-container-bg,var(--maz-surface)))]',
} as const

const TOAST_CLOSE_COLOR: Record<NonNullable<ToastOptions['type']>, string> = {
  info: 'maz:bg-info maz:text-info-foreground maz:border-info-400 maz:hover:bg-info-600 maz:dark:bg-[color-mix(in_oklab,var(--maz-info)_14%,var(--maz-container-bg,var(--maz-surface)))] maz:dark:border-info/20 maz:dark:text-info-600 maz:hover:dark:bg-[color-mix(in_oklab,var(--maz-info)_22%,var(--maz-container-bg,var(--maz-surface)))]',
  success: 'maz:bg-success maz:text-success-foreground maz:border-success-600 maz:hover:bg-success-600 maz:dark:bg-[color-mix(in_oklab,var(--maz-success)_14%,var(--maz-container-bg,var(--maz-surface)))] maz:dark:border-success/20 maz:dark:text-success-600 maz:dark:hover:bg-[color-mix(in_oklab,var(--maz-success)_22%,var(--maz-container-bg,var(--maz-surface)))]',
  warning: 'maz:bg-warning maz:text-warning-foreground maz:border-warning-600 maz:hover:bg-warning-600 maz:dark:bg-[color-mix(in_oklab,var(--maz-warning)_14%,var(--maz-container-bg,var(--maz-surface)))] maz:dark:border-warning/20 maz:dark:text-warning-600 maz:dark:hover:bg-[color-mix(in_oklab,var(--maz-warning)_22%,var(--maz-container-bg,var(--maz-surface)))]',
  destructive: 'maz:bg-destructive maz:text-destructive-foreground maz:border-destructive-600 maz:hover:bg-destructive-600 maz:dark:bg-[color-mix(in_oklab,var(--maz-destructive)_14%,var(--maz-container-bg,var(--maz-surface)))] maz:dark:border-destructive/20 maz:dark:text-destructive-600 maz:dark:hover:bg-[color-mix(in_oklab,var(--maz-destructive)_22%,var(--maz-container-bg,var(--maz-surface)))]',
  contrast: 'maz:bg-contrast maz:text-contrast-foreground maz:border-contrast-600/20 maz:hover:bg-contrast/70',
  neutral: 'maz:bg-neutral maz:text-neutral-foreground maz:border-divider maz:hover:bg-[color-mix(in_oklab,var(--maz-neutral-foreground)_10%,var(--maz-neutral))]',
  accent: 'maz:bg-accent maz:text-accent-foreground maz:border-accent-600 maz:hover:bg-accent-600 maz:dark:bg-[color-mix(in_oklab,var(--maz-accent)_14%,var(--maz-container-bg,var(--maz-surface)))] maz:dark:text-accent-400 maz:dark:border-accent/20 maz:dark:hover:bg-[color-mix(in_oklab,var(--maz-accent)_22%,var(--maz-container-bg,var(--maz-surface)))]',
} as const

const CLOSE_POSITION_X = {
  left: 'maz:-inset-e-2',
  right: 'maz:-left-2',
  center: 'maz:-left-2',
} as const

const BUTTON_POSITION_X = {
  left: 'maz:tab-m:w-88',
  right: 'maz:tab-m:w-88',
  center: 'maz:tab-m:w-88 maz:tab-m:justify-center',
} as const

const containerClassName = `m-toast-container m-reset-css --${positionY.value} --${positionX.value} maz:pointer-events-none maz:fixed maz:h-0 ${CONTAINER_POSITION_Y[positionY.value]} ${CONTAINER_POSITION_X[positionX.value]}`
const selectorContainerClass = `.m-toast-container.--${positionY.value}.--${positionX.value}`

const duration = typeof timeout === 'number' ? timeout : 0
const hasTimer = typeof timeout === 'number' && timeout > 0 && !persistent

const timer = useTimer({
  callback: closeToast,
  timeout: duration,
  callbackOffsetTime: 200,
})

const id = createToastId()
const stackKey = position
const horizontal = positionX.value !== 'center'
const inward: 1 | -1 = positionY.value === 'top' ? 1 : -1
const outwardY = -inward as 1 | -1

const isShown = ref(false)
const phase = ref<'pending' | 'entered' | 'leaving'>('pending')
const outwardX = ref<-1 | 0 | 1>(positionX.value === 'left' ? -1 : positionX.value === 'right' ? 1 : 0)
const dragOffset = ref(0)
const isDragging = ref(false)
const isReleasing = ref(false)
const progressScale = ref(1)
const swipeDirection = computed<1 | -1>(() => (horizontal ? (outwardX.value === 0 ? 1 : outwardX.value) : outwardY))

const DEFAULT_LAYOUT = { y: 0, scale: 1, opacity: 1, zIndex: 1, behind: false, hidden: false, clip: -16 }
let lastLayout = DEFAULT_LAYOUT
let timerStarted = false
let cancelTransition: (() => void) | undefined
let resizeObserver: ResizeObserver | undefined
let drag: { start: number, last: number, lastTime: number, velocity: number, moved: boolean } | undefined

const layout = computed(() => {
  const value = getToastStackLayout(stackKey, id, inward)

  if (value) {
    lastLayout = value
  }

  return value ?? lastLayout
})

const toastStyle = computed(() => {
  const { y, scale, opacity, zIndex, clip } = layout.value
  const dragX = horizontal ? dragOffset.value : 0
  const dragY = horizontal ? 0 : dragOffset.value
  const side = positionY.value === 'top' ? 'top' : 'bottom'
  const clipPath = side === 'bottom'
    ? `inset(${clip}px -32px -16px -32px)`
    : `inset(-16px -32px ${clip}px -32px)`

  const base = {
    transformOrigin: `center ${side}`,
    clipPath,
    zIndex,
  }

  if (phase.value === 'pending') {
    return {
      ...base,
      opacity: 0,
      transform: `translate(${outwardX.value * 110}%, ${horizontal ? 0 : outwardY * 110}%)`,
    }
  }

  if (phase.value === 'leaving') {
    return {
      ...base,
      opacity: 0,
      transform: `translate(calc(${outwardX.value * 110}% + ${dragX}px), calc(${horizontal ? 0 : outwardY * 110}% + ${y + dragY}px)) scale(${scale})`,
    }
  }

  return {
    ...base,
    opacity,
    transform: `translate(${dragX}px, ${y + dragY}px) scale(${scale})`,
  }
})

const pauseReasons = new Set<string>()

function syncTimer() {
  if (!timerStarted) {
    return
  }

  if (pauseReasons.size > 0) {
    timer.pause()
  }
  else {
    timer.resume()
  }
}

function setPaused(reason: string, paused: boolean) {
  if (paused) {
    pauseReasons.add(reason)
  }
  else {
    pauseReasons.delete(reason)
  }

  syncTimer()
}

function startTimer() {
  if (!hasTimer || status.value === 'loading') {
    return
  }

  timerStarted = true
  timer.start(duration)
  syncTimer()
}

function isRtl(element: Element) {
  const dir = element.closest('[dir]')?.getAttribute('dir')

  return dir ? dir === 'rtl' : getComputedStyle(element).direction === 'rtl'
}

function getTransitionTime(element?: Element) {
  if (!element) {
    return 0
  }

  const durations = getComputedStyle(element).transitionDuration.split(',').map((value) => {
    const time = Number.parseFloat(value)
    if (Number.isNaN(time)) {
      return 0
    }
    return value.includes('ms') ? time : time * 1000
  })

  return Math.max(0, ...durations)
}

function afterTransition(callback: () => void) {
  cancelTransition?.()

  const element = Toast.value
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  function finish() {
    cancel()
    callback()
  }

  function onTransitionEnd(event: TransitionEvent) {
    if (event.target === element && event.propertyName === 'opacity') {
      finish()
    }
  }

  function cancel() {
    clearTimeout(timeoutId)
    element?.removeEventListener('transitionend', onTransitionEnd)
    cancelTransition = undefined
  }

  element?.addEventListener('transitionend', onTransitionEnd)
  timeoutId = setTimeout(finish, getTransitionTime(element) + 50)
  cancelTransition = cancel
}

function createParents() {
  const container = document.querySelector<HTMLElement>(selectorContainerClass)

  if (container)
    return

  const toCreate = document.createElement('div')
  toCreate.className = containerClassName
  toCreate.setAttribute('role', 'region')
  toCreate.setAttribute('aria-label', 'Notifications')
  toCreate.addEventListener('mouseenter', () => setToastStackFlag(stackKey, 'hovered', true))
  toCreate.addEventListener('mouseleave', () => setToastStackFlag(stackKey, 'hovered', false))
  toCreate.addEventListener('focusin', () => setToastStackFlag(stackKey, 'focused', true))
  toCreate.addEventListener('focusout', (event) => {
    if (!toCreate.contains(event.relatedTarget as Node | null)) {
      setToastStackFlag(stackKey, 'focused', false)
    }
  })
  document.body.append(toCreate)
}

function shouldQueue() {
  const container = document.querySelector(selectorContainerClass)

  if (!queue && maxToasts === false) {
    return false
  }

  if (typeof maxToasts === 'number' && container) {
    return maxToasts <= container.childElementCount
  }

  return container && container.childElementCount > 0
}

function measure() {
  if (Toast.value) {
    setToastHeight(stackKey, id, Toast.value.offsetHeight)
  }
}

async function showNotice() {
  if (shouldQueue()) {
    queueTimer.value = setTimeout(showNotice, 250)
    return
  }

  const container = document.querySelector<HTMLElement>(selectorContainerClass)

  if (Toast.value && container) {
    container.prepend(Toast.value)

    if (positionX.value === 'right') {
      outwardX.value = isRtl(container) ? -1 : 1
    }
  }

  registerToast(stackKey, { id, height: 0, stacked })
  isActive.value = true
  isShown.value = true

  startTimer()

  await nextTick()

  if (phase.value !== 'pending') {
    return
  }

  measure()

  if (typeof ResizeObserver !== 'undefined' && Toast.value) {
    resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(Toast.value)
  }

  phase.value = 'entered'
  afterTransition(onAnimationEnter)
}

function getProgressBarColor() {
  switch (currentType.value) {
    case 'destructive': {
      return 'maz:bg-destructive-800'
    }
    case 'info': {
      return 'maz:bg-info-800'
    }
    case 'success': {
      return 'maz:bg-success-800'
    }
    case 'warning': {
      return 'maz:bg-warning-800'
    }
    case 'neutral': {
      return 'maz:bg-neutral-foreground'
    }
    default: {
      return 'maz:bg-contrast-foreground'
    }
  }
}

watch(
  timer.remainingTime,
  (remainingTime) => {
    if (duration > 0) {
      progressScale.value = Math.max(0, Math.min(1, remainingTime / duration))
    }
  },
)

watch(
  () => {
    const stack = getToastStack(stackKey)

    return !!stack && (stack.focused || ((stack.hovered || stack.pinned) && pauseOnHover))
  },
  paused => setPaused('stack', paused),
)

const progressStyle = computed(() => ({ transform: `scaleX(${progressScale.value})` }))

let tapStartedByTouch = false
let ignoreNextClick = false

function unpinOutside(event: Event) {
  if (!(event.target as Element | null)?.closest?.(selectorContainerClass)) {
    setToastStackFlag(stackKey, 'pinned', false)
    document.removeEventListener('pointerdown', unpinOutside, true)
  }
}

function click(event: Event, shouldClose: boolean = true) {
  if (ignoreNextClick) {
    ignoreNextClick = false
    return
  }

  const stack = getToastStack(stackKey)

  if (shouldClose && tapStartedByTouch && stack && !stack.pinned && stack.entries.length > 1 && stack.entries.every(entry => entry.stacked)) {
    tapStartedByTouch = false
    setToastStackFlag(stackKey, 'pinned', true)
    document.addEventListener('pointerdown', unpinOutside, true)
    return
  }

  emits('click', event)

  if (!shouldClose) {
    return
  }

  closeToast()
}

const isActionLoading = ref(false)
async function onButtonClick(button: ToastButton, event: Event) {
  if (button.onClick) {
    isActionLoading.value = true
    setPaused('action', true)
    await button.onClick()
    setPaused('action', false)
    isActionLoading.value = false
  }

  click(event, button.closeToast ?? false)
}

function toggleTimer(shouldPause: boolean) {
  if (!pauseOnHover || persistent) {
    return
  }

  setPaused('hover', shouldPause)
}

function onVisibilityChange() {
  setPaused('hidden', document.hidden)
}

function stopTimer() {
  timer.stop()
  timerStarted = false
  if (queueTimer.value) {
    clearTimeout(queueTimer.value)
  }
}

function closeToast() {
  if (phase.value === 'leaving') {
    return
  }

  stopTimer()
  isActive.value = false

  const wasShown = isShown.value
  phase.value = 'leaving'
  unregisterToast(stackKey, id)

  if (!wasShown) {
    onAnimationLeave()
    return
  }

  afterTransition(onAnimationLeave)
}

function settle(result: 'success' | 'error', text: string) {
  if (phase.value === 'leaving') {
    return
  }

  status.value = result
  currentMessage.value = text
  currentType.value = result === 'success' ? 'success' : 'destructive'

  if (isShown.value) {
    startTimer()
  }
}

function onPointerDown(event: PointerEvent) {
  tapStartedByTouch = event.pointerType === 'touch'

  if (phase.value !== 'entered' || (event.pointerType === 'mouse' && event.button !== 0)) {
    return
  }

  if ((event.target as Element | null)?.closest('button, a, input, textarea, select')) {
    return
  }

  const coordinate = horizontal ? event.clientX : event.clientY

  drag = { start: coordinate, last: coordinate, lastTime: event.timeStamp, velocity: 0, moved: false }
  ;(event.currentTarget as Element | null)?.setPointerCapture?.(event.pointerId)
}

function onPointerMove(event: PointerEvent) {
  if (!drag) {
    return
  }

  const coordinate = horizontal ? event.clientX : event.clientY
  const delta = coordinate - drag.start

  if (!drag.moved && Math.abs(delta) < 4) {
    return
  }

  if (!drag.moved) {
    drag.moved = true
    isDragging.value = true
    isReleasing.value = false
    setPaused('drag', true)
  }

  drag.velocity = getSwipeVelocity(coordinate - drag.last, event.timeStamp - drag.lastTime)
  drag.last = coordinate
  drag.lastTime = event.timeStamp
  dragOffset.value = dampSwipe(delta, swipeDirection.value)
}

function endDrag(event: PointerEvent, cancelled: boolean) {
  if (!drag) {
    return
  }

  const { moved, velocity, lastTime } = drag
  drag = undefined

  if (!moved) {
    return
  }

  ignoreNextClick = true
  setTimeout(() => (ignoreNextClick = false), 0)

  isDragging.value = false
  setPaused('drag', false)

  const size = (horizontal ? Toast.value?.offsetWidth : Toast.value?.offsetHeight) ?? 0
  const dismiss = !cancelled && shouldDismissSwipe({
    distance: dragOffset.value * swipeDirection.value,
    velocity: event.timeStamp - lastTime > 100 ? 0 : velocity,
    size,
  })

  if (dismiss) {
    closeToast()
    return
  }

  isReleasing.value = true
  dragOffset.value = 0
}

function onAnimationEnter() {
  emits('open')
}

function onAnimationLeave() {
  cancelTransition?.()
  emits('close')
  isShown.value = false
  unregisterToast(stackKey, id)
  Toast.value?.remove()
  destroy?.()

  const container = document.querySelector(selectorContainerClass)
  if (container && !container?.hasChildNodes()) {
    container.remove()
  }
}

function getButtonEndIcon(button: ToastButton) {
  if (!button.to && !button.href) {
    return button.endIcon
  }

  if (button.target === '_blank') {
    return MazArrowTopRightOnSquare
  }

  return MazLinkIcon
}

defineExpose({
  /**
   * Close the toast
   * @description This is used to close the toast
   */
  closeToast,
  /**
   * Replace a loading toast by its result (used by the `promise` method)
   */
  settle,
})

onMounted(() => {
  document.addEventListener('visibilitychange', onVisibilityChange)
  createParents()
  showNotice()
})

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', onVisibilityChange)
  document.removeEventListener('pointerdown', unpinOutside, true)
  cancelTransition?.()
  resizeObserver?.disconnect()
  clearTimeout(queueTimer.value)
  timer.pause()
  unregisterToast(stackKey, id)
})
</script>

<template>
  <div
    v-show="isShown"
    ref="Toast"
    class="m-toast m-reset-css"
    :class="[
      `--${currentType}`,
      `--${positionY}`,
      `--${positionX}`,
      {
        '--persistent': persistent,
        '--entered': phase === 'entered',
        '--leaving': phase === 'leaving',
        '--behind': layout.behind,
        '--hidden': layout.hidden,
        '--dragging': isDragging,
        '--releasing': isReleasing,
      },
    ]"
    :style="toastStyle"
  >
    <!-- eslint-disable vuejs-accessibility/mouse-events-have-key-events, vuejs-accessibility/no-static-element-interactions, vuejs-accessibility/click-events-have-key-events -->
    <div
      :role="ariaRole"
      aria-atomic="true"
      class="m-toast__button maz:relative maz:flex maz:w-full maz:items-center maz:gap-2 maz:self-center maz:overflow-hidden maz:rounded-md maz:border maz:ps-2 maz:pe-2 maz:shadow-md maz:backdrop-blur-xl"
      :class="[TOAST_BUTTON_COLOR[currentType], BUTTON_POSITION_X[positionX]]"
      @mouseover="toggleTimer(true)"
      @mouseleave="toggleTimer(false)"
      @touchstart.passive="toggleTimer(true)"
      @touchend.passive="toggleTimer(false)"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="endDrag($event, false)"
      @pointercancel="endDrag($event, true)"
      @click.stop="click($event)"
    >
      <MazSpinner v-if="status === 'loading'" size="1.5rem" class="maz:shrink-0" />
      <MazDrawnIcon
        v-else-if="status"
        :name="status === 'success' ? 'check-circle' : 'x-circle'"
        size="md"
        class="maz:shrink-0"
      />
      <MazIcon v-else-if="currentIcon" :icon="currentIcon" class="maz:shrink-0 maz:text-2xl" />

      <Transition name="m-toast-text" mode="out-in">
        <div
          :key="currentMessage"
          class="m-toast__message maz:m-0 maz:flex-1 maz:py-3 maz:text-start maz:type-label"
          v-text="html ? undefined : currentMessage"
          v-html="html ? currentMessage : undefined"
        />
      </Transition>

      <MazBtn
        v-for="(toastButton, index) in internalButtons"
        :key="index"
        v-bind="{
          ...toastButton,
          onClick: undefined,
        }"
        :loading="isActionLoading || toastButton.loading"
        :end-icon="getButtonEndIcon(toastButton)"
        @click.stop="onButtonClick(toastButton, $event)"
      />

      <div
        v-if="hasTimer && status !== 'loading'"
        class="m-toast__progress-bar maz:absolute maz:inset-x-2 maz:overflow-hidden maz:rounded-full"
      >
        <div
          :style="progressStyle"
          class="m-toast__progress-bar-inner maz:size-full maz:origin-left maz:opacity-60 maz:rtl:origin-right"
          :class="getProgressBarColor()"
        />
      </div>
    </div>
    <!-- eslint-enable vuejs-accessibility/mouse-events-have-key-events, vuejs-accessibility/no-static-element-interactions, vuejs-accessibility/click-events-have-key-events -->
    <button
      type="button"
      :aria-label="closeLabel"
      class="m-toast__close maz:absolute maz:-top-1 maz:flex maz:flex-center maz:rounded-full maz:border maz:p-0.5 maz:backdrop-blur-xl"
      :class="[TOAST_CLOSE_COLOR[currentType], CLOSE_POSITION_X[positionX]]"
      @click.stop="click($event)"
    >
      <MazIcon :icon="MazXMark" class="m-toast__close-icon maz:cursor-pointer" />
    </button>
  </div>
</template>

<style>
.m-toast-container {
  z-index: 1051;

  &.--center {
    @media (width >= 768px) {
      transform: translate(-50%, 0);
    }
  }
}
</style>

<style scoped>
.m-toast {
  --m-toast-move: calc(var(--maz-motion-slow, 320ms) * var(--maz-motion-scale, 1));
  --m-toast-fade: calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1));
  --m-toast-exit: calc(var(--maz-motion-slow, 320ms) * 0.7 * var(--maz-motion-scale, 1));

  position: absolute;
  inset-inline: 1rem;
  box-sizing: border-box;
  padding-block: 0.25rem;
  pointer-events: auto;
  touch-action: pan-y;
  transition:
    transform var(--m-toast-move) var(--maz-easing-out, ease-out),
    opacity var(--m-toast-fade) var(--maz-easing-out, ease-out),
    clip-path var(--m-toast-move) var(--maz-easing-out, ease-out);

  & * {
    box-sizing: border-box;
  }

  &.--top {
    inset-block-start: 1rem;
  }

  &.--bottom {
    inset-block-end: 1rem;
  }

  &.--center {
    touch-action: pan-x;
  }

  &.--hidden {
    pointer-events: none;
  }

  &.--releasing {
    transition:
      transform var(--m-toast-move) var(--maz-easing-spring, ease-out),
      opacity var(--m-toast-fade) var(--maz-easing-out, ease-out),
      clip-path var(--m-toast-move) var(--maz-easing-out, ease-out);
  }

  &.--dragging {
    transition:
      opacity var(--m-toast-fade) var(--maz-easing-out, ease-out),
      clip-path var(--m-toast-move) var(--maz-easing-out, ease-out);
  }

  &.--leaving {
    pointer-events: none;
    transition:
      transform var(--m-toast-exit) var(--maz-easing-in, ease-in),
      opacity var(--m-toast-exit) var(--maz-easing-in, ease-in),
      clip-path var(--m-toast-exit) var(--maz-easing-in, ease-in);
  }

  & .m-toast__button {
    touch-action: inherit;
    user-select: none;
    transition:
      background-color var(--m-toast-fade) var(--maz-easing-in-out, ease-in-out),
      border-color var(--m-toast-fade) var(--maz-easing-in-out, ease-in-out),
      color var(--m-toast-fade) var(--maz-easing-in-out, ease-in-out);

    & > * {
      transition: opacity var(--m-toast-fade) var(--maz-easing-out, ease-out);
    }
  }

  &.--behind .m-toast__button > *,
  &.--behind .m-toast__close {
    opacity: 0;
  }

  & .m-toast__close {
    transition: opacity var(--m-toast-fade) var(--maz-easing-out, ease-out);
  }

  & .m-toast__progress-bar {
    inset-block-end: max(var(--maz-border-width), 1px);
    block-size: max(var(--maz-border-width), 0.125rem);
  }

  & .m-toast__progress-bar-inner {
    transition: transform var(--m-toast-fade) linear;
  }
}

.m-toast-text-enter-active {
  transition: opacity var(--m-toast-fade, 200ms) var(--maz-easing-out, ease-out);
}

.m-toast-text-leave-active {
  transition: opacity calc(var(--m-toast-fade, 200ms) * 0.7) var(--maz-easing-in, ease-in);
}

.m-toast-text-enter-from,
.m-toast-text-leave-to {
  opacity: 0;
}
</style>
