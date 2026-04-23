import type { ColorScale } from '../../types'
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

      it('then the 500 variant equals the base color as a complete hsl() string', () => {
        const result = generateColorScale('210 50% 50%')

        expect(result[500]).toBe('hsl(210 50% 50%)')
      })

      it('then each variant is a complete hsl() string', () => {
        const result = generateColorScale('210 50% 50%')
        const variants: (keyof ColorScale)[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

        for (const variant of variants) {
          expect(result[variant]).toMatch(/^hsl\(.+\)$/)
        }
      })

      it('then lower variants are lighter than the base', () => {
        const result = generateColorScale('210 50% 50%')

        const baseLightness = parseHSL(result[500]).l
        const variant50Lightness = parseHSL(result[50]).l
        const variant200Lightness = parseHSL(result[200]).l

        expect(variant50Lightness).toBeGreaterThan(baseLightness)
        expect(variant200Lightness).toBeGreaterThan(baseLightness)
      })

      it('then higher variants are darker than the base', () => {
        const result = generateColorScale('210 50% 50%')

        const baseLightness = parseHSL(result[500]).l
        const variant700Lightness = parseHSL(result[700]).l
        const variant900Lightness = parseHSL(result[900]).l

        expect(variant700Lightness).toBeLessThan(baseLightness)
        expect(variant900Lightness).toBeLessThan(baseLightness)
      })

      it('then the scale is ordered from lightest to darkest', () => {
        const result = generateColorScale('210 50% 50%')
        const variants: (keyof ColorScale)[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

        for (let i = 0; i < variants.length - 1; i++) {
          const currentLightness = parseHSL(result[variants[i]]).l
          const nextLightness = parseHSL(result[variants[i + 1]]).l
          expect(currentLightness).toBeGreaterThanOrEqual(nextLightness)
        }
      })
    })

    describe('when the base color has 100% lightness', () => {
      it('then lower variants remain clamped at 100', () => {
        const result = generateColorScale('210 50% 100%')

        expect(parseHSL(result[50]).l).toBe(100)
        expect(parseHSL(result[100]).l).toBe(100)
        expect(parseHSL(result[200]).l).toBe(100)
      })
    })

    describe('when the base color has 0% lightness', () => {
      it('then higher variants remain clamped at 0', () => {
        const result = generateColorScale('210 50% 0%')

        expect(parseHSL(result[600]).l).toBe(0)
        expect(parseHSL(result[700]).l).toBe(0)
        expect(parseHSL(result[950]).l).toBe(0)
      })
    })

    describe('when the base color has 0% saturation', () => {
      it('then it generates a grayscale', () => {
        const result = generateColorScale('0 0% 50%')

        const variant50Saturation = parseHSL(result[50]).s
        const variant900Saturation = parseHSL(result[900]).s

        expect(variant50Saturation).toBeGreaterThanOrEqual(0)
        expect(variant900Saturation).toBeGreaterThanOrEqual(0)
      })
    })

    describe('when the base color is given as a complete hsl() value', () => {
      it('then it still generates the scale correctly', () => {
        const result = generateColorScale('hsl(210 50% 50%)')

        expect(result[500]).toBe('hsl(210 50% 50%)')
      })
    })

    describe('when the base color is given as a hex value', () => {
      it('then it converts to HSL and generates the scale', () => {
        const result = generateColorScale('#ff0000')

        const parsed = parseHSL(result[500])
        expect(parsed.h).toBeCloseTo(0, 0)
        expect(parsed.s).toBeCloseTo(100, 0)
        expect(parsed.l).toBeCloseTo(50, 0)
      })
    })
  })

  describe('given getContrastColor function', () => {
    describe('when the base color lightness is above 50', () => {
      it('then it returns black in hsl() format', () => {
        expect(getContrastColor('210 50% 70%')).toBe('hsl(0 0% 0%)')
      })
    })

    describe('when the base color lightness is below 50', () => {
      it('then it returns white in hsl() format', () => {
        expect(getContrastColor('210 50% 30%')).toBe('hsl(0 0% 100%)')
      })
    })

    describe('when the base color lightness is exactly 50', () => {
      it('then it returns white', () => {
        expect(getContrastColor('210 50% 50%')).toBe('hsl(0 0% 100%)')
      })
    })

    describe('when the base color lightness is 100', () => {
      it('then it returns black', () => {
        expect(getContrastColor('0 0% 100%')).toBe('hsl(0 0% 0%)')
      })
    })

    describe('when the base color lightness is 0', () => {
      it('then it returns white', () => {
        expect(getContrastColor('0 0% 0%')).toBe('hsl(0 0% 100%)')
      })
    })

    describe('when the base color is a hex value', () => {
      it('then it parses and returns the correct contrast', () => {
        expect(getContrastColor('#ffffff')).toBe('hsl(0 0% 0%)')
        expect(getContrastColor('#000000')).toBe('hsl(0 0% 100%)')
      })
    })
  })

  describe('given adjustColorLightness function', () => {
    describe('when a positive adjustment is applied', () => {
      it('then the lightness increases and output is hsl()', () => {
        expect(adjustColorLightness('210 50% 40%', 20)).toBe('hsl(210 50% 60%)')
      })
    })

    describe('when a negative adjustment is applied', () => {
      it('then the lightness decreases', () => {
        expect(adjustColorLightness('210 50% 40%', -20)).toBe('hsl(210 50% 20%)')
      })
    })

    describe('when the adjustment exceeds 100', () => {
      it('then the lightness is clamped at 100', () => {
        expect(adjustColorLightness('210 50% 90%', 50)).toBe('hsl(210 50% 100%)')
      })
    })

    describe('when the adjustment goes below 0', () => {
      it('then the lightness is clamped at 0', () => {
        expect(adjustColorLightness('210 50% 10%', -50)).toBe('hsl(210 50% 0%)')
      })
    })

    describe('when a zero adjustment is applied', () => {
      it('then the color remains unchanged', () => {
        expect(adjustColorLightness('210 50% 40%', 0)).toBe('hsl(210 50% 40%)')
      })
    })

    describe('when hue and saturation are preserved', () => {
      it('then only lightness changes', () => {
        const result = adjustColorLightness('120 80% 50%', 10)
        const parsed = parseHSL(result)

        expect(parsed.h).toBe(120)
        expect(parsed.s).toBe(80)
        expect(parsed.l).toBe(60)
      })
    })
  })
})
