export interface SwipeValues {
  xStart: number | undefined
  yStart: number | undefined
  xEnd: number | undefined
  yEnd: number | undefined
  xDiff: number | undefined
  yDiff: number | undefined
}

export type SwipeEventCallback = (event: PointerEvent) => void
export type SwipeValuesCallback = (values: SwipeValues) => void

/**
 * Options for handling swipe events.
 */
export interface SwipeOptions {
  /**
   * The element on which the swipe events will be handled.
   * @default null
   */
  element?: HTMLElement | string | null
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
   * Whether to prevent the default behavior of the pointer move event (the move listener
   * becomes non-passive when enabled).
   * @default false
   */
  preventDefaultOnMove?: boolean
  /**
   * Whether to prevent the default behavior of mousewheel event.
   * @default false
   */
  preventDefaultOnMouseWheel?: boolean
  /**
   * Pointer types that can trigger the swipe.
   * @default ['mouse', 'touch', 'pen']
   */
  pointerTypes?: ('mouse' | 'touch' | 'pen')[]
  /**
   * Whether to start listening immediately on instantiation.
   * @default false
   */
  immediate?: boolean
  /**
   * Whether to trigger the swipe event on pointer up.
   * If set to true, the swipe event will be triggered only when the user lifts their finger/pointer.
   * @default false
   */
  triggerOnEnd?: boolean
}

type DefaultSwipeOptions = Required<
  Pick<
    SwipeOptions,
    | 'preventDefaultOnMove'
    | 'preventDefaultOnMouseWheel'
    | 'threshold'
    | 'immediate'
    | 'triggerOnEnd'
  >
>

type SwipeOptionsWithDefaults = SwipeOptions & DefaultSwipeOptions

const defaultOptions: DefaultSwipeOptions = {
  preventDefaultOnMove: false,
  preventDefaultOnMouseWheel: false,
  threshold: 50,
  immediate: false,
  triggerOnEnd: false,
}

export class Swipe {
  public element: HTMLElement | undefined

  public xStart: number | undefined
  public yStart: number | undefined
  public xEnd: number | undefined
  public yEnd: number | undefined
  public xDiff: number | undefined
  public yDiff: number | undefined

  private pointerDown = false

  private readonly onPointerDownCallback: (event: PointerEvent) => void
  private readonly onPointerMoveCallback: (event: PointerEvent) => void
  private readonly onPointerUpCallback: (event: PointerEvent) => void
  private readonly onMouseWheelCallback: (event: Event) => void

  public readonly start: (element?: typeof this.options.element) => void
  public readonly stop: () => void

  public options: SwipeOptionsWithDefaults

  constructor(readonly inputOption: SwipeOptions) {
    this.options = { ...defaultOptions, ...inputOption }

    this.onPointerDownCallback = this.handlePointerDown.bind(this)
    this.onPointerMoveCallback = this.handlePointerMove.bind(this)
    this.onPointerUpCallback = this.handlePointerUp.bind(this)
    this.onMouseWheelCallback = this.handleMouseWheel.bind(this)
    this.start = this.startListening.bind(this)
    this.stop = this.stopListening.bind(this)

    if (this.options.element) {
      this.setElement(this.options.element)
    }

    if (this.options.immediate) {
      this.start()
    }
  }

  private startListening() {
    this.setElement(this.options.element)

    this.element?.addEventListener('pointerdown', this.onPointerDownCallback, { passive: true })
    this.element?.addEventListener('pointermove', this.onPointerMoveCallback, { passive: !this.options.preventDefaultOnMove })
    this.element?.addEventListener('pointerup', this.onPointerUpCallback, { passive: true })
    this.element?.addEventListener('pointercancel', this.onPointerUpCallback, { passive: true })

    if (this.options.preventDefaultOnMouseWheel) {
      this.element?.addEventListener('mousewheel', this.onMouseWheelCallback, { passive: false })
    }
  }

  private stopListening() {
    this.element?.removeEventListener('pointerdown', this.onPointerDownCallback)
    this.element?.removeEventListener('pointermove', this.onPointerMoveCallback)
    this.element?.removeEventListener('pointerup', this.onPointerUpCallback)
    this.element?.removeEventListener('pointercancel', this.onPointerUpCallback)

    if (this.options.preventDefaultOnMouseWheel) {
      this.element?.removeEventListener('mousewheel', this.onMouseWheelCallback)
    }
  }

  private setElement(element?: HTMLElement | string | null) {
    if (!element) {
      console.error(
        '[maz-ui][SwipeHandler](setElement) Element should be provided. Its can be a string selector or an HTMLElement',
      )
      return
    }

    if (typeof element === 'string') {
      const foundElement = document.querySelector(element)
      if (!(foundElement instanceof HTMLElement)) {
        console.error('[maz-ui][SwipeHandler](setElement) String selector for element is not found')
        return
      }
      this.element = foundElement
    }
    else {
      this.element = element
    }
  }

  private isPointerAllowed(event: PointerEvent) {
    const type = event.pointerType as NonNullable<SwipeOptions['pointerTypes']>[number] | undefined
    return !this.options.pointerTypes || !type || this.options.pointerTypes.includes(type)
  }

  private handleMouseWheel(event: Event) {
    event.preventDefault()
  }

  private handlePointerDown(event: PointerEvent) {
    if (!this.isPointerAllowed(event)) {
      return
    }

    this.pointerDown = true
    this.xStart = event.clientX
    this.yStart = event.clientY
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

  private handlePointerMove(event: PointerEvent) {
    if (!this.pointerDown) {
      return
    }

    if (this.options.preventDefaultOnMove && event.cancelable) {
      event.preventDefault()
    }

    this.xEnd = event.clientX
    this.yEnd = event.clientY

    if (this.xStart === undefined || this.yStart === undefined)
      return

    this.xDiff = this.xStart - this.xEnd
    this.yDiff = this.yStart - this.yEnd

    this.emitValuesChanged()

    if (!this.options.triggerOnEnd) {
      this.runCallbacks(event)
    }
  }

  private handlePointerUp(event: PointerEvent) {
    if (this.options.triggerOnEnd) {
      this.runCallbacks(event)
      this.emitValuesChanged()
    }

    this.pointerDown = false
  }

  private runCallbacks(event: PointerEvent) {
    if (typeof this.xDiff !== 'number' || typeof this.yDiff !== 'number') {
      return
    }

    if (
      Math.abs(this.xDiff) < this.options.threshold
      && Math.abs(this.yDiff) < this.options.threshold
    ) {
      return
    }

    if (Math.abs(this.xDiff) > Math.abs(this.yDiff)) {
      if (this.xDiff > 0) {
        this.options.onLeft?.(event)
      }
      else {
        this.options.onRight?.(event)
      }
    }
    else if (this.yDiff > 0) {
      this.options.onUp?.(event)
    }
    else {
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
