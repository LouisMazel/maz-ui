import type { ColorScaleMode, ThemeColors, ThemePreset } from '../types'
import type { OklchChannels } from './color-conversions'
import { colorToHex, formatAsOklch, parseColorAsOklch } from './color-conversions'
import { normalizeColor } from './color-parser'
import { BRAND_COLOR_ROLES, getPerceptualColorScale, getRelativeColorScale } from './css-generator'

export const COLOR_SCALE_STEPS = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
] as const

export type ColorScaleStep = typeof COLOR_SCALE_STEPS[number]

/** Colors with a 50..950 scale in the Tailwind theme of maz-ui (`bg-primary-100`, `text-muted-700`...) */
export const SCALED_COLORS = [
  ...BRAND_COLOR_ROLES,
  'contrast',
  'surface',
  'foreground',
  'divider',
  'muted',
  'overlay',
  'shadow',
] as const

export type ScaledColor = typeof SCALED_COLORS[number]

/** Component backgrounds of the preset: `bg-container`, `bg-input` */
export const COMPONENT_COLORS = ['container', 'input'] as const

export type ResolvedColorName = keyof ThemeColors | typeof COMPONENT_COLORS[number]

export interface ResolvedColor {
  /** sRGB value, clipped when the color is outside the sRGB gamut */
  hex: string
  oklch: string
}

export interface ResolvedThemeColors {
  /** Value of every color token, `container` and `input` included. A value that cannot be computed (unknown variable) is missing */
  colors: Partial<Record<ResolvedColorName, ResolvedColor>>
  /** 50..950 steps of the colors with a scale (500 is the base color) */
  scales: Partial<Record<ScaledColor, Record<ColorScaleStep, ResolvedColor>>>
}

export interface ResolvedPreset {
  name: string
  /** Derivation of the 50..950 steps of the brand colors (`scales.color`) */
  colorScale: ColorScaleMode
  light: ResolvedThemeColors
  dark: ResolvedThemeColors
}

type Mode = 'light' | 'dark'
type VariableResolver = (name: string) => OklchChannels | undefined

/** Splits on a separator that is not inside parentheses */
function splitTopLevel(value: string, separator: RegExp): string[] {
  const parts: string[] = []
  let depth = 0
  let current = ''

  for (const char of value) {
    if (char === '(')
      depth++
    else if (char === ')')
      depth--

    if (depth === 0 && separator.test(char)) {
      if (current)
        parts.push(current)
      current = ''
    }
    else {
      current += char
    }
  }

  if (current)
    parts.push(current)

  return parts.map(part => part.trim()).filter(Boolean)
}

/** Content of `name(...)` when the whole value is this function call */
function functionArguments(value: string, name: string): string | undefined {
  if (!value.toLowerCase().startsWith(`${name}(`) || !value.endsWith(')'))
    return undefined

  const inner = value.slice(name.length + 1, -1)

  return splitTopLevel(`(${inner})`, /,/).length === 1
    ? inner
    : undefined
}

const TOKEN_PATTERN = /\s*(\d*\.\d+|\d+|[a-z]+|[()+\-*/,])/y

