import {
  checkValueWithMinMaxDates,
  convert12To24TimeFormat,
  convertHour12to24Format,
  convertHour24to12Format,
  findNearestNumberInList,
  getDaysInMonth,
  getDaysOfWeek,
  getDefaultsShortcuts,
  getFirstDayOfMonth,
  getFormattedDate,
  getISODate,
  getRangeFormattedDate,
  getRangeISODate,
  isRangeValue,
  isSameDate,
  isSameDay,
  isSmaller,
  isToday,
  isValidDate,
  isValueDisabledDate,
  isValueDisabledWeekly,
  scrollToTarget,
} from '@components/MazDatePicker/utils'
import dayjs from 'dayjs'

describe('given MazDatePicker utils', () => {
  describe('getFormattedDate', () => {
    it('then it should format a valid date', () => {
      const result = getFormattedDate({
        value: '2024-01-15',
        locale: 'en-US',
        options: { dateStyle: 'long' },
      })
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    })

    it('then it should return undefined for no value', () => {
      const result = getFormattedDate({
        value: undefined,
        locale: 'en-US',
      })
      expect(result).toBeUndefined()
    })
  })

  describe('getRangeFormattedDate', () => {
    it('then it should format a range with both start and end', () => {
      const result = getRangeFormattedDate({
        value: { start: '2024-01-15', end: '2024-01-20' },
        locale: 'en-US',
        options: { dateStyle: 'short' },
      })
      expect(result).toBeDefined()
      expect(result).toContain(' - ')
    })

    it('then it should format range with only start', () => {
      const result = getRangeFormattedDate({
        value: { start: '2024-01-15', end: undefined },
        locale: 'en-US',
        options: { dateStyle: 'short' },
      })
      expect(result).toContain('...')
    })

    it('then it should format range with only end', () => {
      const result = getRangeFormattedDate({
        value: { start: undefined, end: '2024-01-20' },
        locale: 'en-US',
        options: { dateStyle: 'short' },
      })
      expect(result).toContain('...')
    })

    it('then it should return undefined when both are undefined', () => {
      const result = getRangeFormattedDate({
        value: { start: undefined, end: undefined },
        locale: 'en-US',
        options: { dateStyle: 'short' },
      })
      expect(result).toBeUndefined()
    })
  })

  describe('getFirstDayOfMonth', () => {
    it('then it should return the first day of month', () => {
      const result = getFirstDayOfMonth('2024-01-01')
      expect(typeof result).toBe('number')
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThanOrEqual(6)
    })
  })

  describe('getDaysOfWeek', () => {
    it('then it should return 7 days', () => {
      const days = getDaysOfWeek('en-US', 0)
      expect(days).toHaveLength(7)
    })

    it('then it should return day names starting from given first day', () => {
      const days = getDaysOfWeek('en-US', 1)
      expect(days).toHaveLength(7)
    })
  })

  describe('getDaysInMonth', () => {
    it('then it should return 31 for January', () => {
      expect(getDaysInMonth('2024-01-15')).toBe(31)
    })

    it('then it should return 29 for Feb in leap year', () => {
      expect(getDaysInMonth('2024-02-15')).toBe(29)
    })

    it('then it should return 28 for Feb in non-leap year', () => {
      expect(getDaysInMonth('2023-02-15')).toBe(28)
    })
  })

  describe('isToday', () => {
    it('then it should return true for today', () => {
      expect(isToday(new Date())).toBe(true)
    })

    it('then it should return false for yesterday', () => {
      const yesterday = dayjs().subtract(1, 'day').toDate()
      expect(isToday(yesterday)).toBe(false)
    })
  })

  describe('isSameDate', () => {
    it('then it should return true for same dates', () => {
      expect(isSameDate('2024-01-15', '2024-01-15', 'date')).toBe(true)
    })

    it('then it should return false for different dates', () => {
      expect(isSameDate('2024-01-15', '2024-01-16', 'date')).toBe(false)
    })

    it('then it should compare by month', () => {
      expect(isSameDate('2024-01-15', '2024-01-20', 'month')).toBe(true)
    })
  })

  describe('isSmaller', () => {
    it('then it should return true when first date is after second', () => {
      expect(isSmaller('2024-01-20', '2024-01-15')).toBe(true)
    })

    it('then it should return false when first date is before second', () => {
      expect(isSmaller('2024-01-15', '2024-01-20')).toBe(false)
    })
  })

  describe('isSameDay', () => {
    it('then it should return true when day matches', () => {
      // 2024-01-15 is a Monday (day 1)
      expect(isSameDay('2024-01-15', 1)).toBe(true)
    })

    it('then it should return false when day does not match', () => {
      expect(isSameDay('2024-01-15', 0)).toBe(false)
    })
  })

  describe('getISODate', () => {
    it('then it should format date to ISO', () => {
      expect(getISODate('2024-01-15')).toBe('2024-01-15')
    })

    it('then it should return undefined for no value', () => {
      expect(getISODate(undefined)).toBeUndefined()
    })

    it('then it should use custom format', () => {
      const result = getISODate('2024-01-15', 'YYYY/MM/DD')
      expect(result).toBe('2024/01/15')
    })
  })

  describe('getRangeISODate', () => {
    it('then it should format range to ISO', () => {
      const result = getRangeISODate({ start: '2024-01-15', end: '2024-01-20' })
      expect(result).toEqual({ start: '2024-01-15', end: '2024-01-20' })
    })

    it('then it should return undefined for no value', () => {
      expect(getRangeISODate(undefined)).toBeUndefined()
    })

    it('then it should use custom format', () => {
      const result = getRangeISODate({ start: '2024-01-15', end: '2024-01-20' }, 'YYYY/MM/DD')
      expect(result).toEqual({ start: '2024/01/15', end: '2024/01/20' })
    })
  })

  describe('checkValueWithMinMaxDates', () => {
    it('then it should return original value when minMaxAuto is false', () => {
      const result = checkValueWithMinMaxDates({
        value: '2024-01-15',
        minDate: '2024-01-10',
        maxDate: '2024-01-20',
        format: 'YYYY-MM-DD',
        minMaxAuto: false,
      })
      expect(result.newValue).toBe('2024-01-15')
      expect(result.newCurrentDate).toBe('2024-01-15')
    })

    it('then it should clamp to minDate when value is before', () => {
      const result = checkValueWithMinMaxDates({
        value: '2024-01-05',
        minDate: '2024-01-10',
        maxDate: '2024-01-20',
        format: 'YYYY-MM-DD',
        minMaxAuto: true,
      })
      expect(result.newValue).toBe('2024-01-10')
    })

    it('then it should clamp to maxDate when value is after', () => {
      const result = checkValueWithMinMaxDates({
        value: '2024-01-25',
        minDate: '2024-01-10',
        maxDate: '2024-01-20',
        format: 'YYYY-MM-DD',
        minMaxAuto: true,
      })
      expect(result.newValue).toBe('2024-01-20')
    })

    it('then it should return undefined when value is in range', () => {
      const result = checkValueWithMinMaxDates({
        value: '2024-01-15',
        minDate: '2024-01-10',
        maxDate: '2024-01-20',
        format: 'YYYY-MM-DD',
        minMaxAuto: true,
      })
      expect(result.newValue).toBeUndefined()
      expect(result.newCurrentDate).toBeUndefined()
    })

    it('then it should handle undefined minDate and maxDate', () => {
      const result = checkValueWithMinMaxDates({
        value: '2024-01-15',
        minDate: undefined,
        maxDate: undefined,
        format: 'YYYY-MM-DD',
        minMaxAuto: true,
      })
      expect(result.newValue).toBeUndefined()
    })
  })

  describe('isValueDisabledWeekly', () => {
    it('then it should return true when day is disabled', () => {
      // 2024-01-15 is Monday (day 1)
      expect(isValueDisabledWeekly({ value: '2024-01-15', disabledWeekly: [1] })).toBe(true)
    })

    it('then it should return false when day is not disabled', () => {
      expect(isValueDisabledWeekly({ value: '2024-01-15', disabledWeekly: [0, 6] })).toBe(false)
    })
  })

  describe('isValueDisabledDate', () => {
    it('then it should return true when date is in disabled list', () => {
      expect(isValueDisabledDate({
        value: '2024-01-15',
        disabledDates: ['2024-01-15', '2024-01-16'],
      })).toBe(true)
    })

    it('then it should return false when date is not disabled', () => {
      expect(isValueDisabledDate({
        value: '2024-01-17',
        disabledDates: ['2024-01-15', '2024-01-16'],
      })).toBe(false)
    })
  })

  describe('scrollToTarget', () => {
    it('then it should call scrollTo on container', () => {
      const container = document.createElement('div')
      const target = document.createElement('div')
      container.scrollTo = vi.fn()

      scrollToTarget(container, target, 10, true)
      expect(container.scrollTo).toHaveBeenCalledWith({
        top: target.offsetTop - 10,
        behavior: 'smooth',
      })
    })

    it('then it should use auto behavior when smooth is false', () => {
      const container = document.createElement('div')
      const target = document.createElement('div')
      container.scrollTo = vi.fn()

      scrollToTarget(container, target, 0, false)
      expect(container.scrollTo).toHaveBeenCalledWith({
        top: target.offsetTop,
        behavior: 'auto',
      })
    })
  })

  describe('findNearestNumberInList', () => {
    it('then it should find nearest number', () => {
      expect(findNearestNumberInList([0, 5, 10, 15, 20], 12)).toBe(10)
    })

    it('then it should return exact match', () => {
      expect(findNearestNumberInList([0, 5, 10], 5)).toBe(5)
    })
  })

  describe('convertHour24to12Format', () => {
    it('then it should convert 0 to 12', () => {
      expect(convertHour24to12Format(0)).toBe(12)
    })

    it('then it should convert 13 to 1', () => {
      expect(convertHour24to12Format(13)).toBe(1)
    })

    it('then it should convert 12 to 12', () => {
      expect(convertHour24to12Format(12)).toBe(12)
    })
  })

  describe('convertHour12to24Format', () => {
    it('then it should convert 0 to 24', () => {
      expect(convertHour12to24Format(0)).toBe(24)
    })

    it('then it should convert 12 to 12', () => {
      expect(convertHour12to24Format(12)).toBe(12)
    })

    it('then it should convert 24 to 24', () => {
      expect(convertHour12to24Format(24)).toBe(24)
    })
  })

  describe('convert12To24TimeFormat', () => {
    it('then it should convert AM time', () => {
      expect(convert12To24TimeFormat('9:30 AM')).toBe('9:30')
    })

    it('then it should convert PM time', () => {
      expect(convert12To24TimeFormat('2:30 PM')).toBe('14:30')
    })

    it('then it should convert 12:00 AM to 0:00', () => {
      expect(convert12To24TimeFormat('12:00 AM')).toBe('00:00')
    })

    it('then it should convert 12:00 PM to 12:00', () => {
      expect(convert12To24TimeFormat('12:00 PM')).toBe('12:00')
    })
  })

  describe('isRangeValue', () => {
    it('then it should return true for object', () => {
      expect(isRangeValue({ start: '2024-01-15', end: '2024-01-20' })).toBe(true)
    })

    it('then it should return false for string', () => {
      expect(isRangeValue('2024-01-15')).toBe(false)
    })

    it('then it should return false for null/undefined', () => {
      expect(isRangeValue(undefined as any)).toBe(false)
      expect(isRangeValue(null as any)).toBe(false)
    })
  })

  describe('isValidDate', () => {
    it('then it should return true for valid string date', () => {
      expect(isValidDate('2024-01-15')).toBe(true)
    })

    it('then it should return true for Date object', () => {
      expect(isValidDate(new Date())).toBe(true)
    })

    it('then it should return true for timestamp number', () => {
      expect(isValidDate(Date.now())).toBe(true)
    })

    it('then it should return false for invalid values', () => {
      expect(isValidDate(null)).toBe(false)
      expect(isValidDate(undefined)).toBe(false)
      expect(isValidDate('')).toBe(false)
    })
  })

  describe('getDefaultsShortcuts', () => {
    it('then it should return 7 shortcuts', () => {
      const t = {
        lastSevenDays: 'Last 7 days',
        lastThirtyDays: 'Last 30 days',
        thisWeek: 'This week',
        lastWeek: 'Last week',
        thisMonth: 'This month',
        thisYear: 'This year',
        lastYear: 'Last year',
      }
      const shortcuts = getDefaultsShortcuts(t)
      expect(shortcuts).toHaveLength(7)
      expect(shortcuts[0].label).toBe('Last 7 days')
      expect(shortcuts[0].identifier).toBe('last7Days')
      expect(shortcuts[0].value.start).toBeDefined()
      expect(shortcuts[0].value.end).toBeDefined()
    })
  })
})
