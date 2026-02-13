import { AosPlugin, DialogPlugin, ToastPlugin, WaitPlugin } from 'maz-ui/plugins'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'maz-ui/src/css/index.css'

import 'maz-ui/src/tailwindcss/tailwind.css'
import './assets/main.css'

const app = createApp(App)

app.use(router)

app.use(ToastPlugin)
app.use(WaitPlugin)
app.use(DialogPlugin)
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
