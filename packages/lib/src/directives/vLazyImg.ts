import type { Plugin } from 'vue'
import type { VLazyImgDirective } from './vLazyImg/lazy-img.directive'
import type { VLazyImgOptions } from './vLazyImg/types'
import { DEFAULT_OPTIONS, LazyImg } from './vLazyImg/lazy-img.handler'

const plugin: Plugin<[VLazyImgOptions?]> = {
  install(app, opts = {}) {
    const options = {
      ...DEFAULT_OPTIONS,
      ...opts,
      observerOptions: {
        ...DEFAULT_OPTIONS.observerOptions,
        ...opts.observerOptions,
      },
    } satisfies VLazyImgOptions

    const instance = new LazyImg(options)

    app.directive('lazy-img', {
      created: instance.add.bind(instance),
      updated: instance.update.bind(instance),
      unmounted: instance.remove.bind(instance),
    })
  },
}

export { vLazyImg, type VLazyImgDirective } from './vLazyImg/lazy-img.directive'
export { plugin as vLazyImgInstall }
export type { VLazyImgBindingValue, VLazyImgOptions } from './vLazyImg/types'

declare module 'vue' {
  interface GlobalDirectives {
    vLazyImg: VLazyImgDirective
  }
}
