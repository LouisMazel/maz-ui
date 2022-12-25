import type { App } from 'vue'

import { capitalize } from './capitalize'
import { currency } from './currency'
import { date } from './date'
import { number } from './number'

const filters = {
  capitalize,
  currency,
  date,
  number,
}

export type Filters = typeof filters

const installFilters = {
  install(app: App) {
    app.provide('filters', filters)
  },
}

export { installFilters }

export * from './capitalize'
export * from './currency'
export * from './date'
export * from './number'
