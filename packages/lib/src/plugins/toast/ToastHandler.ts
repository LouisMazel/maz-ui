import type { App } from 'vue'
import type { MazToastProps } from './MazToast.vue'
import type { ToastButton, ToastOptions } from './types'
import { useMountComponent } from '../../composables/useMountComponent'
import MazToast from './MazToast.vue'

const DEFAULT_OPTIONS: ToastOptions = {
  position: 'bottom-right',
  timeout: 10_000,
  persistent: false,
}

export class ToastHandler {
  constructor(
    private readonly app: App,
    private readonly globalOptions?: ToastOptions,
  ) {}

  private show(message: string, options: ToastOptions) {
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

  private getLocalOptions(options?: ToastOptions): ToastOptions {
    const DEFAULT_BUTTON_OPTIONS: Partial<ToastButton> = {
      size: 'xs',
      color: options?.type ?? 'contrast',
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
      type: options?.type ?? 'contrast',
      ...options,
      buttons,
      button,
    }
  }

  message(message: string, options?: ToastOptions) {
    return this.show(message, this.getLocalOptions(options))
  }

  success(message: string, options?: Omit<ToastOptions, 'type'>) {
    return this.show(message, this.getLocalOptions({ ...options, type: 'success' }))
  }

  error(message: string, options?: Omit<ToastOptions, 'type'>) {
    return this.show(message, this.getLocalOptions({ ...options, type: 'destructive' }))
  }

  info(message: string, options?: Omit<ToastOptions, 'type'>) {
    return this.show(message, this.getLocalOptions({ ...options, type: 'info' }))
  }

  warning(message: string, options?: Omit<ToastOptions, 'type'>) {
    return this.show(message, this.getLocalOptions({ ...options, type: 'warning' }))
  }
}
