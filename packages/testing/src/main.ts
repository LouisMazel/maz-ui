import App from './App.vue'

import 'maz-ui/css/main.css'
import 'maz-ui/css/aos.css'
import '@/css/main.css'

import { createApp } from 'vue'
import {
  vZoomImgInstall,
  vZoomImgOptions,
  installToaster,
  ToasterOptions,
  installAos,
  AosOptions,
} from 'maz-ui'

const app = createApp(App)

const vLazyImgOptions: vZoomImgOptions = {
  disabled: false,
  scale: true,
  blur: true,
}

app.use(vZoomImgInstall, vLazyImgOptions)

const toasterOptions: ToasterOptions = {
  persistent: false,
  position: 'bottom-right',
  timeout: 50000,
}

const options: AosOptions = {
  animation: {
    duration: 2000,
  },
  observer: {
    once: false,
  },
}

app.use(installToaster, toasterOptions)
app.use(installAos, options)

app.mount('#app')
