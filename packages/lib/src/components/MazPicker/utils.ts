import type { IpWhoResponse } from '@components/MazInputPhoneNumber/types'
import type { PartialRangeValue } from '@components/MazPicker/types'

import { capitalize } from '@filters/capitalize'
import { date } from '@filters/date'
import dayjs, { type ConfigType, type OpUnitType } from 'dayjs'
import weekday from 'dayjs/plugin/weekday'

dayjs.extend(weekday)

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

  return startValue || endValue ? `${startValue || '...'} - ${endValue || '...'}` : undefined
}

export function getFirstDayOfMonth(value: ConfigType): number {
  return dayjs(value).startOf('month').day()
}

export function getDaysOfWeek(locale: string, firstDayOfWeek: number) {
  const currentDate = dayjs().locale(locale)
  const days: string[] = []

  for (let i = 0; i < 7; i++) {
    const day = currentDate.day(i + firstDayOfWeek).toDate()
    const dayName = date(day, locale, { weekday: 'short' })
    days.push(dayName)
  }

  return days
}

export function getDaysInMonth(date: ConfigType): number {
  return dayjs(date).daysInMonth()
}

export function isToday(date: ConfigType): boolean {
  return dayjs().isSame(date, 'date')
}

export function isSameDate(date: ConfigType, date2: ConfigType, unit: OpUnitType): boolean {
  return dayjs(date).isSame(date2, unit)
}

export function isSmaller(date: ConfigType, date2: ConfigType): boolean {
  return dayjs(date).isAfter(date2)
}

export function isSameDay(date: ConfigType, dayNumber: number): boolean {
  return dayjs(date).day() === dayNumber
}

export function getISODate(value?: ConfigType, format = 'YYYY-MM-DD'): string | undefined {
  if (!value) {
    return undefined
  }

  return dayjs(value).format(format)
}

export function getRangeISODate(value: PartialRangeValue, format = 'YYYY-MM-DD') {
  return {
    start: getISODate(value.start, format),
    end: getISODate(value.end, format),
  }
}

interface CheckValueResponse {
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
  }
  else if (maxDate && dayjs(value).isAfter(maxDate)) {
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
  return disabledWeekly.some(dayNumber => isSameDay(value, dayNumber))
}

export function isValueDisabledDate({
  value,
  disabledDates,
}: {
  value: string
  disabledDates: string[]
}): boolean {
  return disabledDates.some(disabledDate => dayjs(value).isSame(dayjs(disabledDate), 'date'))
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

export function findNearestNumberInList(list: number[], number: number): number {
  return list.reduce((prev, curr) => {
    return Math.abs(curr - number) < Math.abs(prev - number) ? curr : prev
  })
}

export function convertHour24to12Format(baseHour: number): number {
  return baseHour % 12 || 12
}

export function convertHour12to24Format(baseHour: number): number {
  return baseHour % 24 || 24
}

export function convert12To24TimeFormat(timeStr: string) {
  const [time, modifier] = timeStr.split(' ')

  let hours: string | number = time.split(':')[0]
  const minutes = time.split(':')[1]
  if (hours === '12') {
    hours = '00'
  }
  if (modifier.toLowerCase().trim().includes('pm')) {
    hours = Number.parseInt(hours, 10) + 12
  }
  return `${hours}:${minutes}`
}

export function getBrowserLocale(): string | undefined {
  try {
    if (typeof window === 'undefined') {
      return undefined
    }

    return window.navigator.language
  }
  catch (error) {
    throw new Error(`[MazInputPhoneNumber] (browserLocale) ${error}`)
  }
}

export async function fetchLocale(): Promise<string | undefined> {
  try {
    const reponse = await fetch('https://ipwho.is')
    const { country_code } = (await reponse.json()) as IpWhoResponse

    return country_code
  }
  catch (error) {
    console.error(`[maz-ui](MazPicker)(fetchCountryCode) ${error}`)
  }
}
