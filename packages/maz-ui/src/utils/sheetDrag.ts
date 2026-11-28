import type { MaybeRefOrGetter, Ref } from 'vue'
import { onMounted, onScopeDispose, ref, toValue, watch } from 'vue'

/** The physical edge a sheet is attached to: the sheet is dismissed by dragging it towards this edge. */
export type SheetEdge = 'top' | 'bottom' | 'left' | 'right'

export interface DragSample {
  time: number
  position: number
}

const VELOCITY_WINDOW = 100
const MIN_VELOCITY_DURATION = 10

export function getEdgeAxis(edge: SheetEdge): 'x' | 'y' {
  return edge === 'top' || edge === 'bottom' ? 'y' : 'x'
}

/** `1` when the pointer moves towards the positive axis to dismiss (bottom, right), `-1` otherwise */
export function getEdgeSign(edge: SheetEdge): 1 | -1 {
  return edge === 'bottom' || edge === 'right' ? 1 : -1
}

/**
 * Resistance of a drag beyond its limit (iOS rubber band): follows the pointer at first,
 * then stops at `limit`.
 */
export function rubberBand(distance: number, limit = 60, coefficient = 0.55): number {
  if (distance <= 0)
    return 0

  return (1 - 1 / ((distance * coefficient) / limit + 1)) * limit
}

/**
 * Speed of the last moments of a drag in px/ms, positive towards the dismiss direction.
 * `0` when the samples are too close in time to be reliable, or when the pointer stopped before the release.
 */
export function getReleaseVelocity(samples: readonly DragSample[], releaseTime: number): number {
  const last = samples.at(-1)

  if (!last || releaseTime - last.time > VELOCITY_WINDOW)
    return 0

  const first = samples.find(sample => last.time - sample.time <= VELOCITY_WINDOW)

  if (!first)
    return 0

  const duration = last.time - first.time

  return duration < MIN_VELOCITY_DURATION ? 0 : (last.position - first.position) / duration
}

/**
 * Whether a scrollable element can still scroll when the pointer moves in a direction.
 * `movement` is the sign of the pointer move on the axis: the content follows the finger, so moving
 * towards the positive axis scrolls towards the start of the content.
 */
export function canScrollFurther(element: Element, axis: 'x' | 'y', movement: 1 | -1): boolean {
  const style = getComputedStyle(element)
  const overflow = axis === 'y' ? style.overflowY : style.overflowX

  if (overflow !== 'auto' && overflow !== 'scroll' && overflow !== 'overlay')
    return false

  const max = axis === 'y'
    ? element.scrollHeight - element.clientHeight
    : element.scrollWidth - element.clientWidth

  if (max <= 1)
    return false

  if (axis === 'y') {
    const top = element.scrollTop

    return movement === 1 ? top > 1 : top < max - 1
  }

  const left = element.scrollLeft

  if (style.direction === 'rtl')
    return movement === 1 ? left > -max + 1 : left < -1

  return movement === 1 ? left > 1 : left < max - 1
}

/** Whether a scrollable element, from `target` up to `boundary`, can still scroll in the direction of the pointer */
export function isScrollClaimed(target: Element | null, boundary: Element, axis: 'x' | 'y', movement: 1 | -1): boolean {
  let node: Element | null = target

  while (node) {
    if (canScrollFurther(node, axis, movement))
      return true
    if (node === boundary)
      return false

    node = node.parentElement
  }

  return false
}

/** Translation applied by an element (`transform` or the `translate` property), in pixels, `null` when it cannot be read */
export function readTranslate(element: Element, property: 'transform' | 'translate'): { x: number, y: number } | null {
  const value = getComputedStyle(element)[property]

  if (!value)
    return null

  if (value === 'none')
    return { x: 0, y: 0 }

  if (property === 'translate') {
    const [x, y] = value.split(/\s+/).map(item => Number.parseFloat(item))

    return { x: x || 0, y: y || 0 }
  }

  const matrix = /^matrix\((.+)\)$/.exec(value)

  if (!matrix)
    return null

  const values = (matrix[1] as string).split(',').map(item => Number.parseFloat(item))

  return { x: values[4] || 0, y: values[5] || 0 }
}

