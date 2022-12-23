export interface FilterCurrencyOptions extends Intl.NumberFormatOptions {
  round?: boolean
}

const DEFAULT_OPTIONS: FilterCurrencyOptions = {
  style: 'currency',
  minimumFractionDigits: 2,
  round: false,
}

const getFormattedCurrency = (
  number: number | string,
  locale: string,
  options: FilterCurrencyOptions,
) => {
  let numberToFormat = Number(number)

  if (options.round) {
    numberToFormat = Math.floor(numberToFormat)
    options.minimumFractionDigits = 0
  }

  return new Intl.NumberFormat(locale, options).format(numberToFormat)
}

const validRequiredAttributes = (
  number: number | string,
  locale: string,
  options: FilterCurrencyOptions,
) => {
  if (number === undefined)
    throw new TypeError('[maz-ui](FilterCurrency) The `number` attribute is required.')
  if (locale === undefined)
    throw new TypeError('[maz-ui](FilterCurrency) The `locale` attribute is required.')
  if (typeof locale !== 'string')
    throw new TypeError('[maz-ui](FilterCurrency) The `locale` attribute must be a string.')
  if (options.currency === undefined)
    throw new TypeError('[maz-ui](FilterCurrency) The `options.currency` attribute is required.')
}

export const currency = (
  number: number | string,
  locale: string,
  options: FilterCurrencyOptions,
): string => {
  const options_: FilterCurrencyOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  validRequiredAttributes(number, locale, options_)

  try {
    return getFormattedCurrency(number, locale, options_)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(`[maz-ui](FilterCurrency) ${error}`)
  }
}