/** Evaluates a channel of the relative color syntax: numbers, `l` `c` `h`, `+ - * /`, `calc()`, `min()`, `max()`, `clamp()` */
export function evaluateChannel(expression: string, channels: OklchChannels): number {
  const tokens: string[] = []
  let position = 0
  TOKEN_PATTERN.lastIndex = 0
  let match = TOKEN_PATTERN.exec(expression)

  while (match) {
    tokens.push(match[1])
    position = TOKEN_PATTERN.lastIndex
    match = TOKEN_PATTERN.exec(expression)
  }

  if (expression.slice(position).trim())
    throw new Error(`Invalid channel: ${expression}`)

  let index = 0
  const peek = (): string | undefined => tokens[index]
  const take = (expected?: string): string => {
    const token = tokens[index++]

    if (token === undefined || (expected && token !== expected))
      throw new Error(`Invalid channel: ${expression}`)

    return token
  }

  const functions: Record<string, (args: number[]) => number> = {
    calc: ([value]) => value,
    min: args => Math.min(...args),
    max: args => Math.max(...args),
    clamp: ([min, value, max]) => Math.min(Math.max(value, min), max),
  }

  let sum: () => number

  const factor = (): number => {
    const token = take()

    if (token === '-')
      return -factor()

    if (token === '(') {
      const value = sum()
      take(')')
      return value
    }

    if (/^[\d.]/.test(token))
      return Number.parseFloat(token)

    if (Object.hasOwn(channels, token) && peek() !== '(')
      return channels[token as keyof OklchChannels]

    const fn = Object.hasOwn(functions, token)
      ? functions[token]
      : undefined

    if (!fn)
      throw new Error(`Invalid channel: ${expression}`)

    take('(')
    const args = [
      sum(),
    ]

    while (peek() === ',') {
      take(',')
      args.push(sum())
    }

    take(')')
    return fn(args)
  }

  const product = (): number => {
    let value = factor()

    while (peek() === '*' || peek() === '/') {
      value = take() === '*'
        ? value * factor()
        : value / factor()
    }

    return value
  }

  sum = (): number => {
    let value = product()

    while (peek() === '+' || peek() === '-') {
      value = take() === '+'
        ? value + product()
        : value - product()
    }

    return value
  }

  const value = sum()

  if (index !== tokens.length)
    throw new Error(`Invalid channel: ${expression}`)

  return value
}

function evaluateRelative(inner: string, mode: Mode, resolve: VariableResolver): OklchChannels | undefined {
  const [from, base, ...channels] = splitTopLevel(inner, /\s/)

  if (from !== 'from' || !base || channels.length < 3)
    return undefined

  const origin = evaluateColor(base, { mode, resolve })

  if (!origin)
    return undefined

  const [l, c, h] = channels.map(channel => evaluateChannel(channel, origin))

  return { l, c, h: ((h % 360) + 360) % 360 }
}

/**
 * Computes a CSS color as the browser does: plain colors, `var()` (with fallback),
 * `light-dark()` and the OKLCh relative color syntax (`oklch(from var(--maz-primary) calc(l + 0.1) c h)`).
 * Returns `undefined` when the value cannot be computed (unknown variable, unsupported syntax).
 */
export function evaluateColor(value: string, { mode = 'light', resolve = () => undefined }: { mode?: Mode, resolve?: VariableResolver } = {}): OklchChannels | undefined {
  const trimmed = value.trim()
  const variable = functionArguments(trimmed, 'var')

  if (variable !== undefined) {
    const [name, ...fallback] = splitTopLevel(variable, /,/)

    return resolve(name) ?? (fallback.length > 0
      ? evaluateColor(fallback.join(','), { mode, resolve })
      : undefined)
  }

  const lightDark = functionArguments(trimmed, 'light-dark')

  if (lightDark !== undefined) {
    const [light, dark] = splitTopLevel(lightDark, /,/)
    const picked = mode === 'dark'
      ? dark
      : light

    return picked
      ? evaluateColor(picked, { mode, resolve })
      : undefined
  }

  const oklch = functionArguments(trimmed, 'oklch')

  try {
    if (oklch?.trimStart().startsWith('from '))
      return evaluateRelative(oklch, mode, resolve)

    return parseColorAsOklch(normalizeColor(trimmed))
  }
  catch {
    return undefined
  }
}

function toResolvedColor(channels: OklchChannels): ResolvedColor {
  const oklch = formatAsOklch(channels)

  return {
    hex: colorToHex(oklch),
    oklch,
  }
}

