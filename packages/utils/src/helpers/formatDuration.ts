import { getBrowserLocale } from './getBrowserLocale.ts'

export type DurationInputUnit = 'second' | 'millisecond'

export type DurationStyle = 'long' | 'short' | 'narrow'

export interface FormatDurationOptions {
  /**
   * Any BCP 47 locale (e.g. `fr`, `en-US`, `ja`)
   * @default getBrowserLocale() ?? runtime locale
   */
  locale?: string
  /**
   * Unit of the value
   * @default 'second'
   */
  inputUnit?: DurationInputUnit
  /**
   * `long`: 3 minutes, `short`: 3 min, `narrow`: 3m (depends on the locale)
   * @default 'short'
   */
  style?: DurationStyle
  /**
   * Maximum number of units displayed, from the largest non-zero one (`2`: `1 h 02 min`, `1`: `1 h`)
   * @default 2
   */
  precision?: number
  /**
   * Pad the units after the first one on two digits (`3 min 05 s`)
   * @default true unless `style` is `long`
   */
  pad?: boolean
}

type DurationUnit = 'day' | 'hour' | 'minute' | 'second'

const UNITS: { unit: DurationUnit, seconds: number }[] = [
  { unit: 'day', seconds: 86_400 },
  { unit: 'hour', seconds: 3600 },
  { unit: 'minute', seconds: 60 },
  { unit: 'second', seconds: 1 },
]

let runtimeLocale: string | undefined

function format(locale: string, style: DurationStyle, unit: DurationUnit | 'millisecond', value: number, pad: boolean) {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    unitDisplay: style,
    minimumIntegerDigits: pad ? 2 : 1,
    maximumFractionDigits: 0,
  }).format(value)
}

function largestUnitIndex(seconds: number) {
  const index = UNITS.findIndex(({ seconds: unitSeconds }) => seconds >= unitSeconds)

  return index === -1 ? UNITS.length - 1 : index
}

/**
 * Format a duration with `Intl.NumberFormat`: `12 s`, `3 min 05 s`, `1 h 02 min`
 *
 * @example
 * formatDuration(185) // '3 min 05 sec'
 * formatDuration(185, { locale: 'fr' }) // '3 min 05 s'
 * formatDuration(1500, { inputUnit: 'millisecond' }) // '2 sec'
 */
export function formatDuration(value: number, options: FormatDurationOptions = {}): string {
  runtimeLocale ??= new Intl.DateTimeFormat().resolvedOptions().locale

  const {
    locale = getBrowserLocale() ?? runtimeLocale,
    inputUnit = 'second',
    style = 'short',
    precision = 2,
    pad = style !== 'long',
  } = options

  const milliseconds = Math.round(Math.abs(Number.isFinite(value) ? value : 0) * (inputUnit === 'second' ? 1000 : 1))
  const sign = value < 0 && milliseconds > 0 ? '-' : ''

  if (milliseconds < 1000 && (inputUnit === 'millisecond' || milliseconds > 0)) {
    return sign + format(locale, style, 'millisecond', milliseconds, false)
  }

  const maxUnits = Math.max(1, Math.floor(precision))
  let seconds = milliseconds / 1000
  let first = largestUnitIndex(seconds)
  let last = Math.min(first + maxUnits - 1, UNITS.length - 1)

  seconds = Math.round(seconds / UNITS[last].seconds) * UNITS[last].seconds
  first = largestUnitIndex(seconds)
  last = Math.min(first + maxUnits - 1, UNITS.length - 1)

  const amounts: { unit: DurationUnit, amount: number }[] = []
  let remaining = seconds

  for (let index = first; index <= last; index++) {
    const { unit, seconds: unitSeconds } = UNITS[index]
    const amount = Math.floor(remaining / unitSeconds)
    remaining -= amount * unitSeconds
    amounts.push({ unit, amount })
  }

  while (amounts.length > 1 && amounts.at(-1)?.amount === 0)
    amounts.pop()

  return sign + amounts
    .map(({ unit, amount }, index) => format(locale, style, unit, amount, pad && index > 0))
    .join(' ')
}
