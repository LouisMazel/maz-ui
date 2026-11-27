import type { MaybeRefOrGetter } from 'vue'
import { getCurrentScope, onScopeDispose, toValue } from 'vue'
import { useReducedMotion } from './useReducedMotion.ts'

export interface OriginTransitionPoint {
  x: number
  y: number
}

export type OriginTransitionTarget = Element | string | OriginTransitionPoint | MouseEvent | PointerEvent | null | undefined

/**
 * An element, a CSS selector, a pointer or mouse event, a `{ x, y }` point (viewport coordinates), or a ref
 * or a getter returning one of them
 */
export type OriginTransitionOrigin = MaybeRefOrGetter<OriginTransitionTarget>

export interface UseOriginTransitionOptions {
  /**
   * Where the element grows from. Without it, the element under the last `pointerdown` is used.
   */
  origin?: OriginTransitionOrigin
  /**
   * Duration of the enter in ms
   * @default the `--maz-motion-normal` token multiplied by `--maz-motion-scale`
   */
  duration?: MaybeRefOrGetter<number | undefined>
  /**
   * CSS easing of the enter and the leave
   * @default the `--maz-easing-out` token for the enter, `--maz-easing-in` for the leave
   */
  easing?: string | { enter?: string, leave?: string }
  /**
   * Duration of the leave relative to the enter
   * @default 0.7
   */
  leaveRatio?: number
  /**
   * What happens without a usable origin (none given, not connected, hidden or out of the viewport)
   * @default 'fade-scale'
   */
  fallback?: 'fade-scale' | 'fade' | 'none'
  /**
   * `false` shows and hides the element without animation
   * @default true
   */
  animated?: MaybeRefOrGetter<boolean>
}

type ResolvedOrigin = { kind: 'element', element: Element } | { kind: 'point', x: number, y: number }

interface RunningAnimation {
  animation: Animation
  transformOrigin: string
  settle: () => void
}

const DEFAULT_ENTER_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'
const DEFAULT_LEAVE_EASING = 'cubic-bezier(0.4, 0, 1, 1)'
const LAST_POINTER_MAX_AGE = 1000
const TRIGGER_SELECTOR = 'button, a, summary, label, [role="button"], [role="menuitem"], [role="tab"]'

const lastPointer: { target: Element | null, time: number } = { target: null, time: 0 }
let pointerTrackerInstalled = false

function onPointerDown(event: Event) {
  lastPointer.target = event.target instanceof Element ? event.target : null
  lastPointer.time = Date.now()
}

/**
 * Installs once the shared `pointerdown` listener (passive, capture) that remembers the element under the
 * last pointer. Safe to call many times and on the server.
 */
export function captureLastPointer() {
  if (pointerTrackerInstalled || typeof document === 'undefined')
    return

  pointerTrackerInstalled = true
  document.addEventListener('pointerdown', onPointerDown, { capture: true, passive: true })
}

/**
 * The element (or the button, link... that contains it) under the last `pointerdown`, if it is recent
 * and still connected. `document.activeElement` is not reliable (Safari does not focus buttons on click).
 *
 * @param maxAge max age of the pointerdown in ms
 */
export function getLastPointerTarget(maxAge = LAST_POINTER_MAX_AGE): Element | null {
  captureLastPointer()

  const { target, time } = lastPointer
  if (!target?.isConnected || Date.now() - time > maxAge)
    return null

  if (target === document.body || target === document.documentElement)
    return null

  return target.closest(TRIGGER_SELECTOR) ?? target
}

function resolveTarget(target: OriginTransitionTarget): ResolvedOrigin | null {
  if (!target)
    return null

  if (typeof target === 'string') {
    try {
      const element = document.querySelector(target)
      return element ? { kind: 'element', element } : null
    }
    catch {
      return null
    }
  }

  if (typeof Element !== 'undefined' && target instanceof Element)
    return { kind: 'element', element: target }

  if ('clientX' in target) {
    const keyboardClick = target.type === 'click' && target.detail === 0
    if (keyboardClick && target.target instanceof Element)
      return { kind: 'element', element: target.target }

    return { kind: 'point', x: target.clientX, y: target.clientY }
  }

  if ('x' in target && 'y' in target)
    return { kind: 'point', x: target.x, y: target.y }

  return null
}

function readCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function readNumberVar(name: string, fallback: number, ms = false): number {
  const match = /^(-?[\d.]+)(ms|s)?$/.exec(readCssVar(name))
  if (!match)
    return fallback

  const value = Number.parseFloat(match[1] ?? '')
  if (Number.isNaN(value))
    return fallback

  return ms && match[2] === 's' ? value * 1000 : value
}

function readEasingVar(name: string, fallback: string): string {
  const value = readCssVar(name)
  return value && !value.includes('var(') ? value : fallback
}

function isVisible(rect: DOMRect) {
  return rect.width > 0
    && rect.height > 0
    && rect.bottom > 0
    && rect.right > 0
    && rect.top < window.innerHeight
    && rect.left < window.innerWidth
}

function getHiddenState(
  resolved: ResolvedOrigin | null,
  el: Element,
  rect: DOMRect,
  fallback: NonNullable<UseOriginTransitionOptions['fallback']>,
  reduced: boolean,
): { hidden: Keyframe, origin?: string } | null {
  if (reduced)
    return { hidden: { opacity: '0' } }

  if (resolved?.kind === 'point' && resolved.x >= 0 && resolved.y >= 0 && resolved.x <= window.innerWidth && resolved.y <= window.innerHeight) {
    return { hidden: { transform: 'scale(0.05)', opacity: '0' }, origin: `${resolved.x - rect.left}px ${resolved.y - rect.top}px` }
  }

  if (resolved?.kind === 'element' && resolved.element.isConnected && !el.contains(resolved.element)) {
    const originRect = resolved.element.getBoundingClientRect()
    if (isVisible(originRect) && rect.width > 0 && rect.height > 0) {
      const dx = originRect.left - rect.left
      const dy = originRect.top - rect.top

      return {
        hidden: {
          transform: `translate(${dx}px, ${dy}px) scale(${originRect.width / rect.width}, ${originRect.height / rect.height})`,
          opacity: '0',
          borderRadius: getComputedStyle(resolved.element).borderRadius,
        },
        origin: '0 0',
      }
    }
  }

  if (fallback === 'none')
    return null

  return { hidden: fallback === 'fade' ? { opacity: '0' } : { transform: 'scale(0.97)', opacity: '0' } }
}

/**
 * Base of the "grow from the origin" motif: an element (dialog, lightbox image, menu...) grows out of the
 * element, the event or the point that opened it, and goes back into it when it closes (FLIP animation
 * with the Web Animations API). Without a usable origin, it fades and scales slightly. Reduced motion
 * gives a short fade.
 *
 * `enter` and `leave` are the hooks of a `<Transition :css="false">`, or can be called by hand.
 * `done` is always called exactly once, and a `leave` during an `enter` starts from where it is.
 *
 * @example
 * const { enter, leave } = useOriginTransition({ origin: () => triggerRef.value })
 * // <Transition :css="false" @enter="enter" @leave="leave"> ... </Transition>
 */
