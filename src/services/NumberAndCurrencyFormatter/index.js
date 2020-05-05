/**
 * Created by Mazel on 29/06/2017.
 */

export const getNumber = (number, local) => {
  return new Intl.NumberFormat(local).format(number)
}

export const getCurrency = (number, local, currencyString, round) => {
  let numberToFormat = number / 100
  let numberOfDecimal = 2
  if (round) {
    numberToFormat = Math.floor(numberToFormat)
    numberOfDecimal = 0
  }
  return new Intl.NumberFormat(local, {
    style: 'currency',
    currency: currencyString || 'EUR',
    minimumFractionDigits: numberOfDecimal
  }).format(numberToFormat)
}
