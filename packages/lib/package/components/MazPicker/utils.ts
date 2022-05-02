import dayjs from 'dayjs'
import type { ConfigType, OpUnitType } from 'dayjs'
import weekday from 'dayjs/plugin/weekday'

dayjs.extend(weekday)

import { date, capitalize } from './../../filters'
import type { PartialRangeValue } from './types'

export type DateTimeFormatOptions = Pick<
  Intl.DateTimeFormatOptions,
  'hour12' | 'dateStyle' | 'timeStyle' | 'timeZone'
>

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

export function getFirstDayOfMonth(value: ConfigType): number {
  return dayjs(value).startOf('month').day()
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

export function getDaysInMonth(date: ConfigType): number {
  return dayjs(date).daysInMonth()
}

export function isToday(date: ConfigType): boolean {
  return dayjs(date).isSame(dayjs(), 'date')
}

export function isSameDate(
  date: ConfigType,
  date2: ConfigType,
  unit: OpUnitType,
): boolean {
  return dayjs(date).isSame(date2, unit)
}

export function isSmaller(date: ConfigType, date2: ConfigType): boolean {
  return dayjs(date).isAfter(date2)
}

export function isSameDay(date: ConfigType, dayNumber: number): boolean {
  return dayjs(date).day() === dayNumber
}

export function getISODate(
  value?: ConfigType,
  format = 'YYYY-MM-DD',
): string | undefined {
  if (!value) {
    return undefined
  }

  return dayjs(value).format(format)
}

export function getRangeISODate(
  value: PartialRangeValue,
  format = 'YYYY-MM-DD',
) {
  return {
    start: getISODate(value.start, format),
    end: getISODate(value.end, format),
  }
}

type CheckValueResponse = {
  newValue?: string
  newCurrentDate?: string
}

export function checkValueWithMinMaxDates({
  value,
  minDate,
  maxDate,
  format,
}: {
  value: string
  minDate?: string
  maxDate?: string
  format: string
}): CheckValueResponse {
  if (minDate && dayjs(value).isBefore(minDate)) {
    return {
      newValue: minDate,
      newCurrentDate: dayjs(minDate, format).format(),
    }
  } else if (maxDate && dayjs(value).isAfter(maxDate)) {
    return {
      newValue: maxDate,
      newCurrentDate: dayjs(maxDate, format).format(),
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
  return disabledWeekly.some((dayNumber) => isSameDay(value, dayNumber))
}

export function isValueDisabledDate({
  value,
  disabledDates,
}: {
  value: string
  disabledDates: string[]
}): boolean {
  return disabledDates.some((disabledDate) =>
    dayjs(value).isSame(dayjs(disabledDate), 'date'),
  )
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
