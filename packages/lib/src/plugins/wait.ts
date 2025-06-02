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
  }

  start(loaderId: LoaderId = DEFAULT_LOADER) {
    this._loaders.value = push(this._loaders.value)(loaderId)
    return () => this.stop(loaderId)
  }

  get anyLoading() {
    return computed(() => hasItems(this._loaders.value))
  }

  isLoading(loaderId: LoaderId = DEFAULT_LOADER): boolean {
    const isLoading = computed(() => contains(this._loaders.value)(loaderId))
    return isLoading.value
  }
}

export const instance = new WaitHandler()

export const plugin = {
  install: (app: App) => {
    app.provide('wait', instance)
  },
}
