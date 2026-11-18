import type { ThemePreset, ThemePresetOverrides } from '@maz-ui/themes'
import type { ColorScaleStep, ResolvedColor, ResolvedPreset, ResolvedThemeColors, ScaledColor } from '@maz-ui/themes/utils/resolve-preset'
import type { PresetValue, ProjectPreset } from './preset'

import { folio, mazUi, nova, obsidian, ocean, pristine } from '@maz-ui/themes/presets'
import { parseColorAsOklch } from '@maz-ui/themes/utils/color-conversions'
import { BRAND_COLOR_ROLES } from '@maz-ui/themes/utils/css-generator'
import { mergePresets } from '@maz-ui/themes/utils/preset-merger'
import { COLOR_SCALE_STEPS, getColorDistance, getContrastRatio, resolvePreset, SCALED_COLORS } from '@maz-ui/themes/utils/resolve-preset'

export const BUNDLED_PRESETS = {
  'mazUi': mazUi,
  'maz-ui': mazUi,
  ocean,
  pristine,
  obsidian,
  nova,
  folio,
} as const satisfies Record<string, ThemePreset>

export type BundledPresetName = keyof typeof BUNDLED_PRESETS

export interface ResolvedThemeOptions {
  /** Detailed table (oklch, contrasts) of these colors only */
  colors?: string[]
  /** Only these steps of the scales */
  steps?: ColorScaleStep[]
}

type Mode = 'light' | 'dark'

const MODES: Mode[] = ['light', 'dark']
const AA_TEXT = 4.5
const AA_UI = 3
const SAME_COLOR = 0.01
const HUE_SHIFT = 20
const LIGHTNESS_SHIFT = 0.25
const SHIFT_DISTANCE = 0.08
const COLORED = 0.04
const FOREGROUND_COLORS = new Set<string>([...BRAND_COLOR_ROLES, 'contrast'])

function bundledPreset(base: string | undefined): ThemePreset | undefined {
  return base && Object.hasOwn(BUNDLED_PRESETS, base)
    ? BUNDLED_PRESETS[base as BundledPresetName]
    : undefined
}

/** The literal values of the overrides: the expressions (`<expr: ...>`) are left out */
function literalOverrides(value: PresetValue): PresetValue | undefined {
  if (typeof value === 'string') {
    return value.startsWith('<expr: ')
      ? undefined
      : value
  }

  if (value === null || Array.isArray(value))
    return undefined

  if (typeof value !== 'object')
    return value

  const entries = Object.entries(value).flatMap(([key, child]) => {
    const literal = literalOverrides(child)

    return literal === undefined
      ? []
      : [
          [key, literal] as const,
        ]
  })

  return Object.fromEntries(entries)
}

/** The preset a `definePreset` call produces, when its base is a bundled preset (`mazUi` otherwise) */
export function projectPresetValue(preset: ProjectPreset): { preset: ThemePreset, knownBase: boolean } {
  const base = bundledPreset(preset.base)
  const overrides = literalOverrides(preset.overrides) as ThemePresetOverrides

  return {
    preset: mergePresets(base ?? mazUi, {
      ...overrides,
      name: overrides.name ?? preset.exportName,
    }),
    knownBase: !!base || !preset.base,
  }
}

function hueShift(first: ResolvedColor, second: ResolvedColor): number | undefined {
  const a = parseColorAsOklch(first.oklch)
  const b = parseColorAsOklch(second.oklch)

  if (a.c < COLORED || b.c < COLORED)
    return undefined

  const distance = Math.abs(a.h - b.h) % 360

  return Math.min(distance, 360 - distance)
}

function ratio(first: ResolvedColor | undefined, second: ResolvedColor | undefined): number | undefined {
  return first && second
    ? getContrastRatio(first.hex, second.hex)
    : undefined
}

function formatRatio(value: number | undefined): string {
  return value === undefined
    ? '-'
    : `${value.toFixed(1)}`
}

function collapsedGroups(scale: Record<ColorScaleStep, ResolvedColor>): ColorScaleStep[][] {
  const groups: ColorScaleStep[][] = []

  COLOR_SCALE_STEPS.forEach((step, index) => {
    const previous = COLOR_SCALE_STEPS[index - 1]

    if (previous && getColorDistance(scale[previous].oklch, scale[step].oklch) < SAME_COLOR) {
      const group = groups.at(-1)

      if (group?.at(-1) === previous)
        group.push(step)
      else
        groups.push([previous, step])
    }
  })

  return groups
}

function collapsedSteps(resolved: ResolvedPreset, colors: readonly ScaledColor[]): Array<{ mode: Mode, color: ScaledColor, groups: ColorScaleStep[][], scale: Record<ColorScaleStep, ResolvedColor> }> {
  return MODES.flatMap(mode => colors.flatMap((color) => {
    const scale = resolved[mode].scales[color]
    const groups = scale
      ? collapsedGroups(scale)
      : []

    return scale && groups.length > 0
      ? [
          { mode, color, groups, scale },
        ]
      : []
  }))
}

