import type { ColorScale } from '../types'
import { formatAsOklch, parseColor, parseColorAsOklch } from './color-parser'

/**
 * @deprecated Prefer `parseColor` from `./color-parser` — it accepts any CSS color format
 * (hsl(), rgb(), oklch(), #hex, or the legacy raw "H S% L%"). This alias is kept for
 * internal backwards-compatibility during the v5 migration and may be removed in v6.
 */
export function parseHSL(value: string): { h: number, s: number, l: number } {
  return parseColor(value)
}

/**
 * Lightness offsets for each scale step, expressed in OKLch L units (0..1).
 * Calibrated so a base at L≈0.55 (a typical mid-tone) produces a 50→950 scale
 * spanning roughly 0.97 → 0.21 — the perceptual range that matches Tailwind's
 * static palettes.
 */
const LIGHTNESS_OFFSETS = {
  50: +0.42,
  100: +0.35,
  200: +0.26,
  300: +0.17,
  400: +0.08,
  500: 0,
  600: -0.07,
  700: -0.14,
  800: -0.21,
  900: -0.28,
  950: -0.34,
} as const

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

/**
 * Smooth chroma falloff applied near L=0 and L=1 so very pale and very dark
 * variants don't look unnaturally vivid (a vibrant color at L=0.97 should
 * read as "tinted white", not as the same color).
 */
function chromaFalloff(targetL: number): number {
  if (targetL >= 0.96)
    return Math.max(0, 1 - (targetL - 0.96) * 12)
  if (targetL <= 0.18)
    return Math.max(0, targetL / 0.18)
  return 1
}

/**
 * Generate an 11-step color scale from a base color.
 *
 * The base color may be given in any CSS color format (`hsl()`, `rgb()`, `oklch()`, `#hex`,
 * or the legacy raw `"H S% L%"`). Stepping happens in OKLch space (perceptually uniform),
 * and the output is emitted as `oklch(L C H)` strings.
 */
export function generateColorScale(baseColor: string): ColorScale {
  const base = parseColorAsOklch(baseColor)
  const scale: Partial<ColorScale> = {}

  const variants = Object.keys(LIGHTNESS_OFFSETS).map(Number) as (keyof typeof LIGHTNESS_OFFSETS)[]
  for (const variant of variants) {
    if (variant === 500) {
      scale[variant] = formatAsOklch(base)
      continue
    }

    const offset = LIGHTNESS_OFFSETS[variant]
    const targetL = clamp(base.l + offset, 0, 1)
    const targetC = base.c * chromaFalloff(targetL)

    scale[variant] = formatAsOklch({ l: targetL, c: targetC, h: base.h })
  }

  return scale as ColorScale
}

/**
 * Return a black or white `oklch()` string suitable for text drawn on top of `baseColor`.
 *
 * The threshold (L=0.62) is calibrated for OKLch lightness — perceptually equivalent
 * to a mid-gray, so colors above that get black text, below it white text.
 */
export function getContrastColor(baseColor: string): string {
  const { l } = parseColorAsOklch(baseColor)
  return l > 0.62 ? 'oklch(0 0 0)' : 'oklch(1 0 0)'
}

/**
 * Shift the lightness of a color by `adjustment`. The adjustment is given in
 * OKLch L units (0..1) — e.g. `0.1` to lighten by 10% perceptual luminance.
 *
 * The input can be in any CSS color format; the output is always a complete
 * `oklch()` string.
 */
export function adjustColorLightness(baseColor: string, adjustment: number): string {
  const { l, c, h } = parseColorAsOklch(baseColor)
  const newL = clamp(l + adjustment, 0, 1)
  return formatAsOklch({ l: newL, c, h })
}
