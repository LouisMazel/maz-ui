import { LazyImg, DEFAULT_OPTIONS } from './lazy-img-handler'
import { vLazyImg } from './lazy-img.directive'
import type { vLazyImgOptions } from './types'
export * from './types'

const DIRECTIVE_NAME = 'lazy-img'

const plugin = {
  install(app, opts: vLazyImgOptions = {}) {
    const options: vLazyImgOptions = {
      ...DEFAULT_OPTIONS,
      ...opts,
      observerOptions: {
        ...DEFAULT_OPTIONS.observerOptions,
        ...opts.observerOptions,
      },
    }

    const instance = new LazyImg(options)

    app.directive(DIRECTIVE_NAME, {
      created: instance.add.bind(instance),
      updated: instance.update.bind(instance),
      unmounted: instance.remove.bind(instance),
    })
  },
}

export { vLazyImg, plugin as vLazyImgInstall }
