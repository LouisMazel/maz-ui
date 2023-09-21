import { isClient } from '../is-client'
import type { IdleTimeoutOptions, IdleTimeoutCallback, IdleTimeoutStrictOption } from './types'

export class IdleTimeout {
  private readonly defaultOptions: IdleTimeoutStrictOption = {
    element: undefined,
    timeout: 60 * 1000 * 5, // 5 minutes
    once: false,
    immediate: true,
  }

  private options: IdleTimeoutStrictOption
  private timeoutHandler?: ReturnType<typeof setTimeout>
  private isIdle = false
  private isDestroy = false
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
    private readonly callback: IdleTimeoutCallback,
    options?: IdleTimeoutOptions,
  ) {
    this.options = {
      ...this.defaultOptions,
      ...options,
    }

    if (isClient()) {
      this.start()
    }
  }

  get element() {
    return this.options.element ?? document.body
  }

  public start(): void {
    if (!isClient()) {
      console.warn(`[IdleTimeout](start) you should run this method on client side`)
      return
    }

    for (const eventName of this.eventNames) {
      this.element.addEventListener(eventName, this.handleEvent)
    }

    this.resetTimeout()

    if (this.options.immediate) {
      this.callback({ isIdle: false })
    }
  }

  public pause(): void {
    const remainingTime: number = this.startTime + this.options.timeout - Date.now()
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
    this.isDestroy = false
    this.isIdle = false
    this.remainingTime = 0
    this.resetTimeout()
    this.callback({ isIdle: this.isIdle })
  }

  public destroy(): void {
    if (!isClient()) {
      console.warn(`[IdleTimeout](destroy) you should run this method on client side`)
      return
    }

    this.isDestroy = true

    for (const eventName of this.eventNames) {
      this.element.removeEventListener(eventName, this.handleEvent)
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

    this.startTime = Date.now()
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
    return this.isDestroy
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
