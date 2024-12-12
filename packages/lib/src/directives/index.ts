import type { Plugin } from 'vue'

import { vClickOutsideInstall } from './vClickOutside'
import { vClosableInstall } from './vClosable'
import { vFullscreenImgInstall } from './vFullscreenImg'
import { vLazyImgInstall } from './vLazyImg'
import { vTooltipInstall } from './vTooltip'
import { vZoomImgInstall } from './vZoomImg'

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

export * from './vClickOutside'
export * from './vClosable'
export * from './vFullscreenImg'
export * from './vLazyImg'
export * from './vTooltip'
export * from './vZoomImg'

export { plugin as installDirectives }
