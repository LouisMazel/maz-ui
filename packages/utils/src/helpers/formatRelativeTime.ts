import { formatDate } from './formatDate'
import { getBrowserLocale } from './getBrowserLocale'

export type RelativeTimeInput = Date | string | number

export type RelativeTimeUnit = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'

export type RelativeTimeKind = 'now' | 'relative' | 'absolute'

export type RelativeTimeFormat = 'relative' | 'compact'

export type RelativeTimeStyle = 'long' | 'short' | 'narrow'

export type RelativeTimeNumeric = 'always' | 'auto'

export interface RelativeTimeThresholds {
  /**
   * Number of seconds under which `now` is displayed (past and future)
   * @default 5
   */
  now?: number
  /**
   * Seconds are used while the delay is under this number of seconds
   * @default 60
   */
  second?: number
  /**
   * Minutes are used while the delay is under this number of minutes
   * @default 60
   */
  minute?: number
  /**
   * Hours are used while the delay is under this number of hours
   * @default 24
   */
  hour?: number
  /**
   * Days are used while the delay is under this number of days
   * @default 7
   */
  day?: number
  /**
   * Weeks are used while the delay is under this number of weeks
   * @default 4
   */
  week?: number
  /**
   * Months are used while the delay is under this number of months (30 days), years are used beyond
   * @default 12
   */
  month?: number
}

export interface RelativeTimeOptions {
  /**
   * Any BCP 47 locale (e.g. `fr`, `en-US`, `ja`)
   * @default getBrowserLocale() ?? runtime locale
   */
  locale?: string
  /**
   * Reference date (useful for tests and SSR)
   * @default Date.now()
   */
  now?: Date | number
  /**
   * `relative` returns a sentence (`3 minutes ago`, `in 2 days`), `compact` returns the bare quantity without
   * direction (`3 min`, `2 h`)
   * @default 'relative'
   */
  format?: RelativeTimeFormat
  /**
   * Length of the units
   * @default 'long' for the `relative` format, 'short' for the `compact` format
   */
  style?: RelativeTimeStyle
  /**
   * `auto` uses idiomatic words when they exist (`yesterday`, `tomorrow`), `always` always uses a number.
   * Only used by the `relative` format
   * @default 'auto'
   */
  numeric?: RelativeTimeNumeric
  /**
   * Thresholds used to choose the unit. A threshold set to `0` skips its unit
   */
  thresholds?: RelativeTimeThresholds
  /**
   * Delay in milliseconds (past or future) from which the absolute date is returned instead of a relative time
   * @default undefined (never)
   */
  absoluteAfter?: number
  /**
   * Options of `Intl.DateTimeFormat` used for the absolute date
   * @default formatDate defaults (`Feb 1, 2022`)
   */
  absoluteOptions?: Intl.DateTimeFormatOptions
}

export interface RelativeTimeResult {
  /** The formatted text */
  text: string
  /** `now`, `relative` (a unit was chosen) or `absolute` (the delay is over `absoluteAfter`) */
  kind: RelativeTimeKind
  /** The chosen unit, `null` when the kind is `now` or `absolute` */
  unit: RelativeTimeUnit | null
  /** Quantity of `unit`, negative in the past, positive in the future, `0` when the kind is `now` or `absolute` */
  value: number
  /** `true` when the date is after the reference date */
  isFuture: boolean
  /** The resolved date */
  date: Date
  /** The locale used to format */
  locale: string
  /** Milliseconds before `text` can change, `null` when it never changes */
  nextUpdateIn: number | null
}

const UNITS: RelativeTimeUnit[] = [
  'second',
  'minute',
  'hour',
  'day',
  'week',
  'month',
  'year',
]

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const UNIT_DURATION: Record<RelativeTimeUnit, number> = {
  second: SECOND,
  minute: MINUTE,
  hour: HOUR,
  day: DAY,
  week: 7 * DAY,
  month: 30 * DAY,
  year: 365 * DAY,
}

const DEFAULT_THRESHOLDS: Required<RelativeTimeThresholds> = {
  now: 5,
  second: 60,
  minute: 60,
  hour: 24,
  day: 7,
  week: 4,
  month: 12,
}

const MAX_CACHE_SIZE = 100

const intlCache = new Map<string, Intl.RelativeTimeFormat | Intl.NumberFormat>()

let runtimeLocale: string | undefined

function getRuntimeLocale() {
  runtimeLocale ??= new Intl.DateTimeFormat().resolvedOptions().locale
  return runtimeLocale
}

function getCachedIntl<T extends Intl.RelativeTimeFormat | Intl.NumberFormat>(key: string, create: () => T): T {
  const cached = intlCache.get(key)
  if (cached) {
    return cached as T
  }

  if (intlCache.size >= MAX_CACHE_SIZE) {
    intlCache.clear()
  }

  const instance = create()
  intlCache.set(key, instance)
  return instance
}

function getRelativeTimeFormat(locale: string, style: RelativeTimeStyle, numeric: RelativeTimeNumeric) {
  return getCachedIntl(
    `rtf|${locale}|${style}|${numeric}`,
    () => new Intl.RelativeTimeFormat(locale, { style, numeric }),
  )
}

