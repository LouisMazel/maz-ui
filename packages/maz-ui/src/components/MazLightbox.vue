<script lang="ts" setup>
import type { OriginTransitionTarget } from '../composables/useOriginTransition.ts'
import { MazChevronLeft } from '@maz-ui/icons/lazy/MazChevronLeft'
import { MazXMark } from '@maz-ui/icons/lazy/MazXMark'
import { isClient } from '@maz-ui/utils/helpers/isClient'
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useOriginTransition } from '../composables/useOriginTransition.ts'
import { useReducedMotion } from '../composables/useReducedMotion.ts'
import { useScrollLock } from '../composables/useScrollLock.ts'
import { trapTabKey } from '../utils/focusable.ts'
import { holdInertBackground, releaseInertBackground } from '../utils/inertBackground.ts'
import { getLightboxLabel } from '../utils/lightboxLabels.ts'
import { addOverlayLayer, isTopOverlayLayer, removeOverlayLayer } from '../utils/overlayLayers.ts'
import MazIcon from './MazIcon.vue'
import MazSpinner from './MazSpinner.vue'

export interface MazLightboxImage {
  /**
   * Source of the image, shown at once (a thumbnail already loaded is fine)
   */
  src: string
  alt?: string | null
  /**
   * Text under the image, `alt` when missing
   */
  caption?: string | null
  /**
   * High-resolution image, loaded when the image is shown and swapped in once ready
   */
  fullSrc?: string
}

export type MazLightboxOrigin = OriginTransitionTarget | ((index: number) => OriginTransitionTarget)

export interface MazLightboxProps {
  /**
   * Images of the lightbox: URLs or `{ src, alt, caption, fullSrc }` objects
   */
  images?: (MazLightboxImage | string)[]
  /**
   * Index of the shown image
   * @model index
   * @default 0
   */
  index?: number
  /**
   * Where the image grows from and goes back to: an element, a selector, an event, a `{ x, y }` point, or a function
   * returning one of them for an index (to follow the thumbnail of the shown image). Without it, the element
   * clicked last is used, else the image fades and scales.
   */
  origin?: MazLightboxOrigin
  /**
   * Zoom with a click (on the clicked point), a pinch, or the keys `+`, `-` and `0`
   * @default true
   */
  zoom?: boolean
  /**
   * Maximum zoom
   * @default 5
   */
  maxZoom?: number
  /**
   * Margin around the image in px, reduced on small screens
   * @default 24
   */
  offset?: number
  /**
   * Duration and easing of the grow from the origin, the tokens of the theme by default
   */
  animation?: {
    duration?: number
    easing?: string
  }
  /**
   * `false` shows and hides the lightbox without animation
   * @default true
   */
  animated?: boolean
  /**
   * The last image is followed by the first one
   * @default true
   */
  loop?: boolean
  /**
   * Show the counter ("3 / 12")
   * @default true
   */
  counter?: boolean
  /**
   * Show the caption of the image
   * @default true
   */
  caption?: boolean
  /**
   * Accessible label of the dialog
   */
  label?: string
}

const {
  images = [],
  origin,
  zoom = true,
  maxZoom = 5,
  offset = 24,
  animation,
  animated = true,
  loop = true,
  counter = true,
  caption = true,
  label,
} = defineProps<MazLightboxProps>()

const emit = defineEmits<{
  /**
   * Emitted when the image is in place
   */
  'open': []
  /**
   * Emitted when the image starts to grow from its origin
   */
  'enter': []
  /**
   * Emitted when the lightbox starts to close
   */
  'before-close': []
  /**
   * Emitted when the lightbox is closed (the image is back in its origin)
   */
  'close': []
  'next': []
  'previous': []
}>()

const open = defineModel<boolean>({ default: false })
const index = defineModel<number>('index', { default: 0 })

interface Slide {
  key: number
  index: number
  leaving?: boolean
}

