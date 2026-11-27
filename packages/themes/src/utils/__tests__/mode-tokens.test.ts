import type { ThemePreset } from '../../types.ts'
import { linux } from '../../presets/linux.ts'
import { macos } from '../../presets/macos.ts'
import { mazUi } from '../../presets/mazUi.ts'
import { windows } from '../../presets/windows.ts'
import { generateCSS } from '../css-generator.ts'
import { mergePresets } from '../preset-merger.ts'

const BASE_OPTIONS = {
  prefix: 'maz',
  darkSelectorStrategy: 'class',
  darkClass: 'dark',
  lightClass: 'light',
} as const

function withShadow(shadow: ThemePreset['scales']['shadow']): ThemePreset {
  return { ...mazUi, scales: { ...mazUi.scales, shadow } }
}

const perModeShadow = withShadow({
  ...mazUi.scales.shadow,
  elevation: { light: '0 1px 2px rgb(0 0 0 / 0.1)', dark: '0 4px 8px rgb(0 0 0 / 0.6)' },
})

describe('given a preset with a shadow per color mode', () => {
  describe('when generating CSS with mode both and the class strategy', () => {
    const css = generateCSS(perModeShadow, { ...BASE_OPTIONS, mode: 'both' })

    it('then the light shadow is emitted on :root', () => {
      expect(css).toContain('--maz-shadow-style-elevation: 0 1px 2px rgb(0 0 0 / 0.1);')
    })

    it('then the dark shadow is emitted under the dark class', () => {
      expect(css).toContain('.dark { --maz-shadow-style-elevation: 0 4px 8px rgb(0 0 0 / 0.6); }')
    })

    it('then a shadow without modes is emitted once', () => {
      expect(css.match(/--maz-shadow-style-sm:/g)).toHaveLength(1)
    })
  })

  describe('when generating CSS with the media strategy', () => {
    const css = generateCSS(perModeShadow, { ...BASE_OPTIONS, mode: 'both', darkSelectorStrategy: 'media' })

    it('then the dark shadow is emitted in a prefers-color-scheme query', () => {
      expect(css).toContain('@media (prefers-color-scheme: dark) { :root { --maz-shadow-style-elevation: 0 4px 8px rgb(0 0 0 / 0.6); } }')
    })
  })

  describe('when generating CSS with mode dark', () => {
    const css = generateCSS(perModeShadow, { ...BASE_OPTIONS, mode: 'dark' })

    it('then the dark shadow is emitted on :root only', () => {
      expect(css).toContain('--maz-shadow-style-elevation: 0 4px 8px rgb(0 0 0 / 0.6);')
      expect(css).not.toContain('.dark {')
      expect(css).not.toContain('0 1px 2px rgb(0 0 0 / 0.1);')
    })
  })

  describe('when generating CSS with mode light', () => {
    const css = generateCSS(perModeShadow, { ...BASE_OPTIONS, mode: 'light' })

    it('then the light shadow is emitted and no dark shadow', () => {
      expect(css).toContain('--maz-shadow-style-elevation: 0 1px 2px rgb(0 0 0 / 0.1);')
      expect(css).not.toContain('rgb(0 0 0 / 0.6)')
    })
  })
})

describe('given a preset with plain shadows', () => {
  describe('when generating CSS with mode both', () => {
    it('then no dark shadow block is emitted', () => {
      const css = generateCSS(mazUi, { ...BASE_OPTIONS, mode: 'both' })

      expect(css).not.toContain('.dark { --maz-shadow-style')
    })
  })
})

describe('given a preset with a focus ring', () => {
  const preset: ThemePreset = {
    ...mazUi,
    components: {
      focusRing: { color: { light: '#000000', dark: '#ffffff' }, width: '3px', offset: '1px' },
    },
  }

  describe('when generating CSS with mode both', () => {
    const css = generateCSS(preset, { ...BASE_OPTIONS, mode: 'both' })

    it('then the color follows the color mode', () => {
      expect(css).toContain('--maz-focus-ring-color: light-dark(#000000, #ffffff);')
    })

    it('then the width and the offset are emitted', () => {
      expect(css).toContain('--maz-focus-ring-width: 3px;')
      expect(css).toContain('--maz-focus-ring-offset: 1px;')
    })
  })

  describe('when the preset has no focus ring', () => {
    it('then no focus ring variable is emitted', () => {
      const css = generateCSS(mazUi, { ...BASE_OPTIONS, mode: 'both' })

      expect(css).not.toContain('--maz-focus-ring')
    })
  })

  describe('when overrides change only the width', () => {
    const merged = mergePresets(preset, { components: { focusRing: { width: '4px' } } })

    it('then the other keys of the base are kept', () => {
      expect(merged.components?.focusRing).toMatchObject({
        color: { light: '#000000', dark: '#ffffff' },
        width: '4px',
        offset: '1px',
      })
    })
  })
})

describe('given the native presets', () => {
  describe.each([
    ['macos', macos],
    ['windows', windows],
    ['linux', linux],
  ])('when generating the CSS of %s', (_name, preset) => {
    const css = generateCSS(preset, { ...BASE_OPTIONS, mode: 'both' })

    it('then the neutral button color follows the color mode', () => {
      expect(css).toMatch(/--maz-neutral: light-dark\(#[0-9a-f]{6}, #[0-9a-f]{6}\);/)
    })

    it('then the neutral color differs between light and dark', () => {
      expect(preset.colors.light.neutral).not.toBe(preset.colors.dark.neutral)
    })

    it('then the elevation shadow has a dark value', () => {
      expect(css).toContain('.dark { --maz-shadow-style-elevation:')
    })
  })

  describe('when generating the CSS of a preset without a neutral color', () => {
    it('then no neutral variable is emitted', () => {
      const css = generateCSS(mazUi, { ...BASE_OPTIONS, mode: 'both' })

      expect(css).not.toContain('--maz-neutral')
    })
  })

  describe('when generating the CSS of windows', () => {
    it('then the focus ring is black in light and white in dark', () => {
      const css = generateCSS(windows, { ...BASE_OPTIONS, mode: 'both' })

      expect(css).toContain('--maz-focus-ring-color: light-dark(#000000, #ffffff);')
    })
  })
})