function getUnitNumberFormat(locale: string, style: RelativeTimeStyle, unit: RelativeTimeUnit) {
  return getCachedIntl(
    `unit|${locale}|${style}|${unit}`,
    () => new Intl.NumberFormat(locale, { style: 'unit', unit, unitDisplay: style }),
  )
}

interface Band {
  unit: RelativeTimeUnit
  start: number
  end: number
}

function getBands(thresholds: Required<RelativeTimeThresholds>, nowLimit: number, absoluteLimit: number) {
  const bands: Band[] = []
  let start = nowLimit

  for (const unit of UNITS) {
    const limit = unit === 'year'
      ? Infinity
      : Math.max(0, thresholds[unit]) * UNIT_DURATION[unit]
    const end = Math.min(Math.max(start, limit), absoluteLimit)

    if (end > start) {
      bands.push({ unit, start, end })
      start = end
    }
  }

  return bands
}

function toTimestamp(date: RelativeTimeInput | null | undefined) {
  if (date === undefined || date === null) {
    throw new TypeError('The `date` attribute is required.')
  }

  const timestamp = date instanceof Date
    ? date.getTime()
    : new Date(date).getTime()

  if (Number.isNaN(timestamp)) {
    throw new TypeError(`The \`date\` attribute is not a valid date (${String(date)}).`)
  }

  return timestamp
}

function getDelay(diff: number, lower: number, upper: number) {
  if (diff <= 0) {
    const delay = Math.ceil(upper - Math.abs(diff))
    return Number.isFinite(delay)
      ? Math.max(1, delay)
      : null
  }

  return Math.max(1, Math.floor(diff - lower) + 1)
}

/**
 * Describe the delay between a date and a reference date: the formatted text, the chosen unit and the time
 * before the text changes (to refresh it at the right moment).
 * Everything is localized by `Intl`, no translation is embedded.
 *
 * @param date - Date, ISO string or timestamp
 * @param options - See `RelativeTimeOptions`
 */
export function getRelativeTime(date: RelativeTimeInput, options: RelativeTimeOptions = {}): RelativeTimeResult {
  try {
    const target = toTimestamp(date)
    const reference = options.now === undefined
      ? Date.now()
      : options.now instanceof Date
        ? options.now.getTime()
        : options.now

    if (Number.isNaN(reference)) {
      throw new TypeError('The `now` option is not a valid date.')
    }

    const locale = options.locale ?? getBrowserLocale() ?? getRuntimeLocale()
    const format = options.format ?? 'relative'
    const style = options.style ?? (format === 'compact'
      ? 'short'
      : 'long')
    const numeric = options.numeric ?? 'auto'
    const thresholds = {
      ...DEFAULT_THRESHOLDS,
      ...options.thresholds,
    }

    const diff = target - reference
    const distance = Math.abs(diff)
    const isFuture = diff > 0
    const resolvedDate = date instanceof Date
      ? date
      : new Date(target)

    const nowLimit = Math.max(0, thresholds.now) * SECOND
    const absoluteLimit = options.absoluteAfter === undefined
      ? Infinity
      : Math.max(0, options.absoluteAfter)

    const base = { isFuture, date: resolvedDate, locale }

    if (distance < nowLimit) {
      return {
        ...base,
        text: getRelativeTimeFormat(locale, style, 'auto').format(0, 'second'),
        kind: 'now',
        unit: null,
        value: 0,
        nextUpdateIn: Math.max(1, Math.ceil(diff + nowLimit)),
      }
    }

    const band = getBands(thresholds, nowLimit, absoluteLimit).find(({ end }) => distance < end)

    if (!band) {
      return {
        ...base,
        text: formatDate(target, locale, options.absoluteOptions),
        kind: 'absolute',
        unit: null,
        value: 0,
        nextUpdateIn: isFuture
          ? getDelay(diff, Math.max(absoluteLimit, nowLimit), Infinity)
          : null,
      }
    }

    const duration = UNIT_DURATION[band.unit]
    const quantity = Math.max(1, Math.floor(distance / duration))
    const value = isFuture
      ? quantity
      : -quantity

    const lower = quantity === 1
      ? band.start
      : Math.max(band.start, quantity * duration)
    const upper = Math.min(band.end, (quantity + 1) * duration)

    return {
      ...base,
      text: format === 'compact'
        ? getUnitNumberFormat(locale, style, band.unit).format(quantity)
        : getRelativeTimeFormat(locale, style, numeric).format(value, band.unit),
      kind: 'relative',
      unit: band.unit,
      value,
      nextUpdateIn: getDelay(diff, lower, upper),
    }
  }
  catch (error: unknown) {
    throw new Error(`[maz-ui](formatRelativeTime) ${error}`, { cause: error })
  }
}

/**
 * Format a date relatively to now (`3 minutes ago`, `in 2 days`, `yesterday`) with `Intl.RelativeTimeFormat`
 *
 * @param date - Date, ISO string or timestamp
 * @param options - See `RelativeTimeOptions`
 */
export function formatRelativeTime(date: RelativeTimeInput, options?: RelativeTimeOptions): string {
  return getRelativeTime(date, options).text
}
