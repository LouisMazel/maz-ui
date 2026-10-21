import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import { computed, getCurrentInstance, onMounted, onScopeDispose, readonly, ref, toValue, watch } from 'vue'

export type PullToRefreshTarget = HTMLElement | Window | null | undefined

export interface UsePullToRefreshOptions {
  /**
   * Callback executed when the user releases after pulling far enough (or when `refresh()` is called).
   * The indicator stays in its refreshing state until the returned promise settles.
   */
  onRefresh?: () => unknown
  /**
   * Scroll container that receives the gesture. The pull only starts when this container is scrolled to the top.
   * @default window
   */
  target?: MaybeRefOrGetter<PullToRefreshTarget>
  /**
   * Pull distance (in px, after resistance) required to trigger a refresh
   * @default 80
   */
  threshold?: MaybeRefOrGetter<number>
  /**
   * Maximum pull distance (in px). Beyond the threshold, the pull follows a rubber band curve up to this value.
   * @default threshold * 1.6
   */
  maxDistance?: MaybeRefOrGetter<number | undefined>
  /**
   * Ratio between the finger movement and the pull distance, between 0 and 1. Lower is stiffer.
   * @default 0.5
   */
  resistance?: MaybeRefOrGetter<number>
  /**
   * Minimum time (in ms) the refreshing state lasts, so the feedback stays visible on fast refreshes
   * @default 400
   */
  minDuration?: MaybeRefOrGetter<number>
  /**
   * Vibrate briefly when the threshold is reached (devices supporting `navigator.vibrate`)
   * @default true
   */
  haptic?: MaybeRefOrGetter<boolean>
  /**
   * Disable the gesture
   * @default false
   */
  disabled?: MaybeRefOrGetter<boolean>
  /**
   * Called when `onRefresh` throws or rejects. The error is also exposed in `error`.
   */
  onError?: (error: unknown) => void
}

export interface UsePullToRefreshReturn {
  /** Current pull distance in px */
  distance: Readonly<Ref<number>>
  /** Pull progress towards the threshold, from 0 to 1 */
  progress: ComputedRef<number>
  /** The user is currently pulling */
  isPulling: Readonly<Ref<boolean>>
  /** Releasing now triggers a refresh */
  isReady: ComputedRef<boolean>
  /** `onRefresh` is running */
  isRefreshing: Readonly<Ref<boolean>>
  /** Error thrown by the last `onRefresh`, reset on each refresh */
  error: Readonly<Ref<unknown>>
  /** Run the refresh programmatically (keyboard users, "refresh" buttons) */
  refresh: () => Promise<void>
  /** Attach the touch listeners to the target (called automatically on mount) */
  start: () => void
  /** Detach the touch listeners */
  stop: () => void
}

/**
 * Distance shown for a finger movement: linear (scaled by the resistance) up to the threshold,
 * then a rubber band that tends towards `max` without ever reaching it
 */
function pullDistance(delta: number, { threshold, max, resistance }: { threshold: number, max: number, resistance: number }): number {
  const linear = Math.max(0, delta) * resistance
  if (linear <= threshold || max <= threshold)
    return Math.min(linear, Math.max(max, threshold))
  const range = max - threshold
  const overflow = linear - threshold
  return threshold + range * (overflow / (overflow + range))
}

function scrollTopOf(target: HTMLElement | Window): number {
  return 'scrollY' in target ? target.scrollY : target.scrollTop
}

