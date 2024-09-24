import type { Plugin } from 'vue'

import { vClickOutsideInstall } from './click-outside'
import { vClosableInstall } from './closable'
import { vTooltipInstall } from './tooltip'
import { vFullscreenImgInstall } from './v-fullscreen-img'
import { vLazyImgInstall } from './v-lazy-img'
import { vZoomImgInstall } from './v-zoom-img'

const directives = [
  vClosableInstall,
  vZoomImgInstall,
  vLazyImgInstall,
  vClickOutsideInstall,
  vFullscreenImgInstall,
  vTooltipInstall,
] satisfies Plugin[]

const plugin = {
  install(app) {
    for (const plugin of directives) {
      plugin.install(app, {})
    }
  },
} satisfies Plugin

export * from './click-outside'
export * from './closable'
export * from './tooltip'
export * from './v-fullscreen-img'
export * from './v-lazy-img'
export * from './v-lazy-img'
export * from './v-zoom-img'

export { plugin as installDirectives }