function modeShift(color: ScaledColor, resolved: ResolvedPreset): string | undefined {
  const light = resolved.light.scales[color]
  const dark = resolved.dark.scales[color]

  if (!light || !dark)
    return undefined

  const shifted = COLOR_SCALE_STEPS.filter((step) => {
    const hue = hueShift(light[step], dark[step])
    const lightness = Math.abs(parseColorAsOklch(light[step].oklch).l - parseColorAsOklch(dark[step].oklch).l)

    return ((hue ?? 0) > HUE_SHIFT && getColorDistance(light[step].oklch, dark[step].oklch) > SHIFT_DISTANCE) || lightness > LIGHTNESS_SHIFT
  })

  if (shifted.length === 0)
    return undefined

  const [first] = shifted

  return `\`${color}\`: ${shifted.map(step => `-${step}`).join(', ')} look different in dark mode (\`${color}-${first}\`: \`${light[first].hex}\` light, \`${dark[first].hex}\` dark): check the step suits both modes, or pick one per mode.`
}

function contrastWarnings(mode: Mode, colors: ResolvedThemeColors['colors']): string[] {
  const warnings: string[] = []
  const check = (label: string, value: number | undefined, minimum: number, advice: string): void => {
    if (value !== undefined && value < minimum)
      warnings.push(`${label} ${mode}: ${value.toFixed(1)}:1, under ${minimum}:1. ${advice}`)
  }

  check('`text-foreground` on `bg-surface`', ratio(colors.foreground, colors.surface), AA_TEXT, 'Body text is hard to read.')
  check('`text-muted` on `bg-surface`', ratio(colors.muted, colors.surface), AA_TEXT, 'Secondary text is hard to read.')

  for (const color of ['primary', 'secondary'] as const)
    check(`\`${color}\` on \`bg-surface\``, ratio(colors[color], colors.surface), AA_UI, `\`${color}\` is a strong brand color (buttons, outlined and text variants, links): too pale, it disappears on the surface. For subtle backgrounds use \`surface\`, \`container\`, \`muted\` or the \`-50\`/\`-100\` steps.`)

  for (const color of FOREGROUND_COLORS) {
    const name = color as keyof typeof colors
    check(`\`text-${color}-foreground\` on \`bg-${color}\``, ratio(colors[`${color}-foreground` as keyof typeof colors], colors[name]), AA_TEXT, `Text on \`${color}\` (buttons, badges) is hard to read.`)
  }

  return warnings
}

/** What to check in the resolved theme: low contrasts, steps that look the same, steps that change a lot between modes */
export function themeWarnings(resolved: ResolvedPreset): string[] {
  const brand = collapsedSteps(resolved, BRAND_COLOR_ROLES).map(({ mode, color, groups, scale }) => `\`${color}\` ${mode}: ${groups.map(group => `${group.join(' = ')} (\`${scale[group[0]].hex}\`)`).join(', ')} look the same: pick another step, or \`scales.color: 'perceptual'\` in the preset.`)
  const neutral = collapsedSteps(resolved, SCALED_COLORS.filter(color => !(BRAND_COLOR_ROLES as readonly string[]).includes(color)))
    .map(({ mode, color, groups }) => `\`${color}\` ${mode} ${groups.map(group => `${group[0]}-${group.at(-1)}`).join(', ')}`)

  return [
    ...MODES.flatMap(mode => contrastWarnings(mode, resolved[mode].colors)),
    ...brand,
    ...(neutral.length > 0
      ? [`The neutral scales reach white or black at their ends, these steps look the same: ${neutral.join('; ')}.`]
      : []),
    ...BRAND_COLOR_ROLES.flatMap((color) => {
      const warning = modeShift(color, resolved)

      return warning
        ? [warning]
        : []
    }),
  ]
}

function hex(color: ResolvedColor | undefined): string {
  return color
    ? `\`${color.hex}\``
    : '-'
}

function baseTable(resolved: ResolvedPreset): string {
  const names = Object.keys(resolved.light.colors) as Array<keyof ResolvedThemeColors['colors']>

  return [
    '| Token | Light | Dark | On surface (light / dark) | With its `-foreground` (light / dark) |',
    '| --- | --- | --- | --- | --- |',
    ...names.filter(name => !name.endsWith('-foreground')).map((name) => {
      const foreground = `${name}-foreground` as keyof ResolvedThemeColors['colors']
      const withForeground = FOREGROUND_COLORS.has(name)
        ? MODES.map(mode => formatRatio(ratio(resolved[mode].colors[name], resolved[mode].colors[foreground]))).join(' / ')
        : '-'
      const onSurface = name === 'surface'
        ? '-'
        : MODES.map(mode => formatRatio(ratio(resolved[mode].colors[name], resolved[mode].colors.surface))).join(' / ')

      return `| \`${name}\` | ${hex(resolved.light.colors[name])} | ${hex(resolved.dark.colors[name])} | ${onSurface} | ${withForeground} |`
    }),
  ].join('\n')
}

