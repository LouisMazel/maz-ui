import { describe, expect, it } from 'vitest'
import {
  formatAsHSL,
  isCompleteCSSColor,
  normalizeColor,
  parseColor,
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
