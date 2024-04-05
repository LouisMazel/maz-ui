import type { Plugin } from 'vue'
import { vFullscreenImg } from './fullscreen-img.directive'

const plugin = {
  install(app) {
    app.directive('fullscreen-img', vFullscreenImg)
  },
} satisfies Plugin

export { plugin as vFullscreenImgInstall }
export { vFullscreenImg } from './fullscreen-img.directive'
export type { vFullscreenImgBindingValue, vFullscreenImgOptions } from './fullscreen-img.handler'