const ZOOM_CLICK = 2.5
const SLIDE_DISTANCE = 48
const SWIPE_RATIO = 0.2
const SWIPE_VELOCITY = 0.4
const CLOSE_DISTANCE = 120
const CLOSE_VELOCITY = 0.5
const AXIS_THRESHOLD = 8
const CLICK_THRESHOLD = 6

const { shouldReduceMotion } = useReducedMotion()
const { lock, unlock } = useScrollLock()

const rendered = ref(false)
const shown = ref(false)
const entered = ref(false)
const instant = ref(true)
const dragging = ref(false)
const rtl = ref(false)
const viewport = reactive({ width: 0, height: 0 })

const slides = ref<Slide[]>([])
const activeKey = ref(0)
const loaded = reactive(new Set<number>())
const sizes = reactive(new Map<number, { width: number, height: number }>())
const fullLoaded = reactive(new Set<string>())

const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const dragX = ref(0)
const dragY = ref(0)

const rootRef = ref<HTMLElement>()
const slideElements = new Map<number, HTMLElement>()
const imageElements = new Map<number, HTMLImageElement>()

let keyCounter = 0
let openToken = 0
let previouslyFocused: Element | null = null
let releaseOffset = 0
let inertElements: HTMLElement[] = []
let attached = false
const preloaded = new Set<string>()

const items = computed<MazLightboxImage[]>(() => images.map(image => typeof image === 'string' ? { src: image } : image))
const count = computed(() => items.value.length)
const currentIndex = computed(() => Math.min(Math.max(index.value, 0), Math.max(count.value - 1, 0)))
const currentImage = computed(() => items.value[currentIndex.value])
const captionText = computed(() => caption ? (currentImage.value?.caption ?? currentImage.value?.alt ?? '') : '')
const hasMultiple = computed(() => count.value > 1)
const isZoomed = computed(() => scale.value > 1)
const dialogLabel = computed(() => label ?? currentImage.value?.alt ?? getLightboxLabel('lightbox.label'))
const canPrevious = computed(() => hasMultiple.value && (loop || currentIndex.value > 0))
const canNext = computed(() => hasMultiple.value && (loop || currentIndex.value < count.value - 1))

const rootStyle = computed(() => ({
  '--m-lightbox-fade': String(Math.max(0.2, 1 - Math.abs(dragY.value) / Math.max(viewport.height, 1))),
}))

const margin = computed(() => Math.min(offset, Math.min(viewport.width, viewport.height) * 0.12))

function resolveOrigin(): OriginTransitionTarget {
  return typeof origin === 'function' ? origin(currentIndex.value) : origin
}

const originTransition = useOriginTransition({
  origin: resolveOrigin,
  duration: () => animation?.duration,
  easing: animation?.easing,
  animated: () => animated,
})

const layer = { contains: (target: Node) => !!rootRef.value?.contains(target) }

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function readMotion(name: string, fallback: number) {
  const style = getComputedStyle(document.documentElement)
  const raw = style.getPropertyValue(name).trim()
  const match = /^(-?[\d.]+)(ms|s)?$/.exec(raw)
  const value = match ? Number.parseFloat(match[1] ?? '') * (match[2] === 's' ? 1000 : 1) : fallback
  const motionScale = Number.parseFloat(style.getPropertyValue('--maz-motion-scale')) || 1

  return value * motionScale
}

function readEasing() {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--maz-easing-out').trim()

  return value && !value.includes('var(') ? value : 'cubic-bezier(0.22, 1, 0.36, 1)'
}

function measure() {
  viewport.width = window.innerWidth
  viewport.height = window.innerHeight
}

function getImageSize(key: number) {
  const natural = sizes.get(key)
  if (!natural || natural.width === 0 || natural.height === 0)
    return undefined

  const fit = Math.min(
    Math.max(viewport.width - 2 * margin.value, 1) / natural.width,
    Math.max(viewport.height - 2 * margin.value, 1) / natural.height,
  )

  return { width: natural.width * fit, height: natural.height * fit }
}

