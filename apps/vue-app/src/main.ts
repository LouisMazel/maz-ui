import { definePreset, mazUi } from '@maz-ui/themes'
import { MazUi, ToasterPlugin, WaitPlugin } from 'maz-ui/src/plugins/index.ts'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import 'maz-ui/tailwindcss/tailwind.css'
import './assets/main.css'

const app = createApp(App)

const customPreset = definePreset({
  base: mazUi,
  overrides: {
    name: 'custom',
    appearance: {
      'font-family': 'inter, sans-serif',
      radius: '0.5rem',
      'border-width': '1px',
    },
    colors: {
      light: {
        primary: '221.2 83.2% 53.3%',
      },
      dark: {
        primary: '217.2 91.2% 59.8%',
      },
    },
  },
})

app.use(router)
app.use(ToasterPlugin)
app.use(WaitPlugin)
app.use(MazUi, {
  preset: customPreset,
  strategy: 'hybrid',
  darkMode: 'class',
})

// updateTheme({
//   name: 'custom',
//   colors: {
//     light: {
//       primary: '221.2 83.2% 53.3%',
//     },
//   },
// })

app.mount('#app')
