import { mazUi } from '@maz-ui/themes'
import { en } from '@maz-ui/translations/locales'
import { MazUi } from 'maz-ui/plugins/maz-ui'
import { createApp } from 'vue'
import App from './App.vue'
import 'maz-ui/style.css'
import './style.css'

const app = createApp(App)

app.use(MazUi, {
  theme: { preset: mazUi },
  translations: { messages: { en } },
})

app.mount('#app')
