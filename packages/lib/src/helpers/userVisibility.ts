import { isClient } from './isClient'

export type UserVisibilyCallback = ({ isVisible }: { isVisible: boolean }) => void

export interface UserVisibilyStrictOptions {
  /**
   * Watch immediately
   * @default true
   */
  immediate: boolean
  /**
   * Timeout visibility in ms
   * @default 5000 // 5 sec
   */
  timeout: number
  /**
   * Watch once
   * @default false
   */
  once: boolean
}

export type UserVisibilyOptions = Partial<UserVisibilyStrictOptions>

export class UserVisibility {
  private eventHandlerFunction: () => void

  private event = 'visibilitychange'

  private timeoutHandler?: ReturnType<typeof setTimeout>

  private options: UserVisibilyStrictOptions

  private readonly defaultOptions: UserVisibilyStrictOptions = {
    timeout: 5000,
    once: false,
    immediate: true,
  }

  private isVisible = false

  constructor(
    private readonly callback: UserVisibilyCallback,
    options?: UserVisibilyOptions,
  ) {
    this.options = {
      ...this.defaultOptions,
      ...options,
    }

    this.eventHandlerFunction = this.eventHandler.bind(this)

    if (isClient()) {
      this.start()
    }
  }

  public start() {
    if (!isClient()) {
      console.warn(`[UserVisibility](start) you should run this method on client side`)
      return
    }

    if (this.options.immediate) {
      this.emitCallback()
    }

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
    }
    else if (document.visibilityState === 'hidden') {
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

    this.timeoutHandler = setTimeout(this.emitCallback.bind(this), this.options.timeout)
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
