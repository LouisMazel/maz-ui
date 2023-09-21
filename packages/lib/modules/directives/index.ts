import { vClickOutside } from './click-outside'
import { vClosable } from './closable'
import { vZoomImg } from './v-zoom-img'
import { vLazyImg } from './v-lazy-img'
import { vFullscreenImg } from './v-fullscreen-img'
import type { App } from 'vue'

const directives = [
  {
    name: 'click-outside',
    directive: vClickOutside,
  },
  {
    name: 'closable',
    directive: vClosable,
  },
  {
    name: 'zoom-img',
    directive: vZoomImg,
  },
  {
    name: 'lazy-img',
    directive: vLazyImg,
  },
  {
    name: 'fullscreen-img',
    directive: vFullscreenImg,
  },
]

const installDirectives = {
  install(app: App) {
    for (const { name, directive } of directives) {
      app.directive(name, directive)
    }
  },
}

export { vClickOutside, vClickOutsideInstall } from './click-outside'
export type { vLazyImgOptions, vLazyImgBinding } from './v-lazy-img'
export { vLazyImg, vLazyImgInstall } from './v-lazy-img'
export { vZoomImg, vZoomImgInstall } from './v-zoom-img'
export type { vZoomImgOptions, vZoomImgBinding } from './v-zoom-img'
export { vFullscreenImg, vFullscreenImgInstall } from './v-fullscreen-img'
export type { vFullscreenImgOptions, vFullscreenImgBinding } from './v-fullscreen-img'
export { vClosable, vClosableInstall } from './closable'

export { installDirectives }
