import type { MazTranslationsOptions } from '@maz-ui/translations/src/types.js'

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

app.use(MazUi, {
  theme: {
    strategy: 'hybrid',
    darkModeStrategy: 'class',
    preset: 'ocean',
  },
  translations: {
    locale: 'en',
    fallbackLocale: 'it',
    preloadFallback: true,
  } satisfies MazTranslationsOptions,
})

app.use(router)
app.use(ToastPlugin)
app.use(WaitPlugin)
app.use(DialogPlugin)

app.mount('#app')
