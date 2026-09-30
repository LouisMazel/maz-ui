import type { MaybeRefOrGetter, Ref } from 'vue'
import { isClient } from '@maz-ui/utils/helpers/isClient'
import { onMounted, onScopeDispose, readonly, ref, toValue, watch } from 'vue'

/** Axis the drag is tracked on. */
export type DragAxis = 'x' | 'y' | 'both'

/** Dominant direction of an ongoing drag. */
export type DragDirection = 'up' | 'down' | 'left' | 'right'

/** Pointer types that can initiate a drag. */
export type DragPointerType = 'mouse' | 'touch' | 'pen'

/** Snapshot of the gesture passed to every callback. */
export interface DragState {
  /** Pointer offset from the drag start on the X axis, in pixels (`0` when `axis` is `'y'`). */
  offsetX: number
  /** Pointer offset from the drag start on the Y axis, in pixels (`0` when `axis` is `'x'`). */
  offsetY: number
  /** Absolute distance dragged from the start, in pixels. */
  distance: number
  /** Dominant direction of the drag (`undefined` until the pointer moves). */
  direction: DragDirection | undefined
  /** Pointer position (`clientX`) when the drag started. */
  startX: number
  /** Pointer position (`clientY`) when the drag started. */
  startY: number
  /** Current pointer position (`clientX`). */
  x: number
  /** Current pointer position (`clientY`). */
  y: number
  /** The underlying pointer event. */
  event: PointerEvent
}

export interface UseDragOptions {
  /**
   * Restrict the tracking to a single axis. Off-axis movement is ignored.
   * @default 'both'
   */
  axis?: DragAxis
  /**
   * Minimum distance (px) the pointer must travel before the drag becomes active.
   * @default 0
   */
  threshold?: number
  /**
   * Pointer types allowed to initiate the drag.
   * @default ['mouse', 'touch', 'pen']
   */
  pointerTypes?: DragPointerType[]
  /**
   * Reactively disable the gesture.
   * @default false
   */
  disabled?: MaybeRefOrGetter<boolean>
  /**
   * Call `event.preventDefault()` on each pointer move while dragging.
   * @default false
   */
  preventDefault?: boolean
  /**
   * Call `event.stopPropagation()` on the pointer events.
   * @default false
   */
  stopPropagation?: boolean
  /**
   * Attach the listeners as soon as the target is available. When `false`, call `start()` manually.
   * @default true
   */
  immediate?: boolean
  /** Called once when the drag becomes active (threshold reached). */
  onStart?: (state: DragState) => void
  /** Called on every pointer move while dragging. */
  onMove?: (state: DragState) => void
  /** Called when the drag ends (pointer up or cancel). */
  onEnd?: (state: DragState) => void
}

export type UseDragTarget = MaybeRefOrGetter<HTMLElement | string | null | undefined>

export interface UseDragReturn {
  /** Whether a drag is currently active (threshold reached). */
  isDragging: Readonly<Ref<boolean>>
  /** Reactive pointer offset from the drag start on the X axis. */
  offsetX: Readonly<Ref<number>>
  /** Reactive pointer offset from the drag start on the Y axis. */
  offsetY: Readonly<Ref<number>>
  /** Reactive absolute distance dragged from the start. */
  distance: Readonly<Ref<number>>
  /** Reactive dominant direction of the drag. */
  direction: Readonly<Ref<DragDirection | undefined>>
  /** Manually attach the listeners. */
  start: () => void
  /** Manually detach the listeners (also cancels an ongoing drag). */
  stop: () => void
}

function resolveElement(target: HTMLElement | string | null | undefined): HTMLElement | undefined {
  if (!target)
    return undefined
  if (typeof target === 'string') {
    if (!isClient())
      return undefined
    const found = document.querySelector(target)
    return found instanceof HTMLElement ? found : undefined
  }
  return target
}

/**
 * Track a pointer drag gesture (touch, mouse and pen) on an element.
 *
 * Follows the pointer in real time and exposes the live offset, distance and
 * direction, plus `onStart` / `onMove` / `onEnd` callbacks. Useful to build
 * drag-to-dismiss sheets, sliders, sortable handles, swipeable cards, etc.
 *
 * @example
 * ```ts
 * const handle = ref<HTMLElement>()
 * const { offsetY, isDragging } = useDrag(handle, {
 *   axis: 'y',
 *   onEnd: ({ offsetY }) => {
 *     if (offsetY > 120) close()
 *   },
 * })
 * ```
 */
