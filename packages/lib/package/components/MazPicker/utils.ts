import { date, capitalize } from './../../filters'

export function cloneDate(date: Date): Date {
  return new Date(date.getTime())
}

export function getFormattedDate({
  value,
  locale,
  inputDateStyle,
  inputTimeStyle,
  timeZone,
}: {
  value?: string | Date
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
  return new Date(year, month, 0).getDate()
}

export const isToday = (date: Date | string | number): boolean => {
  const today = new Date()
  const usedDate = getDateInstance(date)

  return (
    usedDate.getDate() === today.getDate() &&
    usedDate.getMonth() === today.getMonth() &&
    usedDate.getFullYear() === today.getFullYear()
  )
}

export const isSameDate = (
  date: Date | string | number,
  date2: Date | string | number,
): boolean => {
  date = getDateInstance(date)
  date2 = getDateInstance(date2)

  return (
    date.getDate() === date2.getDate() &&
    date.getMonth() === date2.getMonth() &&
    date.getFullYear() === date2.getFullYear()
  )
}

export const isSameMonth = (
  date: Date | string | number,
  date2: Date | string | number,
): boolean => {
  date = getDateInstance(date)
  date2 = getDateInstance(date2)

  return date.getMonth() === date2.getMonth()
}

export const isSameYear = (
  date: Date | string | number,
  date2: Date | string | number,
): boolean => {
  date = getDateInstance(date)
  date2 = getDateInstance(date2)

  return date.getFullYear() === date2.getFullYear()
}

export const isBigger = (
  date: Date | string | number,
  date2: Date | string | number,
): boolean => {
  date = getDateInstance(date)
  date2 = getDateInstance(date2)

  return date.getTime() >= date2.getTime() && !isSameDate(date, date2)
}

export const isSmaller = (
  date: Date | string | number,
  date2: Date | string | number,
): boolean => {
  date = getDateInstance(date)
  date2 = getDateInstance(date2)

  return date.getTime() <= date2.getTime() && !isSameDate(date, date2)
}

export const isSameDay = (
  date: Date | string | number,
  dayNumber: number,
): boolean => {
  date = getDateInstance(date)

  return date.getDay() === dayNumber
}
