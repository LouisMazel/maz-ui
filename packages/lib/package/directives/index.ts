import { vClickOutside } from './click-outside.directive'
import { vClosable } from './closable.directive'
import { vZoomImg } from './v-zoom-img'
import { vLazyImg } from './v-lazy-img'
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
]

const installDirectives = {
  install(app: App) {
    for (const { name, directive } of directives) {
      app.directive(name, directive)
    }
  },
}

export { vClickOutside, vClickOutsideInstall } from './click-outside.directive'
export type { vLazyImgOptions, vLazyImgBinding } from './v-lazy-img'
export { vLazyImg, vLazyImgInstall } from './v-lazy-img'
export { vZoomImg, vZoomImgInstall } from './v-zoom-img'
export type { vZoomImgOptions, vZoomImgBinding } from './v-zoom-img'
export { vClosable, vClosableInstall } from './closable.directive'

export { installDirectives }
