import {
  IdleTimeoutOptions,
  IdleTimeoutCallback,
  IdleTimeoutStrictOption,
} from './types'

export class IdleTimeout {
  private readonly defaultOptions: IdleTimeoutStrictOption = {
    element: document,
    timeout: 60 * 1000 * 5, // 5 minutes
    once: false,
    immediate: false,
  }

  private callback: IdleTimeoutCallback

  private options: IdleTimeoutStrictOption
  private timeoutHandler?: ReturnType<typeof setTimeout>
  private isIdle = false
  private startTime = 0
  private remainingTime = 0
  private lastPageX = -1
  private lastPageY = -1

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
    'visibilitychange',
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
    this.eventNames.forEach((eventName): void => {
      element.addEventListener(eventName, this.handleEvent)
    })

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
    this.isIdle = false
    this.remainingTime = 0
    this.resetTimeout()
    this.callback({ isIdle: this.isIdle })
  }

  public destroy(): void {
    const element = this.options.element
    this.eventNames.forEach((eventName): void => {
      element.removeEventListener(eventName, this.handleEvent)
    })

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
    if (this.remainingTime > 0) {
      return
    }

    if (event.type === 'mousemove') {
      const { pageX, pageY } = event as MouseEvent
      if (
        (pageX === undefined && pageY === undefined) ||
        (pageX === this.lastPageX && pageY === this.lastPageY)
      ) {
        return
      }

      this.lastPageX = pageX
      this.lastPageY = pageY
    }

    this.resetTimeout()
    this.callback({ isIdle: this.isIdle })
  }

  private handleTimeout(): void {
    this.isIdle = true
    this.callback({ isIdle: this.isIdle })

    if (this.options.once) {
      this.destroy()
    }
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
      this.callback({ isIdle: this.isIdle })
    } else {
      this.reset()
    }
  }
}
