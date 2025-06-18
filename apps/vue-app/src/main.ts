import type { MazUiPluginOptions } from 'maz-ui/src/plugins/maz-ui.ts'
import { ocean } from '@maz-ui/themes/src/presets/ocean.ts'
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

const config = {
  strategy: 'hybrid',
  darkModeStrategy: 'class',
  preset: ocean,
} satisfies MazUiPluginOptions

app.use(MazUiPlugin, config)

app.use(router)
app.use(ToasterPlugin)
app.use(WaitPlugin)
app.use(DialogPlugin)

app.mount('#app')
