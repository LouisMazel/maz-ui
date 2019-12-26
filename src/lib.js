import '../packages/scss/style-helpers/index.scss'
import '../packages/scss/components/index.scss'

import MazBtn from '@/../packages/components/MazBtn'
import MazBtnGroup from '@/../packages/components/MazBtnGroup'
import MazCheckbox from '@/../packages/components/MazCheckbox'
import MazCollapse from '@/../packages/components/MazCollapse'
import MazDialog from '@/../packages/components/MazDialog'
import MazFlex from '@/../packages/components/MazFlex'
import MazInput from '@/../packages/components/MazInput'
import MazLoader from '@/../packages/components/MazLoader'
import MazPagination from '@/../packages/components/MazPagination'
import MazPhoneNumberInput from '@/../packages/components/MazPhoneNumberInput'
import MazSelect from '@/../packages/components/MazSelect'
import MazSidebar from '@/../packages/components/MazSidebar'
import MazSpinner from '@/../packages/components/MazSpinner'
import MazSwitch from '@/../packages/components/MazSwitch'
import MazTransitionExpand from '@/../packages/components/MazTransitionExpand'

import { version } from '@/../package.json'

const components = [
  MazBtn,
  MazBtnGroup,
  MazCheckbox,
  MazCollapse,
  MazDialog,
  MazFlex,
  MazInput,
  MazLoader,
  MazPagination,
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
  MazBtnGroup,
  MazCheckbox,
  MazCollapse,
  MazDialog,
  MazFlex,
  MazInput,
  MazLoader,
  MazPagination,
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