function getImageStyle(slide: Slide) {
  const size = getImageSize(slide.key)
  const isActive = slide.key === activeKey.value

  return {
    ...(size ? { width: `${size.width}px`, height: `${size.height}px` } : {}),
    ...(isActive && (scale.value !== 1 || translateX.value !== 0 || translateY.value !== 0)
      ? { transform: `translate3d(${translateX.value}px, ${translateY.value}px, 0) scale(${scale.value})` }
      : {}),
  }
}

function getSlideImage(slide: Slide): MazLightboxImage {
  return items.value[slide.index] ?? { src: '' }
}

function getDisplaySrc(slide: Slide) {
  const image = getSlideImage(slide)

  return image.fullSrc && fullLoaded.has(image.fullSrc) ? image.fullSrc : image.src
}

function setElement<T extends Element>(map: Map<number, T>, key: number, element: unknown) {
  if (element instanceof Element)
    map.set(key, element as T)
  else
    map.delete(key)
}

function onImageLoad(slide: Slide, event: Event) {
  const image = event.target as HTMLImageElement
  sizes.set(slide.key, { width: image.naturalWidth, height: image.naturalHeight })
  loaded.add(slide.key)
}

function onImageError(slide: Slide) {
  loaded.add(slide.key)
}

function preload(url: string | undefined, onLoad?: () => void) {
  if (!url || !isClient())
    return

  if (preloaded.has(url) && !onLoad)
    return

  preloaded.add(url)
  const image = new Image()
  image.decoding = 'async'
  if (onLoad)
    image.onload = onLoad
  image.src = url
}

function preloadAround() {
  if (!rendered.value)
    return

  const image = currentImage.value
  if (image?.fullSrc && !fullLoaded.has(image.fullSrc)) {
    const fullSrc = image.fullSrc
    preload(fullSrc, () => fullLoaded.add(fullSrc))
  }

  for (const offsetIndex of [-1, 1]) {
    const neighbor = items.value[(currentIndex.value + offsetIndex + count.value) % Math.max(count.value, 1)]
    preload(neighbor?.src)
  }
}

watch([rendered, currentIndex], preloadAround)

function resetZoom() {
  scale.value = 1
  translateX.value = 0
  translateY.value = 0
}

function clampPan() {
  const size = getImageSize(activeKey.value)
  if (!size)
    return

  const limitX = Math.max(0, (size.width * scale.value - viewport.width) / 2)
  const limitY = Math.max(0, (size.height * scale.value - viewport.height) / 2)
  translateX.value = clamp(translateX.value, -limitX, limitX)
  translateY.value = clamp(translateY.value, -limitY, limitY)
}

function zoomAround(
  nextScale: number,
  focalX: number,
  focalY: number,
  base = { scale: scale.value, x: translateX.value, y: translateY.value },
) {
  const next = clamp(nextScale, 1, maxZoom)
  const centerX = viewport.width / 2
  const centerY = viewport.height / 2
  const pointX = (focalX - centerX - base.x) / base.scale
  const pointY = (focalY - centerY - base.y) / base.scale

  scale.value = next
  translateX.value = focalX - centerX - pointX * next
  translateY.value = focalY - centerY - pointY * next

  if (next === 1) {
    translateX.value = 0
    translateY.value = 0
  }
  else {
    clampPan()
  }
}

function toggleZoom(x: number, y: number) {
  if (isZoomed.value)
    resetZoom()
  else
    zoomAround(ZOOM_CLICK, x, y)
}

function stepZoom(factor: number) {
  zoomAround(scale.value * factor, viewport.width / 2, viewport.height / 2)
}

function waitForImage(key: number) {
  return new Promise<void>((resolve) => {
    const check = () => loaded.has(key)
    if (check())
      return resolve()

    const image = imageElements.get(key)
    if (image?.complete && image.naturalWidth > 0) {
      sizes.set(key, { width: image.naturalWidth, height: image.naturalHeight })
      loaded.add(key)
      return resolve()
    }

    const stop = watch(() => loaded.has(key), (value) => {
      if (value) {
        stop()
        resolve()
      }
    })
  })
}

