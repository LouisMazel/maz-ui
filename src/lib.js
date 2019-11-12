import MazInput from '@/../packages/MazInput/index.js'
import MazSwitch from '@/../packages/MazSwitch/index.js'
import MazLoader from '@/../packages/MazLoader/index.js'
import MazSidebar from '@/../packages/MazSidebar/index.js'

import { version } from '@/../package.json'
import './theme'

const components = [
  MazInput,
  MazSwitch,
  MazSidebar,
  MazLoader
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
  MazSwitch,
  MazSidebar,
  MazLoader
}

export default {
  version,
  install
}
