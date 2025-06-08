import type { Plugin } from 'vue'
import { vFullscreenImg } from './vFullscreenImg/fullscreen-img.directive'

const plugin = {
  install(app) {
    app.directive('fullscreen-img', vFullscreenImg)
  },
} satisfies Plugin

export { plugin as vFullscreenImgInstall }
export { vFullscreenImg } from './vFullscreenImg/fullscreen-img.directive'
export type { VFullscreenImgBindingValue, VFullscreenImgOptions } from './vFullscreenImg/fullscreen-img.handler'