function attach() {
  if (attached)
    return

  attached = true
  document.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', measure)
  addOverlayLayer(layer)
  if (rootRef.value)
    inertElements = holdInertBackground(rootRef.value)
  lock()
}

function detach() {
  if (!attached)
    return

  attached = false
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', measure)
  removeOverlayLayer(layer)
  releaseInertBackground(inertElements)
  inertElements = []
  unlock()
}

async function openLightbox() {
  if (!isClient() || count.value === 0) {
    open.value = false
    return
  }

  const token = ++openToken
  previouslyFocused = document.activeElement
  measure()
  resetZoom()
  dragX.value = 0
  dragY.value = 0
  entered.value = false
  instant.value = true
  const key = ++keyCounter
  slides.value = [{ key, index: currentIndex.value }]
  activeKey.value = key
  rendered.value = true

  await nextTick()
  if (token !== openToken || !rootRef.value)
    return

  rtl.value = getComputedStyle(rootRef.value).direction === 'rtl'
  attach()
  rootRef.value.focus({ preventScroll: true })

  await waitForImage(key)
  await nextTick()
  if (token !== openToken)
    return

  shown.value = true
  const image = imageElements.get(key)
  const done = () => {
    if (token !== openToken)
      return

    entered.value = true
    instant.value = false
    emit('open')
  }

  emit('enter')
  if (image)
    originTransition.enter(image, done)
  else
    done()
}

function restoreFocus() {
  const target = resolveOrigin()
  const element = target instanceof HTMLElement && target.isConnected ? target : previouslyFocused

  if (element instanceof HTMLElement && element.isConnected)
    element.focus({ preventScroll: true })

  previouslyFocused = null
}

function closeLightbox() {
  if (!rendered.value)
    return

  openToken++
  instant.value = true
  const image = imageElements.get(activeKey.value)
  resetZoom()
  shown.value = false

  const finish = () => {
    detach()
    rendered.value = false
    entered.value = false
    slides.value = []
    loaded.clear()
    sizes.clear()
    dragX.value = 0
    dragY.value = 0
    restoreFocus()
    emit('close')
  }

  if (image && loaded.has(activeKey.value))
    originTransition.leave(image, finish)
  else
    finish()
}

watch(open, (value) => {
  if (value)
    openLightbox()
  else
    closeLightbox()
}, { immediate: true })

function close() {
  if (!open.value)
    return

  emit('before-close')
  open.value = false
}

function runSlide(element: HTMLElement | undefined, keyframes: Keyframe[], done?: () => void) {
  if (!element || typeof element.animate !== 'function' || !animated) {
    done?.()
    return
  }

  const reduced = shouldReduceMotion.value
  const frames = reduced ? keyframes.map(({ opacity }) => ({ opacity })) : keyframes
  const animationInstance = element.animate(frames, {
    duration: reduced ? readMotion('--maz-motion-fast', 150) : readMotion('--maz-motion-normal', 200),
    easing: readEasing(),
    fill: 'forwards',
  })

  animationInstance.onfinish = () => done?.()
  animationInstance.oncancel = () => done?.()
}

async function navigate(target: number, direction: 'next' | 'previous') {
  if (!entered.value || target === currentIndex.value || target < 0 || target >= count.value)
    return

  const startOffset = releaseOffset || dragX.value
  releaseOffset = 0
  const previousKey = activeKey.value
  const move = (direction === 'next' ? -1 : 1) * (rtl.value ? -1 : 1) * SLIDE_DISTANCE
  const key = ++keyCounter

  slides.value = [
    ...slides.value.filter(slide => !slide.leaving).map(slide => ({ ...slide, leaving: true })),
    { key, index: target },
  ]
  activeKey.value = key
  instant.value = true
  resetZoom()
  dragX.value = 0
  dragY.value = 0
  index.value = target
  if (direction === 'next')
    emit('next')
  else
    emit('previous')

  await nextTick()
  instant.value = false

  slides.value = slides.value.filter(slide => slide.key === key || slide.key === previousKey)

  runSlide(slideElements.get(previousKey), [
    { transform: `translateX(${startOffset}px)`, opacity: 1 },
    { transform: `translateX(${startOffset + move}px)`, opacity: 0 },
  ], () => {
    slides.value = slides.value.filter(slide => slide.key !== previousKey)
  })
  runSlide(slideElements.get(key), [
    { transform: `translateX(${-move}px)`, opacity: 0 },
    { transform: 'translateX(0)', opacity: 1 },
  ])
}

