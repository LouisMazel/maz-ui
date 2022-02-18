import Moment from 'moment'
import { extendMoment } from 'moment-range'
import capitalize from './../../../filters/capitalize'

const moment = extendMoment(Moment)

export default class Month {
  constructor(month, year) {
    this.start = moment([year, month])
    this.end = this.start.clone().endOf('month')
    this.startNextMonth = this.start.clone().add(1, 'M')
    this.endNextMonth = this.start.clone().add(1, 'M').endOf('month')
    this.startPreviousMonth = this.start.clone().subtract(1, 'M')
    this.endPreviousMonth = this.start.clone().subtract(1, 'M').endOf('month')
    this.month = month
    this.year = year
  }

  getWeekStart() {
    return this.start.weekday()
  }

  getFormatted() {
    return capitalize(this.start.format('MMMM'))
  }

  getYear() {
    return this.start.format('YYYY')
  }

  getWeeks() {
    return this.end.week() - this.start.week() + 1
  }

  getMonthDays() {
    const r1 = moment.range(this.start, this.end).by('days')
    return Array.from(r1)
  }

  getPreviousMonthDays() {
    const r1 = moment
      .range(this.startPreviousMonth, this.endPreviousMonth)
      .by('days')
    const results = Array.from(r1)
    return results.slice(results.length - this.getWeekStart(), results.length)
  }

  getNextMonthDays() {
    const totalDaysLength = this.getWeekStart() + this.getMonthDays().length
    const numberRestDays =
      totalDaysLength > 35 ? 42 - totalDaysLength : 35 - totalDaysLength
    const r1 = moment.range(this.startNextMonth, this.endNextMonth).by('days')
    const results = Array.from(r1)
    return results.slice(0, numberRestDays)
  }
}

export const getWeekDays = (locale = 'en', firstDay = null) => {
  const firstDayNumber =
    firstDay === 0 ? 7 : firstDay || moment.localeData(locale).firstDayOfWeek()
  let days = moment.weekdaysShort()
  const keep = days.splice(firstDayNumber)
  const stay = days
  days = keep.concat(stay)
  return days.map((d) => capitalize(d))
}

export const getMonthsByFormat = (format) => {
  return Array.apply(0, Array(12)).map((_, i) =>
    capitalize(moment().month(i).format(format)),
  )
}
