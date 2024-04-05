import type { Plugin } from 'vue'
import { vZoomImg } from './zoom-img.directive'

const plugin = {
  install(app) {
    app.directive('zoom-img', vZoomImg)
  },
} satisfies Plugin

export { plugin as vZoomImgInstall, vZoomImg }
export type { vZoomImgBindingValue } from './zoom-img.handler'
