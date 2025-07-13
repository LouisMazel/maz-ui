import { pristine } from '@maz-ui/themes/src/presets/pristine.js'

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
    strategy: 'runtime',
    darkModeStrategy: 'class',
    preset: pristine,
  },
  translations: {
    locale: 'de',
    preloadFallback: true,
    fallbackLocale: 'it',
    messages: {
      de: () => import('./locales/de').then(r => r.default),
      it: () => import('./locales/it.json'),
      en: {
        pagination: {
          navAriaLabel: 'Test',
        },
      },
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
