import { buildSlots, formatTime, getPeriodLabels, normalizeTime, pad, parseTime, toMinutes, toTime, uses12Hours } from '@components/MazTimePicker/utils'

describe('given the time utils', () => {
  describe('when parsing a time', () => {
    it('then it reads HH:mm and H:mm', () => {
      expect(parseTime('09:05')).toEqual({ hours: 9, minutes: 5 })
      expect(parseTime('9:05')).toEqual({ hours: 9, minutes: 5 })
    })

    it('then it rejects invalid times', () => {
      expect(parseTime('24:00')).toBeUndefined()
      expect(parseTime('12:60')).toBeUndefined()
      expect(parseTime('noon')).toBeUndefined()
      expect(parseTime(null)).toBeUndefined()
      expect(parseTime('')).toBeUndefined()
    })
  })

  describe('when building a time', () => {
    it('then it pads the numbers', () => {
      expect(pad(3)).toBe('03')
      expect(toTime(9, 5)).toBe('09:05')
      expect(normalizeTime('9:05')).toBe('09:05')
      expect(normalizeTime('x')).toBeUndefined()
    })

    it('then it converts to minutes', () => {
      expect(toMinutes('01:30')).toBe(90)
      expect(toMinutes('nope')).toBeNaN()
    })
  })

  describe('when reading the locale', () => {
    it('then it detects the 12 hours clocks', () => {
      expect(uses12Hours('en-US')).toBe(true)
      expect(uses12Hours('fr-FR')).toBe(false)
    })

    it('then an invalid locale falls back to 24 hours', () => {
      expect(uses12Hours('not a locale')).toBe(false)
    })

    it('then it formats a time', () => {
      expect(formatTime('14:05', 'en-US', true)).toMatch(/2:05\s?PM/)
      expect(formatTime('14:05', 'fr-FR', false)).toBe('14:05')
      expect(formatTime('bad', 'en-US', true)).toBe('bad')
      expect(formatTime('14:05', 'not a locale', false)).toBe('14:05')
    })

    it('then it gives the AM and PM labels', () => {
      expect(getPeriodLabels('en-US')).toEqual(['AM', 'PM'])
      expect(getPeriodLabels('not a locale')).toEqual(['AM', 'PM'])
    })
  })

  describe('when building the slots', () => {
    it('then it lists the times between min and max', () => {
      expect(buildSlots('09:00', '10:30', 30)).toEqual(['09:00', '09:30', '10:00', '10:30'])
    })

    it('then it defaults to the whole day and a step of 1 minute at least', () => {
      expect(buildSlots('x', 'y', 0)).toHaveLength(1440)
    })
  })
})
