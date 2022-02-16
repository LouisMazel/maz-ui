import { computed, ref, Plugin } from 'vue'
import {
  contains,
  DEFAULT_LOADER,
  hasItems,
  LoaderId,
  pop,
  push,
} from './utils'

export class WaitingState {
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

const instance = new WaitingState()

const plugin: Plugin = {
  install: (app) => {
    app.provide('wait', instance)
  },
}

export { instance }

export default plugin
