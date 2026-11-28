import type { MazFreeColor } from '../components/types.ts'

const LIGHTNESS_THRESHOLD = 0.65

export function isFreeColor(color: string): color is MazFreeColor {
  return color.startsWith('#') || color.includes('(')
}

/** CSS value of a theme color name (`var(--maz-primary)`) or of a free color (unchanged) */
export function resolveColor(color: string) {
  return isFreeColor(color)
    ? color
    : `var(--maz-${color})`
}

/** Readable text color on the color: the theme `-foreground` token, or black or white computed from the lightness of a free color */
export function resolveColorForeground(color: string) {
  return isFreeColor(color)
    ? `oklch(from ${color} clamp(0, calc((${LIGHTNESS_THRESHOLD} - l) * 1000), 1) 0 0)`
    : `var(--maz-${color}-foreground)`
}

/** The color moved on the lightness axis of OKLCh (`-0.1` for a text on a pastel background, `0.15` in dark mode) */
export function shiftColorLightness(color: string, offset: number) {
  return `oklch(from ${resolveColor(color)} clamp(0, calc(l ${offset < 0 ? '-' : '+'} ${Math.abs(offset)}), 1) c h)`
}

/** The color at `percent` over a transparent background (tint, halo, border) */
export function mixColor(color: string, percent: number) {
  return `color-mix(in srgb, ${resolveColor(color)} ${percent}%, transparent)`
}
