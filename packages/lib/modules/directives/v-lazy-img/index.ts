import type { Plugin } from 'vue'
import { LazyImg, DEFAULT_OPTIONS } from './lazy-img.handler'
import type { vLazyImgOptions, vLazyImgBindingValue } from './types'

const plugin = {
  install(app, opts) {
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
export { plugin as vLazyImgInstall, vLazyImgOptions, vLazyImgBindingValue }
