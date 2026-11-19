import type { Plugin } from 'vue'
import type { VLazyImgDirective } from './vLazyImg/lazy-img.directive.ts'
import type { VLazyImgOptions } from './vLazyImg/types.ts'
import { DEFAULT_OPTIONS, LazyImg } from './vLazyImg/lazy-img.handler.ts'

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

export { vLazyImg, type VLazyImgDirective } from './vLazyImg/lazy-img.directive.ts'
export { plugin as vLazyImgInstall }
export type { VLazyImgBindingValue, VLazyImgOptions } from './vLazyImg/types.ts'

declare module 'vue' {
  interface GlobalDirectives {
    vLazyImg: VLazyImgDirective
  }
}
