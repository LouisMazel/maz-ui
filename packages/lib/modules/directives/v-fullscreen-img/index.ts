import type { App } from 'vue'
import { vFullscreenImg } from './fullscreen-img.directive'

export const vFullscreenImgInstall = {
  install(app: App) {
    app.directive('fullscreen-img', vFullscreenImg)
  },
}

export { vFullscreenImg } from './fullscreen-img.directive'
export type { vFullscreenImgBinding, vFullscreenImgOptions } from './fullscreen-img.handler'
export * from './fullscreen-img.handler'
