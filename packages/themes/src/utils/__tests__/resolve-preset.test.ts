import type { ThemePreset } from '../../types'
import { mazUi } from '../../presets/mazUi'
import { colorToHex, formatAsOklch } from '../color-conversions'
import { getPerceptualColorScale, getRelativeColorScale } from '../css-generator'
import { mergePresets } from '../preset-merger'
import {
  COLOR_SCALE_STEPS,
  evaluateChannel,
  evaluateColor,
  getColorDistance,
  getContrastRatio,
  resolvePreset,
  SCALED_COLORS,
} from '../resolve-preset'

const channels = { l: 0.5, c: 0.2, h: 120 }

describe('given evaluateChannel', () => {
  describe('when the expression uses the channels and the math functions', () => {
    it('then computes calc, min, max, clamp and the operators', () => {
      expect(evaluateChannel('l', channels)).toBe(0.5)
      expect(evaluateChannel('calc(l + 0.1)', channels)).toBeCloseTo(0.6)
      expect(evaluateChannel('calc(l - .1)', channels)).toBeCloseTo(0.4)
      expect(evaluateChannel('calc(c * 2 / 4)', channels)).toBeCloseTo(0.1)
      expect(evaluateChannel('min(c * 2, 0.3)', channels)).toBeCloseTo(0.3)
      expect(evaluateChannel('max(l, 0.9)', channels)).toBeCloseTo(0.9)
      expect(evaluateChannel('clamp(0, calc(l + 0.8), 1)', channels)).toBe(1)
      expect(evaluateChannel('-(l - 1)', channels)).toBeCloseTo(0.5)
      expect(evaluateChannel('h', channels)).toBe(120)
    })
  })

  describe('when the expression is not supported', () => {
    it('then throws', () => {
      expect(() => evaluateChannel('calc(l + 0.1', channels)).toThrow('Invalid channel')
      expect(() => evaluateChannel('pow(l, 2)', channels)).toThrow('Invalid channel')
      expect(() => evaluateChannel('constructor', channels)).toThrow('Invalid channel')
      expect(() => evaluateChannel('l l', channels)).toThrow('Invalid channel')
      expect(() => evaluateChannel('l + 10%', channels)).toThrow('Invalid channel')
      expect(() => evaluateChannel('', channels)).toThrow('Invalid channel')
      expect(() => evaluateChannel('min(l)(', channels)).toThrow('Invalid channel')
    })
  })
})

describe('given evaluateColor', () => {
  const variables: Record<string, string> = { '--brand': '#ff0000' }
  const resolveVariable = (name: string) => variables[name]
    ? evaluateColor(variables[name])
    : undefined

  describe('when the value is a plain color', () => {
    it('then returns its oklch channels', () => {
      expect(evaluateColor('oklch(0.5 0.1 200)')).toEqual({ l: 0.5, c: 0.1, h: 200 })
      expect(colorToHex(`oklch(${Object.values(evaluateColor('210 100% 50%')!).join(' ')})`)).toBe('#0080ff')
    })
  })

  describe('when the value is a variable', () => {
    it('then resolves it, or its fallback', () => {
      expect(evaluateColor('var(--brand)', { resolve: resolveVariable })?.l).toBeCloseTo(0.628, 3)
      expect(evaluateColor('var(--missing, oklch(0.3 0 0))', { resolve: resolveVariable })).toEqual({ l: 0.3, c: 0, h: 0 })
      expect(evaluateColor('var(--missing, var(--brand))', { resolve: resolveVariable })?.l).toBeCloseTo(0.628, 3)
      expect(evaluateColor('var(--missing)', { resolve: resolveVariable })).toBeUndefined()
      expect(evaluateColor('var(--brand)')).toBeUndefined()
    })
  })

  describe('when the value is light-dark()', () => {
    it('then picks the side of the mode', () => {
      expect(evaluateColor('light-dark(oklch(1 0 0), oklch(0 0 0))')).toEqual({ l: 1, c: 0, h: 0 })
      expect(evaluateColor('light-dark(oklch(1 0 0), oklch(0 0 0))', { mode: 'dark' })).toEqual({ l: 0, c: 0, h: 0 })
      expect(evaluateColor('light-dark(oklch(1 0 0))', { mode: 'dark' })).toBeUndefined()
    })
  })

  describe('when the value uses the relative color syntax', () => {
    it('then applies the channels to the origin color', () => {
      const color = evaluateColor('oklch(from oklch(0.5 0.2 350) calc(l + 0.1) calc(c / 2) calc(h + 20))')

      expect(color?.l).toBeCloseTo(0.6)
      expect(color?.c).toBeCloseTo(0.1)
      expect(color?.h).toBeCloseTo(10)
      expect(evaluateColor('oklch(from  oklch(0.5 0.2 350)  l  c  h )')).toEqual({ l: 0.5, c: 0.2, h: 350 })
    })

    it('then returns undefined when the origin or the channels are invalid', () => {
      expect(evaluateColor('oklch(from var(--missing) l c h)')).toBeUndefined()
      expect(evaluateColor('oklch(from oklch(0.5 0.2 350) l c)')).toBeUndefined()
      expect(evaluateColor('oklch(from oklch(0.5 0.2 350) l c pow(h))')).toBeUndefined()
    })
  })

  describe('when the value is not a single supported color', () => {
    it('then returns undefined', () => {
      expect(evaluateColor('var(--brand), var(--brand)', { resolve: resolveVariable })).toBeUndefined()
      expect(evaluateColor('color-mix(in oklch, red, blue)')).toBeUndefined()
      expect(evaluateColor('not-a-color')).toBeUndefined()
    })
  })
})

