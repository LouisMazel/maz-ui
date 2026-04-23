import type { ColorScale } from '../types'
import { formatAsHSL, parseColor } from './color-parser'

/**
 * @deprecated Prefer `parseColor` from `./color-parser` — it accepts any CSS color format
 * (hsl(), rgb(), oklch(), #hex, or the legacy raw "H S% L%"). This alias is kept for
 * internal backwards-compatibility during the v5 migration and may be removed in v6.
 */
export function parseHSL(value: string): { h: number, s: number, l: number } {
  return parseColor(value)
}

const LUMINOSITY_OFFSETS = {
  50: +37.5,
  100: +30,
  200: +22.5,
  300: +15,
  400: +7.5,
  500: 0,
  600: -7.5,
  700: -15,
  800: -22.5,
  900: -30,
  950: -37.5,
} as const

function calculateSaturationMultiplier(baseVariant: number, targetVariant: number, baseSaturation: number): number {
  if (targetVariant === baseVariant) {
    return 1
  }

  const saturationFactor = Math.min(baseSaturation / 100, 1)
  const variantDiff = Math.abs(targetVariant - baseVariant)

  if (targetVariant < baseVariant) {
    const reduction = (variantDiff / 500) * 0.25 * saturationFactor
    return Math.max(0.3, 1 - reduction)
  }
  else {
    const increase = (variantDiff / 400) * 0.15 * saturationFactor
    return Math.min(1.3, 1 + increase)
  }
}

/**
 * Generate an 11-step color scale from a base color.
 *
 * The base color can be given in any CSS color format (`hsl()`, `rgb()`, `oklch()`, `#hex`,
 * or the legacy raw `"H S% L%"`). Values are converted to HSL for scale computation and
 * emitted as complete `hsl()` strings.
 */
export function generateColorScale(baseColor: string): ColorScale {
  const { h, s, l } = parseColor(baseColor)

  const baseVariant = 500
  const baseLuminosity = l

  const variants = Object.keys(LUMINOSITY_OFFSETS).map(Number) as (keyof typeof LUMINOSITY_OFFSETS)[]
  const scale: Partial<ColorScale> = {}

  variants.forEach((variant) => {
    if (variant === baseVariant) {
      scale[variant] = formatAsHSL({ h, s, l })
    }
    else {
      const isUnderBase = variant < baseVariant
      const isOverBase = variant > baseVariant

      const luminosityOffset = LUMINOSITY_OFFSETS[variant as keyof typeof LUMINOSITY_OFFSETS]
      let targetLuminosity: number | undefined

      if (isUnderBase && l >= 100) {
        targetLuminosity = baseLuminosity
      }
      else {
        targetLuminosity = baseLuminosity + luminosityOffset
      }

      if (isOverBase && l <= 0) {
        targetLuminosity = 0
      }

      targetLuminosity = Math.min(100, Math.max(0, targetLuminosity))

      const saturationMultiplier = calculateSaturationMultiplier(baseVariant, variant, s)
      const adjustedSaturation = Math.min(100, Math.max(5, s * saturationMultiplier))

      scale[variant] = formatAsHSL({ h, s: adjustedSaturation, l: targetLuminosity })
    }
  })

  return scale as ColorScale
}

/**
 * Return a black or white `hsl()` string suitable for text drawn on top of `baseColor`.
 *
 * The base color may be any CSS color format.
 */
export function getContrastColor(baseColor: string): string {
  const { l } = parseColor(baseColor)
  return l > 50 ? 'hsl(0 0% 0%)' : 'hsl(0 0% 100%)'
}

/**
 * Shift the lightness of a color by `adjustment` (in L% units), clamped to [0, 100].
 *
 * The input can be in any CSS color format; the output is always a complete `hsl()` string.
 */
export function adjustColorLightness(baseColor: string, adjustment: number): string {
  const { h, s, l } = parseColor(baseColor)
  const newL = Math.max(0, Math.min(100, l + adjustment))
  return formatAsHSL({ h, s, l: newL })
}
