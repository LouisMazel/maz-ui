import { date, capitalize } from './../../filters'
import { PartialRangeValue } from './types'

export function cloneDate(date: Date | number): Date {
  return new Date(getDateInstance(date).getTime())
}

export function getFormattedDate({
  value,
  locale,
  inputDateStyle,
  inputTimeStyle,
  timeZone,
}: {
  value?: string
  locale: string
  inputDateStyle: Intl.DateTimeFormatOptions['dateStyle']
  inputTimeStyle?: Intl.DateTimeFormatOptions['timeStyle']
  timeZone: Intl.DateTimeFormatOptions['timeZone']
}): string | undefined {
  return value
    ? capitalize(
        date(value, locale, {
          dateStyle: inputDateStyle,
          timeStyle: inputTimeStyle,
          timeZone: timeZone,
        }),
      )
    : undefined
}

export function getRangeFormattedDate({
  value,
  locale,
  inputDateStyle,
  inputTimeStyle,
  timeZone,
}: {
  value: PartialRangeValue
  locale: string
  inputDateStyle: Intl.DateTimeFormatOptions['dateStyle']
  inputTimeStyle?: Intl.DateTimeFormatOptions['timeStyle']
  timeZone: Intl.DateTimeFormatOptions['timeZone']
}): string | undefined {
  const startValue = getFormattedDate({
    value: value.start,
    locale,
    inputDateStyle,
    inputTimeStyle,
    timeZone,
  })

  const endValue = getFormattedDate({
    value: value.end,
    locale,
    inputDateStyle,
    inputTimeStyle,
    timeZone,
  })

  return startValue || endValue
    ? `${startValue || '...'} - ${endValue || '...'}`
    : undefined
}

export function getCurrentDate(value?: string | Date): Date {
  return value ? new Date(value) : new Date()
}

export function getDateInstance(date: string | Date | number): Date {
  return date instanceof Date ? date : new Date(date)
}

export function getFirstAndLastDayOfMonth(value: string | Date | number): {
  firstDay: number
  lastDay: number
} {
  const date = getDateInstance(value)

  return {
    firstDay: new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
    lastDay: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay(),
  }
}

function addDays(date: Date, days: number) {
  return date.setDate(date.getDate() + days)
}

export function getWeekDays(
  locale: string,
  offset = 0,
): { label: string; dayNumber: number }[] {
  return Array.from({ length: 7 }, (_v, i) => i + (offset || 0)).map(
    (index) => {
      const baseDate = addDays(new Date('1970-01-04'), index)
      return {
        label: date(baseDate, locale, { weekday: 'short' }),
        dayNumber: new Date(baseDate).getDay(),
      }
    },
  )
}

export function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

export function isToday(date: Date | string | number): boolean {
  const today = new Date()
  const usedDate = getDateInstance(date)

  return (
    usedDate.getDate() === today.getDate() &&
    usedDate.getMonth() === today.getMonth() &&
    usedDate.getFullYear() === today.getFullYear()
  )
}

export function isSameDate(
  date: Date | string | number,
  date2: Date | string | number,
): boolean {
  date = getDateInstance(date)
  date2 = getDateInstance(date2)

  return (
    date.getDate() === date2.getDate() &&
    date.getMonth() === date2.getMonth() &&
    date.getFullYear() === date2.getFullYear()
  )
}

export function isSameMonth(
  date: Date | string | number,
  date2: Date | string | number,
): boolean {
  date = getDateInstance(date)
  date2 = getDateInstance(date2)

  return date.getMonth() === date2.getMonth()
}

export function isSameYear(
  date: Date | string | number,
  date2: Date | string | number,
): boolean {
  date = getDateInstance(date)
  date2 = getDateInstance(date2)

  return date.getFullYear() === date2.getFullYear()
}

export function isBigger(
  date: Date | string | number,
  date2: Date | string | number,
): boolean {
  date = getDateInstance(date)
  date2 = getDateInstance(date2)

  return date.getTime() >= date2.getTime() && !isSameDate(date, date2)
}

export function isSmaller(
  date: Date | string | number,
  date2: Date | string | number,
): boolean {
  date = getDateInstance(date)
  date2 = getDateInstance(date2)

  return date.getTime() <= date2.getTime() && !isSameDate(date, date2)
}

export function isSameDay(
  date: Date | string | number,
  dayNumber: number,
): boolean {
  date = getDateInstance(date)

  return date.getDay() === dayNumber
}

export function getISODate(value?: string): string | undefined {
  if (!value) {
    return undefined
  }

  function isoDate(value: string): string {
    const userTimezoneOffset = new Date(value).getTimezoneOffset() * 60000
    const dateWithoutTz = new Date(
      new Date(value).getTime() - userTimezoneOffset,
    )
    return dateWithoutTz.toISOString().split('T')[0]
  }

  return isoDate(value)
}

export function getRangeISODate(value: PartialRangeValue) {
  return {
    start: getISODate(value.start),
    end: getISODate(value.end),
  }
}

type CheckValueResponse = {
  newValue?: string
  newCurrentDate?: Date
}

export function checkValueWithMinMaxDates({
  value,
  minDate,
  maxDate,
}: {
  value: string
  minDate?: string
  maxDate?: string
}): CheckValueResponse {
  if (minDate && isSmaller(value, minDate)) {
    return {
      newValue: minDate,
      newCurrentDate: getCurrentDate(minDate),
    }
  } else if (maxDate && isBigger(value, maxDate)) {
    return {
      newValue: maxDate,
      newCurrentDate: getCurrentDate(maxDate),
    }
  }

  return {
    newValue: undefined,
    newCurrentDate: undefined,
  }
}

export function isValueDisabledWeekly({
  value,
  disabledWeekly,
}: {
  value: string
  disabledWeekly: number[]
}): boolean {
  const isDisabled = disabledWeekly.some((dayNumber) =>
    isSameDay(new Date(value), dayNumber),
  )

  return isDisabled
}
