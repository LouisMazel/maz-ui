export interface ParsedTime {
  hours: number
  minutes: number
}

const TIME_REGEX = /^([01]?\d|2[0-3]):([0-5]\d)$/

export function parseTime(value?: string | null): ParsedTime | undefined {
  const match = value ? TIME_REGEX.exec(value.trim()) : null

  return match ? { hours: Number(match[1]), minutes: Number(match[2]) } : undefined
}

export function pad(value: number) {
  return String(value).padStart(2, '0')
}

export function toTime(hours: number, minutes: number) {
  return `${pad(hours)}:${pad(minutes)}`
}

export function toMinutes(value: string) {
  const parsed = parseTime(value)

  return parsed ? parsed.hours * 60 + parsed.minutes : Number.NaN
}

export function normalizeTime(value?: string | null) {
  const parsed = parseTime(value)

  return parsed ? toTime(parsed.hours, parsed.minutes) : undefined
}

export function uses12Hours(locale?: string) {
  try {
    const { hourCycle, hour12 } = new Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions()

    return hour12 ?? (hourCycle === 'h12' || hourCycle === 'h11')
  }
  catch {
    return false
  }
}

export function formatTime(value: string, locale: string | undefined, hour12: boolean) {
  const parsed = parseTime(value)

  if (!parsed)
    return value

  try {
    return new Intl.DateTimeFormat(locale, { hour: hour12 ? 'numeric' : '2-digit', minute: '2-digit', hour12 })
      .format(new Date(2000, 0, 1, parsed.hours, parsed.minutes))
  }
  catch {
    return value
  }
}

export function getPeriodLabels(locale: string | undefined): [string, string] {
  const fallback: [string, string] = ['AM', 'PM']

  try {
    const formatter = new Intl.DateTimeFormat(locale, { hour: 'numeric', hour12: true })
    const read = (hours: number) => formatter
      .formatToParts(new Date(2000, 0, 1, hours))
      .find(part => part.type === 'dayPeriod')
      ?.value

    return [read(1) ?? fallback[0], read(13) ?? fallback[1]]
  }
  catch {
    return fallback
  }
}

export function buildSlots(min: string, max: string, step: number) {
  const start = Number.isNaN(toMinutes(min)) ? 0 : toMinutes(min)
  const end = Number.isNaN(toMinutes(max)) ? 1439 : toMinutes(max)
  const safeStep = Math.max(1, Math.floor(step) || 1)
  const slots: string[] = []

  for (let current = start; current <= end; current += safeStep)
    slots.push(toTime(Math.floor(current / 60), current % 60))

  return slots
}
