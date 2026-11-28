/** A snap point of a bottom sheet: a fraction of the viewport (`0.5`), pixels (`320`), or a CSS length (`'50%'`, `'20rem'`, `'300px'`, `'60vh'`). */
export type SheetSnapPoint = number | string

export interface ResolvedSheetSnap {
  /** The value as given by the user */
  value: SheetSnapPoint
  /** The visible height of the sheet at this snap point, in pixels */
  size: number
}

/** Speed (px/ms) from which a release is a flick */
export const FLICK_VELOCITY = 0.5

/** Distance (px) a sheet without snap points must be dragged to close */
export const CLOSE_DISTANCE = 120

/**
 * Visible height in pixels of a snap point: a number up to `1` is a fraction of the viewport,
 * a bigger number is in pixels, a string is a CSS length (`px`, `%`, `rem`, `vh`).
 * Returns `NaN` for a value that is not a length.
 */
export function resolveSnapSize(point: SheetSnapPoint, viewport: number, rootFontSize = 16): number {
  if (typeof point === 'number')
    return point > 0 && point <= 1 ? point * viewport : point

  const trimmed = point.trim()
  const amountText = /^[\d.]+/.exec(trimmed)?.[0] ?? ''
  const amount = Number.parseFloat(amountText)
  const unit = trimmed.slice(amountText.length).trim() || 'px'

  if (!Number.isFinite(amount) || !['px', 'rem', '%', 'vh', 'dvh', 'svh', 'lvh'].includes(unit))
    return Number.NaN

  if (unit === 'px')
    return amount
  if (unit === 'rem')
    return amount * rootFontSize

  return (amount / 100) * viewport
}

/**
 * Snap points as pixels, from the smallest to the biggest, without invalid values,
 * duplicates nor value bigger than the viewport.
 */
export function resolveSnapPoints(points: readonly SheetSnapPoint[] | undefined, viewport: number, rootFontSize = 16): ResolvedSheetSnap[] {
  if (!points?.length || viewport <= 0)
    return []

  const resolved: ResolvedSheetSnap[] = []

  for (const value of points) {
    const size = Math.min(resolveSnapSize(value, viewport, rootFontSize), viewport)

    if (Number.isFinite(size) && size > 0 && !resolved.some(item => Math.abs(item.size - size) < 1))
      resolved.push({ value, size })
  }

  return resolved.sort((a, b) => a.size - b.size)
}

/**
 * Release of a drag of a sheet without snap points: closes past the distance, or on a flick.
 * `velocity` is positive towards the dismiss direction.
 */
export function shouldDismiss({ position, velocity, distance = CLOSE_DISTANCE }: { position: number, velocity: number, distance?: number }): boolean {
  return position >= distance || (position > 0 && velocity >= FLICK_VELOCITY)
}

/**
 * Where a sheet with snap points rests after a release: the index of a snap point, or `'close'`.
 * - a flick goes to the next snap point in its direction (or closes under the lowest one),
 * - a slow release goes to the nearest one (closing counts as a point at `0`).
 * `visible` is the visible height of the sheet at the release, `velocity` the speed in px/ms (positive
 * when the sheet goes down), `sizes` the visible heights of the points (ascending).
 */
export function resolveSnapTarget({ visible, velocity, sizes, dismissible }: {
  visible: number
  velocity: number
  sizes: readonly number[]
  dismissible: boolean
}): number | 'close' {
  if (sizes.length === 0)
    return dismissible ? 'close' : 0

  if (Math.abs(velocity) >= FLICK_VELOCITY) {
    if (velocity > 0) {
      const lower = sizes.findLastIndex(size => size < visible - 1)

      if (lower !== -1)
        return lower

      return dismissible ? 'close' : 0
    }

    const higher = sizes.findIndex(size => size > visible + 1)

    return higher === -1 ? sizes.length - 1 : higher
  }

  let nearest = 0

  for (const [index, size] of sizes.entries()) {
    if (Math.abs(size - visible) < Math.abs((sizes[nearest] as number) - visible))
      nearest = index
  }

  if (dismissible && visible < Math.abs((sizes[nearest] as number) - visible))
    return 'close'

  return nearest
}