export function useOriginTransition(options: UseOriginTransitionOptions = {}) {
  const { shouldReduceMotion } = useReducedMotion()

  let explicitOrigin: OriginTransitionOrigin | undefined = options.origin
  let storedOrigin: ResolvedOrigin | null = null
  let running: RunningAnimation | null = null

  captureLastPointer()

  function setOrigin(origin: OriginTransitionOrigin | undefined) {
    explicitOrigin = origin
  }

  function resolveOrigin(phase: 'enter' | 'leave'): ResolvedOrigin | null {
    const explicit = explicitOrigin === undefined ? null : resolveTarget(toValue(explicitOrigin))
    if (explicit)
      return explicit

    if (phase === 'leave')
      return storedOrigin

    const pointerTarget = getLastPointerTarget()
    return pointerTarget ? { kind: 'element', element: pointerTarget } : null
  }

  function getDuration(phase: 'enter' | 'leave') {
    const explicit = toValue(options.duration)
    const base = explicit ?? readNumberVar('--maz-motion-normal', 200, true) * readNumberVar('--maz-motion-scale', 1)

    return phase === 'leave' ? base * (options.leaveRatio ?? 0.7) : base
  }

  function getReducedDuration() {
    return toValue(options.duration) === 0 ? 0 : readNumberVar('--maz-motion-fast', 150, true) * readNumberVar('--maz-motion-scale', 1)
  }

  function getEasing(phase: 'enter' | 'leave') {
    const { easing } = options
    const custom = typeof easing === 'string' ? easing : easing?.[phase]
    if (custom)
      return custom

    return phase === 'enter'
      ? readEasingVar('--maz-easing-out', DEFAULT_ENTER_EASING)
      : readEasingVar('--maz-easing-in', DEFAULT_LEAVE_EASING)
  }

  function interruptRunning(el: Element) {
    if (!running)
      return undefined

    const style = getComputedStyle(el)
    const state = {
      current: { transform: style.transform || 'none', opacity: style.opacity || '1', borderRadius: style.borderRadius } as Keyframe,
      transformOrigin: running.transformOrigin,
    }
    running.settle()

    return state
  }

  function run(phase: 'enter' | 'leave', element: Element, done: () => void) {
    const el = element as HTMLElement
    const isEnter = phase === 'enter'

    if (typeof document === 'undefined' || typeof el.animate !== 'function' || toValue(options.animated) === false) {
      running?.settle()
      done()
      return
    }

    const interrupted = interruptRunning(el)
    const current = interrupted?.current
    const transformOrigin = interrupted?.transformOrigin

    const reduced = shouldReduceMotion.value
    const resolved = reduced ? null : resolveOrigin(phase)
    if (isEnter && resolved)
      storedOrigin = resolved

    const rect = el.getBoundingClientRect()
    const style = getComputedStyle(el)
    const shown: Keyframe = { transform: 'none', opacity: '1', borderRadius: style.borderRadius }

    const hiddenState = getHiddenState(resolved, el, rect, options.fallback ?? 'fade-scale', reduced)
    if (!hiddenState) {
      done()
      return
    }

    const { hidden } = hiddenState
    const origin = transformOrigin ?? hiddenState.origin

    const keyframes = isEnter ? [current ?? hidden, shown] : [current ?? shown, hidden]
    const duration = reduced ? getReducedDuration() : getDuration(phase)
    if (duration <= 0) {
      done()
      return
    }

    play(el, keyframes, { duration, easing: getEasing(phase), fill: isEnter ? 'none' : 'forwards' }, origin, done)
  }

  function play(el: HTMLElement, keyframes: Keyframe[], animationOptions: KeyframeAnimationOptions, origin: string | undefined, done: () => void) {
    const previousTransformOrigin = el.style.transformOrigin
    if (origin)
      el.style.transformOrigin = origin
    el.style.willChange = 'transform, opacity'

    let animation: Animation
    try {
      animation = el.animate(keyframes, animationOptions)
    }
    catch {
      el.style.transformOrigin = previousTransformOrigin
      el.style.removeProperty('will-change')
      done()
      return
    }

    let settled = false
    const entry: RunningAnimation = {
      animation,
      transformOrigin: origin ?? previousTransformOrigin,
      settle() {
        if (settled)
          return
        settled = true
        if (running === entry)
          running = null
        el.style.transformOrigin = previousTransformOrigin
        el.style.removeProperty('will-change')
        done()
        animation.cancel()
      },
    }

    running = entry
    animation.onfinish = entry.settle
    animation.oncancel = entry.settle
  }

  function enter(el: Element, done: () => void) {
    run('enter', el, done)
  }

  function leave(el: Element, done: () => void) {
    run('leave', el, done)
  }

  if (getCurrentScope())
    onScopeDispose(() => running?.settle())

  return { enter, leave, setOrigin, captureLastPointer }
}
