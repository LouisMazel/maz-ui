const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
}

export const date = (
  date: string | number,
  locale: string,
  options?: Intl.DateTimeFormatOptions,
): string => {
  if (typeof locale === 'undefined')
    throw new TypeError('[FilterDate] The `locale` attribute is required.')
  if (typeof locale !== 'string')
    throw new TypeError('[FilterDate] The `locale` attribute must be a string.')

  const options_ = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  try {
    return new Intl.DateTimeFormat(locale, options_).format(new Date(date))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(`[FilterDate] ${error}`)
  }
}
