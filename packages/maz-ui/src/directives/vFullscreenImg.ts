import type { Plugin } from 'vue'
import type { VFullscreenImgDirective } from './vFullscreenImg/fullscreen-img.directive.ts'
import { vFullscreenImg } from './vFullscreenImg/fullscreen-img.directive.ts'

const plugin: Plugin = {
  install(app) {
    app.directive('fullscreen-img', vFullscreenImg)
  },
}

export { plugin as vFullscreenImgInstall }
export { vFullscreenImg, type VFullscreenImgDirective } from './vFullscreenImg/fullscreen-img.directive.ts'
export type { VFullscreenImgBindingValue, VFullscreenImgOptions } from './vFullscreenImg/fullscreen-img.handler.ts'

declare module 'vue' {
  interface GlobalDirectives {
    vFullscreenImg: VFullscreenImgDirective
  }
}
