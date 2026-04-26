import { describe, expect, it } from 'vitest'
import {
  colorToHex,
  formatAsHSL,
  formatAsOklch,
  isCompleteCSSColor,
  normalizeColor,
  parseColor,
  parseColorAsOklch,
} from '../color-parser'

describe('parseColor', () => {
  describe('Given a legacy raw HSL string', () => {
    describe('When parsing', () => {
      it('extracts H, S, L directly from the three-number form', () => {
        const result = parseColor('210 100% 56%')
        expect(result.h).toBeCloseTo(210, 1)
        expect(result.s).toBeCloseTo(100, 1)
        expect(result.l).toBeCloseTo(56, 1)
      })

      it('supports decimal values', () => {
        const result = parseColor('210.5 99.9% 55.5%')
        expect(result.h).toBeCloseTo(210.5, 1)
        expect(result.s).toBeCloseTo(99.9, 1)
        expect(result.l).toBeCloseTo(55.5, 1)
      })
    })
  })

  describe('Given an hsl() string with modern syntax', () => {
    describe('When parsing', () => {
      it('extracts channels from hsl(h s% l%)', () => {
        const result = parseColor('hsl(210 100% 56%)')
        expect(result.h).toBeCloseTo(210, 1)
        expect(result.s).toBeCloseTo(100, 1)
        expect(result.l).toBeCloseTo(56, 1)
      })
    })
  })

  describe('Given an hsl() string with legacy comma syntax', () => {
    describe('When parsing', () => {
      it('extracts channels from hsl(h, s%, l%)', () => {
        const result = parseColor('hsl(120, 50%, 40%)')
        expect(result.h).toBeCloseTo(120, 1)
        expect(result.s).toBeCloseTo(50, 1)
        expect(result.l).toBeCloseTo(40, 1)
      })
    })
  })

  describe('Given a 6-digit hex color', () => {
    describe('When parsing', () => {
      it('converts pure red to HSL', () => {
        const result = parseColor('#ff0000')
        expect(result.h).toBeCloseTo(0, 1)
        expect(result.s).toBeCloseTo(100, 1)
        expect(result.l).toBeCloseTo(50, 1)
      })

      it('converts pure green to HSL', () => {
        const result = parseColor('#00ff00')
        expect(result.h).toBeCloseTo(120, 1)
        expect(result.s).toBeCloseTo(100, 1)
        expect(result.l).toBeCloseTo(50, 1)
      })

      it('converts pure blue to HSL', () => {
        const result = parseColor('#0000ff')
        expect(result.h).toBeCloseTo(240, 1)
        expect(result.s).toBeCloseTo(100, 1)
        expect(result.l).toBeCloseTo(50, 1)
      })

      it('converts white to HSL', () => {
        const result = parseColor('#ffffff')
        expect(result.s).toBeCloseTo(0, 1)
        expect(result.l).toBeCloseTo(100, 1)
      })

      it('converts black to HSL', () => {
        const result = parseColor('#000000')
        expect(result.s).toBeCloseTo(0, 1)
        expect(result.l).toBeCloseTo(0, 1)
      })

      it('is case insensitive', () => {
        const result = parseColor('#FF0000')
        expect(result.h).toBeCloseTo(0, 1)
      })
    })
  })

  describe('Given a 3-digit hex shorthand', () => {
    describe('When parsing', () => {
      it('expands to 6-digit form before conversion', () => {
        const result = parseColor('#f00')
        expect(result.h).toBeCloseTo(0, 1)
        expect(result.s).toBeCloseTo(100, 1)
        expect(result.l).toBeCloseTo(50, 1)
      })
    })
  })

  describe('Given a 4-digit hex shorthand with alpha', () => {
    describe('When parsing', () => {
      it('drops the alpha channel and expands the rgb part', () => {
        const result = parseColor('#f00f')
        expect(result.h).toBeCloseTo(0, 1)
        expect(result.s).toBeCloseTo(100, 1)
        expect(result.l).toBeCloseTo(50, 1)
      })
    })
  })

  describe('Given an 8-digit hex with alpha', () => {
    describe('When parsing', () => {
      it('drops the alpha channel and keeps the 6-digit rgb', () => {
        const result = parseColor('#ff0000ff')
        expect(result.h).toBeCloseTo(0, 1)
        expect(result.s).toBeCloseTo(100, 1)
        expect(result.l).toBeCloseTo(50, 1)
      })
    })
  })

  describe('Given an rgb() string with modern syntax', () => {
    describe('When parsing', () => {
      it('converts rgb(255 0 0) to red HSL', () => {
        const result = parseColor('rgb(255 0 0)')
        expect(result.h).toBeCloseTo(0, 1)
        expect(result.s).toBeCloseTo(100, 1)
        expect(result.l).toBeCloseTo(50, 1)
      })
    })
  })

  describe('Given an rgb() string with legacy comma syntax', () => {
    describe('When parsing', () => {
      it('converts rgb(0, 128, 0) to green HSL', () => {
        const result = parseColor('rgb(0, 128, 0)')
        expect(result.h).toBeCloseTo(120, 1)
        expect(result.s).toBeCloseTo(100, 1)
        expect(result.l).toBeCloseTo(25.1, 1)
      })
    })
  })

  describe('Given an rgba() string', () => {
    describe('When parsing', () => {
      it('ignores alpha and extracts HSL from RGB', () => {
        const result = parseColor('rgba(255, 0, 0, 0.5)')
        expect(result.h).toBeCloseTo(0, 1)
        expect(result.s).toBeCloseTo(100, 1)
        expect(result.l).toBeCloseTo(50, 1)
      })
    })
  })

  describe('Given an oklch() string', () => {
    describe('When parsing', () => {
      it('converts to approximate HSL channels', () => {
        const result = parseColor('oklch(0.7 0.15 30)')
        expect(result.h).toBeGreaterThanOrEqual(0)
        expect(result.h).toBeLessThanOrEqual(360)
        expect(result.s).toBeGreaterThanOrEqual(0)
        expect(result.s).toBeLessThanOrEqual(100)
        expect(result.l).toBeGreaterThanOrEqual(0)
        expect(result.l).toBeLessThanOrEqual(100)
      })

      it('accepts percentage luminosity', () => {
        const result = parseColor('oklch(50% 0.1 200)')
        expect(result.l).toBeGreaterThan(0)
        expect(result.l).toBeLessThan(100)
      })
    })
  })

  describe('Given an invalid color string', () => {
    describe('When parsing', () => {
      it('throws a descriptive error', () => {
        expect(() => parseColor('not-a-color')).toThrow()
        expect(() => parseColor('')).toThrow()
      })
    })
  })
})

