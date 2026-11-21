import { AosPlugin } from 'maz-ui/plugins/aos'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './tailwind.css'

const app = createApp(App)

app.use(router)

app.use(AosPlugin, {
  animation: {
    duration: 1000,
    once: false,
    delay: 0,
  },
  delay: 100,
  router,
})

app.mount('#app')
