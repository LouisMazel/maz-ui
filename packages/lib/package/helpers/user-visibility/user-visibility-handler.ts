import type {
  UserVisibilyCallback,
  UserVisibilyOptions,
  UserVisibilyStrictOptions,
} from './types'

export class UserVisibility {
  private element: Document
  private callback: UserVisibilyCallback
  private eventHandlerFunction: () => void

  private event = 'visibilitychange'

  private timeoutHandler?: ReturnType<typeof setTimeout>

  private options: UserVisibilyStrictOptions

  private readonly defaultOptions: UserVisibilyStrictOptions = {
    immediate: false,
    timeout: 5000,
    once: false,
  }

  private isVisible = false

  constructor(callback: UserVisibilyCallback, options: UserVisibilyOptions) {
    this.callback = callback
    this.element = document

    this.options = {
      ...this.defaultOptions,
      ...options,
    }

    this.eventHandlerFunction = this.eventHandler.bind(this)

    if (this.options.immediate) {
      this.emitCallback()
    }

    this.addEventListener()
  }

  private emitCallback() {
    this.isVisible = this.element.visibilityState === 'visible'
    this.callback({ isVisible: this.isVisible })

    if (this.options.once) {
      this.destroy()
    }
  }

  private eventHandler() {
    if (this.element.visibilityState === 'visible' && !this.isVisible) {
      this.clearTimeout()
      this.emitCallback()
    } else if (this.element.visibilityState === 'hidden') {
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
    this.element.addEventListener(this.event, this.eventHandlerFunction)
  }

  private removeEventListener() {
    this.element.removeEventListener(this.event, this.eventHandlerFunction)
  }

  destroy() {
    this.removeEventListener()

    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler)
    }
  }
}
