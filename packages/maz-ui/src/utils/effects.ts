import { isClient } from '@maz-ui/utils/helpers/isClient'

/**
 * Whether the motion must be reduced: `m-motion-reduced` / `m-motion-full` on `<html>` (the `motion` option of `MazUi`)
 * win over the `prefers-reduced-motion` preference of the user
 */
export function isMotionReduced(): boolean {
  if (!isClient())
    return false

  const classes = document.documentElement.classList

  if (classes.contains('m-motion-reduced'))
    return true
  if (classes.contains('m-motion-full'))
    return false

  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Whether the main pointer can hover and is precise (mouse, trackpad, pen): false on touch screens
 */
export function canHover(): boolean {
  return isClient() && typeof matchMedia === 'function' && matchMedia('(hover: hover) and (pointer: fine)').matches
}

/**
 * Adds a stylesheet to the document once per `key` (adopted stylesheet, `<style>` as a fallback)
 */
export function injectStyles(key: string, css: string) {
  if (!isClient())
    return

  const registry = globalThis as unknown as Record<symbol, boolean>
  const symbol = Symbol.for(`maz-ui.${key}.styles`)

  if (registry[symbol])
    return

  registry[symbol] = true

  try {
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(css)
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet]
  }
  catch {
    const style = document.createElement('style')
    style.dataset.mazStyles = key
    style.textContent = css
    document.head.append(style)
  }
}

/**
 * Makes sure an element is a positioning context. Returns the function that restores it
 */
export function ensurePositioned(element: HTMLElement): () => void {
  if (getComputedStyle(element).position !== 'static')
    return () => {}

  element.style.position = 'relative'

  return () => {
    element.style.removeProperty('position')
  }
}

export interface Smoother {
  /** Sets the values to reach. Starts the loop when it is stopped */
  set: (target: number[]) => void
  /** Stops the loop at once */
  stop: () => void
  /** Stops the loop and forgets the current values */
  reset: () => void
  /** Whether the loop runs */
  readonly running: boolean
}

/**
 * Moves values toward a target with damping, one `requestAnimationFrame` loop that only runs while they move.
 * `apply` receives the current values at each frame.
 */
export function createSmoother(apply: (values: number[]) => void, options: { damping?: number, epsilon?: number } = {}): Smoother {
  const damping = options.damping ?? 0.12
  const epsilon = options.epsilon ?? 0.01
  let current: number[] = []
  let target: number[] = []
  let frame = 0

  const tick = () => {
    frame = 0
    let moving = false

    current = target.map((goal, index) => {
      const value = current[index] ?? 0
      const delta = goal - value

      if (Math.abs(delta) <= epsilon)
        return goal

      moving = true
      return value + delta * damping
    })

    apply(current)

    if (moving)
      frame = requestAnimationFrame(tick)
  }

  return {
    set(next) {
      target = next

      if (current.length === 0)
        current = next.map(() => 0)

      if (frame === 0)
        frame = requestAnimationFrame(tick)
    },
    stop() {
      if (frame !== 0)
        cancelAnimationFrame(frame)

      frame = 0
    },
    reset() {
      this.stop()
      current = []
      target = []
    },
    get running() {
      return frame !== 0
    },
  }
}
