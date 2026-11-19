import type { Plugin } from 'vue'
import type { VZoomImgDirective } from './vZoomImg/zoom-img.directive.ts'
import { vZoomImg } from './vZoomImg/zoom-img.directive.ts'

const plugin: Plugin = {
  install(app) {
    app.directive('zoom-img', vZoomImg)
  },
}

export { vZoomImg, type VZoomImgDirective, plugin as vZoomImgInstall }
export type { VZoomImgBindingValue } from './vZoomImg/zoom-img.handler.ts'

declare module 'vue' {
  interface GlobalDirectives {
    vZoomImg: VZoomImgDirective
  }
}
