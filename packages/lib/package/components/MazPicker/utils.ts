import { date, capitalize } from './../../filters'
import { PartialRangeValue } from './types'

export type DateTimeFormatOptions = Pick<
  Intl.DateTimeFormatOptions,
  'hour12' | 'dateStyle' | 'timeStyle' | 'timeZone'
>

export function cloneDate(date: Date | number): Date {
  return new Date(getDateInstance(date).getTime())
}

export function getFormattedDate({
  value,
  locale,
  options,
}: {
  value?: string
  locale: string
  options?: Intl.DateTimeFormatOptions
}): string | undefined {
  return value ? capitalize(date(value, locale, options)) : undefined
}

export function getRangeFormattedDate({
  value,
  locale,
  options,
}: {
  value: PartialRangeValue
  locale: string
  options: Intl.DateTimeFormatOptions
}): string | undefined {
  const startValue = getFormattedDate({
    value: value.start,
    locale,
    options,
  })

  const endValue = getFormattedDate({
    value: value.end,
    locale,
    options,
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

  return date.getTime() >= date2.getTime() // && !isSameDate(date, date2)
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

export function getISODate(
  value?: string,
  hasTime = false,
): string | undefined {
  if (!value) {
    return undefined
  }

  // function isoDate(value: string): string {
  //   const userTimezoneOffset = new Date(value).getTimezoneOffset() * 60000
  //   const dateWithoutTz = new Date(
  //     new Date(value).getTime() - userTimezoneOffset,
  //   )
  //   return dateWithoutTz.toISOString()
  // }

  const dateTest = new Date(value)

  const tzoffset = dateTest.getTimezoneOffset() * 60000 //offset in milliseconds
  const date = new Date(dateTest.getTime() - tzoffset).toISOString()

  return hasTime ? date.split('.')[0] : date.split('T')[0]
}

export function getRangeISODate(value: PartialRangeValue, hasTime = false) {
  return {
    start: getISODate(value.start, hasTime),
    end: getISODate(value.end, hasTime),
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

export function getFirstDateOfWeek(date: Date | string | number): Date {
  date = getDateInstance(date)
  const day = date.getDay()
  const diff = date.getDate() - day + (day == 0 ? -6 : 1) // adjust when day is sunday

  return new Date(date.setDate(diff))
}

export const scrollToTarget = function (
  scrollContainer: HTMLElement,
  target: HTMLElement,
  offset = 0,
  hasSmoothEffect = true,
) {
  scrollContainer.scrollTo({
    top: target.offsetTop - offset,
    behavior: hasSmoothEffect ? 'smooth' : 'auto',
  })
}

export const findNearestNumberInList = (
  list: number[],
  number: number,
): number => {
  const closest = list.reduce((prev, curr) => {
    return Math.abs(curr - number) < Math.abs(prev - number) ? curr : prev
  })

  return closest
}
