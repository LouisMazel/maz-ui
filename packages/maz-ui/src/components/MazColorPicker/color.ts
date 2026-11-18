export type MazColorPickerFormat = 'hex' | 'rgb' | 'hsl' | 'oklch'

/** sRGB channels from 0 to 255, alpha from 0 to 1 */
export interface Rgba {
  r: number
  g: number
  b: number
  a: number
}

/** Hue from 0 to 360, saturation, value and alpha from 0 to 1 */
export interface Hsva {
  h: number
  s: number
  v: number
  a: number
}

const NUMBER = String.raw`[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?`
const FUNCTION_PATTERN = /^(rgba?|hsla?|oklch|oklab)\((.*)\)$/i
const HEX_PATTERN = /^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i
const CHANNEL_PATTERN = new RegExp(String.raw`^(${NUMBER})(%|deg|turn|rad)?$`, 'i')

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value))
}

function round(value: number, digits = 0): number {
  const factor = 10 ** digits

  return Math.round(value * factor) / factor
}

interface Channel {
  value: number
  unit: string
}

function splitChannels(body: string): { channels: Channel[], alpha?: Channel } | undefined {
  const [main = '', alphaPart, ...rest] = body.split('/')
  if (rest.length > 0)
    return undefined

  const parts = main.includes(',')
    ? main.split(',')
    : main.trim().split(/\s+/)
  const tokens = parts.map(part => part.trim()).filter(Boolean)

  const parse = (token: string): Channel | undefined => {
    if (token.toLowerCase() === 'none')
      return { value: 0, unit: '' }
    const match = CHANNEL_PATTERN.exec(token)

    return match
      ? {
          value: Number.parseFloat(match[1]!),
          unit: (match[2] ?? '').toLowerCase(),
        }
      : undefined
  }

  let alphaToken: string | undefined = alphaPart?.trim()
  if (alphaToken === undefined && tokens.length === 4)
    alphaToken = tokens.pop()
  const channels = tokens.map(parse)
  const alpha = alphaToken === undefined
    ? undefined
    : parse(alphaToken)

  if (channels.length !== 3 || channels.some(channel => !channel) || (alphaToken !== undefined && !alpha))
    return undefined

  return { channels: channels as Channel[], alpha }
}

function alphaOf(channel?: Channel): number {
  if (!channel)
    return 1

  return clamp(channel.unit === '%'
    ? channel.value / 100
    : channel.value)
}

function hueOf({ value, unit }: Channel): number {
  const degrees = unit === 'turn'
    ? value * 360
    : unit === 'rad'
      ? value * 180 / Math.PI
      : value

  return ((degrees % 360) + 360) % 360
}

function parseHex(hex: string): Rgba {
  const digits = hex.length <= 4
    ? [...hex].map(char => char + char).join('')
    : hex
  const [r, g, b, a = 255] = digits.match(/../g)!.map(pair => Number.parseInt(pair, 16))

  return {
    r: r!,
    g: g!,
    b: b!,
    a: round(a / 255, 3),
  }
}

function linearToSrgb(value: number): number {
  return value <= 0.0031308
    ? value * 12.92
    : 1.055 * value ** (1 / 2.4) - 0.055
}

function srgbToLinear(value: number): number {
  return value <= 0.04045
    ? value / 12.92
    : ((value + 0.055) / 1.055) ** 2.4
}

function oklabToRgb(l: number, a: number, b: number, alpha: number): Rgba {
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3

  const channels = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ].map(channel => round(clamp(linearToSrgb(channel)) * 255, 3))

  return {
    r: channels[0]!,
    g: channels[1]!,
    b: channels[2]!,
    a: alpha,
  }
}

/** OKLab lightness and the a/b axes of a sRGB color */
function rgbToOklab({ r, g, b }: Rgba): [number, number, number] {
  const [lr, lg, lb] = [r, g, b].map(channel => srgbToLinear(channel / 255)) as [number, number, number]

  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)

  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

export function hslToRgb(h: number, s: number, l: number, a = 1): Rgba {
  const k = (n: number) => (n + h / 30) % 12
  const chroma = s * Math.min(l, 1 - l)
  const f = (n: number) => l - chroma * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))

  return {
    r: round(f(0) * 255, 3),
    g: round(f(8) * 255, 3),
    b: round(f(4) * 255, 3),
    a,
  }
}

function parseFunction(name: string, body: string): Rgba | undefined {
  const parsed = splitChannels(body)
  if (!parsed)
    return undefined

  const [first, second, third] = parsed.channels as [Channel, Channel, Channel]
  const alpha = alphaOf(parsed.alpha)

  if (name.startsWith('rgb')) {
    const [r, g, b] = [first, second, third].map(channel => clamp(channel.unit === '%'
      ? channel.value * 2.55
      : channel.value, 0, 255))

    return { r: r!, g: g!, b: b!, a: alpha }
  }

  if (name.startsWith('hsl'))
    return hslToRgb(hueOf(first), clamp(second.value / 100), clamp(third.value / 100), alpha)

  const lightness = first.unit === '%'
    ? first.value / 100
    : first.value

  if (name === 'oklab') {
    const axis = (channel: Channel) => channel.unit === '%'
      ? channel.value * 0.004
      : channel.value

    return oklabToRgb(lightness, axis(second), axis(third), alpha)
  }

  const chroma = second.unit === '%'
    ? second.value * 0.004
    : second.value
  const hue = hueOf(third) * Math.PI / 180

  return oklabToRgb(lightness, chroma * Math.cos(hue), chroma * Math.sin(hue), alpha)
}

