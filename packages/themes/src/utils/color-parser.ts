export interface HSLChannels {
  h: number
  s: number
  l: number
}

const HEX_PATTERN = /^#([0-9a-f]{3,8})$/i
/* eslint-disable sonarjs/regex-complexity -- Color parsing regexes are tested with 29 cases; splitting would hurt readability. */
const LEGACY_PATTERN = /^(-?\d+\.\d+|-?\d+)\s+(\d+\.\d+|\d+)%\s+(\d+\.\d+|\d+)%$/
const HSL_FN_PATTERN = /^hsla?\(\s*(-?\d+\.\d+|-?\d+)(?:\s*,\s*|\s+)(\d+\.\d+|\d+)%?(?:\s*,\s*|\s+)(\d+\.\d+|\d+)%?(?:\s*[,/][^)]*)?\)$/i
const RGB_FN_PATTERN = /^rgba?\(\s*(\d+\.\d+|\d+)(?:\s*,\s*|\s+)(\d+\.\d+|\d+)(?:\s*,\s*|\s+)(\d+\.\d+|\d+)(?:\s*[,/][^)]*)?\)$/i
const OKLCH_PATTERN = /^oklch\(\s*(\d+\.\d+|\d+)(%?)\s+(\d+\.\d+|\d+)\s+(-?\d+\.\d+|-?\d+)(?:\s*\/[^)]*)?\)$/i
/* eslint-enable sonarjs/regex-complexity */

const COMPLETE_COLOR_PATTERN = /^(?:hsla?|rgba?|oklch|oklab|lab|lch|color)\s*\(/i
const HEX_COLOR_PATTERN = /^#[0-9a-f]{3,8}$/i

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

  const toSRGB = (v: number): number =>
    v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055

  const r = Math.max(0, Math.min(1, toSRGB(rLinear))) * 255
  const g = Math.max(0, Math.min(1, toSRGB(gLinear))) * 255
  const b = Math.max(0, Math.min(1, toSRGB(bLinear))) * 255

  return { r, g, b }
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

export function formatAsHSL(channels: HSLChannels): string {
  return `hsl(${round1(channels.h)} ${round1(channels.s)}% ${round1(channels.l)}%)`
}

export function isCompleteCSSColor(value: string): boolean {
  const trimmed = value.trim()
  return COMPLETE_COLOR_PATTERN.test(trimmed) || HEX_COLOR_PATTERN.test(trimmed)
}

export function normalizeColor(value: string): string {
  if (isCompleteCSSColor(value)) {
    return value
  }
  const channels = parseColor(value)
  return formatAsHSL(channels)
}
