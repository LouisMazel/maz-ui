export type SwipeValues = {
  xStart: number | undefined
  yStart: number | undefined
  xEnd: number | undefined
  yEnd: number | undefined
  xDiff: number | undefined
  yDiff: number | undefined
}

export type SwipeEventCallback = (event: TouchEvent) => void
export type SwipeValuesCallback = (values: SwipeValues) => void

/**
 * Options for handling swipe events.
 */
export interface SwipeOptions {
  /**
   * The element on which the swipe events will be handled.
   * @default null
   */
  element: HTMLElement | string
  /**
   * Callback function to be executed when a left swipe is detected.
   * @default undefined
   */
  onLeft?: SwipeEventCallback
  /**
   * Callback function to be executed when a right swipe is detected.
   * @default undefined
   */
  onRight?: SwipeEventCallback
  /**
   * Callback function to be executed when an up swipe is detected.
   * @default undefined
   */
  onUp?: SwipeEventCallback
  /**
   * Callback function to be executed when a down swipe is detected.
   * @default undefined
   */
  onDown?: SwipeEventCallback
  /**
   * Callback function to be executed when values are changed.
   * @default undefined
   */
  onValuesChanged?: SwipeValuesCallback
  /**
   * The minimum distance the swipe needs to travel to be considered valid.
   * @default 50
   */
  threshold?: number
  /**
   * Whether to prevent the default behavior of touchmove event.
   * @default false
   */
  preventDefaultOnTouchMove?: boolean
  /**
   * Whether to prevent the default behavior of mousewheel event.
   * @default false
   */
  preventDefaultOnMouseWheel?: boolean
  /**
   * Whether to trigger the swipe event immediately on touchstart/mousedown.
   * @default false
   */
  immediate?: boolean
  /**
   * Whether to trigger the swipe event on touchend/mouseup.
   * If set to true, the swipe event will be triggered only when the user lifts their finger/mouse.
   * @default false
   */
  triggerOnEnd?: boolean
}

type DefaultSwipeOptions = Required<
  Pick<
    SwipeOptions,
    | 'preventDefaultOnTouchMove'
    | 'preventDefaultOnMouseWheel'
    | 'threshold'
    | 'immediate'
    | 'triggerOnEnd'
  >
>

type SwipeOptionsWithDefaults = SwipeOptions & DefaultSwipeOptions

export class Swipe {
  private readonly defaultOptions: DefaultSwipeOptions = {
    preventDefaultOnTouchMove: false,
    preventDefaultOnMouseWheel: false,
    threshold: 50,
    immediate: false,
    triggerOnEnd: false,
  }
  public readonly element: HTMLElement

  public xStart: number | undefined
  public yStart: number | undefined
  public xEnd: number | undefined
  public yEnd: number | undefined
  public xDiff: number | undefined
  public yDiff: number | undefined

  private readonly onToucheStartCallback: (event: TouchEvent) => void
  private readonly onToucheMoveCallback: (event: TouchEvent) => void
  private readonly onToucheEndCallback: (event: TouchEvent) => void
  private readonly onMouseWheelCallback: (event: Event) => void

  private options: SwipeOptionsWithDefaults

  constructor(readonly inputOption: SwipeOptions) {
    this.options = { ...this.defaultOptions, ...inputOption }

    if (!this.options.element) {
      throw new Error(
        '[SwipeHandler] Element should be provided. Its can be a string selector or an HTMLElement',
      )
    }

    if (typeof this.options.element === 'string') {
      const foundElement = document.querySelector(this.options.element)
      if (!(foundElement instanceof HTMLElement)) {
        throw new TypeError('[SwipeHandler] String selector for element is not found')
      }
      this.element = foundElement
    } else {
      this.element = this.options.element
    }

    this.onToucheStartCallback = this.toucheStartHandler.bind(this)
    this.onToucheMoveCallback = this.handleTouchMove.bind(this)
    this.onToucheEndCallback = this.handleTouchEnd.bind(this)
    this.onMouseWheelCallback = this.handleMouseWheel.bind(this)

    if (this.options.immediate) {
      this.start()
    }
  }

  start() {
    this.element.addEventListener('touchstart', this.onToucheStartCallback, { passive: true })
    this.element.addEventListener('touchmove', this.onToucheMoveCallback, { passive: true })
    if (this.options.triggerOnEnd) {
      this.element.addEventListener('touchend', this.onToucheEndCallback, { passive: true })
    }
    if (this.options.preventDefaultOnMouseWheel) {
      this.element.addEventListener('mousewheel', this.onMouseWheelCallback, { passive: false })
    }
  }

  public stop() {
    this.element.removeEventListener('touchstart', this.onToucheStartCallback)
    this.element.removeEventListener('touchmove', this.onToucheMoveCallback)
    this.element.removeEventListener('touchend', this.onToucheEndCallback)

    if (this.options.preventDefaultOnMouseWheel) {
      this.element.removeEventListener('mousewheel', this.onMouseWheelCallback)
    }
  }

  private handleMouseWheel(event: Event) {
    event.preventDefault()
  }

  private toucheStartHandler(event: TouchEvent) {
    this.xStart = event.touches[0].clientX
    this.yStart = event.touches[0].clientY
    this.emitValuesChanged()
  }

  private emitValuesChanged() {
    this.options.onValuesChanged?.({
      xStart: this.xStart,
      yStart: this.yStart,
      xEnd: this.xEnd,
      yEnd: this.yEnd,
      xDiff: this.xDiff,
      yDiff: this.yDiff,
    })
  }

  private handleTouchMove(event: TouchEvent) {
    if (this.options.preventDefaultOnTouchMove && event.cancelable) {
      event.preventDefault()
    }

    this.xEnd = event.touches[0].clientX
    this.yEnd = event.touches[0].clientY

    if (!this.xStart || !this.yStart) return

    this.xDiff = this.xStart - this.xEnd
    this.yDiff = this.yStart - this.yEnd

    this.emitValuesChanged()

    if (!this.options.triggerOnEnd) {
      this.runCallbacks(event)
    }
  }

  private handleTouchEnd(event: TouchEvent) {
    this.runCallbacks(event)
    this.emitValuesChanged()
  }

  private runCallbacks(event: TouchEvent) {
    if (typeof this.xDiff !== 'number' || typeof this.yDiff !== 'number') {
      return
    }

    if (
      Math.abs(this.xDiff) < this.options.threshold &&
      Math.abs(this.yDiff) < this.options.threshold
    ) {
      return
    }

    if (Math.abs(this.xDiff) > Math.abs(this.yDiff)) {
      if (this.xDiff > 0) {
        this.options.onLeft?.(event)
      } else {
        this.options.onRight?.(event)
      }
    } else if (this.yDiff > 0) {
      this.options.onUp?.(event)
    } else {
      this.options.onDown?.(event)
    }

    this.resetValues()
  }

  private resetValues() {
    this.xStart = undefined
    this.yStart = undefined
    this.xEnd = undefined
    this.yEnd = undefined
    this.xDiff = undefined
    this.yDiff = undefined

    this.emitValuesChanged()
  }
}
