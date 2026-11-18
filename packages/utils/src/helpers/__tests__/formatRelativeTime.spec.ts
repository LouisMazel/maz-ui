import { formatRelativeTime, getRelativeTime } from '../formatRelativeTime'

const NOW = new Date('2024-06-15T12:00:00.000Z')
const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

function ago(ms: number) {
  return new Date(NOW.getTime() - ms)
}

function ahead(ms: number) {
  return new Date(NOW.getTime() + ms)
}

describe('given the formatRelativeTime helper', () => {
  describe('when the locale is english', () => {
    it.each([
      [
        ago(30 * SECOND),
        '30 seconds ago',
      ],
      [
        ago(3 * MINUTE),
        '3 minutes ago',
      ],
      [
        ago(2 * HOUR),
        '2 hours ago',
      ],
      [
        ago(DAY),
        'yesterday',
      ],
      [
        ago(3 * DAY),
        '3 days ago',
      ],
      [
        ago(14 * DAY),
        '2 weeks ago',
      ],
      [
        ago(60 * DAY),
        '2 months ago',
      ],
      [
        ago(400 * DAY),
        'last year',
      ],
      [
        ago(800 * DAY),
        '2 years ago',
      ],
    ])('then the past date %# is formatted as a sentence', (date, expected) => {
      expect(formatRelativeTime(date, { locale: 'en', now: NOW })).toBe(expected)
    })

    it.each([
      [
        ahead(30 * SECOND),
        'in 30 seconds',
      ],
      [
        ahead(3 * MINUTE + 1),
        'in 3 minutes',
      ],
      [
        ahead(2 * HOUR + 1),
        'in 2 hours',
      ],
      [
        ahead(DAY),
        'tomorrow',
      ],
      [
        ahead(3 * DAY + 1),
        'in 3 days',
      ],
      [
        ahead(60 * DAY),
        'in 2 months',
      ],
      [
        ahead(800 * DAY),
        'in 2 years',
      ],
    ])('then the future date %# is formatted as a sentence', (date, expected) => {
      expect(formatRelativeTime(date, { locale: 'en', now: NOW })).toBe(expected)
    })
  })

  describe('when the locale is french', () => {
    it.each([
      [
        ago(3 * MINUTE),
        'il y a 3 minutes',
      ],
      [
        ahead(3 * MINUTE + 1),
        'dans 3 minutes',
      ],
      [
        ago(DAY),
        'hier',
      ],
      [
        ahead(DAY),
        'demain',
      ],
      [
        ago(2 * HOUR),
        'il y a 2 heures',
      ],
    ])('then the date %# is localized by Intl', (date, expected) => {
      expect(formatRelativeTime(date, { locale: 'fr', now: NOW })).toBe(expected)
    })

    it('then now is localized', () => {
      expect(formatRelativeTime(ago(SECOND), { locale: 'fr', now: NOW })).toBe('maintenant')
    })
  })

  describe('when the locale is japanese', () => {
    it.each([
      [
        ago(3 * MINUTE),
        '3 分前',
      ],
      [
        ahead(2 * HOUR + 1),
        '2 時間後',
      ],
      [
        ago(DAY),
        '昨日',
      ],
      [
        ago(SECOND),
        '今',
      ],
    ])('then the date %# is localized by Intl', (date, expected) => {
      expect(formatRelativeTime(date, { locale: 'ja', now: NOW })).toBe(expected)
    })
  })

  describe('when the locale is arabic', () => {
    it('then the plural rules of the locale are applied', () => {
      expect(formatRelativeTime(ago(2 * MINUTE), { locale: 'ar', now: NOW })).toBe(
        new Intl.RelativeTimeFormat('ar', { numeric: 'auto' }).format(-2, 'minute'),
      )
    })
  })

  describe('when the input type changes', () => {
    it('then a Date, an ISO string and a timestamp give the same text', () => {
      const date = ago(5 * MINUTE)

      const options = { locale: 'en', now: NOW }

      expect(formatRelativeTime(date, options)).toBe('5 minutes ago')
      expect(formatRelativeTime(date.toISOString(), options)).toBe('5 minutes ago')
      expect(formatRelativeTime(date.getTime(), options)).toBe('5 minutes ago')
    })

    it('then now can be a timestamp', () => {
      expect(formatRelativeTime(ago(5 * MINUTE), {
        locale: 'en',
        now: NOW.getTime(),
      })).toBe('5 minutes ago')
    })
  })

  describe('when now is not provided', () => {
    it('then the current time is used', () => {
      vi.useFakeTimers()
      vi.setSystemTime(NOW)

      expect(formatRelativeTime(ago(10 * MINUTE), { locale: 'en' })).toBe('10 minutes ago')

      vi.useRealTimers()
    })
  })

  describe('when the locale is not provided', () => {
    it('then the locale of the browser is used', () => {
      const spy = vi.spyOn(globalThis.navigator, 'language', 'get').mockReturnValue('fr-FR')

      expect(formatRelativeTime(ago(3 * MINUTE), { now: NOW })).toBe('il y a 3 minutes')

      spy.mockRestore()
    })

    it('then the runtime locale is used when the browser has none', () => {
      const spy = vi.spyOn(globalThis.navigator, 'language', 'get').mockReturnValue(undefined as unknown as string)

      expect(formatRelativeTime(ago(3 * MINUTE), { now: NOW })).toMatch(/3/)

      spy.mockRestore()
    })
  })

  describe('when the numeric option is always', () => {
    it('then numbers are used instead of idiomatic words', () => {
      expect(formatRelativeTime(ago(DAY), { locale: 'en', now: NOW, numeric: 'always' })).toBe('1 day ago')
      expect(formatRelativeTime(ahead(DAY), { locale: 'en', now: NOW, numeric: 'always' })).toBe('in 1 day')
    })
  })

  describe('when the style option changes', () => {
    it.each([
      ['long', '3 minutes ago'],
      ['short', '3 min. ago'],
      ['narrow', '3m ago'],
    ] as const)('then the %s style is applied', (style, expected) => {
      expect(formatRelativeTime(ago(3 * MINUTE), { locale: 'en', now: NOW, style })).toBe(expected)
    })
  })

  describe('when the compact format is used', () => {
    it.each([
      [
        ago(30 * SECOND),
        'en',
        '30 sec',
      ],
      [
        ago(3 * MINUTE),
        'en',
        '3 min',
      ],
      [
        ago(2 * HOUR),
        'en',
        '2 hr',
      ],
      [
        ago(3 * DAY),
        'en',
        '3 days',
      ],
      [
        ago(14 * DAY),
        'en',
        '2 wks',
      ],
      [
        ago(60 * DAY),
        'en',
        '2 mths',
      ],
      [
        ago(800 * DAY),
        'en',
        '2 yrs',
      ],
      [
        ago(3 * MINUTE),
        'fr',
        '3 min',
      ],
      [
        ago(2 * HOUR),
        'fr',
        '2 h',
      ],
      [
        ago(3 * MINUTE),
        'ja',
        '3 分',
      ],
    ])('then the date %# has no direction and is localized', (date, locale, expected) => {
      expect(formatRelativeTime(date, { locale, now: NOW, format: 'compact' }).replaceAll(/\s/g, ' ')).toBe(expected)
    })

    it('then the future has no direction either', () => {
      expect(formatRelativeTime(ahead(3 * MINUTE + 1), { locale: 'en', now: NOW, format: 'compact' })).toBe('3 min')
    })

    it('then the narrow style is applied', () => {
      expect(formatRelativeTime(ago(3 * MINUTE), {
        locale: 'en',
        now: NOW,
        format: 'compact',
        style: 'narrow',
      })).toBe('3m')
    })

    it('then now is localized', () => {
      expect(formatRelativeTime(ago(SECOND), { locale: 'en', now: NOW, format: 'compact' })).toBe('now')
    })
  })

  describe('when the thresholds are customized', () => {
    it('then the now threshold is applied in the past and the future', () => {
      const options = {
        locale: 'en',
        now: NOW,
        thresholds: { now: 30 },
      }

      expect(formatRelativeTime(ago(20 * SECOND), options)).toBe('now')
      expect(formatRelativeTime(ahead(20 * SECOND), options)).toBe('now')
      expect(formatRelativeTime(ago(30 * SECOND), options)).toBe('30 seconds ago')
    })

    it('then a threshold set to 0 skips the unit', () => {
      const options = {
        locale: 'en',
        now: NOW,
        thresholds: { second: 0, now: 0 },
      }

      expect(formatRelativeTime(ago(30 * SECOND), options)).toBe('1 minute ago')
    })

    it('then weeks can be skipped to show days longer', () => {
      const options = {
        locale: 'en',
        now: NOW,
        thresholds: { day: 30, week: 0 },
      }

      expect(formatRelativeTime(ago(14 * DAY), options)).toBe('14 days ago')
      expect(formatRelativeTime(ago(45 * DAY), options)).toBe('last month')
    })

    it('then the unit changes exactly at the threshold', () => {
      const options = {
        locale: 'en',
        now: NOW,
        thresholds: { minute: 30 },
      }

      expect(formatRelativeTime(ago(29 * MINUTE), options)).toBe('29 minutes ago')
      expect(formatRelativeTime(ago(30 * MINUTE), options)).toBe('1 hour ago')
      expect(getRelativeTime(ago(30 * MINUTE), options).unit).toBe('hour')
    })

    it('then the default thresholds switch units', () => {
      const unitOf = (ms: number) => getRelativeTime(ago(ms), { locale: 'en', now: NOW }).unit

      expect(unitOf(59 * SECOND)).toBe('second')
      expect(unitOf(60 * SECOND)).toBe('minute')
      expect(unitOf(HOUR)).toBe('hour')
      expect(unitOf(24 * HOUR)).toBe('day')
      expect(unitOf(7 * DAY)).toBe('week')
      expect(unitOf(28 * DAY)).toBe('month')
      expect(unitOf(360 * DAY)).toBe('year')
    })
  })

  describe('when the absolute date is enabled', () => {
    const options = { locale: 'en', now: NOW, absoluteAfter: 7 * DAY }

    it('then a recent date stays relative', () => {
      expect(formatRelativeTime(ago(6 * DAY), options)).toBe('6 days ago')
    })

    it('then an old date switches to the absolute format in the past and the future', () => {
      expect(formatRelativeTime(ago(7 * DAY), options)).toBe('Jun 8, 2024')
      expect(formatRelativeTime(ahead(10 * DAY), options)).toBe('Jun 25, 2024')
    })

    it('then the Intl.DateTimeFormat options are applied', () => {
      expect(formatRelativeTime(ago(10 * DAY), {
        ...options,
        absoluteOptions: { dateStyle: 'full', timeZone: 'UTC' },
      })).toBe('Wednesday, June 5, 2024')
    })

    it('then the absolute date is localized', () => {
      expect(formatRelativeTime(ago(10 * DAY), {
        ...options,
        locale: 'fr',
        absoluteOptions: { dateStyle: 'long' },
      })).toBe('5 juin 2024')
    })
  })

  describe('when the details are requested', () => {
    it('then the unit, the signed value and the direction are returned', () => {
      expect(getRelativeTime(ago(3 * MINUTE), { locale: 'en', now: NOW })).toMatchObject({
        text: '3 minutes ago',
        kind: 'relative',
        unit: 'minute',
        value: -3,
        isFuture: false,
        locale: 'en',
      })
      expect(getRelativeTime(ahead(2 * HOUR + 1), { locale: 'en', now: NOW })).toMatchObject({
        kind: 'relative',
        unit: 'hour',
        value: 2,
        isFuture: true,
      })
    })

    it('then now has no unit', () => {
      expect(getRelativeTime(NOW, { locale: 'en', now: NOW })).toMatchObject({
        kind: 'now',
        unit: null,
        value: 0,
        isFuture: false,
      })
    })

    it('then the absolute kind has no unit', () => {
      expect(getRelativeTime(ago(DAY), { locale: 'en', now: NOW, absoluteAfter: HOUR })).toMatchObject({
        kind: 'absolute',
        unit: null,
      })
    })

    it('then the resolved date is returned', () => {
      expect(getRelativeTime(NOW.getTime(), { locale: 'en', now: NOW }).date).toEqual(NOW)
      expect(getRelativeTime(NOW, { locale: 'en', now: NOW }).date).toBe(NOW)
    })
  })

  describe('when the next update delay is requested', () => {
    function textAt(date: Date, offset: number, options = {}) {
      return formatRelativeTime(date, { locale: 'en', now: NOW.getTime() + offset, ...options })
    }

    it.each([
      ago(SECOND),
      ago(10 * SECOND + 250),
      ago(90 * SECOND),
      ago(2 * HOUR + 17 * MINUTE),
      ago(3 * DAY + 5 * HOUR),
      ago(20 * DAY),
      ago(40 * DAY),
      ago(400 * DAY),
      ahead(SECOND),
      ahead(10 * SECOND + 250),
      ahead(90 * SECOND),
      ahead(2 * HOUR + 17 * MINUTE),
      ahead(3 * DAY + 5 * HOUR),
      ahead(20 * DAY),
      ahead(400 * DAY),
      NOW,
    ])('then the text of the date %# changes exactly after the delay', (date) => {
      const { nextUpdateIn, text } = getRelativeTime(date, { locale: 'en', now: NOW })

      expect(nextUpdateIn).toBeGreaterThan(0)
      expect(textAt(date, nextUpdateIn! - 1)).toBe(text)
      expect(textAt(date, nextUpdateIn!)).not.toBe(text)
    })

    it('then the delay is one second under the minute', () => {
      expect(getRelativeTime(ago(30 * SECOND), { locale: 'en', now: NOW }).nextUpdateIn).toBe(SECOND)
    })

    it('then the delay reaches the next minute above the minute', () => {
      expect(getRelativeTime(ago(MINUTE + 20 * SECOND), { locale: 'en', now: NOW }).nextUpdateIn).toBe(40 * SECOND)
    })

    it('then the delay is the time left before now ends', () => {
      expect(getRelativeTime(ago(2 * SECOND), { locale: 'en', now: NOW }).nextUpdateIn).toBe(3 * SECOND)
      expect(getRelativeTime(ahead(2 * SECOND), { locale: 'en', now: NOW }).nextUpdateIn).toBe(7 * SECOND)
    })

    it('then the delay is the same for the compact format', () => {
      const date = ago(2 * HOUR + 17 * MINUTE)
      const options = { locale: 'en', now: NOW, format: 'compact' } as const

      expect(getRelativeTime(date, options).nextUpdateIn).toBe(43 * MINUTE)
    })

    it('then the delay reaches the absolute date in the future', () => {
      const date = ahead(10 * DAY)
      const options = { absoluteAfter: 7 * DAY }

      const { nextUpdateIn, kind } = getRelativeTime(date, { locale: 'en', now: NOW, ...options })

      expect(kind).toBe('absolute')
      expect(textAt(date, nextUpdateIn! - 1, options)).toBe('Jun 25, 2024')
      expect(textAt(date, nextUpdateIn!, options)).toBe('in 6 days')
    })

    it('then the delay reaches the absolute date in the past', () => {
      const date = ago(6 * DAY + 12 * HOUR)
      const options = { absoluteAfter: 7 * DAY }

      const { nextUpdateIn } = getRelativeTime(date, { locale: 'en', now: NOW, ...options })

      expect(nextUpdateIn).toBe(12 * HOUR)
      expect(textAt(date, nextUpdateIn! - 1, options)).toBe('6 days ago')
      expect(textAt(date, nextUpdateIn!, options)).toBe('Jun 9, 2024')
    })

    it('then there is no next update for a past absolute date', () => {
      expect(getRelativeTime(ago(30 * DAY), { locale: 'en', now: NOW, absoluteAfter: 7 * DAY }).nextUpdateIn).toBeNull()
    })
  })

  describe('when the same options are reused', () => {
    it('then the Intl instances are memoized', () => {
      const relativeSpy = vi.spyOn(Intl, 'RelativeTimeFormat')
      const numberSpy = vi.spyOn(Intl, 'NumberFormat')

      formatRelativeTime(ago(3 * MINUTE), { locale: 'de', now: NOW, style: 'narrow' })
      formatRelativeTime(ago(5 * MINUTE), { locale: 'de', now: NOW, style: 'narrow' })
      formatRelativeTime(ago(7 * MINUTE), { locale: 'de', now: NOW, style: 'narrow' })
      formatRelativeTime(ago(3 * MINUTE), { locale: 'de', now: NOW, format: 'compact' })
      formatRelativeTime(ago(5 * MINUTE), { locale: 'de', now: NOW, format: 'compact' })

      expect(relativeSpy).toHaveBeenCalledTimes(1)
      expect(numberSpy).toHaveBeenCalledTimes(1)

      relativeSpy.mockRestore()
      numberSpy.mockRestore()
    })

    it('then different options create different instances', () => {
      const relativeSpy = vi.spyOn(Intl, 'RelativeTimeFormat')

      formatRelativeTime(ago(3 * MINUTE), { locale: 'es', now: NOW })
      formatRelativeTime(ago(3 * MINUTE), { locale: 'es', now: NOW, style: 'short' })
      formatRelativeTime(ago(3 * MINUTE), { locale: 'it', now: NOW })
      formatRelativeTime(ago(3 * MINUTE), { locale: 'es', now: NOW, numeric: 'always' })

      expect(relativeSpy).toHaveBeenCalledTimes(4)

      relativeSpy.mockRestore()
    })

    it('then the cache is emptied when it is full and keeps working', () => {
      const relativeSpy = vi.spyOn(Intl, 'RelativeTimeFormat')

      for (let index = 0; index < 120; index++) {
        formatRelativeTime(ago(MINUTE), {
          locale: 'en',
          now: NOW,
          style: index % 2
            ? 'short'
            : 'long',
          numeric: index % 3
            ? 'auto'
            : 'always',
          format: 'relative',
          thresholds: { now: index },
        })
      }

      expect(formatRelativeTime(ago(MINUTE), { locale: 'en', now: NOW })).toBe('1 minute ago')
      expect(relativeSpy.mock.calls.length).toBeGreaterThan(0)

      relativeSpy.mockRestore()
    })
  })

  describe('when the arguments are invalid', () => {
    it('then a missing date throws', () => {
      // @ts-expect-error - test undefined value
      expect(() => formatRelativeTime(undefined)).toThrow('The `date` attribute is required.')
    })

    it('then an invalid date throws', () => {
      expect(() => formatRelativeTime('not a date')).toThrow('[maz-ui](formatRelativeTime)')
    })

    it('then an invalid now throws', () => {
      expect(() => formatRelativeTime(NOW, { now: Number.NaN })).toThrow('The `now` option is not a valid date.')
    })

    it('then an invalid locale throws', () => {
      expect(() => formatRelativeTime(ago(MINUTE), { locale: 'not a locale', now: NOW })).toThrow('[maz-ui](formatRelativeTime)')
    })
  })
})
