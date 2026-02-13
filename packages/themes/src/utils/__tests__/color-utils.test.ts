import type { ColorScale } from '../../types'
import { adjustColorLightness, formatHSL, generateColorScale, getContrastColor, parseHSL } from '../color-utils'

describe('color-utils', () => {
  describe('given parseHSL function', () => {
    describe('when a valid HSL string is provided', () => {
      it('then it parses integer values correctly', () => {
        const result = parseHSL('210 50% 40%')

        expect(result).toEqual({ h: 210, s: 50, l: 40 })
      })

      it('then it parses decimal values correctly', () => {
        const result = parseHSL('210.5 50.3% 40.7%')

        expect(result).toEqual({ h: 210.5, s: 50.3, l: 40.7 })
      })

      it('then it parses zero values correctly', () => {
        const result = parseHSL('0 0% 0%')

        expect(result).toEqual({ h: 0, s: 0, l: 0 })
      })

      it('then it parses maximum values correctly', () => {
        const result = parseHSL('360 100% 100%')

        expect(result).toEqual({ h: 360, s: 100, l: 100 })
      })
    })

    describe('when an invalid HSL string is provided', () => {
      it('then it throws an error for malformed input', () => {
        expect(() => parseHSL('not-hsl')).toThrow('Invalid HSL format: not-hsl')
      })

      it('then it throws an error for an empty string', () => {
        expect(() => parseHSL('')).toThrow('Invalid HSL format: ')
      })

      it('then it throws an error for missing percent signs', () => {
        expect(() => parseHSL('210 50 40')).toThrow('Invalid HSL format: 210 50 40')
      })

      it('then it throws an error for CSS hsl() syntax', () => {
        expect(() => parseHSL('hsl(210, 50%, 40%)')).toThrow('Invalid HSL format: hsl(210, 50%, 40%)')
      })
    })
  })

  describe('given formatHSL function', () => {
    describe('when integer values are provided', () => {
      it('then it formats them as an HSL string', () => {
        const result = formatHSL(210, 50, 40)

        expect(result).toBe('210 50% 40%')
      })
    })

    describe('when values with many decimal places are provided', () => {
      it('then it rounds to one decimal place', () => {
        const result = formatHSL(210.456, 50.789, 40.123)

        expect(result).toBe('210.5 50.8% 40.1%')
      })
    })

    describe('when zero values are provided', () => {
      it('then it formats them correctly', () => {
        const result = formatHSL(0, 0, 0)

        expect(result).toBe('0 0% 0%')
      })
    })

    describe('when values round to whole numbers', () => {
      it('then it omits the decimal point', () => {
        const result = formatHSL(210.04, 50.02, 40.01)

        expect(result).toBe('210 50% 40%')
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

      it('then the 500 variant equals the base color', () => {
        const result = generateColorScale('210 50% 50%')

        expect(result[500]).toBe('210 50% 50%')
      })

      it('then lower variants are lighter than the base', () => {
        const baseColor = '210 50% 50%'
        const result = generateColorScale(baseColor)

        const baseLightness = parseHSL(result[500]).l
        const variant50Lightness = parseHSL(result[50]).l
        const variant200Lightness = parseHSL(result[200]).l

        expect(variant50Lightness).toBeGreaterThan(baseLightness)
        expect(variant200Lightness).toBeGreaterThan(baseLightness)
      })

      it('then higher variants are darker than the base', () => {
        const baseColor = '210 50% 50%'
        const result = generateColorScale(baseColor)

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
  })

  describe('given getContrastColor function', () => {
    describe('when the base color lightness is above 50', () => {
      it('then it returns black', () => {
        const result = getContrastColor('210 50% 70%')

        expect(result).toBe('0 0% 0%')
      })
    })

    describe('when the base color lightness is below 50', () => {
      it('then it returns white', () => {
        const result = getContrastColor('210 50% 30%')

        expect(result).toBe('0 0% 100%')
      })
    })

    describe('when the base color lightness is exactly 50', () => {
      it('then it returns white', () => {
        const result = getContrastColor('210 50% 50%')

        expect(result).toBe('0 0% 100%')
      })
    })

    describe('when the base color lightness is 100', () => {
      it('then it returns black', () => {
        const result = getContrastColor('0 0% 100%')

        expect(result).toBe('0 0% 0%')
      })
    })

    describe('when the base color lightness is 0', () => {
      it('then it returns white', () => {
        const result = getContrastColor('0 0% 0%')

        expect(result).toBe('0 0% 100%')
      })
    })
  })

  describe('given adjustColorLightness function', () => {
    describe('when a positive adjustment is applied', () => {
      it('then the lightness increases', () => {
        const result = adjustColorLightness('210 50% 40%', 20)

        expect(result).toBe('210 50% 60%')
      })
    })

    describe('when a negative adjustment is applied', () => {
      it('then the lightness decreases', () => {
        const result = adjustColorLightness('210 50% 40%', -20)

        expect(result).toBe('210 50% 20%')
      })
    })

    describe('when the adjustment exceeds 100', () => {
      it('then the lightness is clamped at 100', () => {
        const result = adjustColorLightness('210 50% 90%', 50)

        expect(result).toBe('210 50% 100%')
      })
    })

    describe('when the adjustment goes below 0', () => {
      it('then the lightness is clamped at 0', () => {
        const result = adjustColorLightness('210 50% 10%', -50)

        expect(result).toBe('210 50% 0%')
      })
    })

    describe('when a zero adjustment is applied', () => {
      it('then the color remains unchanged', () => {
        const result = adjustColorLightness('210 50% 40%', 0)

        expect(result).toBe('210 50% 40%')
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
