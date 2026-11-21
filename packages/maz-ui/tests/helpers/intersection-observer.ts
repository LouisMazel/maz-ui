/** An `IntersectionObserver` the tests drive: `trigger()` sends an entry to the callback */
export class FakeIntersectionObserver {
  static readonly instances: FakeIntersectionObserver[] = []

  readonly elements = new Set<Element>()
  disconnected = false

  constructor(
    readonly callback: IntersectionObserverCallback,
    readonly options: IntersectionObserverInit = {},
  ) {
    FakeIntersectionObserver.instances.push(this)
  }

  static get last(): FakeIntersectionObserver | undefined {
    return FakeIntersectionObserver.instances.at(-1)
  }

  observe(element: Element) {
    this.elements.add(element)
  }

  unobserve(element: Element) {
    this.elements.delete(element)
  }

  disconnect() {
    this.elements.clear()
    this.disconnected = true
  }

  takeRecords() {
    return []
  }

  trigger(isIntersecting: boolean, target: Element = [...this.elements][0]) {
    this.callback([{ isIntersecting, target, intersectionRatio: isIntersecting ? 1 : 0 } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
  }
}

/** Replaces the global mock of the setup by `FakeIntersectionObserver` during the tests of a file */
export function useFakeIntersectionObserver() {
  const original = globalThis.IntersectionObserver

  beforeEach(() => {
    FakeIntersectionObserver.instances.length = 0
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
  })

  afterEach(() => {
    vi.stubGlobal('IntersectionObserver', original)
  })
}
