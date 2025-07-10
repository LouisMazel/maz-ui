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
    messages: {
      it: {
        pagination: {
          navAriaLabel: 'Paginazione',
          screenReader: {
            firstPage: 'Prima pagina',
            previousPage: 'Pagina precedente',
            page: 'Pagina {page}',
            nextPage: 'Pagina successiva',
            lastPage: 'Ultima pagina',
          },
        },
      },
    },
  },
})

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