function step(delta: 1 | -1): Promise<void> | undefined {
  const target = currentIndex.value + delta

  if (target >= 0 && target < count.value)
    return navigate(target, delta === 1 ? 'next' : 'previous')

  if (loop && hasMultiple.value)
    return navigate(delta === 1 ? 0 : count.value - 1, delta === 1 ? 'next' : 'previous')

  return undefined
}

function next() {
  return step(1)
}

function previous() {
  return step(-1)
}

function goTo(target: number) {
  return navigate(target, target > currentIndex.value ? 'next' : 'previous')
}

function onKeydown(event: KeyboardEvent) {
  if (event.defaultPrevented || !isTopOverlayLayer(layer))
    return

  if (event.key === 'Escape') {
    event.preventDefault()
    close()
    return
  }

  if (event.key === 'Tab') {
    trapTabKey(event, rootRef.value)
    return
  }

  if (event.ctrlKey || event.metaKey || event.altKey || !entered.value)
    return

  if (handleNavigationKey(event) || !zoom)
    return

  handleZoomKey(event)
}

function handleNavigationKey(event: KeyboardEvent) {
  const forward = (event.key === 'ArrowRight') !== rtl.value
  const actions: Record<string, () => unknown> = {
    ArrowLeft: forward ? next : previous,
    ArrowRight: forward ? next : previous,
    Home: () => navigate(0, 'previous'),
    End: () => navigate(count.value - 1, 'next'),
  }
  const action = actions[event.key]
  if (!action)
    return false

  event.preventDefault()
  action()

  return true
}

function handleZoomKey(event: KeyboardEvent) {
  const actions: Record<string, () => void> = {
    '+': () => stepZoom(1.5),
    '=': () => stepZoom(1.5),
    '-': () => stepZoom(1 / 1.5),
    '0': resetZoom,
  }
  const action = actions[event.key]
  if (!action)
    return

  event.preventDefault()
  action()
}

interface Point { x: number, y: number }
interface Gesture {
  startX: number
  startY: number
  lastX: number
  lastY: number
  lastTime: number
  velocityX: number
  velocityY: number
  axis: 'x' | 'y' | null
  baseX: number
  baseY: number
  baseScale: number
  startDistance: number
  startMiddle: Point
}

const pointers = new Map<number, Point>()
let gesture: Gesture | undefined
let moved = false

