import Vue from 'vue'
import App from './App.vue'
import './assets/scss/main.scss'
import './components'
import './filters'

import router from './router'

import VueMazelUi from './lib'
import VueHighlightJS from 'vue-highlightjs'

import javascript from 'highlight.js/lib/languages/javascript'
import bash from 'highlight.js/lib/languages/bash'

import 'highlight.js/styles/default.css'

Vue.use(VueHighlightJS, {
  languages: {
    javascript,
    bash
  }
})
Vue.use(VueMazelUi)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
