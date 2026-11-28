import type { App } from 'vue'
import type { MazToastProps } from './MazToast.vue'
import type { ToastButton, ToastOptions, ToastPromiseOptions } from './types.ts'
import { isClient } from '@maz-ui/utils/helpers/isClient'
import { useMountComponent } from '../../composables/useMountComponent.ts'
import MazToast from './MazToast.vue'

const DEFAULT_OPTIONS: ToastOptions = {
  position: 'bottom-right',
  timeout: 10_000,
  persistent: false,
  stacked: true,
}

export class ToastHandler {
  constructor(
    private readonly app: App,
    private readonly globalOptions?: ToastOptions,
  ) {}

  private show(message: string, options: ToastOptions) {
    const { destroy, close } = this.mount(message, options)

    return { destroy, close }
  }

  private mount(message: string, options: ToastOptions, loading = false) {
    if (!isClient()) {
      return {
        destroy: () => {},
        close: () => {},
        settle: (_status: 'success' | 'error', _message: string) => {},
      }
    }

    const props: MazToastProps = {
      ...DEFAULT_OPTIONS,
      ...this.globalOptions,
      ...options,
      message,
      loading,
    }

    const { destroy, vNode } = useMountComponent<typeof MazToast, MazToastProps>(MazToast, {
      props,
      app: this.app,
    })

    return {
      destroy,
      close: () => vNode.component?.exposed?.closeToast(),
      settle: (status: 'success' | 'error', text: string) => vNode.component?.exposed?.settle(status, text),
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

  accent(message: string, options?: Omit<ToastOptions, 'type'>) {
    return this.show(message, this.getLocalOptions({ ...options, type: 'accent' }))
  }

  neutral(message: string, options?: Omit<ToastOptions, 'type'>) {
    return this.show(message, this.getLocalOptions({ ...options, type: 'neutral' }))
  }

  /**
   * Show a loading toast, then a success or an error one when the promise settles.
   * Returns the promise, untouched.
   */
  promise<T>(promise: Promise<T> | (() => Promise<T>), options: ToastPromiseOptions<T>): Promise<T> {
    const { loading, success, error, ...toastOptions } = options
    const source = typeof promise === 'function' ? promise() : promise

    if (!isClient()) {
      return source
    }

    const { settle } = this.mount(loading, this.getLocalOptions({ ...toastOptions, type: 'neutral' }), true)

    source.then(
      data => settle('success', typeof success === 'function' ? success(data) : success),
      reason => settle('error', typeof error === 'function' ? error(reason) : error),
    )

    return source
  }
}