function getMiddle(): Point {
  const points = [...pointers.values()]
  const [a, b] = points as [Point, Point]

  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

function getDistance() {
  const [a, b] = [...pointers.values()] as [Point, Point]

  return Math.hypot(a.x - b.x, a.y - b.y) || 1
}

function startGesture(point: Point): Gesture {
  return {
    startX: point.x,
    startY: point.y,
    lastX: point.x,
    lastY: point.y,
    lastTime: performance.now(),
    velocityX: 0,
    velocityY: 0,
    axis: null,
    baseX: translateX.value,
    baseY: translateY.value,
    baseScale: scale.value,
    startDistance: pointers.size > 1 ? getDistance() : 1,
    startMiddle: pointers.size > 1 ? getMiddle() : point,
  }
}

function onPointerDown(event: PointerEvent) {
  if (!entered.value || (event.pointerType === 'mouse' && event.button !== 0))
    return

  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
  try {
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  }
  catch {}

  if (pointers.size === 1)
    moved = false

  gesture = startGesture({ x: event.clientX, y: event.clientY })
  dragging.value = true
  if (pointers.size > 1) {
    dragX.value = 0
    dragY.value = 0
  }
}

function panSingle(current: Gesture, event: PointerEvent) {
  const deltaX = event.clientX - current.startX
  const deltaY = event.clientY - current.startY

  if (isZoomed.value) {
    translateX.value = current.baseX + deltaX
    translateY.value = current.baseY + deltaY
    clampPan()
    return
  }

  if (!current.axis && Math.max(Math.abs(deltaX), Math.abs(deltaY)) > AXIS_THRESHOLD)
    current.axis = Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y'

  if (current.axis === 'x')
    dragX.value = canNext.value || canPrevious.value ? deltaX : deltaX * 0.25
  else if (current.axis === 'y')
    dragY.value = deltaY
}

function onPointerMove(event: PointerEvent) {
  const current = gesture
  if (!current || !pointers.has(event.pointerId))
    return

  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })

  const now = performance.now()
  const elapsed = Math.max(now - current.lastTime, 1)
  current.velocityX = (event.clientX - current.lastX) / elapsed
  current.velocityY = (event.clientY - current.lastY) / elapsed
  current.lastX = event.clientX
  current.lastY = event.clientY
  current.lastTime = now

  if (Math.hypot(event.clientX - current.startX, event.clientY - current.startY) > CLICK_THRESHOLD)
    moved = true

  if (pointers.size >= 2) {
    if (!zoom)
      return

    const middle = getMiddle()
    zoomAround(
      current.baseScale * (getDistance() / current.startDistance),
      current.startMiddle.x,
      current.startMiddle.y,
      { scale: current.baseScale, x: current.baseX, y: current.baseY },
    )
    translateX.value += middle.x - current.startMiddle.x
    translateY.value += middle.y - current.startMiddle.y
    clampPan()
    return
  }

  panSingle(current, event)
}

function onPointerUp(event: PointerEvent) {
  const current = gesture
  if (!current || !pointers.delete(event.pointerId))
    return

  if (pointers.size > 0) {
    const [remaining] = [...pointers.values()] as [Point]
    gesture = startGesture(remaining)
    return
  }

  dragging.value = false
  gesture = undefined

  if (scale.value < 1.05)
    resetZoom()

  const swipe = Math.abs(dragX.value) > viewport.width * SWIPE_RATIO || Math.abs(current.velocityX) > SWIPE_VELOCITY

  if (current.axis === 'x' && swipe && !isZoomed.value) {
    const forward = (dragX.value < 0) !== rtl.value
    const direction = forward ? 1 : -1
    const target = currentIndex.value + direction
    const exists = (target >= 0 && target < count.value) || (loop && hasMultiple.value)

    if (exists) {
      releaseOffset = dragX.value
      step(direction)
      return
    }
  }

  if (current.axis === 'y' && !isZoomed.value && (Math.abs(dragY.value) > CLOSE_DISTANCE || Math.abs(current.velocityY) > CLOSE_VELOCITY)) {
    close()
    return
  }

  dragX.value = 0
  dragY.value = 0
}

function onStageClick(event: MouseEvent) {
  if (moved) {
    moved = false
    return
  }

  if (!entered.value)
    return

  if (event.target instanceof HTMLImageElement) {
    if (zoom)
      toggleZoom(event.clientX, event.clientY)
    return
  }

  close()
}

function onWheel(event: WheelEvent) {
  if (!zoom || !event.ctrlKey || !entered.value)
    return

  event.preventDefault()
  zoomAround(scale.value * Math.exp(-event.deltaY * 0.01), event.clientX, event.clientY)
}

onBeforeUnmount(() => {
  openToken++
  detach()
})

defineExpose({ close, next, previous, goTo })
</script>

