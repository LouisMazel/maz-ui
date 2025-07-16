import type { Plugin } from 'vue'
import { vZoomImg, type VZoomImgDirective } from './vZoomImg/zoom-img.directive'

const plugin: Plugin = {
  install(app) {
    app.directive('zoom-img', vZoomImg)
  },
}

export { vZoomImg, type VZoomImgDirective, plugin as vZoomImgInstall }
export type { VZoomImgBindingValue } from './vZoomImg/zoom-img.handler'

declare module 'vue' {
  interface GlobalDirectives {
    vZoomImg: VZoomImgDirective
  }
}
