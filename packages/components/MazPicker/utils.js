import Vue from 'vue'
import moment from 'moment'
import capitalizeText from './../../../src/filters/capitalize'

export const getDefaultLocale = () => {
  if (typeof window === 'undefined') return null

  const { userLanguage, language } = window.navigator
  const locale = (userLanguage || language || 'en').substr(0, 2)
  return locale
}

export const EventBus = new Vue()

export const checkIfTargetIsAllowedToCloseComponent = (classesArray, target) => {
  // if (!target) return false
  classesArray.some(classes =>
    classes.every(c =>
      (target.classList ?? []).contains(c)
    )
  )
}

export const hasDateBetweenMinMaxDate = (date, minDate, maxDate, range) => {
  return {
    isBefore: (range ? date.start : date).isBefore(minDate),
    isAfter: (range ? date.end : date).isAfter(maxDate)
  }
}

export const updateComputedDataWithProps = () => 'updated'

export const getDateMoment = (value, format, range) => {
  if (range) {
    if (typeof value === 'string') throw new Error(`[MazPicker] range mode is enable: value must be an object like this '{ start: null, end: null }' or 'null'`)
    return {
      start: value && value.start ? moment(value.start, format) : null,
      end: value && value.end ? moment(value.end, format) : null
    }
  } else {
    return value ? moment(value, format) : null
  }
}

export const getFormattedValue = (value, format, formatted, range) => {
  if (range && value) {
    return `${value.start ? moment(value.start, format).format(formatted) : '...'} - ${value.end ? moment(value.end, format).format(formatted) : '...'}`
  } else if (value) {
    return value ? moment(value, format).format(formatted) : null
  } else {
    return null
  }
}

const DEFAULT_FORMAT_OPTIONS = {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
}

export const getFormattedValuesIntl = (payload = {}) => {
  const {
    locale = 'en',
    opts = DEFAULT_FORMAT_OPTIONS,
    dates = [new Date()]
  } = payload
  const filteredDates = dates.filter(d => d)
  return filteredDates.map(d => d ? capitalizeText(new Intl.DateTimeFormat(locale, opts).format(d)) : null).join(' - ')
}
