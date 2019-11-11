import MazInput from './packages/MazInput/index.js'
import MazCheckbox from './packages/MazCheckbox/index.js'

import { version } from './../package.json'
import './theme'

const components = [
  MazInput,
  MazCheckbox
]

const install = (Vue, opts = {}) => {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export {
  version,
  MazInput,
  MazCheckbox
}

export default {
  version,
  install
}