export function usePullToRefresh(options: UsePullToRefreshOptions = {}): UsePullToRefreshReturn {
  const distance = ref(0)
  const isPulling = ref(false)
  const isRefreshing = ref(false)
  const error = ref<unknown>()

  const threshold = computed(() => toValue(options.threshold) ?? 80)
  const maxDistance = computed(() => toValue(options.maxDistance) ?? threshold.value * 1.6)
  const progress = computed(() => Math.min(1, distance.value / threshold.value))
  const isReady = computed(() => distance.value >= threshold.value)

  let start: { x: number, y: number } | null = null
  let direction: 'vertical' | 'horizontal' | null = null
  let vibrated = false

  function resolveTarget(): HTMLElement | Window | null {
    if (typeof window === 'undefined')
      return null
    return toValue(options.target) ?? globalThis.window
  }

  function reset() {
    start = null
    direction = null
    vibrated = false
    isPulling.value = false
    if (!isRefreshing.value)
      distance.value = 0
  }

  async function refresh() {
    if (isRefreshing.value)
      return
    isRefreshing.value = true
    isPulling.value = false
    error.value = undefined
    distance.value = Math.max(distance.value, threshold.value)
    const minDuration = toValue(options.minDuration) ?? 400
    try {
      await Promise.all([
        options.onRefresh?.(),
        new Promise(resolve => setTimeout(resolve, minDuration)),
      ])
    }
    catch (refreshError) {
      error.value = refreshError
      options.onError?.(refreshError)
    }
    finally {
      isRefreshing.value = false
      distance.value = 0
    }
  }

  function onTouchStart(event: TouchEvent) {
    const target = resolveTarget()
    if (!target || toValue(options.disabled) || isRefreshing.value || event.touches.length !== 1 || scrollTopOf(target) > 0)
      return
    const touch = event.touches[0]!
    start = { x: touch.clientX, y: touch.clientY }
    direction = null
  }

  function lockDirection(deltaX: number, deltaY: number) {
    if (!direction && (Math.abs(deltaX) >= 4 || Math.abs(deltaY) >= 4))
      direction = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical'
    return direction
  }

  function vibrateOnThreshold() {
    if (!isReady.value) {
      vibrated = false
      return
    }
    if (vibrated)
      return
    vibrated = true
    if ((toValue(options.haptic) ?? true) && typeof navigator !== 'undefined' && 'vibrate' in navigator)
      navigator.vibrate(10)
  }

  function cancelPull(abort: boolean) {
    isPulling.value = false
    distance.value = 0
    if (abort)
      start = null
  }

  function onTouchMove(event: TouchEvent) {
    const target = resolveTarget()
    if (!start || !target || event.touches.length !== 1)
      return
    const touch = event.touches[0]!
    const deltaY = touch.clientY - start.y
    const locked = lockDirection(touch.clientX - start.x, deltaY)
    if (!locked)
      return

    const scrolled = scrollTopOf(target) > 0
    if (locked === 'horizontal' || scrolled || deltaY <= 0) {
      cancelPull(locked === 'horizontal' || scrolled)
      return
    }

    // The page does not scroll nor bounce while pulling (and the browser's own pull to refresh stays quiet)
    if (event.cancelable)
      event.preventDefault()

    isPulling.value = true
    distance.value = pullDistance(deltaY, {
      threshold: threshold.value,
      max: maxDistance.value,
      resistance: toValue(options.resistance) ?? 0.5,
    })
    vibrateOnThreshold()
  }

  function onTouchEnd() {
    if (!start)
      return
    const ready = isPulling.value && isReady.value
    reset()
    if (ready)
      void refresh()
  }

  let bound: HTMLElement | Window | null = null

  function stop() {
    if (!bound)
      return
    bound.removeEventListener('touchstart', onTouchStart as EventListener)
    bound.removeEventListener('touchmove', onTouchMove as EventListener)
    bound.removeEventListener('touchend', onTouchEnd)
    bound.removeEventListener('touchcancel', onTouchEnd)
    bound = null
    reset()
  }

  function startListening() {
    stop()
    const target = resolveTarget()
    if (!target)
      return
    target.addEventListener('touchstart', onTouchStart as EventListener, { passive: true })
    target.addEventListener('touchmove', onTouchMove as EventListener, { passive: false })
    target.addEventListener('touchend', onTouchEnd, { passive: true })
    target.addEventListener('touchcancel', onTouchEnd, { passive: true })
    bound = target
  }

  if (getCurrentInstance())
    onMounted(startListening)
  else
    startListening()

  watch(() => toValue(options.target), () => {
    if (bound)
      startListening()
  })

  watch(() => toValue(options.disabled), (disabled) => {
    if (disabled)
      reset()
  })

  onScopeDispose(stop)

  return {
    distance: readonly(distance),
    progress,
    isPulling: readonly(isPulling),
    isReady,
    isRefreshing: readonly(isRefreshing),
    error: readonly(error),
    refresh,
    start: startListening,
    stop,
  }
}
