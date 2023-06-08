import type { App } from 'vue'
import { vZoomImg } from './zoom-img'

const plugin = {
  install(app: App) {
    app.directive('zoom-img', vZoomImg)
  },
}

export { plugin as vZoomImgInstall }

export { vZoomImg } from './zoom-img'
export type { vZoomImgBinding, vZoomImgOptions } from './zoom-img.handler'