const INTERACTIVE_SELECTOR = 'input, textarea, select, [contenteditable=""], [contenteditable="true"], [data-maz-no-drag]'

export interface SheetDragRelease {
  /** Position of the sheet at the release, in pixels towards the dismiss direction */
  position: number
  /** Speed of the release in px/ms, positive towards the dismiss direction */
  velocity: number
}

export interface UseSheetDragOptions {
  /** The element that follows the pointer (receives the `pointerdown`) */
  element: MaybeRefOrGetter<HTMLElement | null | undefined>
  /** Position of the element towards the dismiss direction, in pixels (`0` is the open position). Created when omitted. */
  position?: Ref<number>
  /** The edge the sheet is attached to, read at each `pointerdown` (so it follows the direction of the page) */
  edge: MaybeRefOrGetter<SheetEdge>
  disabled?: MaybeRefOrGetter<boolean>
  /**
   * With a mouse, only the elements matching this selector start a drag (so that the text of the content stays selectable).
   * Touch and pen start from anywhere.
   */
  mouseSelector?: string
  /**
   * Position (towards the dismiss direction) of the fully open sheet: beyond it the sheet resists.
   * @default 0
   */
  min?: MaybeRefOrGetter<number>
  /** Distance of the stretch beyond `min`, `0` for no stretch */
  stretch?: number
  /** The content must not scroll (sheet not fully open): the drag always wins */
  lockScroll?: () => boolean
  /** Distance (px) before the gesture starts */
  threshold?: number
  /** Where the element is now, in pixels towards the dismiss direction (reads the running transition). Defaults to the `position`. */
  readPosition?: (element: HTMLElement, axis: 'x' | 'y', sign: 1 | -1) => number | undefined
  onStart?: (element: HTMLElement, gesture: { axis: 'x' | 'y', sign: 1 | -1 }) => void
  /** Called at the release, returns where the sheet rests (the `position` goes there), or `'close'` to leave it where it is */
  onRelease: (release: SheetDragRelease) => number | 'close'
}

/**
 * Drag gesture of a sheet or a drawer (internal): follows the pointer along the axis of its edge with
 * pointer capture, gives the speed of the release, ignores the gestures that belong to a scrollable
 * content and resists beyond the open position.
 */
