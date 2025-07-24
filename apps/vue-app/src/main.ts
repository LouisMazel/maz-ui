import { mazUi } from '@maz-ui/themes/src/presets/index.ts'

import { AosPlugin } from 'maz-ui/src/plugins/aos.ts'
import { DialogPlugin } from 'maz-ui/src/plugins/dialog.ts'
import { MazUi } from 'maz-ui/src/plugins/maz-ui.ts'
import { ToastPlugin } from 'maz-ui/src/plugins/toast.ts'
import { WaitPlugin } from 'maz-ui/src/plugins/wait.js'
import PrimeVue from 'primevue/config'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import 'maz-ui/src/css/index.css'
import 'maz-ui/src/tailwindcss/tailwind.css'

import './assets/main.css'

const app = createApp(App)

app.use(router)
import { fr } from '@maz-ui/translations'

app.use(MazUi, {
  theme: {
    preset: mazUi,
    mode: 'both',
    colorMode: 'light',
  },
  translations: {
    locale: 'fr',
    fallbackLocale: 'it',
    preloadFallback: false,
    messages: {
      fr,
    },
  },
})

app.use(PrimeVue, {
  locale: {
    accept: 'Aceptar',
    reject: 'Rechazar',
  },
})
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
