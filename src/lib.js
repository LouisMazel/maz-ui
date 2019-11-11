import ButtonCount from './components/ButtonCount'

export default {
  install (Vue, options) {
    if (!options || !options.store) {
      throw new Error('Please initialise plugin with a Vuex store.')
    }

    Vue.component('dummy-button', ButtonCount)
  }
}
