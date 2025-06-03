import type { App } from 'vue'
import type { MazToastProps } from './MazToast.vue'
import type { ToasterOptions } from './types'
import { defineAsyncComponent } from 'vue'
import { useMountComponent } from './../../composables/useMountComponent'

export interface LocalToasterOptions extends ToasterOptions {
  type: 'success' | 'info' | 'warning' | 'danger' | 'theme'
}

const DEFAULT_OPTIONS: ToasterOptions = {
  position: 'bottom-right',
  timeout: 10_000,
  persistent: false,
  icon: true,
}

export class ToasterHandler {
  constructor(
    private readonly app: App,
    private readonly globalOptions?: ToasterOptions,
  ) {}

  private show(message: string, options: LocalToasterOptions) {
    const props: MazToastProps = {
      ...DEFAULT_OPTIONS,
      ...this.globalOptions,
      ...options,
      message,
    }

    const MazToast = defineAsyncComponent(() => import('./MazToast.vue'))

    const { destroy, vNode } = useMountComponent<typeof MazToast, MazToastProps>(MazToast, {
      props,
      app: this.app,
    })

    return {
      destroy,
      close: () => vNode.component?.exposed?.closeToast(),
    }
  }

  private getLocalOptions(
    type: LocalToasterOptions['type'],
    options?: ToasterOptions,
  ): LocalToasterOptions {
    return {
      type,
      ...options,
    }
  }

  message(message: string, options?: ToasterOptions) {
    return this.show(message, this.getLocalOptions('theme', options))
  }

  success(message: string, options?: ToasterOptions) {
    return this.show(message, this.getLocalOptions('success', options))
  }

  error(message: string, options?: ToasterOptions) {
    return this.show(message, this.getLocalOptions('danger', options))
  }

  info(message: string, options?: ToasterOptions) {
    return this.show(message, this.getLocalOptions('info', options))
  }

  warning(message: string, options?: ToasterOptions) {
    return this.show(message, this.getLocalOptions('warning', options))
  }
}
