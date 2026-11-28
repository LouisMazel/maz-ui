export interface PopoverOriginRect {
  x: number
  y: number
  width: number
  height: number
}

export type PopoverOriginSide = 'top' | 'bottom' | 'left' | 'right'

export function getSideFromPlacement(placement: string): PopoverOriginSide {
  const side = placement.split('-')[0]

  return side === 'top' || side === 'left' || side === 'right' ? side : 'bottom'
}

function clamp(value: number, max: number) {
  return Math.min(Math.max(value, 0), max)
}

/**
 * Transform origin (in px, relative to the floating element) of a panel growing from its reference:
 * the center of the reference projected on the edge of the panel that faces it, clamped inside the panel.
 * A point (virtual reference) has a width and a height of 0.
 */
export function getOriginFromRects(
  reference: PopoverOriginRect,
  floating: PopoverOriginRect,
  side: PopoverOriginSide,
) {
  const centerX = clamp(reference.x + reference.width / 2 - floating.x, floating.width)
  const centerY = clamp(reference.y + reference.height / 2 - floating.y, floating.height)

  switch (side) {
    case 'top':
      return { x: centerX, y: floating.height }
    case 'left':
      return { x: floating.width, y: centerY }
    case 'right':
      return { x: 0, y: centerY }
    default:
      return { x: centerX, y: 0 }
  }
}

export function formatOrigin(origin: { x: number, y: number }) {
  return `${Math.round(origin.x * 100) / 100}px ${Math.round(origin.y * 100) / 100}px`
}