describe('given resolvePreset', () => {
  describe('when resolving the maz-ui preset', () => {
    const resolved = resolvePreset(mazUi)

    it('then returns every color token, container and input in both modes', () => {
      expect(resolved.name).toBe('maz-ui')
      expect(resolved.colorScale).toBe('relative')
      expect(Object.keys(resolved.light.colors)).toHaveLength(Object.keys(mazUi.colors.light).length + 2)
      expect(resolved.light.colors.primary).toEqual({
        hex: colorToHex(mazUi.colors.light.primary),
        oklch: 'oklch(0.5645 0.1773 253.63)',
      })
      expect(resolved.light.colors.surface?.hex).toBe('#ffffff')
      expect(resolved.light.colors.input?.hex).toBe('#ffffff')
      expect(resolved.dark.colors.container?.hex).toBe(resolved.dark.colors.surface?.hex)
      expect(resolved.dark.colors.input?.oklch).toBe('oklch(0.3124 0.0212 280.69)')
    })

    it('then returns the 50..950 steps of every scaled color', () => {
      for (const mode of [resolved.light, resolved.dark]) {
        expect(Object.keys(mode.scales)).toEqual([...SCALED_COLORS])
        for (const scale of Object.values(mode.scales))
          expect(Object.keys(scale)).toEqual([...COLOR_SCALE_STEPS])
      }
      expect(resolved.light.scales.primary?.['500']).toEqual(resolved.light.colors.primary)
      expect(resolved.light.scales.primary?.['300'].oklch).toBe('oklch(0.6945 0.1773 253.63)')
      expect(resolved.light.scales.surface?.['50'].hex).toBe('#ffffff')
    })
  })

  describe('when the preset uses the perceptual scale', () => {
    const preset = mergePresets(mazUi, {
      scales: { color: 'perceptual' },
    })
    const resolved = resolvePreset(preset)

    it('then derives the brand steps with the perceptual formula and the others with the relative one', () => {
      expect(resolved.colorScale).toBe('perceptual')
      expect(resolved.light.scales.primary?.['300'].oklch).toBe(formatted(getPerceptualColorScale('oklch(0.5645 0.1773 253.63)')['300']))
      expect(resolved.light.scales.surface?.['950'].oklch).toBe(formatted(getRelativeColorScale('oklch(1 0 0)')['950']))
    })
  })

  describe('when the preset has variables, missing values and cycles', () => {
    const preset: ThemePreset = {
      ...mazUi,
      colors: {
        light: {
          ...mazUi.colors.light,
          accent: 'var(--maz-color-primary-700)',
          info: 'var(--maz-info)',
          muted: '',
        },
        dark: { ...mazUi.colors.dark, 'accent': undefined as unknown as string, 'contrast-foreground': 'var(--unknown)' },
      },
      components: {
        container: {
          bg: { dark: 'oklch(0.2 0 0)' },
        },
        input: {},
      },
    }
    const resolved = resolvePreset(preset)

    it('then resolves the variables of the theme and falls back to the light value', () => {
      expect(resolved.light.colors.accent).toEqual(resolved.light.scales.primary?.['700'])
      expect(resolved.dark.colors.accent).toEqual(resolved.dark.scales.primary?.['700'])
      expect(resolved.light.colors.container?.oklch).toBe('oklch(0.2 0 0)')
      expect(resolved.light.colors.input).toEqual(resolved.light.colors.surface)
    })

    it('then leaves out the values it cannot compute', () => {
      expect(resolved.light.colors.info).toBeUndefined()
      expect(resolved.light.scales.info).toBeUndefined()
      expect(resolved.light.colors.muted).toBeUndefined()
      expect(resolved.dark.colors['contrast-foreground']).toBeUndefined()
      expect(resolved.dark.colors.contrast).toBeDefined()
    })
  })
})

describe('given getContrastRatio', () => {
  describe('when comparing two colors', () => {
    it('then returns the WCAG ratio whatever the order', () => {
      expect(getContrastRatio('#ffffff', '#000000')).toBeCloseTo(21)
      expect(getContrastRatio('#777777', '#ffffff')).toBeCloseTo(4.48, 2)
      expect(getContrastRatio('#ffffff', '#777777')).toBeCloseTo(4.48, 2)
      expect(getContrastRatio('#010101', '#010101')).toBe(1)
    })
  })
})

describe('given getColorDistance', () => {
  describe('when comparing two colors', () => {
    it('then returns their OKLab distance', () => {
      expect(getColorDistance('#ffffff', '#ffffff')).toBe(0)
      expect(getColorDistance('oklch(0.5 0.1 0)', 'oklch(0.5 0.1 180)')).toBeCloseTo(0.2)
    })
  })
})

function formatted(css: string): string {
  return formatAsOklch(evaluateColor(css)!)
}
