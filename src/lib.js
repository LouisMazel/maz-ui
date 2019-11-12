import MazBtn from '@/../packages/MazBtn/index.js'
import MazCheckbox from '@/../packages/MazCheckbox/index.js'
import MazDialog from '@/../packages/MazDialog/index.js'
import MazInput from '@/../packages/MazInput/index.js'
import MazLoader from '@/../packages/MazLoader/index.js'
import MazSidebar from '@/../packages/MazSidebar/index.js'
import MazSpinner from '@/../packages/MazSpinner/index.js'
import MazSwitch from '@/../packages/MazSwitch/index.js'
import MazTransitionExpand from '@/../packages/MazTransitionExpand/index.js'

import { version } from '@/../package.json'
import './theme'

const components = [
  MazBtn,
  MazCheckbox,
  MazDialog,
  MazInput,
  MazSwitch,
  MazSidebar,
  MazSpinner,
  MazLoader,
  MazTransitionExpand
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
  MazCheckbox,
  MazDialog,
  MazInput,
  MazSwitch,
  MazSidebar,
  MazSpinner,
  MazLoader,
  MazTransitionExpand
}

export default {
  version,
  install
}
