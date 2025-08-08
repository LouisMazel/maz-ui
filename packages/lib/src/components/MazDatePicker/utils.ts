import type { MazTranslationsNestedSchema } from '@maz-ui/translations'
import type { ConfigType, OpUnitType } from 'dayjs'
import type { MazDatePickerPartialRangeValue, MazDatePickerValue } from './types'

import { capitalize } from '@maz-ui/utils/helpers/capitalize'
import { formatDate } from '@maz-ui/utils/helpers/formatDate'
import dayjs from 'dayjs'
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
  const formattedDate = value ? formatDate(value, locale, options) : undefined
  return formattedDate ? capitalize(formattedDate) : undefined
}

export function getRangeFormattedDate({
  value,
  locale,
  options,
}: {
  value: MazDatePickerPartialRangeValue
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
    const dayName = formatDate(day, locale, { weekday: 'short' })

    if (dayName) {
      days.push(dayName)
    }
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

export function getRangeISODate(value?: MazDatePickerPartialRangeValue, format = 'YYYY-MM-DD') {
  if (!value) {
    return undefined
  }

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
  minMaxAuto,
}: {
  value: string | undefined
  minDate: string | undefined
  maxDate: string | undefined
  format: string
  minMaxAuto: boolean
}): CheckValueResponse {
  if (!minMaxAuto) {
    return {
      newValue: value,
      newCurrentDate: value,
    }
  }

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

export function scrollToTarget(scrollContainer: HTMLElement, target: HTMLElement, offset = 0, hasSmoothEffect = true) {
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

export function isRangeValue(value: MazDatePickerValue): value is MazDatePickerPartialRangeValue {
  return !!value && typeof value === 'object'
}

export function isValidDate(value: unknown): value is ConfigType {
  return !!value && (typeof value === 'string' || typeof value === 'number' || value instanceof Date) && dayjs(value).isValid()
}

export function getDefaultsShortcuts(t: MazTranslationsNestedSchema['datePicker']['shortcuts']) {
  return [
    {
      label: t.lastSevenDays,
      identifier: 'last7Days',
      value: {
        start: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
        end: dayjs().format('YYYY-MM-DD'),
      },
    },
    {
      label: t.lastThirtyDays,
      identifier: 'last30Days',
      value: {
        start: dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
        end: dayjs().format('YYYY-MM-DD'),
      },
    },
    {
      label: t.thisWeek,
      identifier: 'thisWeek',
      value: {
        start: dayjs().startOf('week').format('YYYY-MM-DD'),
        end: dayjs().endOf('week').format('YYYY-MM-DD'),
      },
    },
    {
      label: t.lastWeek,
      identifier: 'lastWeek',
      value: {
        start: dayjs().subtract(1, 'week').startOf('week').format('YYYY-MM-DD'),
        end: dayjs().subtract(1, 'week').endOf('week').format('YYYY-MM-DD'),
      },
    },
    {
      label: t.thisMonth,
      identifier: 'thisMonth',
      value: {
        start: dayjs().set('date', 1).format('YYYY-MM-DD'),
        end: dayjs().set('date', dayjs().daysInMonth()).format('YYYY-MM-DD'),
      },
    },
    {
      label: t.thisYear,
      identifier: 'thisYear',
      value: {
        start: dayjs().startOf('year').format('YYYY-MM-DD'),
        end: dayjs().endOf('year').format('YYYY-MM-DD'),
      },
    },
    {
      label: t.lastYear,
      identifier: 'lastYear',
      value: {
        start: dayjs().subtract(1, 'year').startOf('year').format('YYYY-MM-DD'),
        end: dayjs().subtract(1, 'year').endOf('year').format('YYYY-MM-DD'),
      },
    },
  ]
}
