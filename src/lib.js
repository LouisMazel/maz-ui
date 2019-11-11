import ButtonCount from './components/ButtonCount/index.js'
import { version } from './../package.json'

const components = [
  ButtonCount
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
  ButtonCount
}

export default {
  version,
  install
}
