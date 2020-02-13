import MazBtn from '@/../packages/components/MazBtn'
import MazBtnGroup from '@/../packages/components/MazBtnGroup'
import MazCheckbox from '@/../packages/components/MazCheckbox'
import MazCollapse from '@/../packages/components/MazCollapse'
import MazDialog from '@/../packages/components/MazDialog'
import MazDropzone from '@/../packages/components/MazDropzone'
import MazFlex from '@/../packages/components/MazFlex'
import MazInput from '@/../packages/components/MazInput'
import MazLoader from '@/../packages/components/MazLoader'
import MazPagination from '@/../packages/components/MazPagination'
import MazPhoneNumberInput from '@/../packages/components/MazPhoneNumberInput'
import MazReadMore from '@/../packages/components/MazReadMore'
import MazResponsiveMenu from '@/../packages/components/MazResponsiveMenu'
import MazSelect from '@/../packages/components/MazSelect'
import MazSidebar from '@/../packages/components/MazSidebar'
import MazSpinner from '@/../packages/components/MazSpinner'
import MazSwitch from '@/../packages/components/MazSwitch'
import MazTransitionExpand from '@/../packages/components/MazTransitionExpand'
import { TabsBar as MazTabsBar, TabsContent as MazTabsContent, TabsContentItem as MazTabsContentItem } from '@/../packages/components/MazTabsLayout'

import { version } from '@/../package.json'

const components = [
  MazBtn,
  MazBtnGroup,
  MazCheckbox,
  MazCollapse,
  MazDialog,
  MazDropzone,
  MazFlex,
  MazInput,
  MazLoader,
  MazPagination,
  MazPhoneNumberInput,
  MazReadMore,
  MazResponsiveMenu,
  MazSelect,
  MazSwitch,
  MazSidebar,
  MazSpinner,
  MazTabsBar,
  MazTabsContent,
  MazTabsContentItem,
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
  MazDropzone,
  MazFlex,
  MazInput,
  MazLoader,
  MazPagination,
  MazPhoneNumberInput,
  MazReadMore,
  MazResponsiveMenu,
  MazSelect,
  MazSwitch,
  MazSidebar,
  MazSpinner,
  MazTabsBar,
  MazTabsContent,
  MazTabsContentItem,
  MazTransitionExpand
}

export default {
  version,
  install
}