export function useSheetDrag(options: UseSheetDragOptions) {
  const { threshold = 6, stretch = 0, mouseSelector } = options

  const position = options.position ?? ref(0)
  const isDragging = ref(false)

  interface Gesture {
    pointerId: number | undefined
    startX: number
    startY: number
    startPosition: number
    axis: 'x' | 'y'
    sign: 1 | -1
    target: Element | null
    element: HTMLElement
    ignored: boolean
    dragging: boolean
    samples: DragSample[]
  }

  let gesture: Gesture | undefined
  let attached: HTMLElement | undefined
  let justDragged = false

  function onPointerDown(event: PointerEvent) {
    const element = attached

    if (!element || gesture || toValue(options.disabled) === true)
      return
    if ((event.button ?? 0) > 0)
      return

    const target = event.target instanceof Element ? event.target : null

    if (target?.closest(INTERACTIVE_SELECTOR))
      return

    const isTouch = event.pointerType === 'touch' || event.pointerType === 'pen'

    if (!isTouch && mouseSelector && !target?.closest(mouseSelector))
      return

    const edge = toValue(options.edge)
    const axis = getEdgeAxis(edge)
    const sign = getEdgeSign(edge)

    const startPosition = options.readPosition?.(element, axis, sign) ?? position.value

    gesture = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startPosition,
      axis,
      sign,
      target,
      element,
      ignored: false,
      dragging: false,
      samples: [{ time: event.timeStamp, position: startPosition }],
    }

    const doc = element.ownerDocument

    doc.addEventListener('pointermove', onPointerMove, { passive: true })
    doc.addEventListener('pointerup', onPointerEnd, { passive: true })
    doc.addEventListener('pointercancel', onPointerEnd, { passive: true })

    if (isTouch)
      element.addEventListener('touchmove', onTouchMove, { passive: false })
  }

  function onTouchMove(event: TouchEvent) {
    if (gesture?.dragging && event.cancelable)
      event.preventDefault()
  }

  function constrain(raw: number) {
    const min = toValue(options.min) ?? 0

    if (raw >= min)
      return raw

    return stretch ? min - rubberBand(min - raw, stretch) : min
  }

  function onPointerMove(event: PointerEvent) {
    if (!gesture || gesture.ignored)
      return
    if (gesture.pointerId !== undefined && event.pointerId !== undefined && event.pointerId !== gesture.pointerId)
      return

    const deltaX = event.clientX - gesture.startX
    const deltaY = event.clientY - gesture.startY
    const main = gesture.axis === 'y' ? deltaY : deltaX
    const cross = gesture.axis === 'y' ? deltaX : deltaY

    if (!gesture.dragging) {
      if (Math.hypot(deltaX, deltaY) < threshold)
        return

      const movement = main > 0 ? 1 : -1

      if (Math.abs(cross) > Math.abs(main)
        || (!options.lockScroll?.() && isScrollClaimed(gesture.target, gesture.element, gesture.axis, movement))) {
        gesture.ignored = true
        return
      }

      gesture.dragging = true
      isDragging.value = true
      options.onStart?.(gesture.element, { axis: gesture.axis, sign: gesture.sign })

      try {
        gesture.element.setPointerCapture?.(event.pointerId)
      }
      catch {
        // the pointer is already gone
      }
    }

    position.value = constrain(gesture.startPosition + gesture.sign * main)

    gesture.samples.push({ time: event.timeStamp, position: position.value })

    if (gesture.samples.length > 8)
      gesture.samples.shift()
  }

  function removeListeners(current: Gesture) {
    const doc = current.element.ownerDocument

    doc.removeEventListener('pointermove', onPointerMove)
    doc.removeEventListener('pointerup', onPointerEnd)
    doc.removeEventListener('pointercancel', onPointerEnd)
    current.element.removeEventListener('touchmove', onTouchMove)
  }

  function onPointerEnd(event: PointerEvent) {
    const current = gesture

    if (!current)
      return
    if (current.pointerId !== undefined && event.pointerId !== undefined && event.pointerId !== current.pointerId)
      return

    gesture = undefined
    removeListeners(current)

    if (!current.dragging)
      return

    try {
      current.element.releasePointerCapture?.(event.pointerId)
    }
    catch {
      // the capture is already released
    }

    const velocity = event.type === 'pointercancel' ? 0 : getReleaseVelocity(current.samples, event.timeStamp)

    justDragged = true
    setTimeout(() => {
      justDragged = false
    }, 0)

    isDragging.value = false

    const rest = options.onRelease({ position: position.value, velocity })

    if (rest !== 'close')
      position.value = rest
  }

  function attach(element: HTMLElement | null | undefined) {
    if (element === attached)
      return

    detach()

    if (element) {
      element.addEventListener('pointerdown', onPointerDown)
      attached = element
    }
  }

  function detach() {
    if (gesture) {
      removeListeners(gesture)
      gesture = undefined
    }

    attached?.removeEventListener('pointerdown', onPointerDown)
    attached = undefined
    isDragging.value = false
  }

  onMounted(() => attach(toValue(options.element)))

  watch(() => toValue(options.element), attach, { flush: 'post' })

  onScopeDispose(detach)

  return {
    position,
    isDragging,
    /** Whether a drag just ended: a click that follows it is not a click */
    hasJustDragged: () => justDragged,
  }
}