describe('formatAsHSL', () => {
  describe('Given HSL channels', () => {
    describe('When formatting', () => {
      it('wraps values in hsl() with space syntax', () => {
        expect(formatAsHSL({ h: 210, s: 100, l: 56 })).toBe('hsl(210 100% 56%)')
      })

      it('rounds channels to one decimal place', () => {
        expect(formatAsHSL({ h: 210.123, s: 99.876, l: 56.5 })).toBe('hsl(210.1 99.9% 56.5%)')
      })

      it('emits whole numbers without trailing dot-zero', () => {
        expect(formatAsHSL({ h: 210, s: 100, l: 50 })).toBe('hsl(210 100% 50%)')
      })
    })
  })
})

describe('isCompleteCSSColor', () => {
  describe('Given a complete CSS color value', () => {
    describe('When testing', () => {
      it('returns true for hsl()', () => {
        expect(isCompleteCSSColor('hsl(210 100% 56%)')).toBe(true)
      })

      it('returns true for rgb()', () => {
        expect(isCompleteCSSColor('rgb(255 0 0)')).toBe(true)
      })

      it('returns true for oklch()', () => {
        expect(isCompleteCSSColor('oklch(0.7 0.15 30)')).toBe(true)
      })

      it('returns true for hex', () => {
        expect(isCompleteCSSColor('#ff0000')).toBe(true)
        expect(isCompleteCSSColor('#f00')).toBe(true)
      })
    })
  })

  describe('Given a legacy raw HSL string', () => {
    describe('When testing', () => {
      it('returns false', () => {
        expect(isCompleteCSSColor('210 100% 56%')).toBe(false)
      })
    })
  })
})

