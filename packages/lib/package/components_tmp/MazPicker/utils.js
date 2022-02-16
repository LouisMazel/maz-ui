import Vue from 'vue'
import moment from 'moment'
import capitalizeText from './../../filters/capitalize'

export const getDefaultLocale = () => {
  if (typeof window === 'undefined') return 'en'

  const { userLanguage, language } = window.navigator
  const locale = (userLanguage || language || 'en').substr(0, 2)
  return locale
}

export const EventBus = new Vue()

export const checkIfTargetIsAllowedToCloseComponent = (
  classesArray,
  target,
) => {
  if (!target) return false
  return classesArray.some((classes) =>
    classes.every((c) => (target.classList ?? []).contains(c)),
  )
}

export const hasDateBetweenMinMaxDate = (date, minDate, maxDate, range) => {
  return {
    isBefore: (range ? date.start : date).isBefore(minDate),
    isAfter: (range ? date.end : date).isAfter(maxDate),
  }
}

export const forceUpdateComputedData = () => 'updated'

export const getDateMoment = (value, format, range) => {
  if (range) {
    if (typeof value === 'string')
      throw new Error(
        "[MazPicker] range mode is enable: value must be an object like this '{ start: null, end: null }' or 'null'",
      )
    return {
      start: value && value.start ? moment(value.start, format) : null,
      end: value && value.end ? moment(value.end, format) : null,
    }
  } else {
    return value ? moment(value, format) : null
  }
}

export const getFormattedValue = (value, format, formatted, range) => {
  const formatValue = (v) => capitalizeText(moment(v, format).format(formatted))
  return range && value
    ? value.start || value.end
      ? `${value.start ? formatValue(value.start) : '...'} - ${
          value.end ? formatValue(value.end) : '...'
        }`
      : null
    : value
    ? formatValue(value)
    : null
}

const DEFAULT_FORMAT_OPTIONS = {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
}

export const getFormattedValuesIntl = (payload = {}) => {
  const {
    locale = 'en',
    opts = DEFAULT_FORMAT_OPTIONS,
    dates = [new Date()],
  } = payload
  return dates
    .map((d) =>
      d
        ? capitalizeText(new Intl.DateTimeFormat(locale, opts).format(d))
        : '...',
    )
    .join(' - ')
}

export const ArrayHourRange = (
  start,
  end,
  twoDigit,
  isAfternoon,
  disabledHours,
) => {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => {
      const n = start + idx
      const number = !isAfternoon ? n : n + 12
      return {
        value: number,
        item: (twoDigit && n < 10 ? '0' : '') + n,
        disabled: disabledHours.includes(number),
      }
    })
}

export const ArrayMinuteRange = (
  start,
  end,
  twoDigit,
  step = 1,
  disabledMinutes,
) => {
  const len = Math.floor(end / step) - start

  return Array(len)
    .fill()
    .map((_, idx) => {
      const number = start + idx * step
      const txtMinute = (twoDigit && number < 10 ? '0' : '') + number
      return {
        value: number,
        item: txtMinute,
        disabled: disabledMinutes.includes(number),
      }
    })
}

export const debounce = (fn, time) => {
  let timeout

  return function () {
    const functionCall = () => fn.apply(this, arguments)
    clearTimeout(timeout)
    timeout = setTimeout(functionCall, time)
  }
}

export const getTimeFormat = (format) => {
  const hasTime = format.includes('T')
  return hasTime ? format.split('T')[1] : format.split(' ').slice(1).join(' ')
}

export const scrollSmoothElement = (
  elem,
  parentHeight,
  hasSmoothEffect,
  itemHeight = 28,
) => {
  if (!elem) return
  const selected = elem.querySelector('.time-picker__column__item.maz-active')
  if (selected) {
    const boundsSelected = selected.getBoundingClientRect()
    const boundsElem = elem.getBoundingClientRect()
    if (boundsSelected && boundsElem) {
      const scrollValue =
        itemHeight / 2 + boundsSelected.top - boundsElem.top - parentHeight / 2
      elem.scrollBy({
        top: scrollValue,
        behavior: hasSmoothEffect ? 'smooth' : 'auto',
      })
    }
  }
}

export const findNearestNumberInList = (list, number) => {
  const closest = list.reduce((prev, curr) => {
    return Math.abs(curr - number) < Math.abs(prev - number) ? curr : prev
  })

  return closest
}

export const getValue = (scroll, itemHeight = 28) => {
  const scrollTop = scroll?.target?.scrollTop ?? 0
  return Math.round(scrollTop / itemHeight)
}