function scaleMatrix(resolved: ResolvedPreset, steps: readonly ColorScaleStep[]): string {
  return [
    `| Color | Mode | ${steps.join(' | ')} |`,
    `| --- | --- | ${steps.map(() => '---').join(' | ')} |`,
    ...SCALED_COLORS.flatMap(color => MODES.flatMap((mode) => {
      const scale = resolved[mode].scales[color]

      return scale
        ? [`| \`${color}\` | ${mode} | ${steps.map(step => hex(scale[step])).join(' | ')} |`]
        : []
    })),
  ].join('\n')
}

function colorDetail(resolved: ResolvedPreset, color: ScaledColor, steps: readonly ColorScaleStep[]): string {
  const hasForeground = FOREGROUND_COLORS.has(color)
  const contrasts = (mode: Mode, value: ResolvedColor): string[] => {
    const { colors } = resolved[mode]

    return [
      formatRatio(ratio(value, colors.surface)),
      formatRatio(ratio(value, colors.foreground)),
      ...(hasForeground
        ? [
            formatRatio(ratio(value, colors[`${color}-foreground` as keyof typeof colors])),
          ]
        : []),
    ]
  }
  const headers = (mode: Mode): string[] => [
    `${mode}`,
    'oklch',
    'on surface',
    'on foreground',
    ...(hasForeground
      ? [`with \`${color}-foreground\``]
      : []),
  ]

  return [
    `#### \`${color}\``,
    '',
    `| Class | ${[
      ...headers('light'),
      ...headers('dark'),
    ].join(' | ')} |`,
    `| --- | ${[
      ...headers('light'),
      ...headers('dark'),
    ].map(() => '---').join(' | ')} |`,
    ...steps.map((step) => {
      const cells = MODES.flatMap((mode) => {
        const value = resolved[mode].scales[color]?.[step]

        return value
          ? [
              `\`${value.hex}\``,
              `\`${value.oklch}\``,
              ...contrasts(mode, value),
            ]
          : headers(mode).map(() => '-')
      })

      return `| \`${color}-${step}\` | ${cells.join(' | ')} |`
    }),
  ].join('\n')
}

/** The effective colors of a preset, per mode, with their contrasts and what to check */
export function renderResolvedTheme(preset: ThemePreset, title: string, { colors, steps }: ResolvedThemeOptions = {}): string {
  const resolved = resolvePreset(preset)
  const wantedSteps = steps?.length
    ? COLOR_SCALE_STEPS.filter(step => steps.includes(step))
    : COLOR_SCALE_STEPS
  const detailed = SCALED_COLORS.filter(color => colors?.includes(color))
  const warnings = themeWarnings(resolved)

  return [
    `### Effective colors of ${title}`,
    `Computed with the formulas of the stylesheet (\`scales.color: '${resolved.colorScale}'\`): the values the browser renders, in sRGB (wide-gamut colors are clipped). Contrast ratios are WCAG 2: 4.5 for text, 3 for large text and UI parts (borders, icons, outlined buttons).`,
    warnings.length > 0
      ? `**To check:**\n\n${warnings.map(warning => `- ${warning}`).join('\n')}`
      : '**To check:** nothing, every text pair reaches AA and every step is distinct.',
    ...(detailed.length > 0
      ? detailed.map(color => colorDetail(resolved, color, wantedSteps))
      : [
          baseTable(resolved),
          scaleMatrix(resolved, wantedSteps),
          'Contrasts and oklch of each step: `get_theme_tokens({ colors: ["accent"] })`.',
        ]),
  ].join('\n\n')
}

export interface EffectiveColorsOptions extends ResolvedThemeOptions {
  /** A bundled preset instead of the presets of the project */
  preset?: BundledPresetName
}

/** The effective colors of a bundled preset, or of the `definePreset` presets of the project (`mazUi` when there is none) */
export function renderEffectiveColors(presets: ProjectPreset[], { preset, ...options }: EffectiveColorsOptions = {}): string {
  if (preset)
    return renderResolvedTheme(BUNDLED_PRESETS[preset], `the \`${preset}\` preset`, options)

  if (presets.length === 0)
    return `${renderResolvedTheme(mazUi, 'the `mazUi` preset', options)}\n\nNo \`definePreset\` in the project: these are the colors of the default preset. Pass \`preset\` for another bundled preset (${Object.keys(BUNDLED_PRESETS).map(name => `\`${name}\``).join(', ')}).`

  return presets.map((project) => {
    const { preset: value, knownBase } = projectPresetValue(project)
    const note = knownBase
      ? ''
      : `\n\nThe base \`${project.base}\` is not a bundled preset: the overrides are applied on \`mazUi\`.`

    return `${renderResolvedTheme(value, `\`${value.name}\` (\`${project.file}\`)`, options)}${note}`
  }).join('\n\n')
}
