import { formatCurrency } from '../formatCurrency'

describe('formatCurrency', () => {
  it('formats a number as a currency', () => {
    expect(formatCurrency(123.45, 'en-US', { currency: 'USD' })).toBe('$123.45')
  })

  it('rounds the number if the round option is set', () => {
    expect(formatCurrency(123.45, 'en-US', { currency: 'USD', round: true })).toBe('$123')
  })

  it('throws an error if the number attribute is not provided', () => {
    // @ts-expect-error - test case
    expect(() => formatCurrency(undefined, 'en-US', { currency: 'USD' })).toThrow(
      '[maz-ui](FilterCurrency) The `number` attribute is required.',
    )
  })

  it('throws an error if the locale attribute is not provided', () => {
    // @ts-expect-error - test case
    expect(() => formatCurrency(123.45, undefined, { currency: 'USD' })).toThrow(
      '[maz-ui](FilterCurrency) The `locale` attribute is required.',
    )
  })

  it('throws an error if the locale attribute is not a string', () => {
    // @ts-expect-error - test case
    expect(() => formatCurrency(123.45, 123, { currency: 'USD' })).toThrow(
      '[maz-ui](FilterCurrency) The `locale` attribute must be a string.',
    )
  })

  it('throws an error if the options.currency attribute is not provided', () => {
    expect(() => formatCurrency(123.45, 'en-US', { round: true })).toThrow(
      '[maz-ui](FilterCurrency) The `options.currency` attribute is required.',
    )
  })
})