/**
 * Parse a CSS color: hex (3, 4, 6 or 8 digits), `rgb()`, `hsl()`, `oklch()`, `oklab()` (legacy comma or modern
 * space syntax, with alpha) and `transparent`. Returns `undefined` for anything else.
 */
export function parseColor(value?: string | null): Rgba | undefined {
  const color = value?.trim().toLowerCase()
  if (!color)
    return undefined

  if (color === 'transparent')
    return { r: 0, g: 0, b: 0, a: 0 }

  const hex = HEX_PATTERN.exec(color)
  if (hex)
    return parseHex(hex[1]!)

  const match = FUNCTION_PATTERN.exec(color)

  return match
    ? parseFunction(match[1]!, match[2]!)
    : undefined
}

/** Resolve any color the browser understands (named colors, `color()`...) through the computed style */
export function resolveCssColor(value?: string | null): Rgba | undefined {
  const parsed = parseColor(value)
  if (parsed || !value || typeof document === 'undefined' || typeof CSS === 'undefined' || !CSS.supports('color', value))
    return parsed

  const element = document.createElement('span')
  element.style.color = value
  element.style.display = 'none'
  document.body.append(element)
  const computed = getComputedStyle(element).color
  element.remove()

  return parseColor(computed)
}

export function rgbToHsv({ r, g, b, a }: Rgba, fallbackHue = 0): Hsva {
  const [red, green, blue] = [r / 255, g / 255, b / 255] as [number, number, number]
  const max = Math.max(red, green, blue)
  const delta = max - Math.min(red, green, blue)

  let hue = fallbackHue
  if (delta > 0) {
    if (max === red)
      hue = 60 * (((green - blue) / delta) % 6)
    else if (max === green)
      hue = 60 * ((blue - red) / delta + 2)
    else
      hue = 60 * ((red - green) / delta + 4)
  }

  return {
    h: (hue + 360) % 360,
    s: max === 0
      ? 0
      : delta / max,
    v: max,
    a,
  }
}

export function hsvToRgb({ h, s, v, a }: Hsva): Rgba {
  const f = (n: number) => {
    const k = (n + h / 60) % 6

    return round((v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255, 3)
  }

  return {
    r: f(5),
    g: f(3),
    b: f(1),
    a,
  }
}

function toHex(value: number): string {
  return Math.round(clamp(value, 0, 255)).toString(16).padStart(2, '0')
}

function rgbToHsl({ r, g, b }: Rgba): [number, number, number] {
  const { h, s: _s, v } = rgbToHsv({ r, g, b, a: 1 })
  const lightness = v * (1 - _s / 2)
  const saturation = lightness === 0 || lightness === 1
    ? 0
    : (v - lightness) / Math.min(lightness, 1 - lightness)

  return [h, saturation, lightness]
}

function alphaSuffix(alpha: number): string {
  return alpha < 1
    ? ` / ${round(alpha, 2)}`
    : ''
}

/** Format a color in one of the CSS formats, with the alpha only when it is under 1 */
export function formatColor(color: Rgba, format: MazColorPickerFormat = 'hex'): string {
  const alpha = clamp(color.a)

  if (format === 'rgb')
    return `rgb(${Math.round(color.r)} ${Math.round(color.g)} ${Math.round(color.b)}${alphaSuffix(alpha)})`

  if (format === 'hsl') {
    const [h, s, l] = rgbToHsl(color)

    return `hsl(${round(h)} ${round(s * 100)}% ${round(l * 100)}%${alphaSuffix(alpha)})`
  }

  if (format === 'oklch') {
    const [l, a, b] = rgbToOklab(color)
    const chroma = Math.hypot(a, b)
    const hue = chroma < 0.0005
      ? 0
      : (Math.atan2(b, a) * 180 / Math.PI + 360) % 360

    return `oklch(${round(l, 3)} ${round(chroma, 3)} ${round(hue, 1)}${alphaSuffix(alpha)})`
  }

  const hex = `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`

  return alpha < 1
    ? `${hex}${toHex(alpha * 255)}`
    : hex
}

/** Relative luminance (WCAG) of a sRGB color, from 0 (black) to 1 (white) */
export function getLuminance({ r, g, b }: Rgba): number {
  const [lr, lg, lb] = [r, g, b].map(channel => srgbToLinear(channel / 255)) as [number, number, number]

  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb
}
