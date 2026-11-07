import type { Plugin } from 'vue'
import { computed, ref } from 'vue'

type LoaderId = string | symbol | number

const DEFAULT_LOADER: LoaderId = 'maz-wait-default-loader'

function uniq(array: LoaderId[]) {
  return array.filter((el, index, arr) => index === arr.indexOf(el))
}

function contains(array: Array<LoaderId>) {
  return (predicate: LoaderId = DEFAULT_LOADER) => {
    return array.includes(predicate)
  }
}

const hasItems = (array: LoaderId[]) => array.length > 0

function push(array: LoaderId[]) {
  return (item: LoaderId = DEFAULT_LOADER) =>
    uniq([...array, item])
}

function pop(array: LoaderId[]) {
  return (item: LoaderId = DEFAULT_LOADER) =>
    array.filter(_item => _item !== item)
}

export class WaitHandler {
  private _loaders = ref<LoaderId[]>([])

  get loaders() {
    return computed(() => this._loaders.value)
  }

  stop(loaderId: LoaderId = DEFAULT_LOADER) {
    this._loaders.value = pop(this._loaders.value)(loaderId)
    return this
  }

  start(loaderId: LoaderId = DEFAULT_LOADER) {
    this._loaders.value = push(this._loaders.value)(loaderId)
    return this
  }

  isLoading(loaderId: LoaderId = DEFAULT_LOADER): boolean {
    const isLoading = computed(() => contains(this._loaders.value)(loaderId))
    return isLoading.value
  }

  get anyLoading() {
    return computed(() => hasItems(this._loaders.value))
  }
}

export const waitInstance = new WaitHandler()

export const WaitPlugin: Plugin = {
  install: (app) => {
    app.provide('mazWait', waitInstance)
    app.config.globalProperties.$mazWait = waitInstance
  },
}

declare module 'vue' {
  interface ComponentCustomProperties {
    /**
     * Wait handler instance
     * @description You should install the plugin to use this property
     * @examl
     * ```ts
     * import { WaitPlugin } from 'maz-ui/plugins/wait'
     * import { createApp } from 'vue'
     *
     * const app = createApp(App)
     * app.use(WaitPlugin)
     *
     * const wait = useWait()
     * wait.start()
     * ```
     */
    $mazWait: WaitHandler
  }
}
