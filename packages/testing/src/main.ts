import App from './App.vue'

// import 'maz-ui/css/main.css'
// import 'maz-ui/package/plugins/aos/scss/index.scss'
// import '@/css/main.css'

import { createApp } from 'vue'
import { vZoomImgInstall, vZoomImgOptions } from 'maz-ui/package/directives'
import {
  installToaster,
  ToasterOptions,
  installAos,
  AosOptions,
} from 'maz-ui/package/plugins'

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
    once: false,
  },
}

app.use(installToaster, toasterOptions)
app.use(installAos, options)

app.mount('#app')
