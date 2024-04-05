import type { Plugin } from 'vue'

import { vClickOutsideInstall } from './click-outside'
import { vClosableInstall } from './closable'
import { vZoomImgInstall } from './v-zoom-img'
import { vLazyImgInstall } from './v-lazy-img'
import { vFullscreenImgInstall } from './v-fullscreen-img'

const directives = [
  vClosableInstall,
  vZoomImgInstall,
  vLazyImgInstall,
  vClickOutsideInstall,
  vFullscreenImgInstall,
] satisfies Plugin[]

const plugin = {
  install(app) {
    for (const plugin of directives) {
      plugin.install(app, {})
    }
  },
} satisfies Plugin

export * from './click-outside'
export * from './v-lazy-img'
export * from './v-zoom-img'
export * from './v-fullscreen-img'
export * from './v-lazy-img'
export * from './closable'

export { plugin as installDirectives }
