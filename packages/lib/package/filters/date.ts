const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
}

export const date = (
  date: string | number | Date,
  locale: string,
  options?: Intl.DateTimeFormatOptions,
): string => {
  if (typeof locale === 'undefined') {
    throw new TypeError(
      '[maz-ui](FilterDate) The `locale` attribute is required.',
    )
  }
  if (typeof locale !== 'string') {
    throw new TypeError(
      '[maz-ui](FilterDate) The `locale` attribute must be a string.',
    )
  }

  const { timeZone: defaultTimeZone, ...rest } = DEFAULT_OPTIONS
  const hasOnlyTimeZone = !!(
    (options && Object.keys(options).length === 1 && options.timeZone) ||
    !options
  )

  const opts = {
    timeZone: options?.timeZone ?? defaultTimeZone,
    ...(!hasOnlyTimeZone ? options : rest),
  }

  try {
    const usedDate = date instanceof Date ? date : new Date(date)

    const result = new Intl.DateTimeFormat(locale, opts).format(usedDate)

    return result
  } catch (error: unknown) {
    throw new Error(`[maz-ui](FilterDate) ${error}`)
  }
}
