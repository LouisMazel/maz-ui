import Vue from 'vue'

import currency from './currency'
import capitalize from './capitalize'
import uppercase from './uppercase'
import kebab from './kebab'
// import telephone from './telephone'

const filters = {
  currency,
  capitalize,
  // telephone,
  uppercase,
  kebab
}

Object.keys(filters).forEach((filter) => {
  Vue.filter(filter, filters[filter])
})
