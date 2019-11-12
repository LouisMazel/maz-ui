import Vue from 'vue'
import App from './App.vue'
import './assets/scss/main.scss'
import './components'

import router from './router'

import VueMazelUi from './lib'

Vue.use(VueMazelUi)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
