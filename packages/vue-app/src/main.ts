import { createApp } from 'vue'
import { installWait } from 'maz-ui/src/plugins/index.ts'
import { installToaster } from 'maz-ui/plugins/toaster'

import App from './App.vue'
import router from './router'

import 'maz-ui/tailwindcss/tailwind.css'
import './assets/main.css'

const app = createApp(App)

app.use(router)
app.use(installToaster)
app.use(installWait)

app.mount('#app')
