import { pristine } from '@maz-ui/themes/presets'

import { fr } from '@maz-ui/translations'
import { AosPlugin } from 'maz-ui/src/plugins/aos.ts'
import { DialogPlugin } from 'maz-ui/src/plugins/dialog.ts'
import { MazUi } from 'maz-ui/src/plugins/maz-ui.ts'
import { ToastPlugin } from 'maz-ui/src/plugins/toast.ts'

import { WaitPlugin } from 'maz-ui/src/plugins/wait.js'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'maz-ui/src/css/index.css'

import 'maz-ui/src/tailwindcss/tailwind.css'
import './assets/main.css'

const app = createApp(App)

app.use(router)

app.use(MazUi, {
  theme: {
    preset: pristine,
    mode: 'both',
    darkModeStrategy: 'class',
    colorMode: 'auto',
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
