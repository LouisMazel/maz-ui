import { describe, expect, it } from 'vitest'
import { isCompleteCSSColor, normalizeColor } from '../color-parser'

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

      it('returns true for var()', () => {
        expect(isCompleteCSSColor('var(--maz-primary)')).toBe(true)
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

      it('returns the input unchanged for var()', () => {
        expect(normalizeColor('var(--maz-primary)')).toBe('var(--maz-primary)')
      })
    })
  })

  describe('Given a legacy raw HSL string', () => {
    describe('When normalizing', () => {
      it('wraps the value in hsl()', () => {
        expect(normalizeColor('210 100% 56%')).toBe('hsl(210 100% 56%)')
      })

      it('supports decimal channels', () => {
        expect(normalizeColor('210.5 99.9% 55.5%')).toBe('hsl(210.5 99.9% 55.5%)')
      })
    })
  })

  describe('Given an unrecognised value', () => {
    describe('When normalizing', () => {
      it('throws a descriptive error', () => {
        expect(() => normalizeColor('not-a-color')).toThrow()
      })
    })
  })
})