<template>
  <Teleport v-if="rendered" to="body">
    <div
      ref="rootRef"
      class="m-lightbox m-reset-css maz:fixed maz:inset-0 maz:z-default-backdrop maz:overflow-hidden maz:outline-hidden"
      :class="{
        '--shown': shown,
        '--instant': instant || shouldReduceMotion || !animated,
        '--dragging': dragging,
        '--zoomed': isZoomed,
      }"
      :style="rootStyle"
      role="dialog"
      aria-modal="true"
      :aria-label="dialogLabel"
      tabindex="-1"
    >
      <div class="m-lightbox__backdrop maz:absolute maz:inset-0 maz:bg-overlay/90 maz:backdrop-blur-sm" />

      <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions, vuejs-accessibility/click-events-have-key-events -->
      <div
        class="m-lightbox__stage maz:absolute maz:inset-0 maz:touch-none maz:select-none"
        :class="isZoomed ? 'maz:cursor-grab' : (zoom ? 'maz:cursor-zoom-in' : 'maz:cursor-default')"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @click="onStageClick"
        @wheel="onWheel"
      >
        <div
          class="m-lightbox__slides maz:absolute maz:inset-0"
          :style="{ transform: `translate3d(${dragX}px, ${dragY}px, 0)` }"
        >
          <figure
            v-for="slide in slides"
            :key="slide.key"
            :ref="(element) => setElement(slideElements, slide.key, element)"
            class="m-lightbox__slide maz:absolute maz:inset-0 maz:m-0 maz:flex maz:flex-center"
          >
            <img
              :ref="(element) => setElement(imageElements, slide.key, element)"
              class="m-lightbox__image maz:max-w-none maz:object-contain maz:outline-hidden"
              :class="{ '--loaded': loaded.has(slide.key), 'maz:cursor-grab': isZoomed && slide.key === activeKey }"
              :src="getDisplaySrc(slide)"
              :alt="getSlideImage(slide).alt ?? ''"
              :style="getImageStyle(slide)"
              draggable="false"
              @load="onImageLoad(slide, $event)"
              @error="onImageError(slide)"
            >
            <MazSpinner
              v-if="!loaded.has(slide.key)"
              class="maz:absolute maz:text-2xl maz:text-white"
              role="status"
              :aria-label="getLightboxLabel('lightbox.loading')"
            />
          </figure>
        </div>
      </div>

      <div class="m-lightbox__chrome maz:pointer-events-none maz:absolute maz:inset-x-0 maz:top-0 maz:flex maz:items-center maz:gap-2 maz:p-4">
        <span
          v-if="counter && hasMultiple"
          class="m-lightbox__counter maz:rounded-full maz:bg-overlay/40 maz:px-3 maz:py-1 maz:text-sm maz:text-white maz:tabular-nums maz:backdrop-blur-sm"
        >
          {{ currentIndex + 1 }} / {{ count }}
        </span>
        <div class="maz:ms-auto maz:flex maz:items-center maz:gap-2">
          <!--
            @slot Actions next to the close button
              @binding {MazLightboxImage} image The shown image
              @binding {number} index Its index
              @binding {() => void} close Closes the lightbox
          -->
          <slot name="toolbar" :image="currentImage" :index="currentIndex" :close="close" />
          <button
            type="button"
            class="m-lightbox__btn maz:pointer-events-auto"
            :aria-label="getLightboxLabel('lightbox.close')"
            @click="close"
          >
            <MazIcon :icon="MazXMark" class="maz:size-5" />
          </button>
        </div>
      </div>

      <template v-if="hasMultiple">
        <button
          type="button"
          class="m-lightbox__btn m-lightbox__nav maz:absolute maz:inset-s-4 maz:top-1/2 maz:-translate-y-1/2"
          :disabled="!canPrevious"
          :aria-label="getLightboxLabel('lightbox.previous')"
          @click="previous"
        >
          <MazIcon :icon="MazChevronLeft" class="maz:size-5 maz:rtl:rotate-180" />
        </button>
        <button
          type="button"
          class="m-lightbox__btn m-lightbox__nav maz:absolute maz:inset-e-4 maz:top-1/2 maz:-translate-y-1/2"
          :disabled="!canNext"
          :aria-label="getLightboxLabel('lightbox.next')"
          @click="next"
        >
          <MazIcon :icon="MazChevronLeft" class="maz:size-5 maz:rotate-180 maz:rtl:rotate-0" />
        </button>
      </template>

      <div
        v-if="captionText || $slots.caption"
        class="m-lightbox__caption maz:pointer-events-none maz:absolute maz:inset-x-0 maz:bottom-0 maz:flex maz:justify-center maz:p-4 maz:text-center maz:text-sm maz:text-white"
        aria-live="polite"
      >
        <!--
          @slot Replaces the caption
            @binding {MazLightboxImage} image The shown image
            @binding {number} index Its index
        -->
        <slot name="caption" :image="currentImage" :index="currentIndex">
          <span class="maz:rounded-lg maz:bg-overlay/40 maz:px-3 maz:py-1.5 maz:backdrop-blur-sm">{{ captionText }}</span>
        </slot>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@reference "../tailwindcss/tailwind.css";

