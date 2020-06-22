import 'core-js/es/array/find'
import 'core-js/es/array/from'
import 'core-js/es/array/fill'
import 'core-js/es/array/find-index'
import 'core-js/es/object/assign'
// import 'core-js/es/object/keys'
import 'core-js/es/array/keys'

import Vue from 'vue'
import App from './App.vue'

import router from './router'

import './plugins'
import './components'
import './filters'
import './assets/scss/main.scss'

import store from './store'

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
