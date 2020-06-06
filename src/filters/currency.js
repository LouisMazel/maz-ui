import { getCurrency } from '@/services/NumberAndCurrencyFormatter'

export default (number, currency, locale, round = false) => {
  if (typeof number === 'undefined')
    throw new Error('The `number` attribute is required.')
  if (typeof currency === 'undefined')
    throw new Error('The `currency` attribute is required.')
  if (typeof locale === 'undefined')
    throw new Error('The `locale` attribute is required.')

  return getCurrency(number, locale, currency, round)
}