describe('parseColorAsOklch', () => {
  describe('Given an oklch() string', () => {
    describe('When parsing', () => {
      it('extracts channels directly without sRGB roundtrip', () => {
        const result = parseColorAsOklch('oklch(0.7 0.15 30)')
        expect(result.l).toBeCloseTo(0.7, 4)
        expect(result.c).toBeCloseTo(0.15, 4)
        expect(result.h).toBeCloseTo(30, 2)
      })

      it('accepts percentage lightness', () => {
        const result = parseColorAsOklch('oklch(70% 0.15 30)')
        expect(result.l).toBeCloseTo(0.7, 4)
      })
    })
  })

  describe('Given an hsl() string', () => {
    describe('When parsing', () => {
      it('converts to OKLch via sRGB', () => {
        const result = parseColorAsOklch('hsl(0 100% 50%)')
        expect(result.l).toBeCloseTo(0.628, 2)
        expect(result.c).toBeGreaterThan(0.2)
      })

      it('returns near-zero chroma for grayscale', () => {
        const result = parseColorAsOklch('hsl(0 0% 50%)')
        expect(result.c).toBeLessThan(0.001)
      })

      it('handles every hue sextant', () => {
        for (const h of [30, 90, 150, 210, 270, 330]) {
          const result = parseColorAsOklch(`hsl(${h} 100% 50%)`)
          expect(result.c).toBeGreaterThan(0)
        }
      })
    })
  })

  describe('Given a hex string', () => {
    describe('When parsing', () => {
      it('converts to OKLch via sRGB', () => {
        const result = parseColorAsOklch('#ff0000')
        expect(result.l).toBeCloseTo(0.628, 2)
        expect(result.h).toBeCloseTo(29.23, 1)
      })
    })
  })

  describe('Given an empty string', () => {
    describe('When parsing', () => {
      it('throws a descriptive error', () => {
        expect(() => parseColorAsOklch('')).toThrow()
        expect(() => parseColorAsOklch('   ')).toThrow()
      })
    })
  })
})

describe('formatAsOklch', () => {
  describe('Given OKLch channels', () => {
    describe('When formatting', () => {
      it('wraps values in oklch() with space syntax', () => {
        expect(formatAsOklch({ l: 0.7, c: 0.15, h: 30 })).toBe('oklch(0.7 0.15 30)')
      })

      it('rounds lightness and chroma to four decimal places, hue to two', () => {
        expect(formatAsOklch({ l: 0.123456, c: 0.234567, h: 30.345 })).toBe('oklch(0.1235 0.2346 30.35)')
      })

      it('canonicalizes hue to 0 when chroma is 0', () => {
        expect(formatAsOklch({ l: 0.5, c: 0, h: 270 })).toBe('oklch(0.5 0 0)')
      })
    })
  })
})

describe('colorToHex', () => {
  describe('Given any CSS color', () => {
    describe('When converting', () => {
      it('returns a 6-digit hex string', () => {
        expect(colorToHex('hsl(0 100% 50%)')).toMatch(/^#[0-9a-f]{6}$/)
      })

      it('roundtrips pure red from hsl', () => {
        expect(colorToHex('hsl(0 100% 50%)')).toBe('#ff0000')
      })

      it('roundtrips white', () => {
        expect(colorToHex('hsl(0 0% 100%)')).toBe('#ffffff')
      })

      it('roundtrips black', () => {
        expect(colorToHex('hsl(0 0% 0%)')).toBe('#000000')
      })

      it('converts oklch to hex', () => {
        const hex = colorToHex('oklch(0.628 0.258 29.23)')
        expect(hex).toMatch(/^#[0-9a-f]{6}$/)
      })

      it('roundtrips a hex through oklch back to the same hex', () => {
        expect(colorToHex('#3366cc')).toBe('#3366cc')
      })
    })
  })
})

describe('normalizeColor', () => {
  describe('Given a complete CSS color value', () => {
    describe('When normalizing', () => {
      it('returns the input unchanged for hsl()', () => {
        expect(normalizeColor('hsl(210 100% 56%)')).toBe('hsl(210 100% 56%)')
      })

      it('returns the input unchanged for hex', () => {
        expect(normalizeColor('#ff0000')).toBe('#ff0000')
      })

      it('returns the input unchanged for oklch()', () => {
        expect(normalizeColor('oklch(0.7 0.15 30)')).toBe('oklch(0.7 0.15 30)')
      })
    })
  })

  describe('Given a legacy raw HSL string', () => {
    describe('When normalizing', () => {
      it('wraps the value in hsl()', () => {
        expect(normalizeColor('210 100% 56%')).toBe('hsl(210 100% 56%)')
      })
    })
  })
})
