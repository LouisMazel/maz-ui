import MazBtn from '@/../packages/MazBtn/index.js'
import MazInput from '@/../packages/MazInput/index.js'
import MazLoader from '@/../packages/MazLoader/index.js'
import MazSidebar from '@/../packages/MazSidebar/index.js'
import MazSpinner from '@/../packages/MazSpinner/index.js'
import MazSwitch from '@/../packages/MazSwitch/index.js'

import { version } from '@/../package.json'
import './theme'

const components = [
  MazBtn,
  MazInput,
  MazSwitch,
  MazSidebar,
  MazSpinner,
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
  MazBtn,
  MazInput,
  MazSwitch,
  MazSidebar,
  MazSpinner,
  MazLoader
}

export default {
  version,
  install
}
