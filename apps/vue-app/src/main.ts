import { mazUi, MazUiTheme } from 'maz-ui/themes'

import { fr, MazUiTranslations } from 'maz-ui/translations'
import { AosPlugin } from 'maz-ui/plugins/aos'
import { DialogPlugin } from 'maz-ui/plugins/dialog'
import { ToastPlugin } from 'maz-ui/plugins/toast'

import { WaitPlugin } from 'maz-ui/plugins/wait'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'maz-ui/styles'

import 'maz-ui/src/tailwindcss/tailwind.css'
import './assets/main.css'

const app = createApp(App)

app.use(router)

app.use(MazUiTranslations, {
  locale: 'fr',
  fallbackLocale: 'en',
  preloadFallback: false,
  messages: {
    fr,
  },
})

app.use(MazUiTheme, {
  preset: mazUi,
  overrides: {
    colors: {
      light: {
        primary: '272 99% 54%',
        destructive: '357 96% 58%',
      }
    }
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
