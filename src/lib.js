import ButtonCount from './components/ButtonCount/index.js'

const components = [
  ButtonCount
]

const install = (Vue, opts = {}) => {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  ButtonCount
}
