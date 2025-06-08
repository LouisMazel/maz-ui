import type { App } from 'vue'
import type { LoaderId } from './wait/utils'
import { computed, ref } from 'vue'
import { contains, DEFAULT_LOADER, hasItems, pop, push } from './wait/utils'

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

export const WaitPlugin = {
  install: (app: App) => {
    app.provide('wait', waitInstance)
    app.config.globalProperties.$wait = waitInstance
  },
}

declare module '@vue/runtime-core' {
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
    $wait: WaitHandler
  }
}
