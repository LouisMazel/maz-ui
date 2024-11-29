import type { Plugin } from 'vue'
import { vZoomImg } from './zoom-img.directive'

const plugin = {
  install(app) {
    app.directive('zoom-img', vZoomImg)
  },
} satisfies Plugin

export { vZoomImg, plugin as vZoomImgInstall }
export type { vZoomImgBindingValue } from './zoom-img.handler'