/** The CSS of every color variable of a mode, as the preset and the maz-ui Tailwind theme declare them */
function colorDefinitions(preset: ThemePreset, mode: Mode): Map<string, string> {
  const definitions = new Map<string, string>()
  const { light, dark } = preset.colors

  for (const [key, lightValue] of Object.entries(light) as Array<[keyof ThemeColors, string]>) {
    const value = mode === 'dark'
      ? (dark[key] ?? lightValue)
      : lightValue

    if (value)
      definitions.set(`--maz-${key}`, value)
  }

  for (const component of COMPONENT_COLORS) {
    const bg = preset.components?.[component]?.bg
    const value = bg?.[mode] ?? bg?.light ?? bg?.dark

    if (value)
      definitions.set(`--maz-${component}-bg`, value)

    definitions.set(`--color-${component}`, `var(--maz-${component}-bg, var(--maz-surface))`)
  }

  const brandRoles = new Set<string>(BRAND_COLOR_ROLES)

  for (const color of SCALED_COLORS) {
    const base = `var(--maz-${color})`
    const scale = preset.scales.color === 'perceptual' && brandRoles.has(color)
      ? getPerceptualColorScale(base)
      : getRelativeColorScale(base)

    definitions.set(`--color-${color}`, base)
    definitions.set(`--color-${color}-500`, base)

    for (const [step, css] of Object.entries(scale))
      definitions.set(`--color-${color}-${step}`, css)
  }

  for (const [name, css] of [...definitions]) {
    if (name.startsWith('--color-'))
      definitions.set(`--maz-${name.slice(2)}`, css)
  }

  return definitions
}

function resolveMode(preset: ThemePreset, mode: Mode): ResolvedThemeColors {
  const definitions = colorDefinitions(preset, mode)
  const cache = new Map<string, OklchChannels | undefined>()
  const pending = new Set<string>()

  const resolve: VariableResolver = (name) => {
    if (cache.has(name))
      return cache.get(name)

    const css = definitions.get(name)

    if (css === undefined || pending.has(name))
      return undefined

    pending.add(name)
    const value = evaluateColor(css, { mode, resolve })
    pending.delete(name)
    cache.set(name, value)

    return value
  }

  const colors: ResolvedThemeColors['colors'] = {}
  const names: ResolvedColorName[] = [
    ...Object.keys(preset.colors.light) as Array<keyof ThemeColors>,
    ...COMPONENT_COLORS,
  ]

  for (const name of names) {
    const value = resolve(`--color-${name}`) ?? resolve(`--maz-${name}`)

    if (value)
      colors[name] = toResolvedColor(value)
  }

  const scales: ResolvedThemeColors['scales'] = {}

  for (const color of SCALED_COLORS) {
    const steps = COLOR_SCALE_STEPS.map(step => [
      step,
      resolve(`--color-${color}-${step}`),
    ] as const)

    if (steps.every(([, value]) => value)) {
      scales[color] = Object.fromEntries(steps.map(([step, value]) => [
        step,
        toResolvedColor(value!),
      ])) as Record<ColorScaleStep, ResolvedColor>
    }
  }

  return { colors, scales }
}

/**
 * Every color a preset produces, per mode: the color tokens, `container` and `input`,
 * and the 50..950 steps, as hex and oklch. Computed from the same CSS as the
 * stylesheet (`getRelativeColorScale`, `getPerceptualColorScale`), so the values
 * match what the browser renders.
 */
export function resolvePreset(preset: ThemePreset): ResolvedPreset {
  return {
    name: preset.name,
    colorScale: preset.scales.color ?? 'relative',
    light: resolveMode(preset, 'light'),
    dark: resolveMode(preset, 'dark'),
  }
}

function relativeLuminance(color: string): number {
  const hex = colorToHex(color)
  const [r, g, b] = [1, 3, 5].map((start) => {
    const channel = Number.parseInt(hex.slice(start, start + 2), 16) / 255

    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG 2 contrast ratio of two CSS colors, from 1 to 21 (AA: 4.5 for text, 3 for large text and UI parts) */
export function getContrastRatio(first: string, second: string): number {
  const [lighter, darker] = [
    relativeLuminance(first),
    relativeLuminance(second),
  ].sort((a, b) => b - a)

  return (lighter + 0.05) / (darker + 0.05)
}

/** Perceptual distance (OKLab) of two CSS colors: under 0.02 they look the same, above 0.15 they look like other colors */
export function getColorDistance(first: string, second: string): number {
  const [a, b] = [first, second].map((color) => {
    const { l, c, h } = parseColorAsOklch(color)
    const radians = (h * Math.PI) / 180

    return [l, c * Math.cos(radians), c * Math.sin(radians)]
  })

  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
}
