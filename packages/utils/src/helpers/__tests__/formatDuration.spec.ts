import type { FormatDurationOptions } from '../formatDuration.ts'
import { formatDuration } from '../formatDuration.ts'

function format(value: number, options: FormatDurationOptions) {
  return formatDuration(value, options).replaceAll(/\s/g, ' ')
}

describe('given the formatDuration helper', () => {
  describe('when the input is in seconds in english', () => {
    it.each([
      [12, '12 sec'],
      [60, '1 min'],
      [185, '3 min 05 sec'],
      [3725, '1 hr 02 min'],
      [3600, '1 hr'],
      [90_000, '1 day 01 hr'],
      [0, '0 sec'],
    ])('then %s gives %s', (value, expected) => {
      expect(format(value, { locale: 'en' })).toBe(expected)
    })
  })

  describe('when the locale is french', () => {
    it.each([
      [12, '12 s'],
      [185, '3 min 05 s'],
      [3725, '1 h 02 min'],
    ])('then %s gives %s', (value, expected) => {
      expect(format(value, { locale: 'fr' })).toBe(expected)
    })
  })

  describe('when the input is in milliseconds', () => {
    it.each([
      [250, '250 ms'],
      [1500, '2 sec'],
      [61_000, '1 min 01 sec'],
    ])('then %s gives %s', (value, expected) => {
      expect(format(value, { locale: 'en', inputUnit: 'millisecond' })).toBe(expected)
    })
  })

  describe('when the seconds have a fraction below one second', () => {
    it('then milliseconds are used', () => {
      expect(format(0.25, { locale: 'en' })).toBe('250 ms')
    })
  })

  describe('when the precision is 1', () => {
    it('then only the largest unit is kept and the value is rounded', () => {
      expect(format(3725, { locale: 'en', precision: 1 })).toBe('1 hr')
      expect(format(3500, { locale: 'en', precision: 1 })).toBe('58 min')
    })
  })

  describe('when the precision is 3', () => {
    it('then three units are shown', () => {
      expect(format(3725, { locale: 'en', precision: 3 })).toBe('1 hr 02 min 05 sec')
    })
  })

  describe('when rounding carries to a larger unit', () => {
    it('then the larger unit is used', () => {
      expect(format(3599.6, { locale: 'en', precision: 1 })).toBe('1 hr')
    })
  })

  describe('when the style is long', () => {
    it('then the units are not padded and are spelled out', () => {
      expect(format(185, { locale: 'en', style: 'long' })).toBe('3 minutes 5 seconds')
    })
  })

  describe('when the style is narrow', () => {
    it('then the narrow units are used', () => {
      expect(format(185, { locale: 'en', style: 'narrow' })).toBe('3m 05s')
    })
  })

  describe('when pad is false', () => {
    it('then the units are not padded', () => {
      expect(format(185, { locale: 'en', pad: false })).toBe('3 min 5 sec')
    })
  })

  describe('when the value is negative', () => {
    it('then the result is prefixed with a minus', () => {
      expect(format(-12, { locale: 'en' })).toBe('-12 sec')
    })
  })

  describe('when the value is not finite', () => {
    it('then it is formatted as zero', () => {
      expect(format(Number.NaN, { locale: 'en' })).toBe('0 sec')
    })
  })

  describe('when no locale is given', () => {
    it('then the browser locale is used', () => {
      expect(formatDuration(12)).toMatch(/12/)
    })
  })
})
