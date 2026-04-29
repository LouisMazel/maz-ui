export interface HSLChannels {
  h: number
  s: number
  l: number
}

export interface OklchChannels {
  /** Lightness in [0, 1] */
  l: number
  /** Chroma in [0, ~0.4] */
  c: number
  /** Hue in degrees [0, 360) */
  h: number
}

const HEX_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
/* eslint-disable sonarjs/regex-complexity -- Color parsing regexes are tested with 29 cases; splitting would hurt readability. */
const LEGACY_PATTERN = /^(-?\d+\.\d+|-?\d+)\s+(\d+\.\d+|\d+)%\s+(\d+\.\d+|\d+)%$/
const HSL_FN_PATTERN = /^hsla?\(\s*(-?\d+\.\d+|-?\d+)(?:\s*,\s*|\s+)(\d+\.\d+|\d+)%?(?:\s*,\s*|\s+)(\d+\.\d+|\d+)%?(?:\s*[,/][^)]*)?\)$/i
const RGB_FN_PATTERN = /^rgba?\(\s*(\d+\.\d+|\d+)(?:\s*,\s*|\s+)(\d+\.\d+|\d+)(?:\s*,\s*|\s+)(\d+\.\d+|\d+)(?:\s*[,/][^)]*)?\)$/i
const OKLCH_PATTERN = /^oklch\(\s*(\d+\.\d+|\d+)(%?)\s+(\d+\.\d+|\d+)\s+(-?\d+\.\d+|-?\d+)(?:\s*\/[^)]*)?\)$/i
/* eslint-enable sonarjs/regex-complexity */

