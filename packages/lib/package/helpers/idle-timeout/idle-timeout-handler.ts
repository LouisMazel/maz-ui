import type {
  IdleTimeoutOptions,
  IdleTimeoutCallback,
  IdleTimeoutStrictOption,
} from './types'

export class IdleTimeout {
  private readonly defaultOptions: IdleTimeoutStrictOption = {
    element: document.body,
    timeout: 60 * 1000 * 5, // 5 minutes
    once: false,
    immediate: false,
  }

  private callback: IdleTimeoutCallback

  private options: IdleTimeoutStrictOption
  private timeoutHandler?: ReturnType<typeof setTimeout>
  private isIdle = false
  private isDestoy = false
  private startTime = 0
  private remainingTime = 0
  private lastClientX = -1
  private lastClientY = -1

  private eventNames = [
    'DOMMouseScroll',
    'mousedown',
    'mousemove',
    'mousewheel',
    'MSPointerDown',
    'MSPointerMove',
    'keydown',
    'touchmove',
    'touchstart',
    'wheel',
    'click',
  ]

  public constructor(
    callback: IdleTimeoutCallback,
    options?: IdleTimeoutOptions,
  ) {
    this.callback = callback
    this.options = {
      ...this.defaultOptions,
      ...options,
    }

    const element = this.options.element

    for (const eventName of this.eventNames) {
      element.addEventListener(eventName, this.handleEvent)
    }

    this.resetTimeout()

    if (this.options.immediate) {
      this.callback({ isIdle: false })
    }
  }

  public pause(): void {
    const remainingTime: number =
      this.startTime + this.options.timeout - new Date().getTime()
    if (remainingTime <= 0) {
      return
    }

    this.remainingTime = remainingTime

    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler)
      this.timeoutHandler = undefined
    }
  }

  public resume(): void {
    if (this.remainingTime <= 0) {
      return
    }

    this.resetTimeout()
    this.callback({ isIdle: this.isIdle })
    this.remainingTime = 0
  }

  public reset(): void {
    this.isDestoy = false
    this.isIdle = false
    this.remainingTime = 0
    this.resetTimeout()
    this.callback({ isIdle: this.isIdle })
  }

  public destroy(): void {
    this.isDestoy = true
    const element = this.options.element

    for (const eventName of this.eventNames) {
      element.removeEventListener(eventName, this.handleEvent)
    }

    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler)
    }
  }

  private resetTimeout(): void {
    this.isIdle = false

    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler)
      this.timeoutHandler = undefined
    }

    this.timeoutHandler = setTimeout(
      this.handleTimeout.bind(this),
      this.remainingTime || this.options.timeout,
    )

    this.startTime = new Date().getTime()
  }

  private handleEvent = (event: Event): void => {
    try {
      if (this.remainingTime > 0) {
        return
      }

      if (event.type === 'mousemove') {
        const { clientX, clientY } = event as MouseEvent
        if (
          (clientX === undefined && clientY === undefined) ||
          (clientX === this.lastClientX && clientY === this.lastClientY)
        ) {
          return
        }

        this.lastClientX = clientX
        this.lastClientY = clientY
      }

      this.resetTimeout()

      this.callback({ isIdle: this.isIdle, eventType: event.type })
    } catch (error) {
      throw new Error(`[IdleTimeout](handleEvent) ${error}`)
    }
  }

  private handleTimeout(): void {
    this.isIdle = true
    this.callback({ isIdle: this.isIdle })

    if (this.options.once) {
      this.destroy()
    }
  }

  public get destroyed() {
    return this.isDestoy
  }

  public get timeout() {
    return this.options.timeout
  }

  public set timeout(value: number) {
    this.options.timeout = value
  }

  public get idle(): boolean {
    return this.isIdle
  }

  public set idle(value: boolean) {
    if (value) {
      this.handleTimeout()
    } else {
      this.reset()
    }

    this.callback({ isIdle: this.isIdle })
  }
}