.m-lightbox {
  --m-lightbox-duration: calc(var(--maz-motion-normal, 200ms) * var(--maz-motion-scale, 1));
  --m-lightbox-fast: calc(var(--maz-motion-fast, 150ms) * var(--maz-motion-scale, 1));
  --m-lightbox-easing: var(--maz-easing-out, cubic-bezier(0.22, 1, 0.36, 1));
}

.m-lightbox__backdrop {
  opacity: 0;
  transition: opacity var(--m-lightbox-duration) var(--m-lightbox-easing);
}

.m-lightbox.--shown .m-lightbox__backdrop {
  opacity: var(--m-lightbox-fade, 1);
}

.m-lightbox__chrome,
.m-lightbox__nav,
.m-lightbox__caption {
  opacity: 0;
  transition: opacity var(--m-lightbox-duration) var(--m-lightbox-easing);
}

.m-lightbox.--shown .m-lightbox__chrome,
.m-lightbox.--shown .m-lightbox__nav,
.m-lightbox.--shown .m-lightbox__caption {
  opacity: calc(var(--m-lightbox-fade, 1) * 1);
}

.m-lightbox.--zoomed .m-lightbox__caption,
.m-lightbox.--zoomed .m-lightbox__nav {
  opacity: 0;
  pointer-events: none;
}

.m-lightbox__slides {
  transition: transform var(--m-lightbox-duration) var(--m-lightbox-easing);
}

.m-lightbox__image {
  opacity: 0;
  transform-origin: center;
  transition:
    transform var(--m-lightbox-duration) var(--m-lightbox-easing),
    opacity var(--m-lightbox-fast) linear;
}

.m-lightbox__image.--loaded {
  opacity: 1;
}

.m-lightbox.--dragging .m-lightbox__slides,
.m-lightbox.--dragging .m-lightbox__image,
.m-lightbox.--instant .m-lightbox__slides,
.m-lightbox.--instant .m-lightbox__image,
.m-lightbox.--instant .m-lightbox__backdrop,
.m-lightbox.--instant .m-lightbox__chrome,
.m-lightbox.--instant .m-lightbox__nav,
.m-lightbox.--instant .m-lightbox__caption {
  transition: none;
}

.m-lightbox.--instant:not(.--shown) .m-lightbox__chrome,
.m-lightbox.--instant:not(.--shown) .m-lightbox__nav,
.m-lightbox.--instant:not(.--shown) .m-lightbox__caption {
  opacity: 0;
}

.m-lightbox__btn {
  @apply maz:flex maz:size-10 maz:cursor-pointer maz:items-center maz:justify-center maz:rounded-full maz:bg-overlay/40 maz:text-white maz:backdrop-blur-sm maz:transition-colors;

  &:hover:not(:disabled) {
    @apply maz:bg-overlay/60;
  }

  &:focus-visible {
    @apply maz:outline-2 maz:outline-offset-2 maz:outline-white;
  }

  &:disabled {
    @apply maz:cursor-default maz:opacity-40;
  }
}
</style>
