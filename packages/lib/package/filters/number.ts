const DEFAULT_OPTIONS: Intl.NumberFormatOptions = {
  minimumFractionDigits: 2,
}

export const number = (
  number: number | string,
  locale: string,
  options?: Intl.NumberFormatOptions,
): string => {
  const filterOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  if (number === undefined) {
    throw new TypeError('[maz-ui](FilterNumber) The `number` attribute is required.')
  }
  if (locale === undefined) {
    throw new TypeError('[maz-ui](FilterNumber) The `locale` attribute is required.')
  }
  if (typeof locale !== 'string') {
    throw new TypeError('[maz-ui](FilterNumber) The `locale` attribute must be a string.')
  }

  try {
    return new Intl.NumberFormat(locale, filterOptions).format(Number(number))
  } catch (error) {
    throw new Error(`[maz-ui](FilterNumber) ${error}`)
  }
}
