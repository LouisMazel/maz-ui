import type { App } from 'vue'
import type { MazToastProps } from './MazToast.vue'
import type { ToasterButton, ToasterOptions } from './types'
import { useMountComponent } from './../../composables/useMountComponent'
import MazToast from './MazToast.vue'

const DEFAULT_OPTIONS: ToasterOptions = {
  position: 'bottom-right',
  timeout: 10_000,
  persistent: false,
}

export class ToasterHandler {
  constructor(
    private readonly app: App,
    private readonly globalOptions?: ToasterOptions,
  ) {}

  private show(message: string, options: ToasterOptions) {
    const props: MazToastProps = {
      ...DEFAULT_OPTIONS,
      ...this.globalOptions,
      ...options,
      message,
    }

    const { destroy, vNode } = useMountComponent<typeof MazToast, MazToastProps>(MazToast, {
      props,
      app: this.app,
    })

    return {
      destroy,
      close: () => vNode.component?.exposed?.closeToast(),
    }
  }

  private getLocalOptions(options?: ToasterOptions): ToasterOptions {
    const DEFAULT_BUTTON_OPTIONS: Partial<ToasterButton> = {
      size: 'xs',
      color: options?.type ?? 'theme',
      closeToast: false,
    }

    const button = options?.button
      ? {
          ...DEFAULT_BUTTON_OPTIONS,
          ...options.button,
        }
      : undefined

    const buttons = options?.buttons?.map(button => ({
      ...DEFAULT_BUTTON_OPTIONS,
      ...button,
    }))

    return {
      type: options?.type ?? 'theme',
      ...options,
      buttons,
      button,
    }
  }

  message(message: string, options?: ToasterOptions) {
    return this.show(message, this.getLocalOptions(options))
  }

  success(message: string, options?: Omit<ToasterOptions, 'type'>) {
    return this.show(message, this.getLocalOptions({ ...options, type: 'success' }))
  }

  error(message: string, options?: Omit<ToasterOptions, 'type'>) {
    return this.show(message, this.getLocalOptions({ ...options, type: 'danger' }))
  }

  info(message: string, options?: Omit<ToasterOptions, 'type'>) {
    return this.show(message, this.getLocalOptions({ ...options, type: 'info' }))
  }

  warning(message: string, options?: Omit<ToasterOptions, 'type'>) {
    return this.show(message, this.getLocalOptions({ ...options, type: 'warning' }))
  }
}
