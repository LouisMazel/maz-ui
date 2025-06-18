import { formatDate } from '@formatters/formatDate'

describe('formatDate', () => {
  it('formats a date string as a short date', () => {
    expect(formatDate('2022-01-01', 'en-US')).toEqual('Jan 1, 2022')
  })

  it('formats a Date object as a short date', () => {
    expect(formatDate(new Date('2022-01-01'), 'en-US')).toEqual('Jan 1, 2022')
  })

  it('throws an error if the locale is not provided', () => {
    // @ts-expect-error - test case
    expect(() => formatDate('2022-01-01', undefined)).toThrow(
      '[maz-ui](FilterDate) The `locale` attribute is required.',
    )
  })

  it('throws an error if the locale is not a string', () => {
    // @ts-expect-error - test case
    expect(() => formatDate('2022-01-01', 123)).toThrow(
      '[maz-ui](FilterDate) The `locale` attribute must be a string.',
    )
  })

  it('throws an error if the date is invalid', () => {
    expect(() => formatDate('invalid date', 'en-US')).toThrow(
      '[maz-ui](FilterDate) RangeError: Invalid time value',
    )
  })
})
