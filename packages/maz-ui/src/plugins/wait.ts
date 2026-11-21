import type { Plugin } from 'vue'
import { computed, ref } from 'vue'
import { warnDeprecated } from '../utils/warnDeprecated.ts'

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

/**
 * On the server, the loaders are never started: a state shared by every request would leak between them
 */
export class ServerWaitHandler extends WaitHandler {
  override stop() {
    return this
  }

  override start() {
    return this
  }
}

export const waitInstance = new WaitHandler()

/**
 * @deprecated `useWait()` works without it, it will be removed in v6. https://maz-ui.com/plugins/wait
 */
// Removed in v6 (plans/ROADMAP.md): deprecated WaitPlugin
export const WaitPlugin: Plugin = {
  install: (app) => {
    warnDeprecated('WaitPlugin', 'WaitPlugin is deprecated and will be removed in v6: useWait() works without any plugin, remove app.use(WaitPlugin). https://maz-ui.com/plugins/wait')

    app.provide('mazWait', waitInstance)
    app.config.globalProperties.$mazWait = waitInstance
  },
}

declare module 'vue' {
  interface ComponentCustomProperties {
    /**
     * Wait handler instance, provided by the deprecated `WaitPlugin`
     * @deprecated use `useWait()` from `maz-ui/composables/useWait`, it will be removed in v6
     */
    // Removed in v6 (plans/ROADMAP.md): deprecated WaitPlugin
    $mazWait: WaitHandler
  }
}
