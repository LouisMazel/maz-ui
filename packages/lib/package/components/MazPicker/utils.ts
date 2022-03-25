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

export function getCurrentDateForTimeValue(value?: string) {
  let base: string | undefined
  if (
    value?.toLowerCase().includes('am') ||
    value?.toLowerCase().includes('pm')
  ) {
    base = convert12To24TimeFormat(value)
  } else {
    base = value?.split('.')[0]
  }

  const hour = base ? Number(base.split(':')[0] ?? 0) : 0
  const minute = base ? Number(base.split(':')[1] ?? 0) : 0
  const seconde = base ? Number(base.split(':')[2] ?? 0) : 0

  return new Date(
    new Date(new Date(new Date().setHours(hour)).setMinutes(minute)).setSeconds(
      seconde,
    ),
  )
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

  const newDate = new Date(value).toISOString()

  return hasTime ? newDate.split('.')[0] : newDate.split('T')[0]
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
  return disabledWeekly.some((dayNumber) =>
    isSameDay(new Date(value), dayNumber),
  )
}

export function isValueDisabledDate({
  value,
  disabledDates,
}: {
  value: string
  disabledDates: string[]
}): boolean {
  return disabledDates.some((disabledDate) =>
    isSameDate(new Date(value), disabledDate),
  )
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

export function getTimeString(value?: string | Date) {
  if (!value) {
    return undefined
  }

  const stringDate = value instanceof Date ? value.toLocaleTimeString() : value

  const date = getCurrentDateForTimeValue(stringDate)

  return date.toLocaleTimeString()
}

export function convertHour24to12Format(baseHour: number): number {
  return baseHour % 12 || 12
}

export function convertHour12to24Format(baseHour: number): number {
  return baseHour % 24 || 24
}

export const convert12To24TimeFormat = (timeStr: string) => {
  const [time, modifier] = timeStr.split(' ')

  let hours: string | number = time.split(':')[0]
  const minutes = time.split(':')[1]
  if (hours === '12') {
    hours = '00'
  }
  if (modifier.toLowerCase().trim().includes('pm')) {
    hours = parseInt(hours, 10) + 12
  }
  return `${hours}:${minutes}`
}

export function getBrowserLocale(): string | undefined {
  try {
    if (typeof window === 'undefined') {
      return undefined
    }

    return window.navigator.language
  } catch (err) {
    throw new Error(`[MazPhoneNumberInput] (browserLocale) ${err}`)
  }
}

export async function fetchLocale(): Promise<string | undefined> {
  try {
    const response = await fetch('https://ip2c.org/s')
    const responseText = await response.text()
    const result = (responseText || '').toString()

    if (!result || result[0] !== '1') {
      return undefined
    }

    return result.split(';')[1]
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[maz-ui](MazPicker)(fetchCountryCode) ${err}`)
  }
}
