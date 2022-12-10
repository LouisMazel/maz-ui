import { isClient } from '../is-client'
import type {
  UserVisibilyCallback,
  UserVisibilyOptions,
  UserVisibilyStrictOptions,
} from './types'

export class UserVisibility {
  private callback: UserVisibilyCallback
  private eventHandlerFunction: () => void

  private event = 'visibilitychange'

  private timeoutHandler?: ReturnType<typeof setTimeout>

  private options: UserVisibilyStrictOptions

  private readonly defaultOptions: UserVisibilyStrictOptions = {
    immediate: true,
    timeout: 5000,
    once: false,
  }

  private isVisible = false

  constructor(callback: UserVisibilyCallback, options?: UserVisibilyOptions) {
    this.callback = callback

    this.options = {
      ...this.defaultOptions,
      ...options,
    }

    this.eventHandlerFunction = this.eventHandler.bind(this)

    if (this.options.immediate && isClient()) {
      this.start()
    } else if (this.options.immediate && !isClient()) {
      console.warn(
        `[UserVisibility](constructor) executed on server side - set immediate option to "false"`,
      )
    }
  }

  public start() {
    if (!isClient()) {
      console.warn(
        `[UserVisibility](start) you should run this method on client side`,
      )
      return
    }

    this.emitCallback()
    this.addEventListener()
  }

  private emitCallback() {
    this.isVisible = document.visibilityState === 'visible'
    this.callback({ isVisible: this.isVisible })

    if (this.options.once) {
      this.destroy()
    }
  }

  private eventHandler() {
    if (document.visibilityState === 'visible' && !this.isVisible) {
      this.clearTimeout()
      this.emitCallback()
    } else if (document.visibilityState === 'hidden') {
      this.initTimeout()
    }
  }

  private clearTimeout(): void {
    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler)
      this.timeoutHandler = undefined
    }
  }

  private initTimeout(): void {
    this.clearTimeout()

    this.timeoutHandler = setTimeout(
      this.emitCallback.bind(this),
      this.options.timeout,
    )
  }

  private addEventListener() {
    document.addEventListener(this.event, this.eventHandlerFunction)
  }

  private removeEventListener() {
    document.removeEventListener(this.event, this.eventHandlerFunction)
  }

  destroy() {
    this.removeEventListener()

    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler)
    }
  }
}
