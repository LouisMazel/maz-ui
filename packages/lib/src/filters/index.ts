import type { App } from 'vue'

import { camelCase } from './camelCase'
import { capitalize } from './capitalize'
import { currency } from './currency'
import { date } from './date'
import { number } from './number'
import { pascalCase } from './pascalCase'

const filters = {
  capitalize,
  camelCase,
  currency,
  date,
  number,
  pascalCase,
}

export type Filters = typeof filters

const installFilters = {
  install(app: App) {
    app.provide('filters', filters)
  },
}

export { installFilters }

export * from './camelCase'
export * from './capitalize'
export * from './currency'
export * from './date'
export * from './number'
export * from './pascalCase'
