import type { ProjectPreset } from '../preset.ts'

import { mazUi } from '@maz-ui/themes/presets/mazUi'
import { ocean } from '@maz-ui/themes/presets/ocean'
import { mergePresets } from '@maz-ui/themes/utils/preset-merger'
import { resolvePreset } from '@maz-ui/themes/utils/resolve-preset'
import { projectPresetValue, renderEffectiveColors, renderResolvedTheme, themeWarnings } from '../resolved-theme.ts'

function projectPreset(preset: Partial<ProjectPreset>): ProjectPreset {
  return { file: 'src/preset.ts', overrides: {}, ...preset }
}

describe('given projectPresetValue', () => {
  describe('when the base is a bundled preset', () => {
    it('then the literal overrides are merged on it', () => {
      const { preset, knownBase } = projectPresetValue(projectPreset({
        base: 'ocean',
        exportName: 'brand',
        overrides: {
          colors: {
            light: { primary: '#ff0000', secondary: '<expr: brand.secondary>' },
          },
          scales: {
            color: 'perceptual',
            rounded: { md: '4px' },
            shadow: null,
          },
          foundation: {
            'font-family': ['a'] as unknown as string,
            'space': 2,
          },
        },
      }))

      expect(knownBase).toBe(true)
      expect(preset.name).toBe('brand')
      expect(preset.colors.light.primary).toBe('#ff0000')
      expect(preset.colors.light.secondary).toBe(ocean.colors.light.secondary)
      expect(preset.scales.color).toBe('perceptual')
      expect(preset.foundation.space).toBe(2)
    })
  })

  describe('when the base is unknown or missing', () => {
    it('then the overrides are merged on mazUi', () => {
      expect(projectPresetValue(projectPreset({
        base: 'brandBase',
        overrides: { name: 'x' },
      }))).toMatchObject({
        knownBase: false,
        preset: {
          name: 'x',
          colors: {
            light: { primary: mazUi.colors.light.primary },
          },
        },
      })
      expect(projectPresetValue(projectPreset({})).knownBase).toBe(true)
    })
  })
})

describe('given themeWarnings', () => {
  describe('when the preset has pale brand colors, low contrasts and collapsed steps', () => {
    const preset = mergePresets(mazUi, {
      colors: {
        light: {
          'secondary': '#f5f3ff',
          'muted': '#bbbbbb',
          'foreground': '#cccccc',
          'primary-foreground': '#0175da',
          'accent': '#C3913D',
        },
        dark: { accent: '#FFF46F' },
      },
    })
    const warnings = themeWarnings(resolvePreset(preset))

    it('then it lists each problem with its fix', () => {
      expect(warnings.join('\n')).toContain('`secondary` on `bg-surface` light')
      expect(warnings.join('\n')).toContain('`text-muted` on `bg-surface` light')
      expect(warnings.join('\n')).toContain('`text-foreground` on `bg-surface` light')
      expect(warnings.join('\n')).toContain('`text-primary-foreground` on `bg-primary` light: 1.0:1')
      expect(warnings.join('\n')).toContain('`secondary` light: 50 = 100 = 200 = 300 = 400 (`#ffffff`) look the same')
      expect(warnings.join('\n')).toContain('The neutral scales reach white or black at their ends')
      expect(warnings.join('\n')).toContain('(`accent-200`: `#ffdba4` light, `#ffffad` dark)')
      expect(warnings.join('\n')).toContain('look different in dark mode')
    })
  })

  describe('when a color cannot be computed', () => {
    it('then its checks are skipped', () => {
      const preset = mergePresets(mazUi, {
        colors: {
          light: { secondary: 'var(--unknown)', surface: 'var(--unknown)' },
          dark: { secondary: 'var(--unknown)' },
        },
      })

      expect(themeWarnings(resolvePreset(preset)).join('\n')).not.toContain('`secondary`')
    })
  })

  describe('when the neutral scales do not collapse', () => {
    it('then there is no neutral warning', () => {
      const grey = 'oklch(0.5 0 0)'
      const neutral = {
        surface: grey,
        foreground: grey,
        contrast: grey,
        neutral: grey,
        divider: grey,
        muted: grey,
        overlay: grey,
        shadow: grey,
      }
      const preset = mergePresets(mazUi, {
        colors: { light: neutral, dark: neutral },
      })

      expect(themeWarnings(resolvePreset(preset)).join('\n')).not.toContain('neutral scales')
    })
  })
})

describe('given renderResolvedTheme', () => {
  describe('when no color is given', () => {
    it('then it renders the tokens and the scale matrix', () => {
      const output = renderResolvedTheme(mazUi, 'the `mazUi` preset', {
        steps: ['100', '500'],
      })

      expect(output).toContain('### Effective colors of the `mazUi` preset')
      expect(output).toContain('| `primary` | `#0175da` | `#0175da` | 4.6 / 3.5 | 4.6 / 4.6 |')
      expect(output).toContain('| `surface` | `#ffffff` | `#20212c` | - | - |')
      expect(output).toContain('| Color | Mode | 100 | 500 |')
      expect(output).toContain('get_theme_tokens({ colors: ["accent"] })')
    })
  })

  describe('when colors are given', () => {
    it('then it details each step with its contrasts', () => {
      const output = renderResolvedTheme(mazUi, 'x', {
        colors: ['primary', 'surface'],
      })

      expect(output).toContain('#### `primary`')
      expect(output).toContain('with `primary-foreground`')
      expect(output).toContain('#### `surface`')
      expect(output).toMatch(/\| `primary-950` \| `#00244e` \| `oklch\([^)]+\)` \| [\d.]+ \|/)
      expect(output).not.toContain('| Color | Mode |')
    })

    it('then the steps that cannot be computed are dashes', () => {
      const preset = mergePresets(mazUi, {
        colors: {
          dark: { primary: 'var(--unknown)' },
        },
      })
      const output = renderResolvedTheme(preset, 'x', {
        colors: ['primary'],
      })

      expect(output).toContain('| - | - | - | - | - |')
    })
  })

  describe('when the preset has nothing to check', () => {
    it('then it says so', () => {
      const unknown = Object.fromEntries(Object.keys(mazUi.colors.light).map(key => [key, 'var(--unknown)']))
      const preset = mergePresets(mazUi, {
        colors: { light: unknown, dark: unknown },
      })

      expect(renderResolvedTheme(preset, 'x')).toContain('**To check:** nothing')
    })
  })
})

