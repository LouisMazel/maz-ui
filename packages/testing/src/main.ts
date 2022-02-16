import App from './App.vue'
import 'maz-ui/css/main.css'
import { createApp } from 'vue'
import {
  vZoomImgInstall,
  vZoomImgOptions,
  installToaster,
  ToasterOptions,
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

app.use(installToaster, toasterOptions)

app.mount('#app')