export function useDrag(target: UseDragTarget, options: UseDragOptions = {}): UseDragReturn {
  const {
    axis = 'both',
    threshold = 0,
    pointerTypes,
    disabled,
    preventDefault = false,
    stopPropagation = false,
    immediate = true,
    onStart,
    onMove,
    onEnd,
  } = options

  const isDragging = ref(false)
  const offsetX = ref(0)
  const offsetY = ref(0)
  const distance = ref(0)
  const direction = ref<DragDirection | undefined>()

  let active = false
  let pointerId: number | undefined
  let startX = 0
  let startY = 0
  let dragDocument: Document | undefined
  let attachedTo: HTMLElement | undefined

  function isDisabled() {
    return toValue(disabled) === true
  }

  function isPointerAllowed(event: PointerEvent) {
    const type = event.pointerType as DragPointerType | undefined
    return !pointerTypes || !type || pointerTypes.includes(type)
  }

  function buildState(event: PointerEvent): DragState {
    return {
      offsetX: offsetX.value,
      offsetY: offsetY.value,
      distance: distance.value,
      direction: direction.value,
      startX,
      startY,
      x: event.clientX,
      y: event.clientY,
      event,
    }
  }

  function reset() {
    isDragging.value = false
    offsetX.value = 0
    offsetY.value = 0
    distance.value = 0
    direction.value = undefined
    pointerId = undefined
  }

  function onPointerdown(event: PointerEvent) {
    if (isDisabled() || pointerId !== undefined || !isPointerAllowed(event))
      return

    pointerId = event.pointerId
    startX = event.clientX
    startY = event.clientY
    isDragging.value = false
    dragDocument = (event.target as Node | null)?.ownerDocument ?? attachedTo?.ownerDocument

    if (stopPropagation)
      event.stopPropagation()

    addMoveListeners()
  }

  function onPointermove(event: PointerEvent) {
    if (pointerId !== undefined && event.pointerId !== pointerId)
      return

    const dx = axis === 'y' ? 0 : event.clientX - startX
    const dy = axis === 'x' ? 0 : event.clientY - startY

    offsetX.value = dx
    offsetY.value = dy
    distance.value = Math.hypot(dx, dy)
    direction.value = Math.abs(dx) > Math.abs(dy)
      ? (dx > 0 ? 'right' : 'left')
      : (dy !== 0 ? (dy > 0 ? 'down' : 'up') : direction.value)

    if (!isDragging.value) {
      if (distance.value < threshold)
        return
      isDragging.value = true
      onStart?.(buildState(event))
    }

    if (preventDefault && event.cancelable)
      event.preventDefault()
    if (stopPropagation)
      event.stopPropagation()

    onMove?.(buildState(event))
  }

  function onPointerup(event: PointerEvent) {
    if (pointerId !== undefined && event.pointerId !== pointerId)
      return

    removeMoveListeners()

    const wasDragging = isDragging.value
    const state = buildState(event)

    reset()

    if (wasDragging)
      onEnd?.(state)
  }

  function addMoveListeners() {
    if (!dragDocument)
      return
    dragDocument.addEventListener('pointermove', onPointermove, { passive: !preventDefault })
    dragDocument.addEventListener('pointerup', onPointerup, { passive: true })
    dragDocument.addEventListener('pointercancel', onPointerup, { passive: true })
  }

  function removeMoveListeners() {
    if (!dragDocument)
      return
    dragDocument.removeEventListener('pointermove', onPointermove)
    dragDocument.removeEventListener('pointerup', onPointerup)
    dragDocument.removeEventListener('pointercancel', onPointerup)
    dragDocument = undefined
  }

  function attach() {
    const el = resolveElement(toValue(target))
    if (!el || attachedTo === el)
      return
    detach()
    el.addEventListener('pointerdown', onPointerdown)
    attachedTo = el
  }

  function detach() {
    attachedTo?.removeEventListener('pointerdown', onPointerdown)
    attachedTo = undefined
    removeMoveListeners()
    reset()
  }

  function start() {
    active = true
    attach()
  }

  function stop() {
    active = false
    detach()
  }

  watch(() => resolveElement(toValue(target)), () => {
    if (active)
      attach()
    else
      detach()
  }, { flush: 'post' })

  onMounted(() => {
    if (immediate)
      start()
  })

  onScopeDispose(stop)

  return {
    isDragging: readonly(isDragging),
    offsetX: readonly(offsetX),
    offsetY: readonly(offsetY),
    distance: readonly(distance),
    direction: readonly(direction),
    start,
    stop,
  }
}
