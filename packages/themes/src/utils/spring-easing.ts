export interface SpringEasingOptions {
  /**
   * Strength of the spring: higher is faster
   * @default 170
   */
  stiffness?: number
  /**
   * Friction: lower bounces more, `2 * sqrt(stiffness * mass)` settles without bouncing
   * @default 26
   */
  damping?: number
  /**
   * Weight of the moving element: higher is slower and bounces more
   * @default 1
   */
  mass?: number
  /**
   * Number of points of the curve
   * @default 32
   */
  points?: number
}

const STEP = 1 / 1000
const MAX_DURATION = 5
const REST_DELTA = 0.001

function round(value: number) {
  return Number(value.toFixed(3))
}

/**
 * A CSS `linear()` easing that follows a spring, from 0 to 1. The spring is simulated until it rests,
 * then sampled in `points` steps: the curve keeps its shape whatever the duration of the transition.
 *
 * @example
 * springEasing() // no bounce
 * springEasing({ stiffness: 300, damping: 18 }) // a small bounce
 */
export function springEasing({ stiffness = 170, damping = 26, mass = 1, points = 32 }: SpringEasingOptions = {}): string {
  const positions: number[] = []
  let position = 0
  let velocity = 0

  for (let time = 0; time < MAX_DURATION; time += STEP) {
    const acceleration = (stiffness * (1 - position) - damping * velocity) / mass
    velocity += acceleration * STEP
    position += velocity * STEP
    positions.push(position)

    if (Math.abs(1 - position) < REST_DELTA && Math.abs(velocity) < REST_DELTA)
      break
  }

  const samples = Array.from({ length: points + 1 }, (_, index) => {
    if (index === 0)
      return 0
    if (index === points)
      return 1

    return round(positions[Math.round((index / points) * (positions.length - 1))] ?? 1)
  })

  return `linear(${samples.join(', ')})`
}
