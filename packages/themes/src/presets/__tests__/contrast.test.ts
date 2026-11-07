import type { ThemeColors, ThemePreset } from '../../types'
import { colorToHex } from '../../utils/color-conversions'
import { folio } from '../folio'
import { mazUi } from '../mazUi'
import { nova } from '../nova'
import { obsidian } from '../obsidian'
import { ocean } from '../ocean'
import { pristine } from '../pristine'

const AA = 4.5
const ROLES = [
  'primary',
  'secondary',
  'accent',
  'success',
  'warning',
  'destructive',
  'info',
  'contrast',
] as const

function luminance(color: string): number {
  const hex = colorToHex(color).replace('#', '')
  const [r, g, b] = [0, 2, 4].map((index) => {
    const channel = Number.parseInt(hex.slice(index, index + 2), 16) / 255

    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(first: string, second: string): number {
  const [light, dark] = [
    luminance(first),
    luminance(second),
  ].sort((a, b) => b - a)

  return (light + 0.05) / (dark + 0.05)
}

function getPairs(colors: ThemeColors): [string, string, string][] {
  return [
    ...ROLES.map(role => [role, colors[role], colors[`${role}-foreground`]] as [string, string, string]),
    ['muted on surface', colors.muted, colors.surface],
    ['foreground on surface', colors.foreground, colors.surface],
  ]
}

describe('given the bundled presets', () => {
  describe.each([
    mazUi,
    pristine,
    ocean,
    obsidian,
    nova,
    folio,
  ] as ThemePreset[])('when the colors of $name are paired', (preset) => {
    it.each(['light', 'dark'] as const)('then every text pair reaches WCAG AA in %s mode', (mode) => {
      const failures = getPairs(preset.colors[mode])
        .map(([name, first, second]) => ({
          name,
          ratio: Number(contrast(first, second).toFixed(2)),
        }))
        .filter(({ ratio }) => ratio < AA)

      expect(failures).toEqual([])
    })
  })
})
