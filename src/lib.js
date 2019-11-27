import MazBtn from '@/../packages/MazBtn'
import MazCheckbox from '@/../packages/MazCheckbox'
import MazDialog from '@/../packages/MazDialog'
import MazInput from '@/../packages/MazInput'
import MazLoader from '@/../packages/MazLoader'
import MazPhoneNumberInput from '@/../packages/MazPhoneNumberInput'
import MazSelect from '@/../packages/MazSelect'
import MazSidebar from '@/../packages/MazSidebar'
import MazSpinner from '@/../packages/MazSpinner'
import MazSwitch from '@/../packages/MazSwitch'
import MazTransitionExpand from '@/../packages/MazTransitionExpand'

import { version } from '@/../package.json'
import './theme'
import './utils/polyfill'
import '@/../packages/scss/style-helpers/index.scss'

const components = [
  MazBtn,
  MazCheckbox,
  MazDialog,
  MazInput,
  MazLoader,
  MazPhoneNumberInput,
  MazSelect,
  MazSwitch,
  MazSidebar,
  MazSpinner,
  MazTransitionExpand
]
// eslint-disable-next-line
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
  MazLoader,
  MazPhoneNumberInput,
  MazSelect,
  MazSwitch,
  MazSidebar,
  MazSpinner,
  MazTransitionExpand
}

export default {
  version,
  install
}
