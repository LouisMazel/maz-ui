import type { Plugin } from 'vue'
import type { vLazyImgBindingValue, vLazyImgOptions } from './types'
import { DEFAULT_OPTIONS, LazyImg } from './lazy-img.handler'

const plugin = {
  install(app, opts = {}) {
    const options = {
      ...DEFAULT_OPTIONS,
      ...opts,
      observerOptions: {
        ...DEFAULT_OPTIONS.observerOptions,
        ...opts.observerOptions,
      },
    } satisfies vLazyImgOptions

    const instance = new LazyImg(options)

    app.directive('lazy-img', {
      created: instance.add.bind(instance),
      updated: instance.update.bind(instance),
      unmounted: instance.remove.bind(instance),
    })
  },
} satisfies Plugin<vLazyImgOptions>

export { vLazyImg } from './lazy-img.directive'
export { vLazyImgBindingValue, plugin as vLazyImgInstall, vLazyImgOptions }
