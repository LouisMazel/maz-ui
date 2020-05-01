import Vue from 'vue'
import moment from 'moment'

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
      start: value && value.start ? moment(value.start, format) : moment(),
      end: value && value.end ? moment(value.end, format) : moment()
    }
  } else {
    return value ? moment(value, format) : moment()
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
