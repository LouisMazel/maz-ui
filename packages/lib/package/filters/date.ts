const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
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

  const opts = options ?? DEFAULT_OPTIONS

  try {
    const usedDate = date instanceof Date ? date : new Date(date)

    const result = new Intl.DateTimeFormat(locale, opts).format(usedDate)

    return result
  } catch (error: unknown) {
    throw new Error(`[maz-ui](FilterDate) ${error}`)
  }
}