const COMPLETE_COLOR_PATTERN = /^(?:hsla?|rgba?|oklch|oklab|lab|lch|color)\s*\(/i
const HEX_COLOR_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const CSS_VAR_PATTERN = /^var\(\s*--[\w-]+/i

export function parseColor(value: string): HSLChannels {
  const trimmed = value.trim()
  if (!trimmed) {
    throw new Error(`Invalid color: empty string`)
  }

  const hslMatch = trimmed.match(HSL_FN_PATTERN)
  if (hslMatch) {
    return {
      h: Number.parseFloat(hslMatch[1]),
      s: Number.parseFloat(hslMatch[2]),
      l: Number.parseFloat(hslMatch[3]),
    }
  }

  const rgbMatch = trimmed.match(RGB_FN_PATTERN)
  if (rgbMatch) {
    return rgbToHsl(
      Number.parseFloat(rgbMatch[1]),
      Number.parseFloat(rgbMatch[2]),
      Number.parseFloat(rgbMatch[3]),
    )
  }

  const hexMatch = trimmed.match(HEX_PATTERN)
  if (hexMatch) {
    const expanded = expandHex(hexMatch[1])
    const r = Number.parseInt(expanded.slice(0, 2), 16)
    const g = Number.parseInt(expanded.slice(2, 4), 16)
    const b = Number.parseInt(expanded.slice(4, 6), 16)
    return rgbToHsl(r, g, b)
  }

  const oklchMatch = trimmed.match(OKLCH_PATTERN)
  if (oklchMatch) {
    const lRaw = Number.parseFloat(oklchMatch[1])
    const lValue = oklchMatch[2] === '%' ? lRaw / 100 : lRaw
    const c = Number.parseFloat(oklchMatch[3])
    const h = Number.parseFloat(oklchMatch[4])
    const { r, g, b } = oklchToRgb(lValue, c, h)
    return rgbToHsl(r, g, b)
  }

  const legacyMatch = trimmed.match(LEGACY_PATTERN)
  if (legacyMatch) {
    return {
      h: Number.parseFloat(legacyMatch[1]),
      s: Number.parseFloat(legacyMatch[2]),
      l: Number.parseFloat(legacyMatch[3]),
    }
  }

  throw new Error(`Invalid color format: ${value}`)
}

/**
 * Parse any CSS color value and return its OKLCH channels.
 *
 * Accepts the same formats as `parseColor` plus native `oklch()` (parsed directly,
 * no roundtrip through sRGB so wide-gamut chroma is preserved).
 */
export function parseColorAsOklch(value: string): OklchChannels {
  const trimmed = value.trim()
  if (!trimmed) {
    throw new Error(`Invalid color: empty string`)
  }

  const oklchMatch = trimmed.match(OKLCH_PATTERN)
  if (oklchMatch) {
    const lRaw = Number.parseFloat(oklchMatch[1])
    return {
      l: oklchMatch[2] === '%' ? lRaw / 100 : lRaw,
      c: Number.parseFloat(oklchMatch[3]),
      h: Number.parseFloat(oklchMatch[4]),
    }
  }

  const { h, s, l } = parseColor(trimmed)
  const { r, g, b } = hslToRgb(h, s, l)
  return rgbToOklch(r, g, b)
}

function expandHex(hex: string): string {
  if (hex.length === 3) {
    return hex.split('').map(c => c + c).join('')
  }
  if (hex.length === 4) {
    return hex.slice(0, 3).split('').map(c => c + c).join('')
  }
  if (hex.length === 8) {
    return hex.slice(0, 6)
  }
  return hex
}

function rgbToHsl(r: number, g: number, b: number): HSLChannels {
  const rNorm = r / 255
  const gNorm = g / 255
  const bNorm = b / 255
  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)
  const l = (max + min) / 2

  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === rNorm) {
      h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6
    }
    else if (max === gNorm) {
      h = ((bNorm - rNorm) / d + 2) / 6
    }
    else {
      h = ((rNorm - gNorm) / d + 4) / 6
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

function hslToRgb(h: number, s: number, l: number): { r: number, g: number, b: number } {
  const sNorm = Math.max(0, Math.min(100, s)) / 100
  const lNorm = Math.max(0, Math.min(100, l)) / 100
  const hNorm = ((h % 360) + 360) % 360

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm
  const x = c * (1 - Math.abs((hNorm / 60) % 2 - 1))
  const m = lNorm - c / 2

  let r1 = 0
  let g1 = 0
  let b1 = 0
  if (hNorm < 60) {
    r1 = c
    g1 = x
  }
  else if (hNorm < 120) {
    r1 = x
    g1 = c
  }
  else if (hNorm < 180) {
    g1 = c
    b1 = x
  }
  else if (hNorm < 240) {
    g1 = x
    b1 = c
  }
  else if (hNorm < 300) {
    r1 = x
    b1 = c
  }
  else {
    r1 = c
    b1 = x
  }

  return { r: (r1 + m) * 255, g: (g1 + m) * 255, b: (b1 + m) * 255 }
}

function sRGBToLinear(v: number): number {
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

function linearToSRGB(v: number): number {
  return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055
}

function rgbToOklch(r: number, g: number, b: number): OklchChannels {
  const rLin = sRGBToLinear(Math.max(0, Math.min(255, r)) / 255)
  const gLin = sRGBToLinear(Math.max(0, Math.min(255, g)) / 255)
  const bLin = sRGBToLinear(Math.max(0, Math.min(255, b)) / 255)

  const lLms = 0.4122214708 * rLin + 0.5363325363 * gLin + 0.0514459929 * bLin
  const mLms = 0.2119034982 * rLin + 0.6806995451 * gLin + 0.1073969566 * bLin
  const sLms = 0.0883024619 * rLin + 0.2817188376 * gLin + 0.6299787005 * bLin

  const lp = Math.cbrt(lLms)
  const mp = Math.cbrt(mLms)
  const sp = Math.cbrt(sLms)

  const L = 0.2104542553 * lp + 0.7936177850 * mp - 0.0040720468 * sp
  const aLab = 1.9779984951 * lp - 2.4285922050 * mp + 0.4505937099 * sp
  const bLab = 0.0259040371 * lp + 0.7827717662 * mp - 0.8086757660 * sp

  const C = Math.sqrt(aLab * aLab + bLab * bLab)
  let H = (Math.atan2(bLab, aLab) * 180) / Math.PI
  if (H < 0)
    H += 360

  return { l: L, c: C, h: H }
}

function oklchToRgb(l: number, c: number, h: number): { r: number, g: number, b: number } {
  const hRad = (h * Math.PI) / 180
  const a = c * Math.cos(hRad)
  const bLab = c * Math.sin(hRad)

  const lp = l + 0.3963377774 * a + 0.2158037573 * bLab
  const mp = l - 0.1055613458 * a - 0.0638541728 * bLab
  const sp = l - 0.0894841775 * a - 1.2914855480 * bLab

  const lc = lp ** 3
  const mc = mp ** 3
  const sc = sp ** 3

  const rLinear = 4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc
  const gLinear = -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc
  const bLinear = -0.0041960863 * lc - 0.7034186147 * mc + 1.7076147010 * sc

  const r = Math.max(0, Math.min(1, linearToSRGB(rLinear))) * 255
  const g = Math.max(0, Math.min(1, linearToSRGB(gLinear))) * 255
  const b = Math.max(0, Math.min(1, linearToSRGB(bLinear))) * 255

  return { r, g, b }
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

function roundTo(n: number, places: number): number {
  const factor = 10 ** places
  return Math.round(n * factor) / factor
}

export function formatAsHSL(channels: HSLChannels): string {
  return `hsl(${round1(channels.h)} ${round1(channels.s)}% ${round1(channels.l)}%)`
}

export function formatAsOklch(channels: OklchChannels): string {
  const l = roundTo(channels.l, 4)
  const c = roundTo(channels.c, 4)
  // Hue is undefined when chroma is zero; canonicalize to 0 to avoid noisy values.
  const h = c === 0 ? 0 : roundTo(channels.h, 2)
  return `oklch(${l} ${c} ${h})`
}

/**
 * Convert any CSS color to a 6-digit `#rrggbb` hex string.
 * Wide-gamut input is clipped to sRGB during conversion.
 */
export function colorToHex(value: string): string {
  const oklch = parseColorAsOklch(value)
  const { r, g, b } = oklchToRgb(oklch.l, oklch.c, oklch.h)
  const toHex = (n: number) => {
    const v = Math.round(Math.max(0, Math.min(255, n))).toString(16)
    return v.length === 1 ? `0${v}` : v
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function isCompleteCSSColor(value: string): boolean {
  const trimmed = value.trim()
  return (
    COMPLETE_COLOR_PATTERN.test(trimmed)
    || HEX_COLOR_PATTERN.test(trimmed)
    || CSS_VAR_PATTERN.test(trimmed)
  )
}

export function normalizeColor(value: string): string {
  if (isCompleteCSSColor(value)) {
    return value
  }
  const channels = parseColor(value)
  return formatAsHSL(channels)
}
