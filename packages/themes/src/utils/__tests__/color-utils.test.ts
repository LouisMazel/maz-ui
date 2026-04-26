import type { ColorScale } from '../../types'
import { parseColorAsOklch } from '../color-parser'
import { adjustColorLightness, generateColorScale, getContrastColor, parseHSL } from '../color-utils'

describe('color-utils', () => {
  describe('given parseHSL function (deprecated alias for parseColor)', () => {
    describe('when a legacy raw HSL string is provided', () => {
      it('then it delegates to parseColor and returns channels', () => {
        expect(parseHSL('210 50% 40%')).toEqual({ h: 210, s: 50, l: 40 })
      })
    })

    describe('when a complete hsl() string is provided', () => {
      it('then it still extracts channels (permissive v5 behavior)', () => {
        expect(parseHSL('hsl(210 50% 40%)')).toEqual({ h: 210, s: 50, l: 40 })
      })
    })
  })

  describe('given generateColorScale function', () => {
    describe('when a base color is provided', () => {
      it('then it returns a scale with 11 variants', () => {
        const result = generateColorScale('210 50% 50%')

        const keys = Object.keys(result).map(Number)
        expect(keys).toEqual([50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950])
      })

      it('then each variant is a complete oklch() string', () => {
        const result = generateColorScale('210 50% 50%')
        const variants: (keyof ColorScale)[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

        for (const variant of variants) {
          expect(result[variant]).toMatch(/^oklch\(.+\)$/)
        }
      })

      it('then the 500 variant matches the base in OKLch space', () => {
        const result = generateColorScale('hsl(210 50% 50%)')

        const expected = parseColorAsOklch('hsl(210 50% 50%)')
        const actual = parseColorAsOklch(result[500])
        expect(actual.l).toBeCloseTo(expected.l, 3)
        expect(actual.c).toBeCloseTo(expected.c, 3)
        expect(actual.h).toBeCloseTo(expected.h, 1)
      })

      it('then lower variants are lighter than the base', () => {
        const result = generateColorScale('210 50% 50%')

        const baseL = parseColorAsOklch(result[500]).l
        expect(parseColorAsOklch(result[50]).l).toBeGreaterThan(baseL)
        expect(parseColorAsOklch(result[200]).l).toBeGreaterThan(baseL)
      })

      it('then higher variants are darker than the base', () => {
        const result = generateColorScale('210 50% 50%')

        const baseL = parseColorAsOklch(result[500]).l
        expect(parseColorAsOklch(result[700]).l).toBeLessThan(baseL)
        expect(parseColorAsOklch(result[900]).l).toBeLessThan(baseL)
      })

      it('then the scale is ordered from lightest to darkest', () => {
        const result = generateColorScale('210 50% 50%')
        const variants: (keyof ColorScale)[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

        for (let i = 0; i < variants.length - 1; i++) {
          const currentL = parseColorAsOklch(result[variants[i]]).l
          const nextL = parseColorAsOklch(result[variants[i + 1]]).l
          expect(currentL).toBeGreaterThanOrEqual(nextL)
        }
      })
    })

    describe('when the base color has 100% HSL lightness (white)', () => {
      it('then lower variants stay clamped near maximum', () => {
        const result = generateColorScale('210 50% 100%')

        expect(parseColorAsOklch(result[50]).l).toBeCloseTo(1, 2)
        expect(parseColorAsOklch(result[100]).l).toBeCloseTo(1, 2)
        expect(parseColorAsOklch(result[200]).l).toBeCloseTo(1, 2)
      })
    })

    describe('when the base color has 0% HSL lightness (black)', () => {
      it('then higher variants stay clamped near zero', () => {
        const result = generateColorScale('210 50% 0%')

        expect(parseColorAsOklch(result[600]).l).toBe(0)
        expect(parseColorAsOklch(result[700]).l).toBe(0)
        expect(parseColorAsOklch(result[950]).l).toBe(0)
      })
    })

    describe('when the base color has 0% HSL saturation (grayscale)', () => {
      it('then chroma stays near zero across the scale', () => {
        const result = generateColorScale('0 0% 50%')

        for (const variant of [50, 200, 500, 800, 950] as (keyof ColorScale)[]) {
          expect(parseColorAsOklch(result[variant]).c).toBeLessThan(0.01)
        }
      })
    })

    describe('when the base color is given as a complete hsl() value', () => {
      it('then it generates the scale correctly', () => {
        const result = generateColorScale('hsl(210 50% 50%)')

        expect(result[500]).toMatch(/^oklch\(.+\)$/)
      })
    })

    describe('when the base color is given as a hex value', () => {
      it('then it converts to OKLch and generates the scale', () => {
        const result = generateColorScale('#ff0000')

        const parsed = parseColorAsOklch(result[500])
        expect(parsed.l).toBeCloseTo(0.628, 2)
        expect(parsed.c).toBeGreaterThan(0.2)
      })
    })

    describe('when the base color is given as oklch()', () => {
      it('then chroma is preserved (no roundtrip through sRGB)', () => {
        const result = generateColorScale('oklch(0.65 0.18 250)')

        const parsed = parseColorAsOklch(result[500])
        expect(parsed.l).toBeCloseTo(0.65, 3)
        expect(parsed.c).toBeCloseTo(0.18, 3)
        expect(parsed.h).toBeCloseTo(250, 1)
      })
    })
  })

  describe('given getContrastColor function', () => {
    describe('when the base color is light', () => {
      it('then it returns black in oklch() format', () => {
        expect(getContrastColor('hsl(0 0% 90%)')).toBe('oklch(0 0 0)')
      })
    })

    describe('when the base color is dark', () => {
      it('then it returns white in oklch() format', () => {
        expect(getContrastColor('hsl(0 0% 10%)')).toBe('oklch(1 0 0)')
      })
    })

    describe('when the base color is white', () => {
      it('then it returns black', () => {
        expect(getContrastColor('hsl(0 0% 100%)')).toBe('oklch(0 0 0)')
      })
    })

    describe('when the base color is black', () => {
      it('then it returns white', () => {
        expect(getContrastColor('hsl(0 0% 0%)')).toBe('oklch(1 0 0)')
      })
    })

    describe('when the base color is a hex value', () => {
      it('then it parses and returns the correct contrast', () => {
        expect(getContrastColor('#ffffff')).toBe('oklch(0 0 0)')
        expect(getContrastColor('#000000')).toBe('oklch(1 0 0)')
      })
    })
  })

  describe('given adjustColorLightness function', () => {
    describe('when a positive adjustment is applied', () => {
      it('then the lightness increases and output is oklch()', () => {
        const result = adjustColorLightness('hsl(210 50% 40%)', 0.2)
        const parsed = parseColorAsOklch(result)
        const original = parseColorAsOklch('hsl(210 50% 40%)')

        expect(result).toMatch(/^oklch\(.+\)$/)
        expect(parsed.l).toBeCloseTo(original.l + 0.2, 3)
      })
    })

    describe('when a negative adjustment is applied', () => {
      it('then the lightness decreases', () => {
        const result = adjustColorLightness('hsl(210 50% 40%)', -0.2)
        const parsed = parseColorAsOklch(result)
        const original = parseColorAsOklch('hsl(210 50% 40%)')

        expect(parsed.l).toBeCloseTo(original.l - 0.2, 3)
      })
    })

    describe('when the adjustment exceeds 1', () => {
      it('then the lightness is clamped at 1', () => {
        const result = adjustColorLightness('hsl(210 50% 90%)', 0.5)
        expect(parseColorAsOklch(result).l).toBe(1)
      })
    })

    describe('when the adjustment goes below 0', () => {
      it('then the lightness is clamped at 0', () => {
        const result = adjustColorLightness('hsl(210 50% 10%)', -0.5)
        expect(parseColorAsOklch(result).l).toBe(0)
      })
    })

    describe('when a zero adjustment is applied', () => {
      it('then lightness is preserved', () => {
        const result = adjustColorLightness('hsl(210 50% 40%)', 0)
        const parsed = parseColorAsOklch(result)
        const original = parseColorAsOklch('hsl(210 50% 40%)')

        expect(parsed.l).toBeCloseTo(original.l, 3)
      })
    })

    describe('when chroma and hue are preserved', () => {
      it('then only lightness changes', () => {
        const result = adjustColorLightness('hsl(120 80% 50%)', 0.1)
        const parsed = parseColorAsOklch(result)
        const original = parseColorAsOklch('hsl(120 80% 50%)')

        expect(parsed.c).toBeCloseTo(original.c, 3)
        expect(parsed.h).toBeCloseTo(original.h, 1)
        expect(parsed.l).toBeCloseTo(original.l + 0.1, 3)
      })
    })
  })
})
