import { definePreset } from '@maz-ui/themes'
import { mazUi as mazUiPreset } from '@maz-ui/themes/presets/mazUi'
import { DialogPlugin } from 'maz-ui/src/plugins/dialog.ts'
import { MazUiPlugin } from 'maz-ui/src/plugins/maz-ui.ts'
import { ToasterPlugin } from 'maz-ui/src/plugins/toaster.ts'
import { WaitPlugin } from 'maz-ui/src/plugins/wait.js'

import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import 'maz-ui/src/tailwindcss/tailwind.css'
import './assets/main.css'

const app = createApp(App)

const customPreset = definePreset({
  base: mazUiPreset,
})

app.use(router)
app.use(ToasterPlugin)
app.use(WaitPlugin)
app.use(DialogPlugin)
app.use(MazUiPlugin, {
  preset: customPreset,
  strategy: 'hybrid',
  darkModeStrategy: 'class',
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
