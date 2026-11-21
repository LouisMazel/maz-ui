/** A `ResizeObserver` the tests drive: `trigger()` sends an entry to the callback */
export class FakeResizeObserver {
  static readonly instances: FakeResizeObserver[] = []

  readonly elements = new Map<Element, ResizeObserverOptions | undefined>()
  disconnected = false

  constructor(readonly callback: ResizeObserverCallback) {
    FakeResizeObserver.instances.push(this)
  }

  static get last(): FakeResizeObserver | undefined {
    return FakeResizeObserver.instances.at(-1)
  }

  observe(element: Element, options?: ResizeObserverOptions) {
    this.elements.set(element, options)
  }

  unobserve(element: Element) {
    this.elements.delete(element)
  }

  disconnect() {
    this.elements.clear()
    this.disconnected = true
  }

  trigger(entries: Partial<ResizeObserverEntry>[]) {
    this.callback(entries as ResizeObserverEntry[], this as unknown as ResizeObserver)
  }
}

/** An entry whose boxes have the size given, `contentRect` only when `withBoxSizes` is false */
export function resizeEntry(target: Element, width: number, height: number, withBoxSizes = true): Partial<ResizeObserverEntry> {
  const size = [{ inlineSize: width, blockSize: height }]

  return {
    target,
    contentRect: { width, height } as DOMRectReadOnly,
    ...(withBoxSizes && { borderBoxSize: size, contentBoxSize: size, devicePixelContentBoxSize: size }),
  }
}

/** Replaces the global mock of the setup by `FakeResizeObserver` during the tests of a file */
export function useFakeResizeObserver() {
  const original = globalThis.ResizeObserver

  beforeEach(() => {
    FakeResizeObserver.instances.length = 0
    vi.stubGlobal('ResizeObserver', FakeResizeObserver)
  })

  afterEach(() => {
    vi.stubGlobal('ResizeObserver', original)
  })
}
