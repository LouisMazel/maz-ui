import { createApp } from 'vue'
import { installWait, installToaster } from 'maz-ui/src/plugins/index.ts'

import App from './App.vue'
import router from './router'

import 'maz-ui/tailwindcss/tailwind.css'
import './assets/main.css'

const app = createApp(App)

app.use(router)
app.use(installToaster)
app.use(installWait)

app.mount('#app')