describe('given renderEffectiveColors', () => {
  describe('when a bundled preset is given', () => {
    it('then it renders this preset', () => {
      expect(renderEffectiveColors([], { preset: 'pristine' })).toContain('### Effective colors of the `pristine` preset')
    })
  })

  describe('when the project has no preset', () => {
    it('then it renders mazUi with a note', () => {
      expect(renderEffectiveColors([])).toContain('No `definePreset` in the project')
    })
  })

  describe('when the project has presets', () => {
    it('then it renders each one, with a note for an unknown base', () => {
      const output = renderEffectiveColors([
        projectPreset({
          base: 'ocean',
          overrides: { name: 'brand' },
        }),
        projectPreset({ file: 'b.ts', base: 'brandBase', exportName: 'other' }),
      ])

      expect(output).toContain('### Effective colors of `brand` (`src/preset.ts`)')
      expect(output).toContain('### Effective colors of `other` (`b.ts`)')
      expect(output).toContain('The base `brandBase` is not a bundled preset')
    })
  })

  describe('when the project passes only some of its presets to the theme', () => {
    const presets = [
      projectPreset({ base: 'ocean', exportName: 'wired', overrides: { name: 'wired' } }),
      projectPreset({ file: 'b.ts', exportName: 'forgotten', overrides: { name: 'forgotten' } }),
    ]

    it('then only the used one is rendered, and the other is listed as left out', () => {
      const output = renderEffectiveColors(presets, { usage: { used: ['wired'], inlineFiles: [], dynamic: false, wired: true } })

      expect(output).toContain('### Effective colors of `wired`')
      expect(output).not.toContain('### Effective colors of `forgotten`')
      expect(output).toContain('Defined but not passed to the theme, so left out: `forgotten` (`b.ts`)')
      expect(output).not.toContain('chosen at runtime')
    })

    it('then a runtime choice lists every candidate and says so', () => {
      const output = renderEffectiveColors(presets, { usage: { used: ['wired', 'forgotten', 'macos'], inlineFiles: [], dynamic: true, wired: true } })

      expect(output).toContain('### Effective colors of `wired`')
      expect(output).toContain('### Effective colors of `forgotten`')
      expect(output).toContain('### Effective colors of the `macos` preset')
      expect(output).toContain('The preset is chosen at runtime')
    })

    it('then a bundled preset used by the app replaces the presets that are only defined', () => {
      const output = renderEffectiveColors(presets, { usage: { used: ['nova'], inlineFiles: [], dynamic: false, wired: true } })

      expect(output).toContain('### Effective colors of the `nova` preset')
      expect(output).toContain('Defined but not passed to the theme, so left out: `wired` (`src/preset.ts`), `forgotten` (`b.ts`)')
    })

    it('then every preset is rendered with a note when the passed one is unknown', () => {
      const output = renderEffectiveColors(presets, { usage: { used: ['mystery'], inlineFiles: [], dynamic: false, wired: true } })

      expect(output).toContain('### Effective colors of `wired`')
      expect(output).toContain('The preset passed to the theme (`mystery`) is not a `definePreset` of the project')
    })

    it('then every preset is rendered when nothing is wired', () => {
      const output = renderEffectiveColors(presets, { usage: { used: [], inlineFiles: [], dynamic: false, wired: false } })

      expect(output).toContain('### Effective colors of `forgotten`')
      expect(output).not.toContain('left out')
    })
  })

  describe('when the project has no preset but uses a bundled one', () => {
    it('then it renders the bundled preset', () => {
      const output = renderEffectiveColors([], { usage: { used: ['folio'], inlineFiles: [], dynamic: false, wired: true } })

      expect(output).toContain('### Effective colors of the `folio` preset')
      expect(output).not.toContain('No `definePreset` in the project')
    })
  })

  describe('when some overrides cannot be resolved', () => {
    it('then they are listed with the fallback to the base values', () => {
      const output = renderEffectiveColors([
        projectPreset({
          exportName: 'brand',
          overrides: {
            colors: {
              light: { primary: '<expr: NUIT>', a: '<expr: x>', b: '<expr: x>', c: '<expr: x>', d: '<expr: x>', e: '<expr: x>', f: '<expr: x>' },
            },
            list: ['<expr: item>', 1],
            empty: null,
            flag: true,
          },
        }),
      ])

      expect(output).toContain('**Not resolved**: `colors.light.primary` = NUIT')
      expect(output).toContain('and 2 more')
      expect(output).toContain('the base preset values are used for them')
    })
  })
})
