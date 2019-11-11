import Vue from 'vue'
import App from './App.vue'
import './assets/scss/main.scss'

import VueMazelUi from './lib'

Vue.use(VueMazelUi)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
